'use client';

import Link from 'next/link';
import DeadlineFilterList from '@/components/DeadlineFilterList';
import { HomeOutlined, BookOutlined, ArrowLeftOutlined } from '@/components/icons';
import type { Subject, Deadline } from '@/types';
import { getSubjectTheme } from '@/lib/subject-theme';

interface SubjectDetailViewProps {
  subject: Subject;
  allDeadlines: Deadline[];
  allSubjects: Subject[];
  subjectDeadlines: Deadline[];
}

export default function SubjectDetailView({
  subject,
  allDeadlines,
  allSubjects,
  subjectDeadlines,
}: SubjectDetailViewProps) {
  const theme = getSubjectTheme(subject.slug);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Semantic Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-600 font-medium list-none p-0 m-0">
          <li>
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1.5 transition">
              <HomeOutlined />
              <span>Trang chủ</span>
            </Link>
          </li>
          <li className="text-slate-400" aria-hidden="true">/</li>
          <li>
            <Link href="/deadlines" className="hover:text-blue-600 transition">
              Deadline
            </Link>
          </li>
          <li className="text-slate-400" aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-900 font-semibold truncate max-w-xs">
            {subject.name}
          </li>
        </ol>
      </nav>

      {/* Header Môn Học mang màu sắc riêng của môn */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl ${theme.iconBgClass} flex items-center justify-center text-lg`}>
              <BookOutlined />
            </div>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${theme.badgeClass}`}>
              MÔN: {subject.slug.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {subject.name}
          </h1>

          <p className="text-slate-600 text-sm">
            Hiện có <strong className="text-slate-900">{subjectDeadlines.length}</strong> bài tập và hạn nộp được công bố trong học kỳ.
          </p>
        </div>

        <Link
          href="/deadlines"
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          <ArrowLeftOutlined />
          <span>Xem tất cả môn khác</span>
        </Link>
      </div>

      {/* Danh sách deadline có bộ lọc */}
      <DeadlineFilterList
        deadlines={allDeadlines}
        subjects={allSubjects}
        initialSubjectSlug={subject.slug}
      />
    </div>
  );
}
