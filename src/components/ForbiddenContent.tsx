'use client';

import Link from 'next/link';
import { Result, Button } from 'antd';
import { HomeOutlined, DashboardOutlined, LockOutlined } from '@/components/icons';

export default function ForbiddenContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full text-center">
        <Result
          icon={<LockOutlined className="text-red-500 text-6xl" />}
          status="403"
          title={<span className="text-2xl font-bold text-slate-800">403 - Quyền Truy Cập Bị Từ Chối</span>}
          subTitle={
            <div className="text-slate-600 mt-2 space-y-2">
              <p>Bạn không có quyền truy cập vào phân hệ Quản trị (Admin).</p>
              <p className="text-sm bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200">
                Chỉ tài khoản Lớp trưởng (Admin) mới có quyền thêm/xoá deadline môn học.
              </p>
            </div>
          }
          extra={[
            <Link key="dashboard" href="/dashboard">
              <Button type="primary" icon={<DashboardOutlined />} size="large">
                Về Bảng Điều Khiển
              </Button>
            </Link>,
            <Link key="home" href="/">
              <Button icon={<HomeOutlined />} size="large">
                Trang Chủ
              </Button>
            </Link>,
          ]}
        />
      </div>
    </div>
  );
}
