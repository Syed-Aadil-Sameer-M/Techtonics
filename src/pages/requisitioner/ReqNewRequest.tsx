import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

export function ReqNewRequest() {
  const navigate = useNavigate();
  const currentUser = useStore(s => s.currentUser)!;
  const createRequest = useStore(s => s.createRequest);
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [neededBy, setNeededBy] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.trim() || !location.trim() || !neededBy || quantity <= 0) return;
    setSubmitting(true);
    try {
      await createRequest({ material, quantity, location, neededBy, description: description || undefined });
      navigate('/req/requests');
    } catch {
      // store.addToast handles error display
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageHeader title="New Material Request" subtitle="Create a new procurement request for approval" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-4">Request Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Material" value={material} onChange={e => setMaterial(e.target.value)} placeholder="e.g. Dell Latitude 5440 Laptop" required />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Quantity" type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} min={1} required />
                <Input label="Delivery Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Engineering Bay 2" required />
                <Input label="Deadline" type="date" value={neededBy} onChange={e => setNeededBy(e.target.value)} required />
              </div>
              <Textarea label="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what you need and why..." rows={4} />
              <Button type="submit" size="lg" className="w-full" disabled={submitting || !material.trim() || !location.trim() || !neededBy || quantity <= 0}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <><Send size={16} /> Submit for Approval</>
                )}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Requester</span>
                <span className="text-slate-200">{currentUser.username}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Material</span>
                <span className="text-slate-200">{material || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Quantity</span>
                <span className="text-slate-200">{quantity}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Location</span>
                <span className="text-slate-200">{location || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Deadline</span>
                <span className="text-slate-200">{neededBy || '—'}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-white mb-4">Approval Workflow</h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-xs text-sky-300">1</div>
              <div>
                <p className="text-sm text-slate-200">Admin Review</p>
                <p className="text-xs text-slate-500">Pending approval</p>
              </div>
            </div>
            <div className="ml-4 w-px h-6 bg-slate-700" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center text-xs text-slate-400">2</div>
              <div>
                <p className="text-sm text-slate-200">Procurement Processing</p>
                <p className="text-xs text-slate-500">Auto-assigned</p>
              </div>
            </div>
            <div className="ml-4 w-px h-6 bg-slate-700" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center text-xs text-slate-400">3</div>
              <div>
                <p className="text-sm text-slate-200">Dispatch & Delivery</p>
                <p className="text-xs text-slate-500">After approval</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
