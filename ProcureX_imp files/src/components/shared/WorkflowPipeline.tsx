import type { MaterialRequest } from '@/types';
import { Check, X, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowPipelineProps {
  request: MaterialRequest;
}

const stages = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'COMPLETED', label: 'Completed' },
];

export function WorkflowPipeline({ request }: WorkflowPipelineProps) {
  const currentIdx = stages.findIndex(s => s.key === request.status);
  const isRejected = request.status === 'REJECTED';

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2">
      {stages.map((stage, idx) => {
        const isComplete = !isRejected && idx < currentIdx;
        const isCurrent = !isRejected && idx === currentIdx;
        const isRejectedStage = isRejected && idx === 0;

        return (
          <div key={stage.key} className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isComplete && 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
                  isCurrent && 'bg-sky-500/20 border-sky-500 text-sky-400 animate-pulse-glow',
                  isRejectedStage && 'bg-rose-500/20 border-rose-500 text-rose-400',
                  !isComplete && !isCurrent && !isRejectedStage && 'bg-slate-800/60 border-slate-700 text-slate-600'
                )}
              >
                {isComplete ? <Check size={15} /> : isRejectedStage ? <X size={15} /> : isCurrent ? <Clock size={15} /> : <span className="text-xs">{idx + 1}</span>}
              </div>
              <span className={cn(
                'text-[11px] font-medium whitespace-nowrap',
                isComplete && 'text-emerald-400',
                isCurrent && 'text-sky-400',
                isRejectedStage && 'text-rose-400',
                !isComplete && !isCurrent && !isRejectedStage && 'text-slate-500'
              )}>
                {stage.label}
              </span>
            </div>
            {idx < stages.length - 1 && (
              <ArrowRight size={14} className={cn('shrink-0 mb-5', isComplete ? 'text-emerald-500/40' : 'text-slate-700')} />
            )}
          </div>
        );
      })}
      {isRejected && (
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 bg-rose-500/20 border-rose-500 text-rose-400">
              <X size={15} />
            </div>
            <span className="text-[11px] font-medium text-rose-400">Rejected</span>
          </div>
        </div>
      )}
    </div>
  );
}
