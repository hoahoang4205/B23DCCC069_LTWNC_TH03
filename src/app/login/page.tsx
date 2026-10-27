import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';
import { Spin } from 'antd';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập cổng quản lý deadline của lớp học viện PTIT.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex justify-center items-center p-12">
            <Spin size="large" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
