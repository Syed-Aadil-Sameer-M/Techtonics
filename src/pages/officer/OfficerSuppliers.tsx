import { useState } from 'react';
import { Building2, Search, Plus, Edit3 } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { ExportButton } from '@/components/shared/ExportButton';
import { downloadCsv } from '@/lib/export';
import type { Vendor } from '@/types';

export function OfficerSuppliers() {
  const vendors = useStore(s => s.vendors);
  const addVendor = useStore(s => s.addVendor);
  const updateVendor = useStore(s => s.updateVendor);
  const [search, setSearch] = useState('');
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', contactName: '', email: '', phone: '' });

  const filtered = vendors.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) || (v.contactName || '').toLowerCase().includes(search.toLowerCase())
  );

  const exportVendors = () =>
    downloadCsv('procurex-vendors.csv',
      ['ID', 'Name', 'Contact', 'Email', 'Phone'],
      filtered.map(v => [v.id, v.name, v.contactName || '', v.email || '', v.phone || ''])
    );

  const handleEdit = (v: Vendor) => {
    setEditVendor(v);
    setForm({ name: v.name, contactName: v.contactName || '', email: v.email || '', phone: v.phone || '' });
  };

  const handleSaveEdit = () => {
    if (editVendor) {
      updateVendor(editVendor.id, form);
      setEditVendor(null);
    }
  };

  const handleAdd = () => {
    if (form.name.trim()) {
      addVendor(form);
      setForm({ name: '', contactName: '', email: '', phone: '' });
      setShowAdd(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Vendors"
        subtitle="Manage vendor relationships"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Vendor</Button>
            <ExportButton onCsv={exportVendors} />
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/40 transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <Card className="col-span-full"><p className="text-center text-slate-500 py-8"><Building2 size={32} className="mx-auto mb-2 opacity-50" />No vendors found</p></Card>
        ) : (
          filtered.map(vendor => (
            <Card key={vendor.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/40 flex items-center justify-center">
                    <Building2 size={18} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{vendor.name}</p>
                    <p className="text-xs text-slate-500">#{vendor.id}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleEdit(vendor)}><Edit3 size={14} /></Button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contact</span>
                  <span className="text-slate-300">{vendor.contactName || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="text-slate-300 truncate ml-2">{vendor.email || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="text-slate-300">{vendor.phone || '—'}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editVendor} onClose={() => setEditVendor(null)} title="Edit Vendor" description={editVendor?.name}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <Input label="Contact Person" value={form.contactName} onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => setEditVendor(null)} className="flex-1">Cancel</Button>
            <Button onClick={handleSaveEdit} className="flex-1">Save</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={showAdd} onClose={() => setShowAdd(false)} title="Add Vendor">
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Vendor name" />
          <Input label="Contact Person" value={form.contactName} onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAdd} className="flex-1">Add Vendor</Button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
}
