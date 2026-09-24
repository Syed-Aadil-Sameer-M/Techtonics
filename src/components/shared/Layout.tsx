import { type ReactNode } from 'react';
import { useStore } from '@/store';
import { Sidebar } from '@/components/shared/Sidebar';
import { Topbar } from '@/components/shared/Topbar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const collapsed = useStore(s => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'ml-20' : 'ml-64'
        )}
      >
        <Topbar />
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
