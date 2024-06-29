import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { invitations, userChatPermissions } from "~/server/db/schema";

export const invitationRouter = createTRPCRouter({
  getChatInvitations: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chatInvitations = await ctx.db.query.invitations.findMany({
        where: eq(invitations.chatId, input.chatId),
      });

      return chatInvitations;
    }),
  createInvitation: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        type: z.enum(["permanent", "one-time", "time-limited"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const permissions = await ctx.db.query.userChatPermissions.findFirst({
        where: and(
          eq(userChatPermissions.userId, ctx.user.id),
          eq(userChatPermissions.chatId, input.chatId),
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
      const invitation = (
        await ctx.db
          .insert(invitations)
          .values({
            chatId: input.chatId,
            type: input.type,
          })
          .returning({
            invId: invitations.id,
          })
      )[0];

      if (!invitation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed to create invitation",
        });
      }
      return invitation;
    }),

  deleteInvitation: protectedProcedure
    .input(z.object({ invId: z.string(), chatId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const permissions = await ctx.db.query.userChatPermissions.findFirst({
        where: and(
          eq(userChatPermissions.userId, ctx.user.id),
          eq(userChatPermissions.chatId, input.chatId),
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
      await ctx.db.delete(invitations).where(eq(invitations.id, input.invId));
    }),
});
