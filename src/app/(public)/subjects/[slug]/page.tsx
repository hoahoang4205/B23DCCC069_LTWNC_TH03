import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubjects, getSubjectBySlug, getDeadlinesBySubject, getDeadlines } from '@/lib/db';
import SubjectDetailView from '@/components/SubjectDetailView';

// Chiến lược SSG
export const dynamic = 'force-static';

interface SubjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((subj) => ({
    slug: subj.slug,
  }));
}

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) {
    return { title: 'Môn học không tồn tại' };
  }
  return {
    title: `Môn ${subject.name}`,
    description: `Danh sách các bài tập và deadline môn ${subject.name} (${subject.slug.toUpperCase()}).`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const allDeadlines = await getDeadlines();
  const allSubjects = await getSubjects();
  const subjectDeadlines = await getDeadlinesBySubject(slug);

  return (
    <SubjectDetailView
      subject={subject}
      allDeadlines={allDeadlines}
      allSubjects={allSubjects}
      subjectDeadlines={subjectDeadlines}
    />
  );
}
