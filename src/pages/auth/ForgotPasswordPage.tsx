import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/api';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/change-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6">
          <ArrowLeft size={16} /> Back to sign in
        </button>
        <div className="glass rounded-3xl p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle2 size={40} className="mx-auto text-emerald-300" />
              <h1 className="text-2xl font-bold text-white mt-4">Check your inbox</h1>
              <p className="text-sm text-slate-400 mt-2">If an account exists for that email, you'll receive a password reset link.</p>
              <Button className="w-full mt-6" onClick={() => navigate('/login')}>Return to sign in</Button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-300">
                <Mail size={22} />
              </div>
              <h1 className="text-2xl font-bold text-white mt-5">Reset your password</h1>
              <p className="text-sm text-slate-400 mt-2 mb-6">Enter your work email and we'll send you a reset link.</p>
              <form onSubmit={submit} className="space-y-4">
                <Input label="Work email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
                {error && <p className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">{error}</p>}
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
