'use client';

import { useEffect } from 'react';
import { Result, Button } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@/components/icons';
import Link from 'next/link';

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
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full text-center">
        <Result
          status="500"
          title={<span className="text-2xl font-bold text-slate-800">Đã Có Lỗi Xảy Ra!</span>}
          subTitle={
            <div className="text-slate-600 mt-2 space-y-1">
              <p>Hệ thống không thể xử lý yêu cầu của bạn lúc này.</p>
              {error.message && (
                <p className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 font-mono">
                  {error.message}
                </p>
              )}
            </div>
          }
          extra={[
            <Button
              key="retry"
              type="primary"
              icon={<ReloadOutlined />}
              size="large"
              onClick={() => recover?.()}
              className="bg-blue-600"
            >
              Thử Lại
            </Button>,
            <Link key="home" href="/">
              <Button icon={<HomeOutlined />} size="large">
                Về Trang Chủ
              </Button>
            </Link>,
          ]}
        />
      </div>
    </div>
  );
}
