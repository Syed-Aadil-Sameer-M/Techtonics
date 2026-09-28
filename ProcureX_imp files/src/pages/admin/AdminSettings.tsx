import { Shield, Bell, Database, Mail, Globe, Save } from 'lucide-react';
import { useStore } from '@/store';
import { Layout } from '@/components/shared/Layout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useState } from 'react';

export function AdminSettings() {
  const addToast = useStore(s => s.addToast);
  const [orgName, setOrgName] = useState('ProcureX Technologies Inc.');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('UTC+5:30 (India)');
  const [threshold, setThreshold] = useState('50000');
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);

  const handleSave = () => addToast('success', 'Settings saved successfully');

  return (
    <Layout>
      <PageHeader title="Settings" subtitle="Configure organization-wide procurement settings" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <Globe size={18} className="text-sky-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Organization</h3>
              <p className="text-xs text-slate-500">General organization settings</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Organization Name" value={orgName} onChange={e => setOrgName(e.target.value)} />
            <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="INR">INR — Indian Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
            </Select>
            <Select label="Timezone" value={timezone} onChange={e => setTimezone(e.target.value)}>
              <option>UTC+5:30 (India)</option>
              <option>UTC-8 (Pacific)</option>
              <option>UTC-5 (Eastern)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+8 (Singapore)</option>
            </Select>
            <Input label="Auto-approve Threshold" value={threshold} onChange={e => setThreshold(e.target.value)} type="number" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Bell size={18} className="text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <p className="text-xs text-slate-500">Alert preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-slate-200">Email Notifications</p>
                <p className="text-xs text-slate-500">Send alerts via email</p>
              </div>
              <button onClick={() => setEmailNotif(!emailNotif)} className={`relative w-11 h-6 rounded-full transition-colors ${emailNotif ? 'bg-sky-500' : 'bg-slate-700'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${emailNotif ? 'left-5' : 'left-0.5'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-slate-200">Auto-approve Low Value</p>
                <p className="text-xs text-slate-500">Below threshold amount</p>
              </div>
              <button onClick={() => setAutoApprove(!autoApprove)} className={`relative w-11 h-6 rounded-full transition-colors ${autoApprove ? 'bg-sky-500' : 'bg-slate-700'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${autoApprove ? 'left-5' : 'left-0.5'}`} />
              </button>
            </label>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Shield size={18} className="text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Security</h3>
              <p className="text-xs text-slate-500">Access control settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
              <span className="text-sm text-slate-300">Two-Factor Auth</span>
              <span className="text-xs text-emerald-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
              <span className="text-sm text-slate-300">SSO Integration</span>
              <span className="text-xs text-emerald-400 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
              <span className="text-sm text-slate-300">Session Timeout</span>
              <span className="text-xs text-slate-400">30 minutes</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Database size={18} className="text-violet-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Data & Backup</h3>
              <p className="text-xs text-slate-500">Retention and backup settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
              <span className="text-sm text-slate-300">Last Backup</span>
              <span className="text-xs text-slate-400">Aug 23, 2026 03:00</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
              <span className="text-sm text-slate-300">Audit Retention</span>
              <span className="text-xs text-slate-400">7 years</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
              <span className="text-sm text-slate-300">Backup Frequency</span>
              <span className="text-xs text-slate-400">Daily</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Mail size={18} className="text-cyan-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Email Templates</h3>
              <p className="text-xs text-slate-500">Customize notification emails</p>
            </div>
          </div>
          <Textarea label="Approval Request Template" rows={4} defaultValue="A new material request {{request_id}} from {{requester}} is awaiting your approval. Material: {{material}}, Quantity: {{quantity}}. Please review and take action." />
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} size="lg">
          <Save size={18} /> Save Changes
        </Button>
      </div>
    </Layout>
  );
}
