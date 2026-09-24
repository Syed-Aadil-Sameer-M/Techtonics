import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileCheck, FileText, Users, ListTodo,
  BarChart3, ScrollText, Settings, Package, Truck, Building2,
  ClipboardList, PackageCheck, Boxes, Bell, ChevronLeft,
  ShoppingCart,
} from 'lucide-react';
import { useStore } from '@/store';
import { cn } from '@/lib/utils';
import type { BackendRole } from '@/types';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

function getNavItems(role: BackendRole): { section: string; items: NavItem[] }[] {
  switch (role) {
    case 'ADMIN':
      return [
        {
          section: 'Overview',
          items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
        },
        {
          section: 'Workflow',
          items: [
            { to: '/admin/approvals', label: 'Approvals', icon: FileCheck },
            { to: '/admin/purchase-orders', label: 'Purchase Orders', icon: FileText },
            { to: '/admin/tasks', label: 'Tasks', icon: ListTodo },
          ],
        },
        {
          section: 'Management',
          items: [
            { to: '/admin/users', label: 'User Management', icon: Users },
            { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
            { to: '/admin/audit', label: 'Audit Log', icon: ScrollText },
            { to: '/admin/settings', label: 'Settings', icon: Settings },
          ],
        },
      ];
    case 'RECEIVER':
      return [
        {
          section: 'Overview',
          items: [{ to: '/req/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
        },
        {
          section: 'Requests',
          items: [
            { to: '/req/requests', label: 'My Requests', icon: ClipboardList },
            { to: '/req/new-request', label: 'New Request', icon: FileText },
          ],
        },
        {
          section: 'Activity',
          items: [
            { to: '/req/tasks', label: 'Tasks', icon: ListTodo },
            { to: '/req/notifications', label: 'Notifications', icon: Bell },
          ],
        },
      ];
    case 'PROCUREMENT':
      return [
        {
          section: 'Overview',
          items: [{ to: '/officer/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
        },
        {
          section: 'Procurement',
          items: [
            { to: '/officer/approved', label: 'Approved Requests', icon: FileCheck },
            { to: '/officer/inventory', label: 'Inventory', icon: Boxes },
            { to: '/officer/purchase-requests', label: 'All Requests', icon: ClipboardList },
            { to: '/officer/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
          ],
        },
        {
          section: 'Operations',
          items: [
            { to: '/officer/suppliers', label: 'Vendors', icon: Building2 },
            { to: '/officer/dispatch', label: 'Dispatch', icon: Truck },
          ],
        },
      ];
  }
}

export function Sidebar() {
  const currentUser = useStore(s => s.currentUser);
  const collapsed = useStore(s => s.sidebarCollapsed);
  const toggle = useStore(s => s.toggleSidebar);
  const requests = useStore(s => s.requests);
  const notifications = useStore(s => s.notifications);

  if (!currentUser) return null;

  const sections = getNavItems(currentUser.role);

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  sections.forEach(section => {
    section.items.forEach(item => {
      if (item.label === 'Approvals') item.badge = pendingCount;
      if (item.label === 'Approved Requests') item.badge = approvedCount;
      if (item.label === 'Notifications') item.badge = unreadNotifs;
    });
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen glass border-r border-slate-800/60 flex flex-col transition-all duration-300 z-40',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/40">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center shrink-0 glow-sky">
          <PackageCheck size={22} className="text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold text-white tracking-tight">ProcureX</h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Procurement OS</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-6">
        {sections.map(section => (
          <div key={section.section}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2">
                {section.section}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                      isActive
                        ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent',
                      collapsed && 'justify-center'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={18} className="shrink-0" />
                      {!collapsed && <span className="flex-1">{item.label}</span>}
                      {!collapsed && item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          {item.badge}
                        </span>
                      )}
                      {collapsed && item.badge !== undefined && item.badge > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-400" />
                      )}
                      {isActive && !collapsed && (
                        <span className="w-1 h-5 rounded-full bg-sky-400 absolute -left-3" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <button
        onClick={toggle}
        className="flex items-center justify-center p-3 border-t border-slate-800/40 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ChevronLeft size={18} className={cn('transition-transform duration-300', collapsed && 'rotate-180')} />
      </button>
    </aside>
  );
}
