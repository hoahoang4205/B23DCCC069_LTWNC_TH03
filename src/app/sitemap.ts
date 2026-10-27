import type { MetadataRoute } from 'next';
import { getDeadlines, getSubjects } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  // Route tĩnh
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Route môn học
  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((subj) => ({
    url: `${baseUrl}/subjects/${subj.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Route từng deadline (gồm mọi deadline theo yêu cầu mục E)
  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((item) => ({
    url: `${baseUrl}/deadlines/${item.id}`,
    lastModified: new Date(item.dueDate),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
