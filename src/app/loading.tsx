'use client';

import { Spin } from 'antd';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <Spin size="large" />
      <p className="text-sm text-slate-500 font-medium">Đang tải dữ liệu, vui lòng đợi...</p>
    </div>
  );
}
