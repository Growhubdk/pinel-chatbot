// lib/db/queries/suggestions.ts
import { db } from '../db';
import { suggestion } from '../schema';
import { eq } from 'drizzle-orm';
import { ChatSDKError } from '@/lib/errors';
import type { Suggestion } from '../schema';

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Suggestion[];
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save suggestions');
  }
}

export async function getSuggestionsByDocumentId({
  documentid,
}: {
  documentid: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(eq(suggestion.documentid, documentid));
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get suggestions by document id');
  }
}
