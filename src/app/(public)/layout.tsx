import PublicHeader from '@/components/PublicHeader';
import PublicSessionProvider from '@/components/PublicSessionProvider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicSessionProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <PublicHeader />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-4 mt-auto text-center text-xs text-slate-600 font-medium">
          <p>© 2026 Class Deadline Hub • Học viện Công nghệ Bưu chính Viễn thông (PTIT)</p>
        </footer>
      </div>
    </PublicSessionProvider>
  );
}
