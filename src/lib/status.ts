import type { RequestStatus, PurchaseOrderStatus, StockLevel, BackendRole } from '@/types';

export const requestStatusConfig: Record<RequestStatus, { label: string; color: string; bg: string; dot: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
  APPROVED: { label: 'Approved', color: 'text-sky-300', bg: 'bg-sky-500/10 border-sky-500/30', dot: 'bg-sky-400' },
  REJECTED: { label: 'Rejected', color: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30', dot: 'bg-rose-400' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
};

export const poStatusConfig: Record<PurchaseOrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  CREATED: { label: 'Created', color: 'text-slate-300', bg: 'bg-slate-700/40 border-slate-600/40', dot: 'bg-slate-400' },
  SENT: { label: 'Sent', color: 'text-sky-300', bg: 'bg-sky-500/10 border-sky-500/30', dot: 'bg-sky-400' },
  RECEIVED: { label: 'Received', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
  CANCELLED: { label: 'Cancelled', color: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30', dot: 'bg-rose-400' },
};

export const stockLevelConfig: Record<StockLevel, { label: string; color: string; bg: string; dot: string }> = {
  OK: { label: 'In Stock', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
  LOW: { label: 'Low Stock', color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
  CRITICAL: { label: 'Critical', color: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30', dot: 'bg-rose-400' },
};

export const roleConfig: Record<BackendRole, { label: string; color: string; bg: string }> = {
  ADMIN: { label: 'Administrator', color: 'text-sky-300', bg: 'bg-sky-500/10 border-sky-500/30' },
  RECEIVER: { label: 'Receiver', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  PROCUREMENT: { label: 'Procurement Officer', color: 'text-violet-300', bg: 'bg-violet-500/10 border-violet-500/30' },
};

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}
