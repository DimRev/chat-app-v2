import "server-only";
import { type createTRPCContext } from "../api/trpc";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { userChatPermissions } from "../db/schema";

type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export async function isAdminOrOwner(ctx: TRPCContext, chatId: string) {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized to create invitation link",
    });
  }
  const permissions = await ctx.db.query.userChatPermissions.findFirst({
    where: and(
      eq(userChatPermissions.userId, ctx.user.id),
      eq(userChatPermissions.chatId, chatId),
    ),
    columns: {
      role: true,
    },
  });
  const permittedRoles = ["admin", "owner"];
  if (!permissions || !permittedRoles.includes(permissions.role)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized to create invitation link",
    });
  }

  return permissions.role;
}
