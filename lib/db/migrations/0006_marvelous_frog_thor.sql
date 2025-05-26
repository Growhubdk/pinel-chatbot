CREATE TABLE IF NOT EXISTS stream (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  chatid uuid NOT NULL,
  createdat timestamp NOT NULL,
  CONSTRAINT stream_id_pk PRIMARY KEY (id)
);
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE stream ADD CONSTRAINT stream_chatid_chat_id_fk
  FOREIGN KEY (chatid) REFERENCES public.chat(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
