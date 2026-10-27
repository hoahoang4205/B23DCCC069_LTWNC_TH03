import type { NextAuthConfig } from 'next-auth';
import type { Role } from '@/types';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user.role as Role) || 'user';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string) || '';
        session.user.role = (token.role as Role) || 'user';
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
