import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { chats, userChatPermissions } from "~/server/db/schema";

export const chatRouter = createTRPCRouter({
  getUserChats: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const userChats = await ctx.db.query.userChatPermissions.findMany({
        where: eq(userChatPermissions.userId, ctx.user.id),
        with: {
          chat: true,
        },
      });

      const chatsWithUserCount = await Promise.all(
        userChats.map(async (userChat) => {
          const userCount = await ctx.db
            .select({ count: sql<number>`cast(count(*) as integer)` })
            .from(userChatPermissions)
            .where(eq(userChatPermissions.chatId, userChat.chatId))
            .then((res) => res[0]?.count);

          return { ...userChat, userCount };
        }),
      );

      return chatsWithUserCount;
    }),
  getUserChatById: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.query.userChatPermissions.findFirst({
        where: and(
          eq(userChatPermissions.userId, ctx.user.id),
          eq(userChatPermissions.chatId, input.chatId),
        ),
        with: {
          chat: true,
        },
      });
      if (!chat) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Chat not found" });
      }
      return chat;
    }),
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
              imageUrl: ctx.user.imageUrl,
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
