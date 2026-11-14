import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#050716] text-white flex flex-col items-center justify-center p-6 text-center">
          <p className="text-lg font-bold text-rose-200 mb-2">
            পেজটি লোড করতে সামান্য সমস্যা হয়েছে
          </p>
          <p className="text-xs text-zinc-300 mb-4 max-w-sm">
            অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা আধুনিক ব্রাউজারে (Chrome / Safari) লিংকটি ওপেন করুন।
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full bg-rose-500 text-white text-xs font-bold cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
