import type { Metadata } from 'next';
import NotFoundContent from '@/components/NotFoundContent';

export const metadata: Metadata = {
  title: '404 - Không tìm thấy trang',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return <NotFoundContent />;
}
