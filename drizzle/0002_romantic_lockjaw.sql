CREATE TABLE IF NOT EXISTS "chat-app-v2_invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat-app-v2_invitation" ADD CONSTRAINT "chat-app-v2_invitation_chat_id_chat-app-v2_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat-app-v2_chat"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
