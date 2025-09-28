'use client';

import { useEffect, useState } from 'react';
import { BaseMiniAppService } from '@/lib/base-integration';

interface BaseFrameProps {
  children: React.ReactNode;
  onAction?: (action: any) => void;
}

export function BaseFrame({ children, onAction }: BaseFrameProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [walletInfo, setWalletInfo] = useState<any>(null);

  useEffect(() => {
    initializeBaseApp();
  }, []);

  const initializeBaseApp = async () => {
    try {
      await BaseMiniAppService.initialize();
      setIsInitialized(true);

      // Get wallet info
      const wallet = await BaseMiniAppService.getWalletInfo();
      setWalletInfo(wallet);

      // Set up action listeners
      setupActionListeners();
    } catch (error) {
      console.error('Failed to initialize Base Mini App:', error);
    }
  };

  const setupActionListeners = () => {
    // Listen for frame actions from the parent app
    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleFrameMessage);
    }
  };

  const handleFrameMessage = async (event: MessageEvent) => {
    // Verify origin for security
    if (event.origin !== window.location.origin) return;

    try {
      const { type, data } = event.data;

      switch (type) {
        case 'submit-diagnostic':
          await BaseMiniAppService.handleSubmitDiagnostic(data);
          break;
        case 'view-report':
          await BaseMiniAppService.handleViewReport(data.diagnosticId);
          break;
        case 'approve-estimate':
          await BaseMiniAppService.handleApproveEstimate(data.diagnosticId);
          break;
        default:
          console.log('Unknown frame action:', type);
      }

      if (onAction) {
        onAction({ type, data });
      }
    } catch (error) {
      console.error('Failed to handle frame message:', error);
    }
  };

  return (
    <div className="base-frame">
      {children}

      {/* Base Mini App Status Indicator */}
      {isInitialized && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="glass-card rounded-lg p-3 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              walletInfo?.isConnected ? 'bg-success' : 'bg-warning'
            }`} />
            <span className="text-xs text-text-secondary">
              {walletInfo?.isConnected ? 'Base Connected' : 'Base Disconnected'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Frame Action Buttons
export function FrameActionButton({
  action,
  children,
  onClick,
  ...props
}: {
  action: string;
  children: React.ReactNode;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const handleClick = async () => {
    try {
      // Send action to parent frame
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'frame-action',
          action,
          timestamp: Date.now()
        }, '*');
      }

      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error('Failed to send frame action:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="btn-primary"
      {...props}
    >
      {children}
    </button>
  );
}

