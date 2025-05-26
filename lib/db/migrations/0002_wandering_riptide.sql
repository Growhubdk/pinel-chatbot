CREATE TABLE IF NOT EXISTS message (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  chatid uuid NOT NULL,
  role varchar NOT NULL,
  content json NOT NULL,
  createdat timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS vote (
  chatid uuid NOT NULL,
  messageid uuid NOT NULL,
  isupvoted boolean NOT NULL,
  CONSTRAINT vote_chatid_messageid_pk PRIMARY KEY (chatid, messageid)
);
--> statement-breakpoint
ALTER TABLE chat ADD COLUMN title text NOT NULL; --> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE message ADD CONSTRAINT message_chatid_chat_id_fk
  FOREIGN KEY (chatid) REFERENCES public.chat(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE vote ADD CONSTRAINT vote_chatid_chat_id_fk
  FOREIGN KEY (chatid) REFERENCES public.chat(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE vote ADD CONSTRAINT vote_messageid_message_id_fk
  FOREIGN KEY (messageid) REFERENCES public.message(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
ALTER TABLE chat DROP COLUMN IF EXISTS messages;
