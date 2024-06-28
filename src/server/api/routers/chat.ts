import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { chats, userChatPermissions } from "~/server/db/schema";

export const chatRouter = createTRPCRouter({
  addChat: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const addedChat = (
          await tx
            .insert(chats)
            .values({
              name: input.name,
              description: input.description,
            })
            .returning({
              id: chats.id,
            })
        )[0];

        if (!addedChat) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "failed to add a chat group",
          });
        }

        const addedUserPermission = (
          await tx
            .insert(userChatPermissions)
            .values({
              chatId: addedChat.id,
              userId: ctx.user.id,
              role: "owner",
            })
            .returning({
              id: userChatPermissions.id,
            })
        )[0];

        if (!addedUserPermission) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "failed to add userPermission",
          });
        }
      });
    }),
});
