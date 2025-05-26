CREATE TABLE IF NOT EXISTS suggestion (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  documentid uuid NOT NULL,
  documentcreatedat timestamp NOT NULL,
  originaltext text NOT NULL,
  suggestedtext text NOT NULL,
  description text,
  isresolved boolean DEFAULT false NOT NULL,
  userid uuid NOT NULL,
  createdat timestamp NOT NULL,
  CONSTRAINT suggestion_id_pk PRIMARY KEY (id)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS document (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  createdat timestamp NOT NULL,
  title text NOT NULL,
  content text,
  userid uuid NOT NULL,
  CONSTRAINT document_id_createdat_pk PRIMARY KEY (id, createdat)
);
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE suggestion ADD CONSTRAINT suggestion_userid_user_id_fk
  FOREIGN KEY (userid) REFERENCES public."user"(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE suggestion ADD CONSTRAINT suggestion_documentid_documentcreatedat_document_id_createdat_fk
  FOREIGN KEY (documentid, documentcreatedat) REFERENCES public.document(id, createdat) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE document ADD CONSTRAINT document_userid_user_id_fk
  FOREIGN KEY (userid) REFERENCES public."user"(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
