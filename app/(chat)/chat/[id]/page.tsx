import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import type { DBMessage } from '@/lib/db/schema';
import type { Attachment, UIMessage } from 'ai';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { id } = params;

  const chat = await getChatById(id);
  if (!chat) {
    return notFound();
  }

  const session = await auth();
  if (!session) {
    return redirect('/api/auth/guest');
  }

  const isOwner = session.user?.id === chat.userid;

  if (chat.visibility === 'private' && !isOwner) {
    return notFound();
  }

  const messagesFromDb = await getMessagesByChatId(id);

  const uiMessages: UIMessage[] = messagesFromDb.map((message) => ({
    id: message.id,
    parts: message.parts as UIMessage['parts'],
    role: message.role as UIMessage['role'],
    content: '', // deprecated
    createdAt: message.createdat,
    experimental_attachments: (message.attachments as Attachment[]) ?? [],
  }));

  const cookieStore = cookies();
  const chatModelCookie = cookieStore.get('chat-model');
  const chatModel = chatModelCookie?.value || DEFAULT_CHAT_MODEL;

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={uiMessages}
        initialChatModel={chatModel}
        initialVisibilityType={chat.visibility}
        isReadonly={!isOwner}
        session={session}
        autoResume={true}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
