import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { messages } from "~/server/db/schema";

export const messageRouter = createTRPCRouter({
  getMessagesByChatId: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const chatMessages = await ctx.db.query.messages.findMany({
        where: eq(messages.chatId, input.chatId),
        with: {
          author: true,
        },
      });

      return chatMessages;
    }),
});
