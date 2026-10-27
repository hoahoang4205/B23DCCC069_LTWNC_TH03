import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { can } from '@/lib/permissions';
import { getDeadlines, getSubjects } from '@/lib/db';
import AdminDeadlineManager from '@/components/AdminDeadlineManager';

// Chiến lược SSR theo yêu cầu đề bài
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Trang Quản Trị Lớp Trưởng',
  description: 'Quản trị thêm mới và xoá deadline các môn học.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await auth();

  // Lớp bảo vệ thứ 2 (Page level): Phòng thủ đa tầng theo yêu cầu đề bài
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (!can(session.user.role, 'create:deadline')) {
    redirect('/403');
  }

  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
          <span>Khu vực Ban Cán Sự Lớp</span>
          <span>•</span>
          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">SSR (Admin Only)</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Quản Trị Deadline Môn Học
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Xin chào <strong>{session.user.name}</strong> (Lớp trưởng). Thêm mới bài tập hoặc xoá deadline đã kết thúc.
        </p>
      </div>

      <AdminDeadlineManager initialDeadlines={deadlines} subjects={subjects} />
    </div>
  );
}
