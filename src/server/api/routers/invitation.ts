import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { invitations } from "~/server/db/schema";
import { isAdminOrOwner } from "~/server/lib/server-utils";

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
      await isAdminOrOwner(ctx, input.chatId);
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
      await isAdminOrOwner(ctx, input.chatId);
      await ctx.db.delete(invitations).where(eq(invitations.id, input.invId));
    }),
});
