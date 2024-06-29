import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { userChatPermissions } from "~/server/db/schema";

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
});
