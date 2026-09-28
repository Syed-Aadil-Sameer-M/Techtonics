import { Bell, CheckCheck } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { timeAgo } from '@/lib/status';
import { cn } from '@/lib/utils';

export function ReqNotifications() {
  const notifications = useStore(s => s.notifications);
  const markRead = useStore(s => s.markNotificationRead);
  const markAllRead = useStore(s => s.markAllNotificationsRead);

  const sorted = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const unreadCount = sorted.filter(n => !n.isRead).length;

  return (
    <Layout>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You are all caught up'}
        actions={unreadCount > 0 ? <Button variant="secondary" onClick={() => markAllRead()}><CheckCheck size={16} /> Mark all read</Button> : undefined}
      />

      <div className="space-y-2">
        {sorted.length === 0 ? (
          <Card><p className="text-center text-slate-500 py-12"><Bell size={32} className="mx-auto mb-2 opacity-50" />No notifications yet</p></Card>
        ) : (
          sorted.map(n => (
            <Card key={n.id} hover>
              <button onClick={() => markRead(n.id)} className="w-full flex items-start gap-4 text-left">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border',
                  n.isRead ? 'bg-slate-700/40 border-slate-600/40 text-slate-400' : 'bg-sky-500/10 border-sky-500/20 text-sky-300'
                )}>
                  <Bell size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-sm font-medium', n.isRead ? 'text-slate-400' : 'text-slate-200')}>{n.message}</p>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{timeAgo(n.timestamp)}</p>
                </div>
              </button>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
}
