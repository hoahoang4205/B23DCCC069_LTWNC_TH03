'use client';

import Link from 'next/link';
import { Row, Col, Divider } from 'antd';
import {
  BookOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
} from '@/components/icons';
import DeadlineFilterList from '@/components/DeadlineFilterList';
import type { Subject, Deadline } from '@/types';
import { getSubjectTheme } from '@/lib/subject-theme';

interface HomeViewProps {
  subjects: Subject[];
  deadlines: Deadline[];
}

export default function HomeView({ subjects, deadlines }: HomeViewProps) {
  const totalCount = deadlines.length;
  const now = new Date().getTime();
  const upcomingCount = deadlines.filter((d) => new Date(d.dueDate).getTime() > now).length;

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero Section phong cách Gen Z năng động, sáng sủa, có gradient rực rỡ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white p-8 md:p-10 shadow-lg shadow-indigo-100">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 -top-10 w-48 h-48 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PTIT Academic Portal • Học kỳ 2026</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Class Deadline Hub <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-300 bg-clip-text text-transparent">
              Quản Lý Hạn Nộp Siêu Tốc
            </span>
          </h1>

          <p className="text-sm md:text-base text-blue-50/90 leading-relaxed font-normal">
            Không còn nỗi lo trễ hạn nộp bài. Theo dõi toàn bộ bài tập, đồ án 4 môn học với bộ đếm ngược thông minh và giao diện trực quan.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20">
              <CalendarOutlined /> {totalCount} Bài tập trong kỳ
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-400/20 backdrop-blur-xs text-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {upcomingCount} Bài đang mở
            </span>
          </div>
        </div>
      </section>

      {/* 4 Môn học trong kỳ - Mỗi môn một dải màu phong cách Gen Z */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              4 Môn Học Trong Kỳ
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Khám phá bài tập và đồ án theo từng môn học chuyên ngành
            </p>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {subjects.map((subj) => {
            const count = deadlines.filter((d) => d.subjectSlug === subj.slug).length;
            const theme = getSubjectTheme(subj.slug);

            return (
              <Col xs={24} sm={12} lg={6} key={subj.slug}>
                <Link href={`/subjects/${subj.slug}`} className="block h-full group">
                  <div
                    className={`h-full bg-white rounded-2xl border border-slate-200 ${theme.borderClass} shadow-2xs hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col justify-between`}
                  >
                    <div>
                      {/* Icon môn học có gradient riêng */}
                      <div
                        className={`w-12 h-12 rounded-2xl ${theme.iconBgClass} flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform duration-200`}
                      >
                        <BookOutlined />
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {subj.name}
                      </h3>

                      <span
                        className={`inline-block text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md mb-4 ${theme.badgeClass}`}
                      >
                        {subj.slug.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-slate-100">
                      <span className={theme.accentText}>{count} Deadline</span>
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowRightOutlined />
                      </span>
                    </div>
                  </div>
                </Link>
              </Col>
            );
          })}
        </Row>
      </section>

      <Divider className="!my-6 border-slate-200" />

      {/* Danh sách Deadline công khai cho Guest */}
      <section id="danh-sach-deadline" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              Danh Sách Deadline Công Khai
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Tra cứu nhanh bài tập theo môn học, thời hạn và chế độ xem (Lưới ⊞ hoặc Ngang ☰)
            </p>
          </div>
        </div>

        <DeadlineFilterList deadlines={deadlines} subjects={subjects} />
      </section>
    </div>
  );
}
