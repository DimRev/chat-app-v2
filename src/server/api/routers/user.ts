import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { userChatPermissions } from "~/server/db/schema";
import { isAdminOrOwner } from "~/server/lib/server-utils";

export const userRouter = createTRPCRouter({
  getChatMembers: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.userChatPermissions.findMany({
        where: eq(userChatPermissions.chatId, input.chatId),
        with: {
          user: true,
        },
      });
    }),

  memberRoleChange: protectedProcedure
    .input(
      z.object({
        userChatPermissionId: z.string(),
        chatId: z.string(),
        role: z.enum(["owner", "admin", "elevated", "member"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await isAdminOrOwner(ctx, input.chatId);
      await ctx.db
        .update(userChatPermissions)
        .set({
          role: input.role,
        })
        .where(and(eq(userChatPermissions.id, input.userChatPermissionId)));
    }),
});
