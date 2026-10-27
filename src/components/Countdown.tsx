'use client';

import { useEffect, useState } from 'react';
import { ClockCircleOutlined, ExclamationCircleOutlined } from '@/components/icons';

interface CountdownProps {
  dueDate: string;
}

export default function Countdown({ dueDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    status: 'upcoming' | 'expired' | 'invalid';
    text: string;
    isUrgent: boolean;
  }>({
    status: 'upcoming',
    text: 'Đang tính...',
    isUrgent: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(dueDate).getTime();
      if (Number.isNaN(target)) {
        setTimeLeft({ status: 'invalid', text: 'Hạn nộp không hợp lệ', isUrgent: true });
        return;
      }
      const diff = target - now;

      if (diff <= 0) {
        const expiredDiff = Math.abs(diff);
        const days = Math.floor(expiredDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((expiredDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let text = 'Đã hết hạn';
        if (days > 0) {
          text = `Quá hạn ${days} ngày`;
        } else if (hours > 0) {
          text = `Quá hạn ${hours} giờ`;
        } else {
          text = 'Vừa quá hạn';
        }
        setTimeLeft({ status: 'expired', text, isUrgent: true });
      } else {
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let text = '';
        if (days > 0) {
          text = `Còn ${days} ngày`;
        } else if (hours > 0) {
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          text = `Còn ${hours} giờ ${minutes} phút`;
        } else {
          text = 'Còn dưới 1 giờ';
        }
        setTimeLeft({
          status: 'upcoming',
          text,
          isUrgent: days <= 3,
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [dueDate]);

  if (timeLeft.status === 'expired') {
    return (
      <span
        role="timer"
        aria-label={`Thời hạn nộp bài: ${timeLeft.text}`}
        className="inline-flex items-center gap-1.5 font-semibold text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 border border-red-200"
      >
        <ExclamationCircleOutlined />
        <span>{timeLeft.text}</span>
      </span>
    );
  }

  if (timeLeft.status === 'invalid') {
    return (
      <span
        role="timer"
        aria-label="Hạn nộp không hợp lệ"
        className="inline-flex items-center gap-1.5 font-semibold text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
      >
        <span>{timeLeft.text}</span>
      </span>
    );
  }

  return (
    <span
      role="timer"
      aria-label={`Thời gian còn lại nộp bài: ${timeLeft.text}`}
      className={`inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-1 rounded-md border ${
        timeLeft.isUrgent
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-blue-50 text-blue-800 border-blue-200'
      }`}
    >
      <ClockCircleOutlined />
      <span>{timeLeft.text}</span>
    </span>
  );
}
