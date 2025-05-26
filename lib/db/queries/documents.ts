// lib/db/queries/documents.ts
import { db } from '../db';
import { document, suggestion } from '../schema';
import { eq, gt, asc, desc, and } from 'drizzle-orm';
import { ChatSDKError } from '@/lib/errors';
import type { ArtifactKind } from '@/components/artifact';

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userid,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userid: string;
}) {
  try {
    return await db.insert(document).values({
      id,
      title,
      kind,
      content,
      userid,
      createdat: new Date(),
    }).returning();
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save document');
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdat));
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get documents by id');
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [doc] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdat));
    return doc;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get document by id');
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentid, id),
          gt(suggestion.documentcreatedat, timestamp)
        )
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdat, timestamp)))
      .returning();
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to delete documents by id after timestamp'
    );
  }
}