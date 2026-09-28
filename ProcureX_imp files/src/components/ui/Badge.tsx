import { cn } from '@/lib/utils';

interface BadgeProps {
  className?: string;
  color?: string;
  bg?: string;
  dot?: string;
  label: string;
}

export function Badge({ className, color, bg, dot, label }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        color,
        bg,
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />}
      {label}
    </span>
  );
}
