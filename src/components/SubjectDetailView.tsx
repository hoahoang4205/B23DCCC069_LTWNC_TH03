'use client';

import Link from 'next/link';
import DeadlineFilterList from '@/components/DeadlineFilterList';
import { Breadcrumb, Button } from 'antd';
import { HomeOutlined, BookOutlined, ArrowLeftOutlined } from '@/components/icons';
import type { Subject, Deadline } from '@/types';

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
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            title: (
              <Link href="/">
                <HomeOutlined /> Trang chủ
              </Link>
            ),
          },
          {
            title: <Link href="/deadlines">Deadline</Link>,
          },
          {
            title: subject.name,
          },
        ]}
      />

      {/* Header Môn Học */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              <BookOutlined />
            </span>
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
              Mã môn: {subject.slug.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            Môn: {subject.name}
          </h1>
          <p className="text-slate-500 text-sm">
            Hiện có <strong>{subjectDeadlines.length}</strong> bài tập và hạn nộp được công bố.
          </p>
        </div>

        <Link href="/deadlines">
          <Button icon={<ArrowLeftOutlined />}>Xem tất cả môn khác</Button>
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
