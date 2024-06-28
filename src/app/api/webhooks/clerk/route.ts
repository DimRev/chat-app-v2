import { Webhook } from "svix";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
  switch (evt.type) {
    case "user.created":
      const {
        id: cu_id,
        email_addresses: cu_email_addresses,
        username: cu_username,
        primary_email_address_id: cu_primary_email_address_id,
      } = evt.data;
      const cu_primaryEmailAddress = cu_email_addresses.find(
        (emailAddress) => emailAddress.id === cu_primary_email_address_id,
      )?.email_address;
      if (!cu_primaryEmailAddress || !cu_username) {
        console.log(
          `Failed to add user of id: ${cu_id} - missing email / username`,
        );
        return NextResponse.json(
          { error: "No Primary email address or username" },
          { status: 400 },
        );
      }
      await db.insert(users).values({
        clerkId: cu_id,
        email: cu_primaryEmailAddress,
        name: cu_username,
      });
      break;
    case "user.updated":
      const {
        id: uu_id,
        username: uu_username,
        email_addresses: uu_email_addresses,
        primary_email_address_id: uu_primary_email_address_id,
      } = evt.data;
      const uu_primaryEmailAddress = uu_email_addresses.find(
        (emailAddress) => emailAddress.id === uu_primary_email_address_id,
      )?.email_address;
      if (!uu_primaryEmailAddress || !uu_username) {
        console.log(
          `Failed to update user of id: ${uu_id} - missing email / username`,
        );
        return NextResponse.json(
          { error: "No Primary email address or username" },
          { status: 400 },
        );
      }
      await db
        .update(users)
        .set({
          email: uu_primaryEmailAddress,
          name: uu_username,
        })
        .where(eq(users.clerkId, uu_id));
      break;
    case "user.deleted":
      const { deleted, id: du_id } = evt.data;
      if (!deleted || !du_id) {
        console.log(
          `Failed to delete user of id: ${du_id} - deleted is false?`,
        );
        return NextResponse.json(
          { error: "Failed to delete user" },
          { status: 400 },
        );
      }
      await db.delete(users).where(eq(users.clerkId, du_id));
      break;
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
