import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getDeadlines, getSubjects } from '@/lib/db';
import DashboardDeadlineList from '@/components/DashboardDeadlineList';

// Chiến lược SSR theo yêu cầu đề bài
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bảng Điều Khiển Sinh Viên',
  description: 'Theo dõi bài tập và đánh dấu tiến độ hoàn thành deadline.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <span>Không gian học tập cá nhân</span>
          <span>•</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">SSR</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Bảng Điều Khiển Deadline
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Xin chào <strong>{session.user.name}</strong> ({session.user.role === 'admin' ? 'Lớp trưởng' : 'Sinh viên'}). Xem danh sách bài tập và đánh dấu bài đã nộp.
        </p>
      </div>

      <DashboardDeadlineList
        initialDeadlines={deadlines}
        subjects={subjects}
        userEmail={session.user.email || ''}
      />
    </div>
  );
}
