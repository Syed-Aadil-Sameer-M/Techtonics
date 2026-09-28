import { ArrowRight, BarChart3, Boxes, CheckCircle2, FileCheck2, PackageCheck, ShieldCheck, Truck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const features = [
  { icon: FileCheck2, title: 'Request to approval', text: 'Give every purchase a clear owner, budget, approval path, and audit trail.' },
  { icon: Truck, title: 'Order to delivery', text: 'Turn approved requests into purchase orders and track every delivery milestone.' },
  { icon: Boxes, title: 'Inventory visibility', text: 'Spot low stock early and keep teams supplied without manual spreadsheets.' },
  { icon: BarChart3, title: 'Decisions with context', text: 'See spend, supplier performance, and operational bottlenecks in one place.' },
];

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-grid">
      <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/20"><PackageCheck size={22} /></span>
            <span><span className="block text-lg font-bold tracking-tight">ProcureX</span><span className="block text-[10px] text-slate-500 uppercase tracking-[0.2em]">Procurement OS</span></span>
          </button>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/login')}>Sign in <ArrowRight size={16} /></Button>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-xs text-sky-300 mb-6"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Procurement operations, brought together</div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">Move every purchase <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">forward.</span></h1>
            <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl leading-8">ProcureX connects requests, approvals, suppliers, inventory, orders, and dispatch in one calm, accountable workspace.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button size="lg" onClick={() => navigate('/login')}>Sign in <ArrowRight size={18} /></Button><Button size="lg" variant="outline" onClick={() => navigate('/login')}>Explore the workspace</Button></div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Role-based workflows</span><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-sky-400" /> Audit-ready activity</span></div>
          </div>
          <div className="relative animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <div className="absolute -inset-8 bg-sky-500/10 blur-3xl rounded-full" />
            <div className="relative rounded-3xl border border-slate-700/70 bg-slate-900/90 p-4 shadow-2xl shadow-sky-950/40">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between mb-6"><div><p className="text-xs text-slate-500 uppercase tracking-wider">Operations overview</p><p className="text-2xl font-semibold text-white mt-1">₹42,85,600</p></div><span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">On track</span></div>
                <div className="grid grid-cols-3 gap-3 mb-5">{[['Pending', '18'], ['Active POs', '27'], ['Low stock', '05']].map(([label, value]) => <div key={label} className="p-3 rounded-xl bg-slate-900 border border-slate-800"><p className="text-xl font-bold text-white">{value}</p><p className="text-[11px] text-slate-500 mt-1">{label}</p></div>)}</div>
                <div className="space-y-3">{[
                  { name: 'Engineering workstations', amount: '₹33,73,400', status: 'Pending approval', dot: 'bg-amber-400', text: 'text-amber-300' },
                  { name: 'Safety equipment restock', amount: '₹5,59,700', status: 'In procurement', dot: 'bg-sky-400', text: 'text-sky-300' },
                  { name: 'Conference room furniture', amount: '₹7,83,600', status: 'Ordered', dot: 'bg-cyan-400', text: 'text-cyan-300' },
                ].map(item => <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800"><span className={`w-2 h-2 rounded-full ${item.dot}`} /><div className="flex-1 min-w-0"><p className="text-sm text-slate-200 truncate">{item.name}</p><p className="text-xs text-slate-500 mt-1">{item.amount}</p></div><span className={`text-[11px] ${item.text}`}>{item.status}</span></div>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800/60 bg-slate-900/30"><div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-slate-500"><span className="flex items-center gap-2"><Users size={16} /> Built for every procurement role</span><span className="flex items-center gap-2"><ShieldCheck size={16} /> Designed for accountable decisions</span><span className="flex items-center gap-2"><PackageCheck size={16} /> From request to dispatch</span></div></section>

        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24"><div className="max-w-2xl mb-12"><p className="text-xs text-sky-300 uppercase tracking-[0.2em] font-semibold">One connected flow</p><h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Less chasing. More certainty.</h2><p className="text-slate-400 mt-4 leading-7">Make the next step obvious for the people who request, review, buy, receive, and use what your organization needs.</p></div><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{features.map(feature => <div key={feature.title} className="group p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-sky-500/30 hover:bg-slate-900/70 transition-all"><div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform"><feature.icon size={20} /></div><h3 className="mt-5 font-semibold text-white">{feature.title}</h3><p className="mt-2 text-sm text-slate-500 leading-6">{feature.text}</p></div>)}</div></section>

        <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24"><div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 sm:p-12 grid lg:grid-cols-[1fr_auto] gap-8 items-center"><div><p className="text-xs text-cyan-300 uppercase tracking-[0.2em] font-semibold">Ready when you are</p><h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">Give procurement a clear operating rhythm.</h2><p className="text-slate-400 mt-3 max-w-2xl">Sign in to your workspace and start with a request that everyone can follow.</p></div><Button size="lg" onClick={() => navigate('/login')}>Sign in <ArrowRight size={18} /></Button></div></section>
      </main>
      <footer className="border-t border-slate-800/60"><div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-slate-600"><span>ProcureX · Procurement & Logistics Workspace</span><span>Built for clearer decisions and smoother delivery.</span></div></footer>
    </div>
  );
}
