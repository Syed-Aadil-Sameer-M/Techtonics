import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card p-5',
        hover && 'transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/60',
        className
      )}
    >
      {children}
    </div>
  );
}
