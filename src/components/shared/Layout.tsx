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
  const mobileNavOpen = useStore(s => s.mobileNavOpen);
  const closeMobileNav = useStore(s => s.closeMobileNav);

  return (
    <div className="min-h-screen bg-slate-950 bg-grid overflow-x-hidden">
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
          onClick={closeMobileNav}
        />
      )}
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 min-w-0',
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
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
