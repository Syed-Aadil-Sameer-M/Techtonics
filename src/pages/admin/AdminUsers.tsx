import { useState } from 'react';
import { Users, Shield, Truck, UserPlus, Search } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/shared/Avatar';
import { roleConfig, formatDate } from '@/lib/status';
import { cn } from '@/lib/utils';
import type { BackendRole } from '@/types';

export function AdminUsers() {
  const users = useStore(s => s.users);
  const fetchUsers = useStore(s => s.fetchUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<BackendRole | 'all'>('all');

  const filtered = users.filter(u => {
    const matchesSearch = !search ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.fullName || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const receiverCount = users.filter(u => u.role === 'RECEIVER').length;
  const procurementCount = users.filter(u => u.role === 'PROCUREMENT').length;

  return (
    <Layout>
      <PageHeader title="User Management" subtitle="Manage workspace members and their roles" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Administrators', count: adminCount, icon: Shield, color: 'sky' },
          { label: 'Receivers', count: receiverCount, icon: Users, color: 'emerald' },
          { label: 'Procurement', count: procurementCount, icon: Truck, color: 'violet' },
          { label: 'Total Users', count: users.length, icon: UserPlus, color: 'slate' },
        ].map(s => (
          <Card key={s.label} hover>
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-xl border',
                s.color === 'sky' && 'bg-sky-500/10 border-sky-500/20 text-sky-300',
                s.color === 'emerald' && 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
                s.color === 'violet' && 'bg-violet-500/10 border-violet-500/20 text-violet-300',
                s.color === 'slate' && 'bg-slate-700/40 border-slate-600/40 text-slate-300'
              )}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{s.count}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/40"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as BackendRole | 'all')}
          className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40 text-sm text-slate-200 focus:outline-none focus:border-sky-500/40"
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Administrator</option>
          <option value="RECEIVER">Receiver</option>
          <option value="PROCUREMENT">Procurement Officer</option>
        </select>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-medium">User</th>
                <th className="text-left px-5 py-3.5 font-medium">Role</th>
                <th className="text-left px-5 py-3.5 font-medium hidden sm:table-cell">Department</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Phone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-slate-500"><Users size={32} className="mx-auto mb-2 opacity-50" /><p>No users found</p></td></tr>
              ) : (
                filtered.map(u => {
                  const role = roleConfig[u.role];
                  return (
                    <tr key={u.id} className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.fullName || u.username} color="sky" size="sm" />
                          <div>
                            <p className="text-slate-200 font-medium">{u.fullName || u.username}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', role.color, role.bg)}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-slate-400">{u.department || '—'}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-slate-400">{u.phoneNumber || '—'}</td>
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
