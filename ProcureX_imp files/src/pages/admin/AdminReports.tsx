import { TrendingUp, Package, FileText, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, RadialBarChart, RadialBar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/status';
import { ExportButton } from '@/components/shared/ExportButton';
import { downloadCsv } from '@/lib/export';

const monthlySpend = [
  { month: 'Jan', spend: 420000, orders: 8 },
  { month: 'Feb', spend: 380000, orders: 6 },
  { month: 'Mar', spend: 510000, orders: 10 },
  { month: 'Apr', spend: 470000, orders: 7 },
  { month: 'May', spend: 590000, orders: 12 },
  { month: 'Jun', spend: 620000, orders: 11 },
  { month: 'Jul', spend: 540000, orders: 9 },
  { month: 'Aug', spend: 680000, orders: 14 },
];

const supplierPerf = [
  { name: 'TechCorp', value: 95, fill: '#10b981' },
  { name: 'SteelCo', value: 88, fill: '#0ea5e9' },
  { name: 'LogiTrans', value: 78, fill: '#f59e0b' },
  { name: 'OfficePro', value: 92, fill: '#8b5cf6' },
];

const categorySpend = [
  { name: 'Electronics', value: 420000, color: '#0ea5e9' },
  { name: 'Raw Materials', value: 310000, color: '#10b981' },
  { name: 'Office Supplies', value: 180000, color: '#f59e0b' },
  { name: 'Logistics', value: 150000, color: '#8b5cf6' },
  { name: 'Other', value: 52000, color: '#64748b' },
];

export function AdminReports() {
  const requests = useStore(s => s.requests);
  const purchaseOrders = useStore(s => s.purchaseOrders);

  const totalOrders = purchaseOrders.length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
  const completedRequests = requests.filter(r => r.status === 'COMPLETED').length;
  const approvalRate = requests.length > 0 ? Math.round((completedRequests / requests.length) * 100) : 0;

  const exportReport = () => {
    downloadCsv('procurex-report.csv',
      ['Metric', 'Value'],
      [
        ['Total Orders', totalOrders],
        ['Pending Requests', pendingRequests],
        ['Completed Requests', completedRequests],
        ['Approval Rate (%)', approvalRate],
      ]
    );
  };

  return (
    <Layout>
      <PageHeader title="Reports" subtitle="Procurement analytics and insights" actions={<ExportButton onCsv={exportReport} />} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={TrendingUp} label="Total Orders" value={totalOrders} accent="sky" />
        <KpiCard icon={FileText} label="Total Requests" value={requests.length} accent="emerald" />
        <KpiCard icon={Clock} label="Pending" value={pendingRequests} accent="amber" />
        <KpiCard icon={Package} label="Approval Rate" value={approvalRate} suffix="%" accent="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <p className="text-sm font-semibold text-slate-300 mb-4">Monthly Spend & Order Volume</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlySpend}>
              <defs>
                <linearGradient id="reportSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="spend" stroke="#0ea5e9" strokeWidth={2} fill="url(#reportSpend)" />
              <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-slate-300 mb-4">Vendor Performance</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart data={supplierPerf} innerRadius="20%" outerRadius="90%" startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={6} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, fontSize: 12 }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {supplierPerf.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.fill }} />
                  {s.name}
                </span>
                <span className="text-slate-300 font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm font-semibold text-slate-300 mb-4">Spend by Category</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categorySpend} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                {categorySpend.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, fontSize: 12 }} formatter={(v) => formatCurrency(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categorySpend.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="text-slate-300 font-medium">{formatCurrency(c.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-slate-300 mb-4">Order Volume by Month</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="orders" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Layout>
  );
}
