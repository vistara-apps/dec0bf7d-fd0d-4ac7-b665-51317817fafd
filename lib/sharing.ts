import { Diagnostic, Vehicle } from './types';
import { db } from './database';

export interface ShareableReport {
  id: string;
  token: string;
  vehicle: Vehicle;
  diagnostic: Diagnostic;
  createdAt: string;
  expiresAt: string;
  accessCount: number;
  maxAccessCount?: number;
}

export class SharingService {
  private static shares = new Map<string, ShareableReport>();

  static async createShareableReport(
    diagnosticId: string,
    options: {
      maxAccessCount?: number;
      expiresInDays?: number;
    } = {}
  ): Promise<ShareableReport> {
    const diagnostic = await db.getDiagnostic(diagnosticId);
    if (!diagnostic) {
      throw new Error('Diagnostic not found');
    }

    const vehicle = await db.getVehicle(diagnostic.vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const token = this.generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (options.expiresInDays || 30) * 24 * 60 * 60 * 1000);

    const shareableReport: ShareableReport = {
      id: `share-${Date.now()}`,
      token,
      vehicle,
      diagnostic,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      accessCount: 0,
      maxAccessCount: options.maxAccessCount
    };

    this.shares.set(token, shareableReport);
    return shareableReport;
  }

  static async getShareableReport(token: string): Promise<ShareableReport | null> {
    const report = this.shares.get(token);
    if (!report) {
      return null;
    }

    // Check if expired
    if (new Date() > new Date(report.expiresAt)) {
      this.shares.delete(token);
      return null;
    }

    // Check access count limit
    if (report.maxAccessCount && report.accessCount >= report.maxAccessCount) {
      return null;
    }

    // Increment access count
    report.accessCount++;
    this.shares.set(token, report);

    return report;
  }

  static async getShareableReports(): Promise<ShareableReport[]> {
    return Array.from(this.shares.values());
  }

  private static generateToken(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  static async createFleetShare(
    vehicleIds: string[],
    options: {
      maxAccessCount?: number;
      expiresInDays?: number;
    } = {}
  ): Promise<{
    token: string;
    vehicles: Vehicle[];
    expiresAt: string;
  }> {
    const vehicles: Vehicle[] = [];

    for (const vehicleId of vehicleIds) {
      const vehicle = await db.getVehicle(vehicleId);
      if (vehicle) {
        vehicles.push(vehicle);
      }
    }

    if (vehicles.length === 0) {
      throw new Error('No valid vehicles found');
    }

    const token = this.generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (options.expiresInDays || 30) * 24 * 60 * 60 * 1000);

    // Store fleet share (simplified - in production would be in database)
    const fleetShare = {
      id: `fleet-${Date.now()}`,
      token,
      vehicles,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      accessCount: 0,
      maxAccessCount: options.maxAccessCount
    };

    this.shares.set(`fleet-${token}`, fleetShare);

    return {
      token,
      vehicles,
      expiresAt: expiresAt.toISOString()
    };
  }

  static async getFleetShare(token: string): Promise<{
    vehicles: Vehicle[];
    expiresAt: string;
  } | null> {
    const share = this.shares.get(`fleet-${token}`);
    if (!share) {
      return null;
    }

    // Check if expired
    if (new Date() > new Date(share.expiresAt)) {
      this.shares.delete(`fleet-${token}`);
      return null;
    }

    // Check access count limit
    if (share.maxAccessCount && share.accessCount >= share.maxAccessCount) {
      return null;
    }

    // Increment access count
    share.accessCount++;
    this.shares.set(`fleet-${token}`, share);

    return {
      vehicles: share.vehicles,
      expiresAt: share.expiresAt
    };
  }
}

