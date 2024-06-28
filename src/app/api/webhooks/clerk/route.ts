import { Webhook } from "svix";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export const POST = async (req: NextRequest) => {
  // Check if the request method is POST (Next.js app router already ensures this)

  // Get the headers
  const svix_id = req.headers.get("svix-id")!;
  const svix_timestamp = req.headers.get("svix-timestamp")!;
  const svix_signature = req.headers.get("svix-signature")!;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Error occurred -- no svix headers" },
      { status: 400 },
    );
  }

  // Get the body
  const payload = await buffer(req);
  const body = payload.toString();

  // Ensure that the webhook secret is defined
  const webhookSecret = env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret is not defined" },
      { status: 500 },
    );
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Error occurred" }, { status: 400 });
  }

  // Handle the webhook
  if (evt.type === "user.created") {
    const { id, email_addresses, username, primary_email_address_id } =
      evt.data;

    const primaryEmailAddress = email_addresses.find(
      (emailAddress) => emailAddress.id === primary_email_address_id,
    )?.email_address;

    if (!primaryEmailAddress || !username) {
      console.log(`Failed to add user of id: ${id} - missing email / username`);
      return NextResponse.json(
        { error: "No Primary email address" },
        { status: 400 },
      );
    }

    console.log(id, email_addresses, username);

    await db.insert(users).values({
      clerkId: id,
      email: primaryEmailAddress,
      name: username,
    });
  }

  return NextResponse.json({ received: true });
};

// Helper function to parse the request body
async function buffer(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) {
    return Buffer.from(new Uint8Array());
  }

  let done: boolean | undefined = false;
  let value: Uint8Array | undefined;

  while (!done) {
    const result = await reader.read();
    done = result.done;
    value = result.value;

    if (value) {
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks);
}
