'use client';

import Link from 'next/link';
import { Card, Row, Col, Divider } from 'antd';
import {
  BookOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
} from '@/components/icons';
import DeadlineFilterList from '@/components/DeadlineFilterList';
import type { Subject, Deadline } from '@/types';

interface HomeViewProps {
  subjects: Subject[];
  deadlines: Deadline[];
}

export default function HomeView({ subjects, deadlines }: HomeViewProps) {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero Section tinh gọn, không nút bấm rườm rà */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-8 md:p-10 shadow-md">
        <div className="max-w-2xl space-y-3">
          <span className="inline-block bg-white/20 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Lớp Học Phần PTIT • Học Kỳ Hiện Tại
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Class Deadline Hub <br />
            <span className="text-amber-300">Cổng Quản Lý Deadline Lớp Học</span>
          </h1>

          <p className="text-sm md:text-base text-blue-100 leading-relaxed">
            Xem toàn bộ hạn nộp bài tập, đồ án công khai cho sinh viên. Đăng nhập để tự đánh dấu bài tập đã hoàn thành.
          </p>
        </div>
      </section>

      {/* 4 Môn học trong kỳ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">4 Môn Học Trong Kỳ</h2>
          <span className="text-xs text-slate-500">Bấm vào môn để xem danh sách bài tập</span>
        </div>

        <Row gutter={[16, 16]}>
          {subjects.map((subj) => {
            const count = deadlines.filter((d) => d.subjectSlug === subj.slug).length;
            return (
              <Col xs={24} sm={12} lg={6} key={subj.slug}>
                <Link href={`/subjects/${subj.slug}`} className="block h-full group">
                  <div className="h-full bg-white rounded-2xl border border-slate-200 hover:border-blue-500 shadow-2xs hover:shadow-sm transition-all p-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 text-lg">
                      <BookOutlined />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3 font-mono">
                      {subj.slug.toUpperCase()}
                    </p>
                    <div className="flex items-center justify-between text-xs text-blue-600 font-semibold pt-2.5 border-t border-slate-100">
                      <span>{count} Deadline</span>
                      <ArrowRightOutlined />
                    </div>
                  </div>
                </Link>
              </Col>
            );
          })}
        </Row>
      </section>

      <Divider className="!my-6" />

      {/* Danh sách Deadline công khai cho Guest (có chuyển đổi Cột / Ngang) */}
      <section id="danh-sach-deadline" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Danh Sách Deadline Công Khai</h2>
            <p className="text-xs text-slate-500">
              Tra cứu nhanh bài tập theo môn học, thời hạn và chế độ xem (Cột hoặc Ngang)
            </p>
          </div>
        </div>

        <DeadlineFilterList deadlines={deadlines} subjects={subjects} />
      </section>
    </div>
  );
}
