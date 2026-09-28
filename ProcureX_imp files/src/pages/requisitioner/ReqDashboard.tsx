import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, Plus, ArrowRight, FileText } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { KpiCard } from '@/components/shared/KpiCard';
import { RequestDetailDrawer } from '@/components/shared/PRDetailDrawer';
import { requestStatusConfig, formatDate, timeAgo } from '@/lib/status';

export function ReqDashboard() {
  const navigate = useNavigate();
  const currentUser = useStore(s => s.currentUser)!;
  const requests = useStore(s => s.requests);
  const notifications = useStore(s => s.notifications);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const pending = requests.filter(r => r.status === 'PENDING').length;
  const approved = requests.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;
  const unreadNotifs = notifications.filter(n => !n.isRead);

  const recentRequests = [...requests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <Layout>
      <PageHeader
        title={`Welcome, ${currentUser.username}`}
        subtitle="Your procurement requests and activity overview"
        actions={<Button onClick={() => navigate('/req/new-request')}><Plus size={16} /> New Request</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Clock} label="Pending" value={pending} accent="amber" trend="Awaiting approval" />
        <KpiCard icon={CheckCircle2} label="Approved" value={approved} accent="emerald" trend="In progress" />
        <KpiCard icon={XCircle} label="Rejected" value={rejected} accent="rose" trend="Needs revision" />
        <KpiCard icon={FileText} label="Total Requests" value={requests.length} accent="sky" trend="All time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">My Recent Requests</h3>
            <button onClick={() => navigate('/req/requests')} className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No requests yet. Create your first one!</p>
            ) : (
              recentRequests.map(req => {
                const status = requestStatusConfig[req.status];
                return (
                  <button key={req.id} onClick={() => setSelectedRequest(req.id)} className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:border-sky-500/30 transition-all text-left">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{req.material}</p>
                      <p className="text-xs text-slate-500">#{req.id} · {req.location} · {timeAgo(req.date)}</p>
                    </div>
                    <Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} />
                  </button>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {unreadNotifs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">You're all caught up!</p>
            ) : (
              unreadNotifs.slice(0, 5).map(n => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40">
                  <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-200">{n.message}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{timeAgo(n.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <RequestDetailDrawer
        request={requests.find(r => r.id === selectedRequest) || null}
        onClose={() => setSelectedRequest(null)}
      />
    </Layout>
  );
}
