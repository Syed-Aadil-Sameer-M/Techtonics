import { useState } from 'react';
import { ScrollText, Search } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/status';
import { cn } from '@/lib/utils';
import { ExportButton } from '@/components/shared/ExportButton';
import { downloadCsv } from '@/lib/export';

const actionColors: Record<string, { color: string; bg: string }> = {
  APPROVE: { color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  REJECT: { color: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30' },
  CREATE: { color: 'text-sky-300', bg: 'bg-sky-500/10 border-sky-500/30' },
  LOGIN: { color: 'text-violet-300', bg: 'bg-violet-500/10 border-violet-500/30' },
  UPDATE: { color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/30' },
  DELETE: { color: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30' },
};

export function AdminAudit() {
  const auditLogs = useStore(s => s.auditLogs);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const uniqueActions = Array.from(new Set(auditLogs.map(l => l.action)));
  const filtered = auditLogs.filter(l => {
    const matchesSearch = !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.user || '').toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const exportAudit = () => {
    downloadCsv('procurex-audit.csv', ['Action', 'Module', 'Description', 'User', 'Timestamp'],
      filtered.map(l => [l.action, l.module, l.description || '', l.user || '', formatDateTime(l.timestamp)])
    );
  };

  return (
    <Layout>
      <PageHeader title="Audit Log" subtitle="System activity and change history" actions={<ExportButton onCsv={exportAudit} />} />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/40"
          />
        </div>
        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40 text-sm text-slate-200 focus:outline-none focus:border-sky-500/40"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-medium">User</th>
                <th className="text-left px-5 py-3.5 font-medium">Action</th>
                <th className="text-left px-5 py-3.5 font-medium hidden sm:table-cell">Module</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Description</th>
                <th className="text-left px-5 py-3.5 font-medium hidden lg:table-cell">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-500"><ScrollText size={32} className="mx-auto mb-2 opacity-50" /><p>No audit logs found</p></td></tr>
              ) : (
                filtered.map(log => {
                  const colorConfig = actionColors[log.action] || { color: 'text-slate-300', bg: 'bg-slate-700/40 border-slate-600/40' };
                  return (
                    <tr key={log.id} className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 text-slate-300">{log.user || 'System'}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', colorConfig.color, colorConfig.bg)}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-slate-400">{log.module}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-slate-400 max-w-xs truncate">{log.description || '—'}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-slate-400">{formatDateTime(log.timestamp)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}
