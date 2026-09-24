import { cn } from '@/lib/utils';

const colorMap: Record<string, string> = {
  sky: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, color = 'sky', size = 'md', className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border font-semibold shrink-0',
        colorMap[color] || colorMap.sky,
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
