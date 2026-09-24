import { useState } from 'react';
import { Package, XCircle } from 'lucide-react';
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
import { ExportButton } from '@/components/shared/ExportButton';
import { downloadCsv } from '@/lib/export';

export function AdminPurchaseOrders() {
  const pos = useStore(s => s.purchaseOrders);
  const updatePOStatus = useStore(s => s.updatePOStatus);
  const [filter, setFilter] = useState<PurchaseOrderStatus | 'all'>('all');
  const [cancelTarget, setCancelTarget] = useState<PurchaseOrder | null>(null);

  const filtered = filter === 'all' ? pos : pos.filter(p => p.status === filter);

  const exportOrders = () =>
    downloadCsv('procurex-purchase-orders.csv',
      ['PO ID', 'Material', 'Vendor', 'Quantity', 'Status', 'Date'],
      filtered.map(po => [po.id, po.material, po.vendor, po.quantity, po.status, formatDate(po.date)])
    );

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

  return (
    <Layout>
      <PageHeader
        title="Purchase Orders"
        subtitle="All purchase orders across the organization"
        actions={<ExportButton onCsv={exportOrders} />}
      />

      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-thin">
        {statusOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={cn(
              'px-3.5 py-2 rounded-xl text-sm font-medium transition-all border',
              filter === opt.key
                ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
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
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No purchase orders found</p>
                  </td>
                </tr>
              ) : (
                filtered.map(po => {
                  const status = poStatusConfig[po.status];
                  return (
                    <tr key={po.id} className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 text-slate-200 font-medium font-mono">#{po.id}</td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-slate-300">{po.material}</td>
                      <td className="px-5 py-3.5 text-slate-300">{po.vendor}</td>
                      <td className="px-5 py-3.5 text-right text-slate-200">{po.quantity}</td>
                      <td className="px-5 py-3.5">
                        <Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} />
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-slate-400">{formatDate(po.date)}</td>
                      <td className="px-5 py-3.5 text-right">
                        {po.status !== 'RECEIVED' && po.status !== 'COMPLETED' && po.status !== 'CANCELLED' ? (
                          <button onClick={() => setCancelTarget(po)} className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 px-2 py-1 ml-auto">
                            <XCircle size={14} /> Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Purchase Order" description={cancelTarget ? `PO #${cancelTarget.id}` : ''}>
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Cancelling this PO will notify the vendor. This action cannot be undone.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => setCancelTarget(null)} className="flex-1">Keep PO</Button>
            <Button variant="danger" onClick={handleConfirmCancel} className="flex-1">
              <XCircle size={16} /> Cancel PO
            </Button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
}
