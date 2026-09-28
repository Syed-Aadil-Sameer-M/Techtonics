import { useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RequestDetailDrawer } from '@/components/shared/PRDetailDrawer';
import { requestStatusConfig, formatDate } from '@/lib/status';
import { cn } from '@/lib/utils';
import type { RequestStatus } from '@/types';

export function OfficerPurchaseRequests() {
  const requests = useStore(s => s.requests);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const filters: { key: RequestStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const filtered = requests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search && !r.material.toLowerCase().includes(search.toLowerCase()) && !r.prNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Layout>
      <PageHeader title="All Requests" subtitle="View and manage all material requests" />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/40 transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-thin">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={cn('px-3.5 py-2 rounded-xl text-sm font-medium transition-all border',
              filter === f.key ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700')}>
            {f.label}
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
                <th className="text-right px-5 py-3.5 font-medium">Qty</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Requested By</th>
                <th className="text-left px-5 py-3.5 font-medium">Status</th>
                <th className="text-left px-5 py-3.5 font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500"><ClipboardList size={32} className="mx-auto mb-2 opacity-50" /><p>No requests found</p></td></tr>
              ) : (
                filtered.map(req => {
                  const status = requestStatusConfig[req.status];
                  return (
                    <tr key={req.id} onClick={() => setSelectedRequest(req.id)} className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/30 cursor-pointer transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-slate-200 font-medium">{req.material}</p>
                        <p className="text-xs text-slate-500 font-mono">{req.prNumber}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-slate-400">{req.location}</td>
                      <td className="px-5 py-3.5 text-right text-slate-200">{req.quantity}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-slate-400">{req.requesterName || '—'}</td>
                      <td className="px-5 py-3.5"><Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} /></td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-slate-400">{formatDate(req.createdAt)}</td>
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
      />
    </Layout>
  );
}
