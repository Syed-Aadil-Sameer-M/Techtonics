import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, Package, Users, AlertTriangle, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RequestDetailDrawer } from '@/components/shared/PRDetailDrawer';
import { requestStatusConfig, formatCurrency, formatDate, timeAgo } from '@/lib/status';
import { cn } from '@/lib/utils';

const monthlyData = [
  { month: 'Jan', spend: 420000, requests: 12 },
  { month: 'Feb', spend: 380000, requests: 15 },
  { month: 'Mar', spend: 510000, requests: 18 },
  { month: 'Apr', spend: 470000, requests: 14 },
  { month: 'May', spend: 590000, requests: 22 },
  { month: 'Jun', spend: 620000, requests: 19 },
  { month: 'Jul', spend: 540000, requests: 16 },
  { month: 'Aug', spend: 680000, requests: 24 },
];

const departmentData = [
  { name: 'Engineering', value: 35, color: '#0ea5e9' },
  { name: 'Operations', value: 25, color: '#10b981' },
  { name: 'Facilities', value: 20, color: '#f59e0b' },
  { name: 'IT', value: 12, color: '#8b5cf6' },
  { name: 'Other', value: 8, color: '#64748b' },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const requests = useStore(s => s.requests);
  const purchaseOrders = useStore(s => s.purchaseOrders);
  const users = useStore(s => s.users);
  const inventory = useStore(s => s.inventory);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const pendingApprovals = requests.filter(r => r.status === 'PENDING');
  const activePOs = purchaseOrders.filter(po => po.status === 'SENT' || po.status === 'CREATED');
  const lowStockItems = inventory.filter(i => i.stockLevel === 'LOW' || i.stockLevel === 'CRITICAL');
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + (po.quantity || 0), 0);

  const recentActivity = [...requests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <Layout>
      <PageHeader title="Dashboard" subtitle="Organization-wide procurement overview" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={FileCheck} label="Pending Approvals" value={pendingApprovals.length} accent="amber" trend={pendingApprovals.length > 0 ? `${pendingApprovals.length} awaiting review` : 'All clear'} />
        <KpiCard icon={TrendingUp} label="Total Orders" value={purchaseOrders.length} accent="sky" trend={`${activePOs.length} active`} />
        <KpiCard icon={Package} label="Inventory Items" value={inventory.length} accent="emerald" trend={`${lowStockItems.length} low stock`} />
        <KpiCard icon={Users} label="Total Users" value={users.length} accent="violet" trend="Across all roles" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <p className="text-sm font-semibold text-slate-300 mb-4">Procurement Activity</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="spend" stroke="#0ea5e9" strokeWidth={2} fill="url(#spendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-slate-300 mb-4">Requests by Department</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {departmentData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {departmentData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="text-slate-300 font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-300">Pending Approvals</p>
            <button onClick={() => navigate('/admin/approvals')} className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {pendingApprovals.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-6">No pending approvals</p>
            ) : (
              pendingApprovals.slice(0, 5).map(req => {
                const status = requestStatusConfig[req.status];
                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequest(req.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:border-sky-500/40 transition-all text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{req.material}</p>
                      <p className="text-xs text-slate-500 mt-0.5">#{req.id} · {req.location} · {formatDate(req.date)}</p>
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
            <p className="text-sm font-semibold text-slate-300">Recent Activity</p>
            <Activity size={14} className="text-slate-500" />
          </div>
          <div className="space-y-2">
            {recentActivity.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-6">No recent activity</p>
            ) : (
              recentActivity.map(req => {
                const status = requestStatusConfig[req.status];
                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequest(req.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:border-sky-500/40 transition-all text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{req.material}</p>
                      <p className="text-xs text-slate-500 mt-0.5">#{req.id} · {timeAgo(req.date)}</p>
                    </div>
                    <Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} />
                  </button>
                );
              })
            )}
          </div>
        </Card>
      </div>

      <RequestDetailDrawer
        request={requests.find(r => r.id === selectedRequest) || null}
        onClose={() => setSelectedRequest(null)}
        showActions
      />
    </Layout>
  );
}
