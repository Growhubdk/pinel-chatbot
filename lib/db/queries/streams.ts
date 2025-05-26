// lib/db/queries/streams.ts
import { db } from '../db';
import { stream } from '../schema';
import { eq, asc } from 'drizzle-orm';
import { ChatSDKError } from '@/lib/errors';

export async function createStreamId({
  streamid,
  chatid,
}: {
  streamid: string;
  chatid: string;
}) {
  try {
    await db.insert(stream).values({
      id: streamid,
      chatid,
      createdat: new Date(),
    });
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to create stream id');
  }
}

export async function getStreamIdsByChatId({ chatid }: { chatid: string }) {
  try {
    const streamIds = await db
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatid, chatid))
      .orderBy(asc(stream.createdat));

    return streamIds.map(({ id }) => id);
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get stream ids by chat id');
  }
}
