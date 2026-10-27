'use client';

import { useState } from 'react';
import Link from 'next/link';
import { message } from 'antd';
import {
  CalendarOutlined,
  CheckOutlined,
  UndoOutlined,
} from '@/components/icons';
import type { Deadline, Subject } from '@/types';
import { toggleComplete } from '@/app/actions/deadline';

interface DashboardDeadlineListProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
  userEmail: string;
}

export default function DashboardDeadlineList({
  initialDeadlines,
  subjects,
  userEmail,
}: DashboardDeadlineListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('pending');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const subjectMap = new Map(subjects.map((s) => [s.slug, s.name]));

  const completedDeadlines = initialDeadlines.filter((d) => d.completedBy.includes(userEmail));
  const pendingDeadlines = initialDeadlines.filter((d) => !d.completedBy.includes(userEmail));

  const handleToggle = async (deadlineId: string) => {
    setLoadingId(deadlineId);
    try {
      const formData = new FormData();
      formData.set('id', deadlineId);
      const res = await toggleComplete(formData);
      if (res.success) {
        message.success(res.message);
      } else {
        message.error(res.error);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const displayedDeadlines =
    activeTab === 'all'
      ? initialDeadlines
      : activeTab === 'completed'
      ? completedDeadlines
      : pendingDeadlines;

  return (
    <div className="max-w-5xl mx-auto py-2">
      {/* Container chính bo tròn chuẩn theo mẫu thiết kế */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-7">
        {/* Header với Icon lịch */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/60 shadow-xs">
            <CalendarOutlined style={{ fontSize: 26 }} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Deadline của tôi
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Theo dõi bài tập và đánh dấu khi đã hoàn thành.
            </p>
          </div>
        </div>

        {/* Thanh chuyển Tab dạng Pill đúng theo ảnh mẫu */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Tất cả ({initialDeadlines.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Cần làm ({pendingDeadlines.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Đã hoàn thành ({completedDeadlines.length})
          </button>
        </div>

        {/* Danh sách thẻ bài tập */}
        <div className="space-y-3.5">
          {displayedDeadlines.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-sm">
              Không có bài tập nào trong mục này.
            </div>
          ) : (
            displayedDeadlines.map((item) => {
              const isDone = item.completedBy.includes(userEmail);
              const subjectName = subjectMap.get(item.subjectSlug) || item.subjectSlug;

              const dateObj = new Date(item.dueDate);
              const timeStr = dateObj.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const dateStr = dateObj.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isDone
                      ? 'bg-emerald-50/40 border border-emerald-200/80'
                      : 'bg-white border border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Cột trái: Vòng tròn trạng thái + Tiêu đề + Hạn nộp */}
                  <div className="flex items-start gap-4">
                    {/* Circle checkbox icon */}
                    <div className="mt-1 shrink-0">
                      {isDone ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                      )}
                    </div>

                    <div className="space-y-1">
                      {/* Tag môn học */}
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-0.5 rounded-full">
                        {subjectName}
                      </span>

                      {/* Tiêu đề bài tập */}
                      <h3
                        className={`text-base sm:text-lg font-bold leading-snug ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        <Link href={`/deadlines/${item.id}`} className="hover:text-blue-600">
                          {item.title}
                        </Link>
                      </h3>

                      {/* Hạn nộp */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                        <CalendarOutlined className="text-slate-400" />
                        <span>Hạn nộp: {timeStr} · {dateStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cột phải: Nút bấm Hoàn thành / Đã hoàn thành */}
                  <div className="shrink-0 flex items-center self-end sm:self-center">
                    {isDone ? (
                      <button
                        type="button"
                        disabled={loadingId === item.id}
                        onClick={() => handleToggle(item.id)}
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-500 font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl transition cursor-pointer"
                        title="Bấm để huỷ hoàn thành"
                      >
                        <CheckOutlined />
                        <span>{loadingId === item.id ? 'Đang lưu...' : '✓ Đã hoàn thành'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={loadingId === item.id}
                        onClick={() => handleToggle(item.id)}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                      >
                        <CheckOutlined />
                        <span>{loadingId === item.id ? 'Đang lưu...' : 'Hoàn thành'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
