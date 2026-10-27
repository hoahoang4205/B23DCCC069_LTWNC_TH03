import { ImageResponse } from 'next/og';
import { getDeadlineById, getSubjectBySlug } from '@/lib/db';

export const runtime = 'nodejs';
export const alt = 'Class Deadline Hub - Chi tiết bài tập';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);
  const subject = deadline ? await getSubjectBySlug(deadline.subjectSlug) : null;

  const title = deadline?.title || 'Chi tiết Deadline';
  const subjectName = subject?.name || 'Môn học PTIT';
  const dueDate = deadline
    ? new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              PTIT
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f8fafc' }}>
              Class Deadline Hub
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#1d4ed8',
              color: '#eff6ff',
              padding: '8px 24px',
              borderRadius: '9999px',
              fontSize: '22px',
              fontWeight: '600',
            }}
          >
            {subjectName}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '22px',
              color: '#38bdf8',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: '700',
            }}
          >
            Hạn chót nộp bài tập
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: '900',
              lineHeight: 1.15,
              color: '#ffffff',
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid #334155',
            paddingTop: '30px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', color: '#94a3b8' }}>
            <span>Hạn nộp:</span>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{dueDate}</span>
          </div>

          <div style={{ fontSize: '20px', color: '#64748b' }}>
            Cổng quản lý bài tập trực tuyến lớp học
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
