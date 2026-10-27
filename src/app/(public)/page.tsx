import { getSubjects, getDeadlines } from '@/lib/db';
import HomeView from '@/components/HomeView';

// Trang chủ dùng chiến lược SSG (Static Site Generation)
export const dynamic = 'force-static';

export default async function HomePage() {
  const subjects = await getSubjects();
  const deadlines = await getDeadlines();

  return <HomeView subjects={subjects} deadlines={deadlines} />;
}
