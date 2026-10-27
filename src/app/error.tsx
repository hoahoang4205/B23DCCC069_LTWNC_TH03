'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ReloadOutlined, HomeOutlined, ExclamationCircleOutlined } from '@/components/icons';

export default function Error({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}) {
  const recover = reset ?? retry;

  useEffect(() => {
    console.error('App Router Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">
          <ExclamationCircleOutlined />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Đã Có Lỗi Xảy Ra!</h2>
        <div className="text-slate-600 space-y-2">
          <p className="text-sm">Hệ thống không thể xử lý yêu cầu của bạn lúc này.</p>
          {error.message && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 font-mono text-left overflow-auto">
              {error.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => recover?.()}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs text-sm cursor-pointer transition"
          >
            <ReloadOutlined />
            <span>Thử Lại</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition"
          >
            <HomeOutlined />
            <span>Về Trang Chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
