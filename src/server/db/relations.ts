import { relations } from "drizzle-orm";
import {
  users,
  chats,
  messages,
  userChatPermissions,
  invitations,
} from "./schema";

export const userRelations = relations(users, ({ many }) => ({
  messages: many(messages),
  chatPermissions: many(userChatPermissions),
}));

export const chatRelations = relations(chats, ({ many }) => ({
  members: many(userChatPermissions),
  messages: many(messages),
  invitations: many(invitations),
}));

export const messageRelations = relations(messages, ({ one }) => ({
  author: one(users, {
    fields: [messages.authorId],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

export const userChatPermissionsRelations = relations(
  userChatPermissions,
  ({ one }) => ({
    user: one(users, {
      fields: [userChatPermissions.userId],
      references: [users.id],
    }),
    chat: one(chats, {
      fields: [userChatPermissions.chatId],
      references: [chats.id],
    }),
  }),
);

export const invitationRelations = relations(invitations, ({ one }) => ({
  chat: one(chats, {
    fields: [invitations.chatId],
    references: [chats.id],
  }),
}));
