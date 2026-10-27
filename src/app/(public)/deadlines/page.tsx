import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/lib/db';
import DeadlineFilterList from '@/components/DeadlineFilterList';

// Chiến lược ISR: làm mới sau 60 giây theo yêu cầu đề bài
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tất Cả Deadline Lớp Học',
  description: 'Danh sách tổng hợp các bài tập, đồ án và hạn chót nộp bài của các môn học.',
};

export default async function DeadlinesPage() {
  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <span>Công khai cho mọi người</span>
          <span>•</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">ISR 60s</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Danh Sách Deadline Môn Học
        </h1>
        <p className="text-slate-600 mt-1">
          Theo dõi thời hạn và tìm kiếm deadline bài tập theo từng môn học nhanh chóng.
        </p>
      </div>

      <DeadlineFilterList deadlines={deadlines} subjects={subjects} />
    </div>
  );
}
