import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Class Deadline Hub',
    default: 'Class Deadline Hub - Cổng Quản Lý Deadline Lớp Học',
  },
  description: 'Cổng thông tin theo dõi và quản lý deadline môn học tập trung dành cho sinh viên và ban cán sự lớp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.className}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
