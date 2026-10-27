import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDeadlines, getDeadlineById, getSubjectBySlug } from '@/lib/db';
import DeadlineDetailView from '@/components/DeadlineDetailView';

// Chiến lược ISR
export const revalidate = 60;

interface DeadlineDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({
    id: d.id,
  }));
}

export async function generateMetadata({ params }: DeadlineDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);
  if (!deadline) {
    return {
      title: 'Không tìm thấy deadline',
      description: 'Hạn chót hoặc bài tập không tồn tại.',
    };
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);
  const subjectName = subject?.name || deadline.subjectSlug;
  const imagePath = `/deadlines/${deadline.id}/opengraph-image`;

  const formattedDate = new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    title: `${deadline.title} - ${subjectName}`,
    description: `Hạn nộp: ${formattedDate}. Môn học: ${subjectName}. Chi tiết: ${deadline.description || 'Theo dõi hạn chót bài tập trên Class Deadline Hub.'}`,
    openGraph: {
      title: `${deadline.title} | ${subjectName}`,
      description: `Hạn nộp: ${formattedDate}. ${deadline.description || ''}`,
      type: 'article',
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: `${deadline.title} - ${subjectName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${deadline.title} | ${subjectName}`,
      description: `Hạn nộp: ${formattedDate}`,
    },
  };
}

export default async function DeadlineDetailPage({ params }: DeadlineDetailPageProps) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    notFound();
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

  // Structured Data (JSON-LD) kiểu BreadcrumbList theo yêu cầu mục E
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tất cả Deadline',
        item: `${baseUrl}/deadlines`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: subject?.name || deadline.subjectSlug,
        item: `${baseUrl}/subjects/${deadline.subjectSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: deadline.title,
        item: `${baseUrl}/deadlines/${deadline.id}`,
      },
    ],
  };

  return (
    <>
      {/* Script chèn JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <DeadlineDetailView
        deadline={deadline}
        subject={subject || null}
      />
    </>
  );
}
