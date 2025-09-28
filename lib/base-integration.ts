import { MiniAppProvider } from '@farcaster/miniapp-sdk';

export interface FrameAction {
  type: 'submit-diagnostic' | 'view-report' | 'approve-estimate';
  data: any;
}

export interface FrameNotification {
  type: 'new-report' | 'estimate-approved' | 'maintenance-reminder';
  title: string;
  body: string;
  data?: any;
}

export class BaseMiniAppService {
  private static provider: MiniAppProvider | null = null;

  static async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      this.provider = new MiniAppProvider({
        appId: process.env.NEXT_PUBLIC_BASE_APP_ID || 'autodiagnostics-ai',
        apiUrl: process.env.NEXT_PUBLIC_BASE_API_URL
      });

      await this.provider.initialize();
    } catch (error) {
      console.error('Failed to initialize Base Mini App:', error);
    }
  }

  static getProvider(): MiniAppProvider | null {
    return this.provider;
  }

  static async sendFrameAction(action: FrameAction): Promise<void> {
    if (!this.provider) {
      throw new Error('Base Mini App not initialized');
    }

    try {
      await this.provider.sendAction({
        type: action.type,
        data: action.data
      });
    } catch (error) {
      console.error('Failed to send frame action:', error);
      throw error;
    }
  }

  static async sendNotification(notification: FrameNotification): Promise<void> {
    if (!this.provider) {
      throw new Error('Base Mini App not initialized');
    }

    try {
      await this.provider.sendNotification({
        title: notification.title,
        body: notification.body,
        data: notification.data
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  static async getWalletInfo(): Promise<{
    address: string;
    chainId: number;
    isConnected: boolean;
  } | null> {
    if (!this.provider) {
      return null;
    }

    try {
      const wallet = await this.provider.getWallet();
      return {
        address: wallet.address,
        chainId: wallet.chainId,
        isConnected: wallet.isConnected
      };
    } catch (error) {
      console.error('Failed to get wallet info:', error);
      return null;
    }
  }

  static async requestTransaction(tx: {
    to: string;
    value?: string;
    data?: string;
  }): Promise<string> {
    if (!this.provider) {
      throw new Error('Base Mini App not initialized');
    }

    try {
      const txHash = await this.provider.sendTransaction(tx);
      return txHash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  // Frame action handlers
  static async handleSubmitDiagnostic(data: {
    vehicleId: string;
    dataType: 'video' | 'audio' | 'text' | 'obd2';
    data: string;
  }): Promise<void> {
    try {
      // Create diagnostic via API
      const response = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create diagnostic');
      }

      const diagnostic = await response.json();

      // Send success notification
      await this.sendNotification({
        type: 'new-report',
        title: 'Diagnostic Submitted',
        body: 'Your diagnostic data has been submitted for AI analysis.',
        data: { diagnosticId: diagnostic.diagnosticId }
      });
    } catch (error) {
      console.error('Failed to handle diagnostic submission:', error);
      throw error;
    }
  }

  static async handleViewReport(diagnosticId: string): Promise<void> {
    try {
      // Get diagnostic data
      const response = await fetch(`/api/diagnostics/${diagnosticId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch diagnostic');
      }

      const diagnostic = await response.json();

      // Send report data to frame
      await this.sendFrameAction({
        type: 'view-report',
        data: {
          diagnostic,
          shareUrl: `${window.location.origin}/share/${diagnosticId}`
        }
      });
    } catch (error) {
      console.error('Failed to handle report view:', error);
      throw error;
    }
  }

  static async handleApproveEstimate(diagnosticId: string): Promise<void> {
    try {
      // Update diagnostic status
      const response = await fetch(`/api/diagnostics/${diagnosticId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });

      if (!response.ok) {
        throw new Error('Failed to approve estimate');
      }

      // Send notification
      await this.sendNotification({
        type: 'estimate-approved',
        title: 'Estimate Approved',
        body: 'Your repair estimate has been approved.',
        data: { diagnosticId }
      });
    } catch (error) {
      console.error('Failed to approve estimate:', error);
      throw error;
    }
  }
}

