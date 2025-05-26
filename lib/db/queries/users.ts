// lib/db/queries/users.ts
import { db } from '../db';
import { user } from '../schema';
import { eq } from 'drizzle-orm';
import { generateHashedPassword, generateDummyPassword } from '../utils';
import { ChatSDKError } from '@/lib/errors';
import type { User } from '../schema';

// Hent bruger baseret på email
export async function getUser(email: string): Promise<User[]> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get user by email'
    );
  }
}

// Opret ny bruger med hash
export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);
  try {
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to create user');
  }
}

// Opret gæstebruger med dummy-password
export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateDummyPassword();

  try {
    return await db.insert(user).values({ email, password }).returning({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error('createGuestUser error:', error);
    throw new ChatSDKError('bad_request:database', 'Failed to create guest user');
  }
}
