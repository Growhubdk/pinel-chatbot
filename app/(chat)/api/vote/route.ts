import { auth } from '@/app/(auth)/auth';
import { getChatById, getVotesByChatId, voteMessage } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new ChatSDKError(
      'bad_request:api',
      'Parameter chatId is required.',
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:vote').toResponse();
  }

  const chat = await getChatById(chatId); // 🔧 Rettet: vi sender string direkte

  if (!chat) {
    return new ChatSDKError('not_found:chat').toResponse();
  }

  if (chat.userid !== session.user.id) {
    return new ChatSDKError('forbidden:vote').toResponse();
  }

  const votes = await getVotesByChatId({ chatid: chatId }); // 🔧 bruger 'chatid' som i schema

  return Response.json(votes, { status: 200 });
}

export async function PATCH(request: Request) {
  const {
    chatid,
    messageid,
    type,
  }: { chatid: string; messageid: string; type: 'up' | 'down' } =
    await request.json();

  if (!chatid || !messageid || !type) {
    return new ChatSDKError(
      'bad_request:api',
      'Parameters chatid, messageid, and type are required.',
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:vote').toResponse();
  }

  const chat = await getChatById(chatid);

  if (!chat) {
    return new ChatSDKError('not_found:vote').toResponse();
  }

  if (chat.userid !== session.user.id) {
    return new ChatSDKError('forbidden:vote').toResponse();
  }

  await voteMessage({
    chatid,
    messageid,
    type,
  });

  return new Response('Message voted', { status: 200 });
}
