// lib/db/queries/messages.ts
import { db } from '../db';
import { chat, message, vote } from '../schema';
import { eq, gte, inArray, desc, and, count } from 'drizzle-orm';
import type { DBMessage } from '../schema';
import { ChatSDKError } from '@/lib/errors';

export async function getMessagesByChatId(chatid: string) {
  return db
    .select()
    .from(message)
    .where(eq(message.chatid, chatid))
    .orderBy(desc(message.createdat));
}

export async function getMessageById({ id }: { id: string }) {
  return db.select().from(message).where(eq(message.id, id));
}

export async function saveMessages(messages: DBMessage[]) {
  await db.insert(message).values(messages);
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatid,
  timestamp,
}: {
  chatid: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(and(eq(message.chatid, chatid), gte(message.createdat, timestamp)));

    const messageIds = messagesToDelete.map((msg) => msg.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(and(eq(vote.chatid, chatid), inArray(vote.messageid, messageIds)));

      return db
        .delete(message)
        .where(and(eq(message.chatid, chatid), inArray(message.id, messageIds)));
    }
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to delete messages'
    );
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  const threshold = new Date(Date.now() - differenceInHours * 60 * 60 * 1000);

  const [stats] = await db
    .select({ count: count(message.id) })
    .from(message)
    .innerJoin(chat, eq(message.chatid, chat.id))
    .where(
      and(
        eq(chat.userid, id),
        gte(message.createdat, threshold),
        eq(message.role, 'user')
      )
    );

  return stats?.count ?? 0;
}
