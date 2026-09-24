import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, Menu, ChevronDown } from 'lucide-react';
import { useStore } from '@/store';
import { Avatar } from '@/components/shared/Avatar';
import { roleConfig, timeAgo } from '@/lib/status';
import { cn } from '@/lib/utils';

export function Topbar() {
  const navigate = useNavigate();
  const currentUser = useStore(s => s.currentUser);
  const notifications = useStore(s => s.notifications);
  const markRead = useStore(s => s.markNotificationRead);
  const markAllRead = useStore(s => s.markAllNotificationsRead);
  const logout = useStore(s => s.logout);
  const toggleSidebar = useStore(s => s.toggleSidebar);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const userNotifs = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const unreadCount = userNotifs.filter(n => !n.isRead).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = currentUser.username;
  const roleLabel = roleConfig[currentUser.role]?.label || currentUser.role;

  return (
    <header className="sticky top-0 z-30 glass border-b border-slate-800/60 px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors lg:hidden">
          <Menu size={18} />
        </button>
        <div className="relative flex-1 hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search requests, orders, vendors..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/40 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl shadow-2xl border border-slate-800/60 animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
                <p className="text-sm font-semibold text-white">Notifications</p>
                {unreadCount > 0 && (
                  <button onClick={() => markAllRead()} className="text-xs text-sky-400 hover:text-sky-300">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-thin">
                {userNotifs.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-500">No notifications</p>
                ) : (
                  userNotifs.slice(0, 10).map(n => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        'w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-800/40 transition-colors text-left border-b border-slate-800/30',
                        !n.isRead && 'bg-sky-500/5'
                      )}
                    >
                      <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', n.isRead ? 'bg-slate-600' : 'bg-sky-400')} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{n.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{timeAgo(n.timestamp)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <Avatar name={displayName} color="sky" size="md" />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-200">{displayName}</p>
              <p className="text-[10px] text-slate-500">{roleLabel}</p>
            </div>
            <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 glass rounded-2xl shadow-2xl border border-slate-800/60 animate-scale-in overflow-hidden">
              <div className="p-4 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <Avatar name={displayName} color="sky" size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-white">{displayName}</p>
                    <p className="text-xs text-slate-400">User ID: {currentUser.userId}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', roleLabel !== currentUser.role && roleConfig[currentUser.role].color, roleLabel !== currentUser.role && roleConfig[currentUser.role].bg)}>
                    {roleLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
