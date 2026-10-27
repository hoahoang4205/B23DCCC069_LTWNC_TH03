'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export type LoginResult = {
  success?: boolean;
  error?: string;
};

export async function loginWithCredentials(
  email: string,
  password: string,
  callbackUrl: string = '/dashboard'
): Promise<LoginResult> {
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Email hoặc mật khẩu không chính xác.' };
        default:
          return { error: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.' };
      }
    }
    // Next.js redirection throws an internal NEXT_REDIRECT error which must be rethrown
    throw error;
  }
}

export async function loginWithGitHub(callbackUrl: string = '/dashboard') {
  await signIn('github', { redirectTo: callbackUrl });
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}
