import { useState } from 'react';
import { Truck, Send, CheckCircle2, MapPin } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { requestStatusConfig, formatDate, formatDateTime } from '@/lib/status';
import type { MaterialRequest } from '@/types';
import { ExportButton, type DateRange } from '@/components/shared/ExportButton';
import { downloadCsv, downloadExcel, downloadPdf, filterByDateRange } from '@/lib/export';

export function OfficerDispatch() {
  const requests = useStore(s => s.requests);
  const purchaseOrders = useStore(s => s.purchaseOrders);
  const updateRequestStatus = useStore(s => s.updateRequestStatus);
  const [dispatchReq, setDispatchReq] = useState<MaterialRequest | null>(null);
  const [notes, setNotes] = useState('');

  const readyForDispatch = requests.filter(r => r.status === 'APPROVED');
  const dispatched = requests.filter(r => r.status === 'COMPLETED');



  const handleConfirmDispatch = () => {
    if (dispatchReq) {
      updateRequestStatus(dispatchReq.id, 'COMPLETED');
      setDispatchReq(null);
      setNotes('');
    }
  };

  const HEADERS = ['PO Number', 'Material', 'Vendor', 'Qty', 'Status', 'Date'];
  const toRows = (items: typeof purchaseOrders) => items.map(item => [item.poNumber || item.id, item.material, item.vendor, item.quantity, item.status, item.date]);
  const getFiltered = (r: DateRange) => filterByDateRange(purchaseOrders, item => item.date, r.from, r.to);
  const label = (r: DateRange) => r.from || r.to ? `${r.from || 'start'}_to_${r.to || 'today'}` : 'all';
  return (
    <Layout>
      <PageHeader title="Dispatch" subtitle="Dispatch approved materials to requesters" actions={<ExportButton
        onCsv={r => downloadCsv(`procurex-dispatch-${label(r)}.csv`, HEADERS, toRows(getFiltered(r)))}
        onExcel={r => downloadExcel(`procurex-dispatch-${label(r)}`, 'Dispatch', HEADERS, toRows(getFiltered(r)))}
        onPdf={r => downloadPdf(`procurex-dispatch-${label(r)}`, 'Dispatch', 'Dispatch records', HEADERS, toRows(getFiltered(r)), r)}
      />} />

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3">Ready for Dispatch</h3>
        <div className="space-y-2">
          {readyForDispatch.length === 0 ? (
            <Card><p className="text-center text-slate-500 py-8"><Truck size={32} className="mx-auto mb-2 opacity-50" />No items ready for dispatch</p></Card>
          ) : (
            readyForDispatch.map(req => (
              <Card key={req.id} hover>
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{req.material}</p>
                    <p className="text-xs text-slate-500">#{req.id} · {req.location} · Qty: {req.quantity} · {req.requestedBy || '—'}</p>
                  </div>
                  <Button size="sm" onClick={() => setDispatchReq(req)}><Send size={14} /> Dispatch</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-3">Dispatch History</h3>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-medium">Request #</th>
                <th className="text-left px-5 py-3.5 font-medium hidden sm:table-cell">Material</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Location</th>
                <th className="text-right px-5 py-3.5 font-medium">Qty</th>
                <th className="text-left px-5 py-3.5 font-medium">Status</th>
                <th className="text-left px-5 py-3.5 font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {dispatched.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500"><Truck size={32} className="mx-auto mb-2 opacity-50" /><p>No dispatches yet</p></td></tr>
              ) : (
                dispatched.map(req => {
                  const status = requestStatusConfig[req.status];
                  return (
                    <tr key={req.id} className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 text-slate-200 font-medium font-mono">#{req.id}</td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-slate-300">{req.material}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-slate-400">{req.location}</td>
                      <td className="px-5 py-3.5 text-right text-slate-200">{req.quantity}</td>
                      <td className="px-5 py-3.5"><Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} /></td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-slate-400">{formatDateTime(req.date)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!dispatchReq} onClose={() => setDispatchReq(null)} title="Dispatch Items" description={dispatchReq ? `Request #${dispatchReq.id}` : ''}>
        {dispatchReq && (
          <div className="space-y-4">
            <div className="glass-card p-4 space-y-3">
              <p className="text-sm text-slate-300">Dispatching: <span className="font-medium text-white">{dispatchReq.material}</span></p>
              <p className="text-xs text-slate-500">To: {dispatchReq.location} · Qty: {dispatchReq.quantity}</p>
              <p className="text-xs text-slate-500">Requested by: {dispatchReq.requestedBy || '—'}</p>
            </div>
            <Input label="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Dispatch notes..." />
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => setDispatchReq(null)} className="flex-1">Cancel</Button>
              <Button variant="success" onClick={handleConfirmDispatch} className="flex-1"><CheckCircle2 size={16} /> Confirm Dispatch</Button>
            </div>
          </div>
        )}
      </Dialog>
    </Layout>
  );
}
