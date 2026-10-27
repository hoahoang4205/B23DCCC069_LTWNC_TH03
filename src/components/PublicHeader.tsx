'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Tag, Button } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import {
  CalendarOutlined,
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@/components/icons';
export default function PublicHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/ptit-logo.svg"
              alt="PTIT Logo"
              width={40}
              height={40}
              priority
              className="w-10 h-10 rounded-xl shadow-sm shadow-blue-200 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                  Class Deadline Hub
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase">
                  PTIT
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Cổng quản lý bài tập & deadline lớp học
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Trang Chủ
            </Link>
            <Link
              href="/deadlines"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/deadlines'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tất Cả Deadline
            </Link>
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center space-x-3">
            {status === 'authenticated' && user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Thông tin user & role */}
                <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                    {user.name}
                  </span>
                  <Tag
                    color={isAdmin ? 'red' : 'green'}
                    className="!mr-0 text-[11px] font-semibold"
                  >
                    {isAdmin ? 'Lớp trưởng' : 'Sinh viên'}
                  </Tag>
                </div>

                {/* Nút vào phân hệ tương ứng */}
                {isAdmin ? (
                  <Link href="/admin">
                    <Button
                      type="primary"
                      icon={<SettingOutlined />}
                      className="bg-red-600 hover:bg-red-500 font-medium h-9 text-xs"
                    >
                      Quản Trị Lớp
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button
                      type="primary"
                      icon={<DashboardOutlined />}
                      className="bg-blue-600 hover:bg-blue-500 font-medium h-9 text-xs"
                    >
                      Bảng Điều Khiển
                    </Button>
                  </Link>
                )}

                {/* Nút Đăng xuất */}
                <Button
                  danger
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="h-9 text-xs font-medium text-slate-600 hover:text-red-600"
                >
                  <span className="hidden sm:inline">Đăng xuất</span>
                </Button>
              </div>
            ) : status === 'unauthenticated' ? (
              <Link href="/login">
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  className="bg-blue-600 hover:bg-blue-500 font-semibold h-10 px-5 rounded-xl shadow-xs"
                >
                  Đăng Nhập
                </Button>
              </Link>
            ) : (
              <span className="h-10 w-28" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
