'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Countdown from '@/components/Countdown';
import {
  CalendarOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  CheckOutlined,
  UndoOutlined,
} from '@/components/icons';
import type { Deadline, Subject } from '@/types';
import { toggleComplete } from '@/app/actions/deadline';

interface DeadlineDetailViewProps {
  deadline: Deadline;
  subject: Subject | null;
}

export default function DeadlineDetailView({
  deadline,
  subject,
}: DeadlineDetailViewProps) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [completionOverride, setCompletionOverride] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isDone =
    completionOverride ?? Boolean(user?.email && deadline.completedBy.includes(user.email));

  const dueDateFormatted = new Date(deadline.dueDate).toLocaleString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleToggle = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const formData = new FormData();
      formData.set('id', deadline.id);
      const res = await toggleComplete(formData);
      if (res?.success) {
        setCompletionOverride(res.completed ?? !isDone);
        setNotice(res.message || 'Đã cập nhật trạng thái bài tập!');
        setTimeout(() => setNotice(null), 3000);
      } else {
        setNotice(res?.error || 'Không thể cập nhật trạng thái.');
      }
    } catch {
      setNotice('Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Breadcrumb chuẩn Semantic Accessible HTML */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-600 font-medium list-none p-0 m-0">
          <li className="flex items-center gap-1.5">
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
          <li>
            <Link href={`/subjects/${deadline.subjectSlug}`} className="hover:text-blue-600 transition">
              {subject?.name || deadline.subjectSlug}
            </Link>
          </li>
          <li className="text-slate-400" aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-900 font-semibold truncate max-w-xs">
            {deadline.title}
          </li>
        </ol>
      </nav>

      {/* 2. Main Detail Card siêu nhẹ */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header: Môn học + Đếm ngược */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
              <BookOutlined />
              <span>{subject?.name || deadline.subjectSlug}</span>
            </span>
            <span className="text-xs text-slate-600 font-mono font-medium">ID: #{deadline.id}</span>
          </div>
          <Countdown dueDate={deadline.dueDate} />
        </div>

        {/* Tiêu đề & Hạn nộp */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {deadline.title}
          </h1>
          <div className="mt-2.5 flex items-center gap-2 text-slate-700 text-sm">
            <CalendarOutlined className="text-blue-600" />
            <span>
              Hạn nộp bài: <strong className="text-slate-900">{dueDateFormatted}</strong>
            </span>
          </div>
        </div>

        <div className="h-px bg-slate-100 my-4" />

        {/* Nội dung bài tập */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Nội dung bài tập &amp; Yêu cầu
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 leading-relaxed text-sm sm:text-base">
            {deadline.description || 'Chưa có mô tả chi tiết cho bài tập này.'}
          </div>
        </div>

        {/* Thông báo trạng thái nhanh nếu có */}
        {notice && (
          <div className="p-3 bg-blue-50 text-blue-800 text-xs font-semibold rounded-xl border border-blue-200 transition">
            {notice}
          </div>
        )}

        {/* Phần tương tác trạng thái bài tập */}
        {user ? (
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDone
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-blue-50/40 border-blue-200'
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Trạng thái bài tập của bạn
              </p>
              <div className="flex items-center gap-2 mt-1">
                {isDone ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    <CheckCircleOutlined /> Đã hoàn thành bài tập
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    <ClockCircleOutlined /> Chưa nộp bài
                  </span>
                )}
              </div>
            </div>

            {/* Nút bấm Đánh dấu hoàn thành trực tiếp trên trang chi tiết */}
            <button
              type="button"
              disabled={loading}
              onClick={handleToggle}
              aria-label={isDone ? 'Huỷ đánh dấu hoàn thành bài tập' : 'Đánh dấu đã hoàn thành bài tập'}
              className={`h-11 px-5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                isDone
                  ? 'border border-emerald-300 text-emerald-800 hover:bg-emerald-50 bg-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {isDone ? <UndoOutlined /> : <CheckOutlined />}
              <span>
                {loading
                  ? 'Đang lưu...'
                  : isDone
                  ? 'Huỷ hoàn thành'
                  : 'Đánh dấu đã hoàn thành'}
              </span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Bạn đang xem bài tập ở chế độ Khách công khai.</span>
            <Link
              href={`/login?callbackUrl=/deadlines/${deadline.id}`}
              className="text-blue-700 hover:underline font-semibold"
            >
              Đăng nhập để đánh dấu hoàn thành →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
