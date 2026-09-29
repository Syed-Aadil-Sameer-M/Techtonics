import { useState } from 'react';
import { ShoppingCart, XCircle } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { poStatusConfig, formatDate } from '@/lib/status';
import { cn } from '@/lib/utils';
import type { PurchaseOrderStatus, PurchaseOrder } from '@/types';
import { ExportButton, type DateRange } from '@/components/shared/ExportButton';
import { downloadCsv, downloadExcel, downloadPdf, filterByDateRange } from '@/lib/export';

export function OfficerPurchaseOrders() {
  const pos = useStore(s => s.purchaseOrders);
  const updatePOStatus = useStore(s => s.updatePOStatus);
  const [filter, setFilter] = useState<PurchaseOrderStatus | 'all'>('all');
  const [cancelTarget, setCancelTarget] = useState<PurchaseOrder | null>(null);

  const filtered = filter === 'all' ? pos : pos.filter(p => p.status === filter);



  const statusOptions: { key: PurchaseOrderStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'CREATED', label: 'Created' },
    { key: 'SENT', label: 'Sent' },
    { key: 'RECEIVED', label: 'Received' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      updatePOStatus(cancelTarget.id, 'CANCELLED');
      setCancelTarget(null);
    }
  };

  const HEADERS = ['PO Number', 'Material', 'Vendor', 'Qty', 'Status', 'Date'];
  const toRows = (items: typeof pos) => items.map(item => [item.poNumber || item.id, item.material, item.vendor, item.quantity, item.status, item.date]);
  const getFiltered = (r: DateRange) => filterByDateRange(pos, item => item.date, r.from, r.to);
  const label = (r: DateRange) => r.from || r.to ? `${r.from || 'start'}_to_${r.to || 'today'}` : 'all';
  return (
    <Layout>
      <PageHeader title="Purchase Orders" subtitle="Manage POs — track deliveries and update status" actions={<ExportButton
        onCsv={r => downloadCsv(`procurex-pos-${label(r)}.csv`, HEADERS, toRows(getFiltered(r)))}
        onExcel={r => downloadExcel(`procurex-pos-${label(r)}`, 'Purchase Orders', HEADERS, toRows(getFiltered(r)))}
        onPdf={r => downloadPdf(`procurex-pos-${label(r)}`, 'Purchase Orders', 'Officer purchase orders', HEADERS, toRows(getFiltered(r)), r)}
      />} />

      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-thin">
        {statusOptions.map(opt => (
          <button key={opt.key} onClick={() => setFilter(opt.key)}
            className={cn('px-3.5 py-2 rounded-xl text-sm font-medium transition-all border',
              filter === opt.key ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700')}>
            {opt.label}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-medium">PO ID</th>
                <th className="text-left px-5 py-3.5 font-medium hidden sm:table-cell">Material</th>
                <th className="text-left px-5 py-3.5 font-medium">Vendor</th>
                <th className="text-right px-5 py-3.5 font-medium">Qty</th>
                <th className="text-left px-5 py-3.5 font-medium">Status</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Date</th>
                <th className="text-right px-5 py-3.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500"><ShoppingCart size={32} className="mx-auto mb-2 opacity-50" /><p>No purchase orders</p></td></tr>
              ) : (
                filtered.map(po => {
                  const status = poStatusConfig[po.status];
                  return (
                    <tr key={po.id} className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 text-slate-200 font-medium font-mono">{po.poNumber}</td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-slate-300">{po.material}</td>
                      <td className="px-5 py-3.5 text-slate-300">{po.supplier}</td>
                      <td className="px-5 py-3.5 text-right text-slate-200">{po.quantity}</td>
                      <td className="px-5 py-3.5"><Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} /></td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-slate-400">{formatDate(po.createdAt)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {po.status === 'CREATED' && (
                            <Button size="sm" variant="ghost" onClick={() => updatePOStatus(po.id, 'SENT')}>Mark Sent</Button>
                          )}
                          {po.status === 'SENT' && (
                            <Button size="sm" variant="ghost" onClick={() => updatePOStatus(po.id, 'RECEIVED')}>Mark Received</Button>
                          )}
                          {po.status === 'RECEIVED' && (
                            <Button size="sm" variant="ghost" onClick={() => updatePOStatus(po.id, 'COMPLETED')}>Complete</Button>
                          )}
                          {po.status !== 'RECEIVED' && po.status !== 'COMPLETED' && po.status !== 'CANCELLED' && (
                            <button onClick={() => setCancelTarget(po)} className="text-xs text-slate-500 hover:text-rose-400 px-2 py-1"><XCircle size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Purchase Order" description={cancelTarget ? cancelTarget.poNumber : ''}>
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Cancelling this PO will notify the vendor. This action cannot be undone.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => setCancelTarget(null)} className="flex-1">Keep PO</Button>
            <Button variant="danger" onClick={handleConfirmCancel} className="flex-1"><XCircle size={16} /> Cancel PO</Button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
}
