'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface PublicSessionProviderProps {
  children: ReactNode;
}

export default function PublicSessionProvider({ children }: PublicSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
