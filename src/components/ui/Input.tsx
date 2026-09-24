import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder:text-slate-500',
          'focus:outline-none focus:border-sky-500/60 focus:bg-slate-800/80 focus:ring-2 focus:ring-sky-500/10',
          'transition-all duration-200',
          error && 'border-rose-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, children, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100',
          'focus:outline-none focus:border-sky-500/60 focus:bg-slate-800/80',
          'transition-all duration-200 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
);
Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder:text-slate-500',
          'focus:outline-none focus:border-sky-500/60 focus:bg-slate-800/80',
          'transition-all duration-200 resize-none',
          className
        )}
        {...props}
      />
    </div>
  )
);
Textarea.displayName = 'Textarea';
