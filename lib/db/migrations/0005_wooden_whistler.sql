CREATE TABLE IF NOT EXISTS message_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  chatid uuid NOT NULL,
  role varchar NOT NULL,
  parts json NOT NULL,
  attachments json NOT NULL,
  createdat timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS vote_v2 (
  chatid uuid NOT NULL,
  messageid uuid NOT NULL,
  isupvoted boolean NOT NULL,
  CONSTRAINT vote_v2_chatid_messageid_pk PRIMARY KEY (chatid, messageid)
);
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE message_v2 ADD CONSTRAINT message_v2_chatid_chat_id_fk
  FOREIGN KEY (chatid) REFERENCES public.chat(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE vote_v2 ADD CONSTRAINT vote_v2_chatid_chat_id_fk
  FOREIGN KEY (chatid) REFERENCES public.chat(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE vote_v2 ADD CONSTRAINT vote_v2_messageid_message_v2_id_fk
  FOREIGN KEY (messageid) REFERENCES public.message_v2(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
