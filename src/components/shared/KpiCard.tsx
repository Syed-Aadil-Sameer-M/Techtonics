import { type LucideIcon } from 'lucide-react';
import { CountUp } from '@/components/shared/CountUp';
import { TiltCard } from '@/components/shared/TiltCard';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  trend?: string;
  accent: 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan';
  delay?: number;
}

const accentMap = {
  sky: { text: 'text-sky-300', bg: 'bg-sky-500/10', border: 'border-sky-500/20', glow: 'glow-sky' },
  emerald: { text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'glow-emerald' },
  amber: { text: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'glow-amber' },
  rose: { text: 'text-rose-300', bg: 'bg-rose-500/10', border: 'border-rose-500/20', glow: '' },
  violet: { text: 'text-violet-300', bg: 'bg-violet-500/10', border: 'border-violet-500/20', glow: '' },
  cyan: { text: 'text-cyan-300', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', glow: '' },
};

export function KpiCard({ label, value, prefix, suffix, decimals, icon: Icon, trend, accent, delay = 0 }: KpiCardProps) {
  const c = accentMap[accent];
  return (
    <div
      className="animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <TiltCard className="glass-card p-5 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-2.5 rounded-xl border', c.bg, c.border)}>
            <Icon size={20} className={c.text} />
          </div>
        </div>
        <div className="space-y-1">
          <p className={cn('text-2xl font-bold tracking-tight', c.text)}>
            <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </p>
          <p className="text-sm text-slate-400">{label}</p>
          {trend && <p className="text-xs text-slate-500 mt-1">{trend}</p>}
        </div>
      </TiltCard>
    </div>
  );
}
