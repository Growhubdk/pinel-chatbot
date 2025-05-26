// lib/db/queries/chats.ts
import { db } from '../db';
import * as schema from '../schema';
import { eq, desc, gt, lt, and, SQL } from 'drizzle-orm';
import { ChatSDKError } from '@/lib/errors';
import type { Chat as ChatType } from '../schema';
import type { VisibilityType } from '@/components/visibility-selector';

export async function saveChat({
  id,
  userid,
  title,
  visibility,
}: {
  id: string;
  userid: string;
  title: string;
  visibility: VisibilityType;
}) {
  return db.insert(schema.chat).values({
    id,
    createdat: new Date(),
    userid,
    title,
    visibility,
  });
}

export async function deleteChatById({ id }: { id: string }) {
  await db.delete(schema.vote).where(eq(schema.vote.chatid, id));
  await db.delete(schema.message).where(eq(schema.message.chatid, id));
  await db.delete(schema.stream).where(eq(schema.stream.chatid, id));
  const [deleted] = await db.delete(schema.chat).where(eq(schema.chat.id, id)).returning();
  return deleted;
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  console.log('🧪 getChatsByUserId input:', { id, limit, startingAfter, endingBefore });

  const extendedLimit = limit + 1;

  const query = (whereCondition?: SQL) => {
    console.log('🧪 DEBUG schema.chat.userid value:', schema.chat.userid);
    console.log('🧪 DEBUG id value:', id);

    const baseCondition = eq(schema.chat.userid, id);
    const fullCondition = whereCondition ? and(whereCondition, baseCondition) : baseCondition;

    console.log('🧪 Executing query with condition:', fullCondition);

    return db
      .select()
      .from(schema.chat)
      .where(fullCondition)
      .orderBy(desc(schema.chat.createdat))
      .limit(extendedLimit);
  };

  let filteredChats: ChatType[] = [];

  if (startingAfter) {
    const [selectedChat] = await db
      .select()
      .from(schema.chat)
      .where(eq(schema.chat.id, startingAfter))
      .limit(1);

    if (!selectedChat) throw new ChatSDKError('not_found:database', 'Chat not found');
    filteredChats = await query(gt(schema.chat.createdat, selectedChat.createdat));
  } else if (endingBefore) {
    const [selectedChat] = await db
      .select()
      .from(schema.chat)
      .where(eq(schema.chat.id, endingBefore))
      .limit(1);

    if (!selectedChat) throw new ChatSDKError('not_found:database', 'Chat not found');
    filteredChats = await query(lt(schema.chat.createdat, selectedChat.createdat));
  } else {
    filteredChats = await query();
  }

  const hasMore = filteredChats.length > limit;
  return {
    chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
    hasMore,
  };
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  return db.update(schema.chat).set({ visibility }).where(eq(schema.chat.id, chatId));
}

export async function getChatById(id: string) {
  const [result] = await db.select().from(schema.chat).where(eq(schema.chat.id, id)).limit(1);
  return result;
}
