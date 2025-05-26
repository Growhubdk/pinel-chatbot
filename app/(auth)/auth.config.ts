import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET, // <-- Tilføj denne linje

  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // Providers bliver tilføjet i auth.ts
  ],
  callbacks: {},
} satisfies NextAuthConfig;
