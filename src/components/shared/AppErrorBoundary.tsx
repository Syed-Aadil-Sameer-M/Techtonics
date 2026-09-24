import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render error', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <section className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900/80 p-6 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
            <TriangleAlert size={24} />
          </div>
          <h1 className="text-xl font-semibold text-white">ProcureX could not load</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Refresh the preview to try again. If the problem continues, this message identifies the startup failure.
          </p>
          <p className="mt-4 break-words rounded-xl bg-slate-950 p-3 text-left font-mono text-xs text-rose-200">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-400"
          >
            <RefreshCw size={16} />
            Reload preview
          </button>
        </section>
      </main>
    );
  }
}
