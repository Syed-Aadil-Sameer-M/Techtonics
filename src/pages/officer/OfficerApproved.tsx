import { useState } from 'react';
import { FileCheck } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RequestDetailDrawer } from '@/components/shared/PRDetailDrawer';
import { requestStatusConfig, formatDate } from '@/lib/status';

export function OfficerApproved() {
  const requests = useStore(s => s.requests);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const approved = requests.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED');

  return (
    <Layout>
      <PageHeader title="Approved Requests" subtitle="Process approved requests — create POs and manage procurement" />

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
              {approved.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500"><FileCheck size={32} className="mx-auto mb-2 opacity-50" /><p>No approved requests</p></td></tr>
              ) : (
                approved.map(req => {
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
