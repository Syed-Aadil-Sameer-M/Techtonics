import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { WorkflowPipeline } from '@/components/shared/WorkflowPipeline';
import { useStore } from '@/store';
import { requestStatusConfig, formatDate } from '@/lib/status';
import { Check, X, MapPin } from 'lucide-react';
import type { MaterialRequest } from '@/types';

interface RequestDetailDrawerProps {
  request: MaterialRequest | null;
  onClose: () => void;
  showActions?: boolean;
}

export function RequestDetailDrawer({ request, onClose, showActions = false }: RequestDetailDrawerProps) {
  const [comment, setComment] = useState('');
  const updateRequestStatus = useStore(s => s.updateRequestStatus);
  const addToast = useStore(s => s.addToast);

  if (!request) return null;

  const status = requestStatusConfig[request.status];

  const handleApprove = () => {
    updateRequestStatus(request.id, 'APPROVED');
    setComment('');
    onClose();
  };

  const handleReject = () => {
    updateRequestStatus(request.id, 'REJECTED');
    setComment('');
    onClose();
  };

  return (
    <Dialog open={!!request} onClose={onClose} size="xl" title={`Request #${request.id}`} description={request.material}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge label={status.label} color={status.color} bg={status.bg} dot={status.dot} />
          <span className="text-sm text-slate-400 flex items-center gap-1">
            <MapPin size={14} /> {request.location}
          </span>
          <span className="text-sm text-slate-600">·</span>
          <span className="text-sm text-slate-400">Submitted {formatDate(request.date)}</span>
        </div>

        <div className="glass-card p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Workflow Pipeline</p>
          <WorkflowPipeline request={request} />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</p>
          <p className="text-sm text-slate-300 leading-relaxed">{request.description || 'No description provided'}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Details</p>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-800/30">
                  <td className="px-4 py-3 text-slate-500 font-medium">Material</td>
                  <td className="px-4 py-3 text-slate-200">{request.material}</td>
                </tr>
                <tr className="border-b border-slate-800/30">
                  <td className="px-4 py-3 text-slate-500 font-medium">Quantity</td>
                  <td className="px-4 py-3 text-slate-200">{request.quantity}</td>
                </tr>
                <tr className="border-b border-slate-800/30">
                  <td className="px-4 py-3 text-slate-500 font-medium">Location</td>
                  <td className="px-4 py-3 text-slate-200">{request.location}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-500 font-medium">Requested By</td>
                  <td className="px-4 py-3 text-slate-200">{request.requestedBy || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {showActions && request.status === 'PENDING' && (
          <div className="space-y-3 pt-4 border-t border-slate-800/60">
            <Textarea
              label="Comment (optional)"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment for the requester..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button variant="success" onClick={handleApprove} className="flex-1">
                <Check size={16} /> Approve Request
              </Button>
              <Button variant="danger" onClick={handleReject} className="flex-1">
                <X size={16} /> Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
