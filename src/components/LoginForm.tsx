'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Card, Input, Button, Alert, Divider } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  GithubOutlined,
} from '@/components/icons';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get('callbackUrl');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    if (!loginEmail || !loginPass) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        email: loginEmail.trim(),
        password: loginPass.trim(),
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage('Email hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.');
        setLoading(false);
      } else {
        // Điều hướng thông minh theo vai trò
        let targetUrl = rawCallback;
        if (!targetUrl || targetUrl === '/' || targetUrl === '/login') {
          targetUrl = loginEmail.includes('admin') ? '/admin' : '/dashboard';
        }
        window.location.href = targetUrl;
      }
    } catch {
      setErrorMessage('Đã có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại!');
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const handleQuickFillAndLogin = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    performLogin(fillEmail, fillPass);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card
        className="shadow-xl rounded-3xl border border-slate-200 bg-white"
        styles={{ body: { padding: '2.5rem 2rem' } }}
      >
        {/* Header màn hình Login */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-3 shadow-md shadow-blue-200">
            <SafetyCertificateOutlined style={{ fontSize: 28 }} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Đăng Nhập Hệ Thống</h1>
          <p className="text-xs text-slate-500 mt-1">
            Cổng quản lý deadline lớp học - Học viện PTIT
          </p>
        </div>

        {/* Thông báo lỗi */}
        {errorMessage && (
          <Alert
            message="Đăng nhập không thành công"
            description={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage(null)}
            className="mb-5 text-xs rounded-xl"
          />
        )}

        {/* Form đăng nhập chuẩn */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Địa chỉ Email
            </label>
            <Input
              size="large"
              prefix={<UserOutlined className="text-slate-400 mr-1" />}
              placeholder="admin@ptit.edu.vn hoặc sv@ptit.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl h-11"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mật khẩu
            </label>
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-slate-400 mr-1" />}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl h-11"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-100 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LoginOutlined />
            <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
          </button>
        </form>

        {/* Nút đăng nhập nhanh cho Giảng viên / Người chấm bài */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 text-center mb-2.5">
            ⚡ 1-Click Đăng nhập nhanh để chấm bài:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFillAndLogin('admin@ptit.edu.vn', 'admin123')}
              className="py-2.5 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition text-center cursor-pointer"
            >
              👑 Lớp trưởng (Admin)
            </button>

            <button
              type="button"
              onClick={() => handleQuickFillAndLogin('sv@ptit.edu.vn', 'sv123456')}
              className="py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition text-center cursor-pointer"
            >
              🎓 Sinh viên (User)
            </button>
          </div>
        </div>

        {/* GitHub OAuth (Điểm cộng) */}
        <div className="mt-4">
          <Button
            icon={<GithubOutlined />}
            block
            size="large"
            className="rounded-xl h-10 border-slate-300 text-slate-700 text-xs font-medium hover:border-slate-400"
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          >
            Đăng nhập với GitHub (OAuth)
          </Button>
        </div>

        {/* Link về trang chủ */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-blue-600 transition"
          >
            <HomeOutlined className="mr-1" /> Về lại Trang Chủ công khai
          </Link>
        </div>
      </Card>
    </div>
  );
}
