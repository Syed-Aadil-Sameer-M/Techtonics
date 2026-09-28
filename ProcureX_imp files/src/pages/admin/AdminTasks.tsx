import { useState } from 'react';
import { ListTodo, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { requestStatusConfig, formatDate, timeAgo } from '@/lib/status';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import type { RequestStatus } from '@/types';

export function AdminTasks() {
  const navigate = useNavigate();
  const requests = useStore(s => s.requests);
  const updateRequestStatus = useStore(s => s.updateRequestStatus);
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');

  const pending = requests.filter(r => r.status === 'PENDING');
  const approved = requests.filter(r => r.status === 'APPROVED');
  const completed = requests.filter(r => r.status === 'COMPLETED');

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const tabs: { key: RequestStatus | 'all'; label: string; count: number; icon: typeof Clock }[] = [
    { key: 'all', label: 'All', count: requests.length, icon: ListTodo },
    { key: 'PENDING', label: 'Pending', count: pending.length, icon: Clock },
    { key: 'APPROVED', label: 'Approved', count: approved.length, icon: AlertCircle },
    { key: 'COMPLETED', label: 'Completed', count: completed.length, icon: CheckCircle2 },
  ];

  return (
    <Layout>
      <PageHeader title="Tasks" subtitle="Requests requiring action across the workflow" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {tabs.map(tab => (
          <Card key={tab.key} hover>
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-xl border',
                tab.key === 'PENDING' && 'bg-amber-500/10 border-amber-500/20 text-amber-300',
                tab.key === 'APPROVED' && 'bg-sky-500/10 border-sky-500/20 text-sky-300',
                tab.key === 'COMPLETED' && 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
                tab.key === 'all' && 'bg-slate-700/40 border-slate-600/40 text-slate-300'
              )}>
                <tab.icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{tab.count}</p>
                <p className="text-xs text-slate-400">{tab.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-thin">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              'px-3.5 py-2 rounded-xl text-sm font-medium transition-all border',
              filter === tab.key
                ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card>
            <p className="text-center text-slate-500 py-8">No tasks found</p>
          </Card>
        ) : (
          filtered.map(req => {
            const status = requestStatusConfig[req.status];
            return (
              <Card key={req.id} hover>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-1 h-12 rounded-full',
                    req.status === 'PENDING' && 'bg-amber-500',
                    req.status === 'APPROVED' && 'bg-sky-500',
                    req.status === 'COMPLETED' && 'bg-emerald-500',
                    req.status === 'REJECTED' && 'bg-rose-500',
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{req.material}</p>
                    <p className="text-xs text-slate-500 mt-0.5">#{req.id} · {req.location} · Qty: {req.quantity}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-500">By {req.requestedBy || '—'}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{formatDate(req.date)}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{timeAgo(req.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} />
                    {req.status === 'PENDING' && (
                      <>
                        <button onClick={() => navigate('/admin/approvals')} className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 px-2 py-1">
                          Go to <ArrowRight size={12} />
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'APPROVED')}
                          className="text-emerald-400 hover:text-emerald-300 p-1"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </Layout>
  );
}
