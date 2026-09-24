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

export function LoginPage() {
  const navigate = useNavigate();
  const login = useStore(s => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const user = useStore.getState().currentUser;
      if (user) navigate(homeForRole(user.role));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center glow-sky mb-4 animate-float">
            <PackageCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ProcureX</h1>
          <p className="text-sm text-slate-400 mt-1">Enterprise Procurement & Logistics</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Sign in</h2>
          <p className="text-sm text-slate-400 mb-6">Enter your credentials to access your workspace</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@procurex.io"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end -mt-2">
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs text-sky-400 hover:text-sky-300">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300 animate-fade-in">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight size={18} /></>
              )}
            </Button>
          </form>

          <p className="text-xs text-slate-600 text-center mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/create-account')} className="text-sky-400 hover:text-sky-300">
              Create one
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          ProcureX · Procurement & Logistics Workspace
        </p>
      </div>
    </div>
  );
}
