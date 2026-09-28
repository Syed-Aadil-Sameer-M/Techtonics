import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useStore } from '@/store';
import { cn } from '@/lib/utils';

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  error: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  info: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
};

export function ToastContainer() {
  const toasts = useStore(s => s.toasts);
  const dismiss = useStore(s => s.dismissToast);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-[100] flex flex-col gap-3 max-w-sm ml-auto">
      {toasts.map(toast => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl animate-slide-in-right',
              colorMap[toast.type]
            )}
          >
            <Icon size={18} className="shrink-0 mt-0.5" />
            <p className="text-sm flex-1 text-slate-100">{toast.message}</p>
            <button onClick={() => dismiss(toast.id)} className="shrink-0 text-slate-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
