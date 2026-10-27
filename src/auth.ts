import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import { authConfig } from './auth.config';
import type { NextAuthConfig } from 'next-auth';
import type { Role } from '@/types';

export const USERS = [
  {
    id: '1',
    name: 'Admin Lớp Trưởng',
    email: 'admin@ptit.edu.vn',
    password: 'admin123',
    role: 'admin' as Role,
  },
  {
    id: '2',
    name: 'Sinh Viên PTIT',
    email: 'sv@ptit.edu.vn',
    password: 'sv123456',
    role: 'user' as Role,
  },
];

const providers: NonNullable<NextAuthConfig['providers']> = [
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Mật khẩu', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const user = USERS.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },
  }),
];

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'user' as Role,
        };
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  session: { strategy: 'jwt' },
});
