import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface DateRange { from: string; to: string; }

interface ExportButtonProps {
  onCsv: (range: DateRange) => void;
  onExcel: (range: DateRange) => void;
  onPdf: (range: DateRange) => void;
}

export function ExportButton({ onCsv, onExcel, onPdf }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const range: DateRange = { from, to };
  const hasFilter = !!from || !!to;

  const handle = (fn: (r: DateRange) => void) => {
    fn(range);
    setOpen(false);
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFrom(''); setTo('');
  };

  return (
    <div ref={ref} className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5"
      >
        <Download size={14} />
        Export
        {hasFilter && (
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 ml-0.5" />
        )}
        <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 glass rounded-2xl shadow-2xl border border-slate-800/60 z-50 animate-scale-in p-4">

          {/* Date range filter */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Calendar size={12} /> Date range filter
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-[10px] text-slate-500 mb-1 block">From</label>
              <input
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-200 focus:outline-none focus:border-sky-500/40"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 mb-1 block">To</label>
              <input
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                min={from || undefined}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-200 focus:outline-none focus:border-sky-500/40"
              />
            </div>
          </div>

          {hasFilter && (
            <button
              onClick={clearDates}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 mb-3"
            >
              <X size={11} /> Clear dates
            </button>
          )}

          <div className="h-px bg-slate-800/60 mb-3" />

          {/* Export format buttons */}
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Download as</p>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handle(onExcel)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Excel (.xlsx)</p>
                <p className="text-[10px] text-slate-500">Open in Excel or Google Sheets</p>
              </div>
            </button>

            <button
              onClick={() => handle(onPdf)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">PDF (.pdf)</p>
                <p className="text-[10px] text-slate-500">Print or share as document</p>
              </div>
            </button>

            <button
              onClick={() => handle(onCsv)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                <Download size={14} className="text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">CSV (.csv)</p>
                <p className="text-[10px] text-slate-500">Raw data for any spreadsheet</p>
              </div>
            </button>
          </div>

          {hasFilter && (
            <p className="text-[10px] text-slate-500 mt-3 text-center">
              Filter active: {from || '…'} → {to || '…'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
