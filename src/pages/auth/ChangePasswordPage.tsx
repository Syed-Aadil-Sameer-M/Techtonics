import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCheck, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { BackendRole } from '@/types';

function homeForRole(role: BackendRole): string {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'RECEIVER') return '/req/dashboard';
  return '/officer/dashboard';
}

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const changePassword = useStore(s => s.changePassword);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await changePassword(password);
      const user = useStore.getState().currentUser;
      if (user) navigate(homeForRole(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center glow-sky mb-4">
            <PackageCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ProcureX</h1>
        </div>
        <div className="glass rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Change password</h2>
          <p className="text-sm text-slate-400 mb-6">You signed in with a temporary password. Set your own password to continue.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="New password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" required />
            <Input label="Confirm password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" required />
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">{error}</div>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : <>Save password <ArrowRight size={18} /></>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
