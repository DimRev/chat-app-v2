import {
  pgTableCreator,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `chat-app-v2_${name}`);

export const users = createTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  email: text("email").notNull().unique(),
  clerkId: text("clerk_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chats = createTable("chat", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = createTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade", onUpdate: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userChatPermissions = createTable(
  "user_permissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade", onUpdate: "cascade" }),
    role: text("role", {
      enum: ["owner", "admin", "elevated", "member"],
    })
      .notNull()
      .default("member"),
  },
  (table) => ({
    uniqueUserChat: unique().on(table.chatId, table.userId),
  }),
);

export const invitations = createTable("invitation", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade", onUpdate: "cascade" }),
  type: text("type", {
    enum: ["permanent", "one-time", "time-limited"],
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
