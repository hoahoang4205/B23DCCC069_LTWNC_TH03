'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Button, Menu, type MenuProps } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  CalendarOutlined,
  HomeOutlined,
  LogoutOutlined,
} from '@/components/icons';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

interface AppSidebarProps {
  session: Session | null;
}

export default function AppSidebar({ session }: AppSidebarProps) {
  const pathname = usePathname();
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  const menuItems: NonNullable<MenuProps['items']> = [
    {
      key: '/dashboard',
      label: <Link href="/dashboard">Bảng Điều Khiển</Link>,
      icon: <DashboardOutlined style={{ fontSize: 18 }} />,
    },
    ...(isAdmin
      ? [
          {
            key: '/admin',
            label: <Link href="/admin">Quản Trị Lớp Học</Link>,
            icon: <SettingOutlined style={{ fontSize: 18 }} />,
          },
        ]
      : []),
    {
      key: '/deadlines',
      label: <Link href="/deadlines">Tất Cả Deadline</Link>,
      icon: <CalendarOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: '/',
      label: <Link href="/">Trang Chủ</Link>,
      icon: <HomeOutlined style={{ fontSize: 18 }} />,
    },
  ];
  const selectedKey = pathname.startsWith('/admin')
    ? '/admin'
    : pathname.startsWith('/deadlines')
      ? '/deadlines'
      : '/dashboard';

  return (
    <aside className="w-64 bg-white text-slate-800 flex flex-col shrink-0 min-h-screen border-r border-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <Image
          src="/ptit-logo.svg"
          alt="PTIT Logo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-xl shadow-sm shadow-blue-200"
        />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base text-slate-900">Deadline Hub</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
              PTIT
            </span>
          </div>
          <p className="text-xs text-slate-500">Khu vực thành viên</p>
        </div>
      </div>

      {/* User Badge */}
      <div className="p-4 mx-3 my-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="overflow-hidden flex-1">
          <p className="font-bold text-slate-800 text-sm truncate">{user?.name || 'Thành viên'}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Tag color={isAdmin ? 'red' : 'green'} className="!mr-0 text-[10px] py-0 px-1.5 font-semibold">
              {isAdmin ? 'Lớp trưởng (Admin)' : 'Sinh viên'}
            </Tag>
          </div>
        </div>
      </div>

      {/* Navigation Links with Active Highlighting */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Menu Điều Hướng
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          className="!bg-transparent !border-0"
        />
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-slate-100">
        <Button
          danger
          block
          icon={<LogoutOutlined />}
          className="h-10 text-xs font-semibold rounded-xl"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Đăng Xuất
        </Button>
      </div>
    </aside>
  );
}
