// Simple in-memory cache for development - replace with Redis in production
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

export class CacheService {
  private static cache = new Map<string, CacheEntry>();

  static set(key: string, data: any, ttlMinutes: number = 5): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    };
    this.cache.set(key, entry);
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Cache keys
  static readonly VEHICLES = 'vehicles';
  static readonly DIAGNOSTICS = 'diagnostics';
  static readonly DASHBOARD_METRICS = 'dashboard_metrics';
  static readonly PREDICTIVE_INSIGHTS = 'predictive_insights';

  static getVehicleCacheKey(userId?: string): string {
    return userId ? `${this.VEHICLES}_${userId}` : this.VEHICLES;
  }

  static getDiagnosticsCacheKey(vehicleId?: string): string {
    return vehicleId ? `${this.DIAGNOSTICS}_${vehicleId}` : this.DIAGNOSTICS;
  }

  static getDashboardMetricsCacheKey(userId?: string): string {
    return userId ? `${this.DASHBOARD_METRICS}_${userId}` : this.DASHBOARD_METRICS;
  }

  static getPredictiveInsightsCacheKey(vehicleId: string): string {
    return `${this.PREDICTIVE_INSIGHTS}_${vehicleId}`;
  }
}

// Auto cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    CacheService.cleanup();
  }, 5 * 60 * 1000);
}

