import type { Metadata } from 'next';
import ForbiddenContent from '@/components/ForbiddenContent';

export const metadata: Metadata = {
  title: '403 - Quyền Truy Cập Bị Từ Chối',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return <ForbiddenContent />;
}
