'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-error/20">
            <AlertTriangle className="h-12 w-12 text-error" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-fg">Something went wrong!</h1>
          <p className="text-text-secondary">
            An error occurred while loading AutoDiagnostics AI. Please try again.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary px-6 py-3 rounded-lg font-medium block mx-auto"
          >
            Go to Dashboard
          </button>
        </div>

        {error.digest && (
          <div className="text-xs text-text-secondary bg-surface p-3 rounded-lg border border-border">
            Error ID: {error.digest}
          </div>
        )}
      </div>
    </div>
  );
}
