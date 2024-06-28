CREATE TABLE IF NOT EXISTS "chat-app-v2_chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat-app-v2_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"chat_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat-app-v2_user_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"chat_id" uuid NOT NULL,
	"role" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat-app-v2_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"clerk_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat-app-v2_user_name_unique" UNIQUE("name"),
	CONSTRAINT "chat-app-v2_user_email_unique" UNIQUE("email"),
	CONSTRAINT "chat-app-v2_user_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat-app-v2_message" ADD CONSTRAINT "chat-app-v2_message_author_id_chat-app-v2_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."chat-app-v2_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat-app-v2_message" ADD CONSTRAINT "chat-app-v2_message_chat_id_chat-app-v2_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat-app-v2_chat"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat-app-v2_user_permissions" ADD CONSTRAINT "chat-app-v2_user_permissions_user_id_chat-app-v2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chat-app-v2_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat-app-v2_user_permissions" ADD CONSTRAINT "chat-app-v2_user_permissions_chat_id_chat-app-v2_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat-app-v2_chat"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
