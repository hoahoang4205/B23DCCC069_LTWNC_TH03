'use client';

import Link from 'next/link';
import { Result, Button } from 'antd';
import { HomeOutlined, CalendarOutlined } from '@/components/icons';

export default function NotFoundContent() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full text-center">
        <Result
          status="404"
          title={<span className="text-2xl font-bold text-slate-800">404 - Không Tìm Thấy Trang</span>}
          subTitle={
            <p className="text-slate-600 mt-2">
              Mã deadline hoặc đường dẫn bạn truy cập không tồn tại hoặc đã được chuyển đi nơi khác.
            </p>
          }
          extra={[
            <Link key="deadlines" href="/deadlines">
              <Button type="primary" icon={<CalendarOutlined />} size="large">
                Xem Tất Cả Deadline
              </Button>
            </Link>,
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
