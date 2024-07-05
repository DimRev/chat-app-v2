-- Add image_url column to chat-app-v2_user table if not exists
ALTER TABLE "chat-app-v2_user" ADD COLUMN "image_url" text;

-- Ensure image_url column in chat-app-v2_user is unique
ALTER TABLE "chat-app-v2_user" ADD CONSTRAINT "chat-app-v2_user_image_url_unique" UNIQUE("image_url");

-- Add image_url column to chat-app-v2_user_permissions table if not exists
ALTER TABLE "chat-app-v2_user_permissions" ADD COLUMN "image_url" text NOT NULL;

-- Add foreign key constraint after ensuring unique constraint
DO $$ BEGIN
 ALTER TABLE "chat-app-v2_user_permissions" ADD CONSTRAINT "chat-app-v2_user_permissions_image_url_chat-app-v2_user_image_url_fk" FOREIGN KEY ("image_url") REFERENCES "public"."chat-app-v2_user"("image_url") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
