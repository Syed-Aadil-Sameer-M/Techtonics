import { useState } from 'react';
import { Package, Boxes, ArrowRight, Clock, ClipboardList } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/shared/KpiCard';
import { RequestDetailDrawer } from '@/components/shared/PRDetailDrawer';
import { requestStatusConfig, stockLevelConfig, formatDate, timeAgo } from '@/lib/status';
import { useNavigate } from 'react-router-dom';

export function OfficerDashboard() {
  const navigate = useNavigate();
  const currentUser = useStore(s => s.currentUser)!;
  const requests = useStore(s => s.requests);
  const purchaseOrders = useStore(s => s.purchaseOrders);
  const inventory = useStore(s => s.inventory);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const approvedRequests = requests.filter(r => r.status === 'APPROVED');
  const activePOs = purchaseOrders.filter(po => po.status === 'SENT' || po.status === 'CREATED');
  const lowStock = inventory.filter(i => i.stockLevel === 'LOW' || i.stockLevel === 'CRITICAL');
  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <Layout>
      <PageHeader title={`Welcome, ${currentUser.name}`} subtitle="Procurement operations dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={ClipboardList} label="Approved Requests" value={approvedRequests.length} accent="sky" trend="Awaiting PO creation" />
        <KpiCard icon={Package} label="Active POs" value={activePOs.length} accent="violet" trend="In progress" />
        <KpiCard icon={Boxes} label="Low Stock Items" value={lowStock.length} accent="rose" trend="Needs reorder" />
        <KpiCard icon={Clock} label="Pending Requests" value={pendingRequests.length} accent="amber" trend="Awaiting approval" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Approved Requests</h3>
            <button onClick={() => navigate('/officer/approved')} className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {approvedRequests.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No approved requests</p>
            ) : (
              approvedRequests.map(req => {
                const status = requestStatusConfig[req.status];
                return (
                  <button key={req.id} onClick={() => setSelectedRequest(req.id)} className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:border-sky-500/30 transition-all text-left">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{req.material}</p>
                      <p className="text-xs text-slate-500">#{req.id} · {req.location} · Qty: {req.quantity}</p>
                    </div>
                    <Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} />
                  </button>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Low Stock Alerts</h3>
            <button onClick={() => navigate('/officer/inventory')} className="text-xs text-sky-400 hover:text-sky-300">View all</button>
          </div>
          <div className="space-y-2">
            {lowStock.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">All stock levels are healthy</p>
            ) : (
              lowStock.map(item => {
                const lvl = stockLevelConfig[item.stockLevel];
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">Min: {item.reorderLevel} {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-rose-300">{item.quantity}</p>
                      <Badge label={lvl.label} color={lvl.color} bg={lvl.bg} dot={lvl.dot} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Recent Purchase Orders</h3>
          <button onClick={() => navigate('/officer/purchase-orders')} className="text-xs text-sky-400 hover:text-sky-300">View all</button>
        </div>
        <div className="space-y-2">
          {purchaseOrders.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No purchase orders</p>
          ) : (
            purchaseOrders.slice(0, 5).map(po => (
              <div key={po.id} className="flex items-center gap-3 p-3 rounded-xl glass-card">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{po.poNumber} · {po.material}</p>
                  <p className="text-xs text-slate-500">{po.supplier} · Qty: {po.quantity} · {formatDate(po.createdAt)}</p>
                </div>
                <span className="text-xs text-slate-500">{timeAgo(po.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      <RequestDetailDrawer
        request={requests.find(r => r.id === selectedRequest) || null}
        onClose={() => setSelectedRequest(null)}
      />
    </Layout>
  );
}
