import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useStore } from '@/store';
import type { BackendRole } from '@/types';

export function CreateAccountPage() {
  const navigate = useNavigate();
  const register = useStore(s => s.register);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    department: '',
    phoneNumber: '',
    role: 'RECEIVER' as BackendRole,
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [confirmRequired, setConfirmRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.fullName.trim().length < 2) return setError('Enter your full name.');
    if (form.username.trim().length < 3) return setError('Username must be at least 3 characters.');
    if (!form.department.trim()) return setError('Enter your department.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const result = await register({
        email: form.email,
        password: form.password,
        role: form.role,
        fullName: form.fullName,
        department: form.department,
      });
      setConfirmRequired(result === 'confirm');
      setComplete(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the account. That email may already be registered.');
    }
    setLoading(false);
  };

  if (complete) {
    return (
      <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center p-4">
        <div className="w-full max-w-md glass rounded-3xl p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-300">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mt-5">{confirmRequired ? 'Check your email' : 'Account created'}</h1>
          <p className="text-sm text-slate-400 mt-2">{confirmRequired ? 'We sent a confirmation link to your email. Click it to verify your account, then sign in.' : 'Your ProcureX workspace is ready. Sign in to continue.'}</p>
          <Button className="w-full mt-6" onClick={() => navigate('/login')}>
            Continue to sign in <ArrowRight size={17} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in-up">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6">
          <ArrowLeft size={16} /> Back to home
        </button>
        <div className="glass rounded-3xl p-7 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
              <PackageCheck size={23} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Create your account</h1>
              <p className="text-xs text-slate-500">Choose the role that matches your work</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name" value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Your name" required />
            <Input label="Username" value={form.username} onChange={e => update('username', e.target.value)} placeholder="Choose a username" required />
            <Input label="Work email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@company.com" required />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Department" value={form.department} onChange={e => update('department', e.target.value)} placeholder="Engineering" required />
              <Input label="Phone number" value={form.phoneNumber} onChange={e => update('phoneNumber', e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <Select label="Workspace role" value={form.role} onChange={e => update('role', e.target.value as BackendRole)}>
              <option value="RECEIVER">Receiver</option>
              <option value="PROCUREMENT">Procurement Officer</option>
              <option value="ADMIN">Administrator</option>
            </Select>
            <Input label="Password" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="At least 8 characters" required />
            <Input label="Confirm password" type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Repeat your password" required />
            {error && <p className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : <>Create account <ArrowRight size={18} /></>}
            </Button>
          </form>
          <p className="text-xs text-slate-600 text-center mt-5">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-sky-400 hover:text-sky-300">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
