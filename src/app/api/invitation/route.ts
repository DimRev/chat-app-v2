import "server-only";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { type RequestLike } from "node_modules/@clerk/nextjs/dist/types/server/types";
import { env } from "~/env";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { invitations, userChatPermissions, users } from "~/server/db/schema";

export async function GET(request: Request) {
  const { userId } = getAuth(request as RequestLike);

  if (!userId) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_NEXT_URL}/sign-in`);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_NEXT_URL}/sign-in`);
  }

  const url = new URL(request.url);
  const invId = url.searchParams.get("invId");

  if (!invId) {
    console.log("test");
    return NextResponse.redirect(`${env.NEXT_PUBLIC_NEXT_URL}/`);
  }

  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.id, invId),
  });
  if (!invitation) {
    console.log("Invitation Error");
    return NextResponse.redirect(`${env.NEXT_PUBLIC_NEXT_URL}/chat`);
  }

  const userPermission = (
    await db
      .insert(userChatPermissions)
      .values({
        chatId: invitation.chatId,
        userId: user.id,
      })
      .returning({ chatId: userChatPermissions.chatId })
  )[0];
  if (!userPermission) {
    console.log("Failed to create userChatPermission");
    return NextResponse.redirect(`${env.NEXT_PUBLIC_NEXT_URL}/chat`);
  }

  return NextResponse.redirect(
    `${env.NEXT_PUBLIC_NEXT_URL}/chat/group/${userPermission?.chatId}`,
  );
}
