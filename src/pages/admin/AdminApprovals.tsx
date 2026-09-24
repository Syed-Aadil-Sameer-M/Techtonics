import { useState } from 'react';
import { FileCheck, Filter } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RequestDetailDrawer } from '@/components/shared/PRDetailDrawer';
import { requestStatusConfig, formatDate } from '@/lib/status';
import { cn } from '@/lib/utils';
import type { RequestStatus } from '@/types';

export function AdminApprovals() {
  const requests = useStore(s => s.requests);
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const tabs: { key: RequestStatus | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: requests.length },
    { key: 'PENDING', label: 'Pending', count: requests.filter(r => r.status === 'PENDING').length },
    { key: 'APPROVED', label: 'Approved', count: requests.filter(r => r.status === 'APPROVED').length },
    { key: 'REJECTED', label: 'Rejected', count: requests.filter(r => r.status === 'REJECTED').length },
    { key: 'COMPLETED', label: 'Completed', count: requests.filter(r => r.status === 'COMPLETED').length },
  ];

  return (
    <Layout>
      <PageHeader title="Approvals" subtitle="Review and act on material requests" />

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
            <span className="ml-2 text-xs text-slate-500">{tab.count}</span>
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-medium">Request</th>
                <th className="text-left px-5 py-3.5 font-medium hidden sm:table-cell">Location</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Requested By</th>
                <th className="text-left px-5 py-3.5 font-medium">Status</th>
                <th className="text-left px-5 py-3.5 font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    <FileCheck size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No requests found</p>
                  </td>
                </tr>
              ) : (
                filtered.map(req => {
                  const status = requestStatusConfig[req.status];
                  return (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedRequest(req.id)}
                      className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/30 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-slate-200 font-medium">{req.material}</p>
                        <p className="text-xs text-slate-500 mt-0.5">#{req.id} · Qty: {req.quantity}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-slate-400">{req.location}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-slate-400">{req.requestedBy || '—'}</td>
                      <td className="px-5 py-3.5"><Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} /></td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-slate-400">{formatDate(req.date)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <RequestDetailDrawer
        request={requests.find(r => r.id === selectedRequest) || null}
        onClose={() => setSelectedRequest(null)}
        showActions
      />
    </Layout>
  );
}
