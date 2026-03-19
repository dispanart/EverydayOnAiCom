'use client';

import { Component } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Something Went Wrong</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">
          {this.props.fallbackMessage || 'This component could not be loaded. Try refreshing the page.'}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold
                       px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={14} /> Try Again
          </button>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            Back to Home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && this.state.error && (
          <pre className="mt-6 text-xs text-left bg-slate-100 rounded-lg p-4 max-w-lg overflow-auto text-red-600">
            {this.state.error.toString()}
          </pre>
        )}
      </div>
    );
  }
}
