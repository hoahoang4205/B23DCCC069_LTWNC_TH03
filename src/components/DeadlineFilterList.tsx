'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input, Select, Card, Tag, Button, Empty, Row, Col, Pagination } from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  RightOutlined,
  BookOutlined,
  FilterOutlined,
} from '@/components/icons';
import type { Deadline, Subject } from '@/types';
import Countdown from '@/components/Countdown';

interface DeadlineFilterListProps {
  deadlines: Deadline[];
  subjects: Subject[];
  initialSubjectSlug?: string;
}

export default function DeadlineFilterList({
  deadlines,
  subjects,
  initialSubjectSlug = 'all',
}: DeadlineFilterListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectSlug);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'expired'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Chế độ xem: Cột (Grid) hoặc Ngang (List)

  const subjectMap = useMemo(() => {
    const map = new Map<string, string>();
    subjects.forEach((s) => map.set(s.slug, s.name));
    return map;
  }, [subjects]);

  const filteredDeadlines = useMemo(() => {
    const now = new Date().getTime();
    return deadlines.filter((item) => {
      // Lọc từ khoá
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Lọc môn học
      const matchSubject =
        selectedSubject === 'all' || item.subjectSlug === selectedSubject;

      // Lọc trạng thái
      const itemTime = new Date(item.dueDate).getTime();
      const isExpired = itemTime < now;
      let matchStatus = true;
      if (statusFilter === 'upcoming') matchStatus = !isExpired;
      if (statusFilter === 'expired') matchStatus = isExpired;

      return matchSearch && matchSubject && matchStatus;
    });
  }, [deadlines, searchTerm, selectedSubject, statusFilter]);
  const pageSize = 12;
  const visibleDeadlines = filteredDeadlines.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const subjectOptions = [
    { value: 'all', label: 'Tất cả môn học' },
    ...subjects.map((s) => ({ value: s.slug, label: s.name })),
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'upcoming', label: '⏳ Còn hạn' },
    { value: 'expired', label: '⚠️ Quá hạn' },
  ];

  return (
    <div className="space-y-5">
      {/* Thanh bộ lọc & Chuyển đổi chế độ xem (Grid / List) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={10}>
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Tìm kiếm deadline, môn học..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              allowClear
              size="large"
              className="rounded-xl"
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              className="w-full"
              size="large"
              value={selectedSubject}
              onChange={(val) => {
                setSelectedSubject(val);
                setCurrentPage(1);
              }}
              options={subjectOptions}
              suffixIcon={<BookOutlined />}
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              className="w-full"
              size="large"
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              options={statusOptions}
              suffixIcon={<FilterOutlined />}
            />
          </Col>
          <Col xs={24} md={4} className="flex justify-end">
            {/* Nút chuyển đổi giao diện Cột / Ngang theo yêu cầu của bạn */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Xem dạng cột (Grid)"
              >
                ⊞ Cột
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Xem dạng ngang (List)"
              >
                ☰ Ngang
              </button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Thông tin số lượng */}
      <div className="text-xs text-slate-500 px-1">
        Hiển thị <strong>{filteredDeadlines.length}</strong> / {deadlines.length} bài tập
      </div>

      {/* Hiển thị danh sách theo chế độ đã chọn */}
      {filteredDeadlines.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-12 text-center">
          <Empty description="Không có deadline nào phù hợp với bộ lọc" />
        </div>
      ) : viewMode === 'grid' ? (
        /* 1. CHẾ ĐỘ XEM DẠNG CỘT (GRID VIEW) */
        <Row gutter={[16, 16]}>
          {visibleDeadlines.map((item) => {
            const subjectName = subjectMap.get(item.subjectSlug) || item.subjectSlug;
            const dueDateFormatted = new Date(item.dueDate).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Col xs={24} sm={12} lg={8} key={item.id}>
                <div className="h-full bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                        {subjectName}
                      </span>
                      <Countdown dueDate={item.dueDate} />
                    </div>

                    <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                      <Link href={`/deadlines/${item.id}`}>{item.title}</Link>
                    </h3>

                    <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {item.description || 'Không có mô tả chi tiết.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CalendarOutlined className="text-blue-500" /> {dueDateFormatted}
                    </span>

                    <Link
                      href={`/deadlines/${item.id}`}
                      className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Xem</span>
                      <RightOutlined />
                    </Link>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      ) : (
        /* 2. CHẾ ĐỘ XEM DẠNG NGANG (LIST VIEW) */
        <div className="space-y-3">
          {visibleDeadlines.map((item) => {
            const subjectName = subjectMap.get(item.subjectSlug) || item.subjectSlug;
            const dueDateFormatted = new Date(item.dueDate).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-sm transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                      {subjectName}
                    </span>
                    <Countdown dueDate={item.dueDate} />
                  </div>

                  <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                    <Link href={`/deadlines/${item.id}`}>{item.title}</Link>
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarOutlined className="text-blue-500" /> Hạn nộp: {dueDateFormatted}
                    </span>
                    <span>•</span>
                    <span className="line-clamp-1">{item.description || 'Không có mô tả'}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Link
                    href={`/deadlines/${item.id}`}
                    className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-xl transition"
                  >
                    <span>Xem chi tiết</span>
                    <RightOutlined />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {filteredDeadlines.length > pageSize && (
        <div className="flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredDeadlines.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
