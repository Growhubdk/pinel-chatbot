// lib/db/queries/votes.ts
import { db } from '../db';
import { vote } from '../schema';
import { eq, and } from 'drizzle-orm';
import { ChatSDKError } from '@/lib/errors';

export async function voteMessage({
  chatid,
  messageid,
  type,
}: {
  chatid: string;
  messageid: string;
  type: 'up' | 'down';
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageid, messageid), eq(vote.chatid, chatid)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isupvoted: type === 'up' })
        .where(and(eq(vote.messageid, messageid), eq(vote.chatid, chatid)));
    }

    return await db.insert(vote).values({
      chatid,
      messageid,
      isupvoted: type === 'up',
    });
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to vote message');
  }
}

export async function getVotesByChatId({ chatid }: { chatid: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatid, chatid));
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get votes by chat id');
  }
}