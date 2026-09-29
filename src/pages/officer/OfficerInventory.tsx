import { useState } from 'react';
import { Boxes, Search, Edit3, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { stockLevelConfig, formatCurrency } from '@/lib/status';
import type { InventoryItem } from '@/types';
import { ExportButton, type DateRange } from '@/components/shared/ExportButton';
import { downloadCsv, downloadExcel, downloadPdf, filterByDateRange } from '@/lib/export';

export function OfficerInventory() {
  const inventory = useStore(s => s.inventory);
  const updateItem = useStore(s => s.updateInventoryItem);
  const addItem = useStore(s => s.addInventoryItem);
  const deleteItem = useStore(s => s.deleteInventoryItem);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState(0);
  const [reorderLevel, setReorderLevel] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [unit, setUnit] = useState('pcs');

  const [newItem, setNewItem] = useState({ name: '', quantity: 0, unitPrice: 0, unit: 'pcs', reorderLevel: 0 });

  const filtered = inventory.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase())
  );



  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setName(item.name);
    setQty(item.quantity);
    setReorderLevel(item.reorderLevel);
    setUnitPrice(item.unitPrice);
    setUnit(item.unit);
  };

  const handleSave = () => {
    if (editItem) {
      updateItem(editItem.id, { name, quantity: qty, reorderLevel, unitPrice });
      setEditItem(null);
    }
  };

  const handleAdd = () => {
    if (newItem.name.trim()) {
      addItem(newItem);
      setNewItem({ name: '', quantity: 0, unitPrice: 0, unit: 'pcs', reorderLevel: 0 });
      setShowAdd(false);
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteItem(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const HEADERS = ['SKU', 'Name', 'Category', 'Qty', 'Unit', 'Reorder Level', 'Unit Price', 'Stock Level'];
  const toRows = (items: typeof inventory) =>
    items.map(i => [i.sku, i.name, i.category, i.quantity, i.unit, i.reorderLevel, i.unitPrice, i.stockLevel]);
  // Inventory has no date field - export all (date filter shows no effect but UI stays consistent)
  const getFiltered = (_r: DateRange) => inventory.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));
  const label = (r: DateRange) => r.from || r.to ? `${r.from || 'start'}_to_${r.to || 'today'}` : 'all';
  return (
    <Layout>
      <PageHeader
        title="Inventory"
        subtitle="Manage stock levels, prices, and warehouse inventory"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Item</Button>
            <ExportButton
              onCsv={r => downloadCsv(`procurex-inventory-${label(r)}.csv`, HEADERS, toRows(getFiltered(r)))}
              onExcel={r => downloadExcel(`procurex-inventory-${label(r)}`, 'Inventory', HEADERS, toRows(getFiltered(r)))}
              onPdf={r => downloadPdf(`procurex-inventory-${label(r)}`, 'Inventory', 'Current inventory status', HEADERS, toRows(getFiltered(r)), r)}
            />
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/40 transition-colors" />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-medium">SKU</th>
                <th className="text-left px-5 py-3.5 font-medium">Name</th>
                <th className="text-right px-5 py-3.5 font-medium">Stock</th>
                <th className="text-right px-5 py-3.5 font-medium hidden md:table-cell">Reorder Level</th>
                <th className="text-right px-5 py-3.5 font-medium hidden sm:table-cell">Price / Unit</th>
                <th className="text-left px-5 py-3.5 font-medium">Status</th>
                <th className="text-right px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500"><Boxes size={32} className="mx-auto mb-2 opacity-50" /><p>No inventory items found</p></td></tr>
              ) : (
                filtered.map(item => {
                  const lvl = stockLevelConfig[item.stockLevel];
                  return (
                    <tr key={item.id} className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{item.sku}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-slate-200 font-medium">{item.name}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(item.unitPrice)} / {item.unit}</p>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="font-bold text-slate-200">{item.quantity}</span>
                        <span className="text-xs text-slate-500 ml-1">{item.unit}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden md:table-cell text-slate-400">{item.reorderLevel}</td>
                      <td className="px-5 py-3.5 text-right hidden sm:table-cell text-slate-400">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-5 py-3.5"><Badge label={lvl.label} color={lvl.color} bg={lvl.bg} dot={lvl.dot} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}><Edit3 size={14} /></Button>
                          <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"><Trash2 size={14} /></button>
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

      <Dialog open={!!editItem} onClose={() => setEditItem(null)} title="Edit Inventory Item" description={editItem?.name}>
        {editItem && (
          <div className="space-y-4">
            <Input label="Item Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="pcs, kg, L" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Quantity" type="number" value={qty} onChange={e => setQty(parseInt(e.target.value) || 0)} />
              <Input label="Reorder Level" type="number" value={reorderLevel} onChange={e => setReorderLevel(parseInt(e.target.value) || 0)} />
            </div>
            <Input label="Price per Unit (₹)" type="number" value={unitPrice} onChange={e => setUnitPrice(parseFloat(e.target.value) || 0)} />
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => setEditItem(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} className="flex-1">Save Changes</Button>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog open={showAdd} onClose={() => setShowAdd(false)} title="Add Inventory Item">
        <div className="space-y-4">
          <Input label="Item Name" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} placeholder="Item name" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Quantity" type="number" value={newItem.quantity} onChange={e => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 0 }))} />
            <Input label="Unit" value={newItem.unit} onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))} placeholder="pcs, kg, L" />
            <Input label="Price per Unit (₹)" type="number" value={newItem.unitPrice} onChange={e => setNewItem(p => ({ ...p, unitPrice: parseFloat(e.target.value) || 0 }))} />
            <Input label="Reorder Level" type="number" value={newItem.reorderLevel} onChange={e => setNewItem(p => ({ ...p, reorderLevel: parseInt(e.target.value) || 0 }))} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAdd} className="flex-1">Add Item</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Item" description={deleteTarget?.name}>
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={handleDelete} className="flex-1"><Trash2 size={16} /> Delete</Button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
}
