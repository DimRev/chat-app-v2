// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `chat-app-v2_${name}`);

export const posts = createTable("post", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  authorId: uuid("author_id").references(() => users.id),
  chatId: uuid("chat_id").references(() => chats.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  content: text("content").notNull(),
});

export const chats = createTable("chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const users = createTable("user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
});

export const userChats = createTable("user_chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  permission: text("permission", {
    enum: ["regular", "elevated", "admin"],
  }).default("regular"),
  chatId: uuid("chat_id")
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
