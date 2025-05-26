CREATE TABLE IF NOT EXISTS chat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  createdat timestamp NOT NULL,
  messages json NOT NULL,
  userid uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  email varchar(64) NOT NULL,
  password varchar(64)
);
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE chat ADD CONSTRAINT chat_userid_user_id_fk
  FOREIGN KEY (userid) REFERENCES "public"."user"(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
