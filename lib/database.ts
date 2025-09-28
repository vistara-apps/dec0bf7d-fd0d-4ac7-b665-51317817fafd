import { Vehicle, Diagnostic, ServiceRecord, User, DashboardMetrics } from './types';

// In-memory database for development - replace with real database in production
class Database {
  private vehicles: Map<string, Vehicle> = new Map();
  private diagnostics: Map<string, Diagnostic> = new Map();
  private serviceRecords: Map<string, ServiceRecord> = new Map();
  private users: Map<string, User> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with mock data
    const mockUser = {
      userId: 'user-1',
      name: 'Alex Rodriguez',
      email: 'alex@autodiagnostics.ai',
      role: 'mechanic' as const,
      subscriptionTier: 'pro' as const,
      avatar: '/api/placeholder/40/40'
    };

    const mockVehicles = [
      {
        vehicleId: 'vehicle-1',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        vin: '1HGBH41JXMN109186',
        owner: 'John Smith',
        mileage: 45000,
        lastService: '2024-01-15'
      },
      {
        vehicleId: 'vehicle-2',
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        vin: '2HGFC2F59KH123456',
        owner: 'Sarah Johnson',
        mileage: 52000,
        lastService: '2024-01-10'
      },
      {
        vehicleId: 'vehicle-3',
        make: 'Ford',
        model: 'F-150',
        year: 2021,
        vin: '1FTFW1ET5MKE12345',
        owner: 'Mike Wilson',
        mileage: 38000,
        lastService: '2024-01-20'
      }
    ];

    const mockDiagnostics = [
      {
        diagnosticId: 'diag-1',
        vehicleId: 'vehicle-1',
        timestamp: '2024-01-22T10:30:00Z',
        dataType: 'obd2' as const,
        dataUrl: '/api/diagnostic-data/diag-1.json',
        aiAnalysis: 'Engine misfire detected in cylinder 2. Likely causes: faulty spark plug or ignition coil.',
        detectedFaults: ['Engine Misfire - Cylinder 2', 'O2 Sensor - Bank 1'],
        estimatedCost: 350,
        status: 'completed' as const,
        confidence: 0.92,
        recommendations: ['Replace spark plug in cylinder 2', 'Check ignition coil', 'Inspect O2 sensor']
      },
      {
        diagnosticId: 'diag-2',
        vehicleId: 'vehicle-2',
        timestamp: '2024-01-22T14:15:00Z',
        dataType: 'video' as const,
        dataUrl: '/api/diagnostic-data/diag-2.mp4',
        aiAnalysis: 'Brake pad wear detected from audio analysis. Recommend inspection.',
        detectedFaults: ['Brake Pad Wear - Front'],
        estimatedCost: 280,
        status: 'completed' as const,
        confidence: 0.87,
        recommendations: ['Inspect brake pads', 'Check brake fluid level', 'Test brake performance']
      }
    ];

    const mockServiceRecords = [
      {
        recordId: 'service-1',
        vehicleId: 'vehicle-1',
        date: '2024-01-15',
        description: 'Oil change and filter replacement',
        partsUsed: ['Oil Filter', 'Engine Oil (5qt)'],
        laborCost: 45,
        totalCost: 89,
        mechanicId: 'user-1',
        mechanicName: 'Alex Rodriguez',
        status: 'completed' as const
      },
      {
        recordId: 'service-2',
        vehicleId: 'vehicle-2',
        date: '2024-01-10',
        description: 'Brake inspection and pad replacement',
        partsUsed: ['Brake Pads (Front)', 'Brake Fluid'],
        laborCost: 120,
        totalCost: 285,
        mechanicId: 'user-1',
        mechanicName: 'Alex Rodriguez',
        status: 'completed' as const
      }
    ];

    this.users.set(mockUser.userId, mockUser);
    mockVehicles.forEach(vehicle => this.vehicles.set(vehicle.vehicleId, vehicle));
    mockDiagnostics.forEach(diagnostic => this.diagnostics.set(diagnostic.diagnosticId, diagnostic));
    mockServiceRecords.forEach(record => this.serviceRecords.set(record.recordId, record));
  }

  // Vehicle operations
  async getVehicles(userId?: string): Promise<Vehicle[]> {
    const vehicles = Array.from(this.vehicles.values());
    return userId ? vehicles.filter(v => v.owner === userId) : vehicles;
  }

  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    return this.vehicles.get(vehicleId) || null;
  }

  async createVehicle(vehicle: Omit<Vehicle, 'vehicleId'>): Promise<Vehicle> {
    const vehicleId = `vehicle-${Date.now()}`;
    const newVehicle = { ...vehicle, vehicleId };
    this.vehicles.set(vehicleId, newVehicle);
    return newVehicle;
  }

  async updateVehicle(vehicleId: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) return null;

    const updatedVehicle = { ...vehicle, ...updates };
    this.vehicles.set(vehicleId, updatedVehicle);
    return updatedVehicle;
  }

  async deleteVehicle(vehicleId: string): Promise<boolean> {
    return this.vehicles.delete(vehicleId);
  }

  // Diagnostic operations
  async getDiagnostics(vehicleId?: string): Promise<Diagnostic[]> {
    const diagnostics = Array.from(this.diagnostics.values());
    return vehicleId ? diagnostics.filter(d => d.vehicleId === vehicleId) : diagnostics;
  }

  async getDiagnostic(diagnosticId: string): Promise<Diagnostic | null> {
    return this.diagnostics.get(diagnosticId) || null;
  }

  async createDiagnostic(diagnostic: Omit<Diagnostic, 'diagnosticId'>): Promise<Diagnostic> {
    const diagnosticId = `diag-${Date.now()}`;
    const newDiagnostic = { ...diagnostic, diagnosticId };
    this.diagnostics.set(diagnosticId, newDiagnostic);
    return newDiagnostic;
  }

  async updateDiagnostic(diagnosticId: string, updates: Partial<Diagnostic>): Promise<Diagnostic | null> {
    const diagnostic = this.diagnostics.get(diagnosticId);
    if (!diagnostic) return null;

    const updatedDiagnostic = { ...diagnostic, ...updates };
    this.diagnostics.set(diagnosticId, updatedDiagnostic);
    return updatedDiagnostic;
  }

  // Service record operations
  async getServiceRecords(vehicleId?: string): Promise<ServiceRecord[]> {
    const records = Array.from(this.serviceRecords.values());
    return vehicleId ? records.filter(r => r.vehicleId === vehicleId) : records;
  }

  async getServiceRecord(recordId: string): Promise<ServiceRecord | null> {
    return this.serviceRecords.get(recordId) || null;
  }

  async createServiceRecord(record: Omit<ServiceRecord, 'recordId'>): Promise<ServiceRecord> {
    const recordId = `service-${Date.now()}`;
    const newRecord = { ...record, recordId };
    this.serviceRecords.set(recordId, newRecord);
    return newRecord;
  }

  async updateServiceRecord(recordId: string, updates: Partial<ServiceRecord>): Promise<ServiceRecord | null> {
    const record = this.serviceRecords.get(recordId);
    if (!record) return null;

    const updatedRecord = { ...record, ...updates };
    this.serviceRecords.set(recordId, updatedRecord);
    return updatedRecord;
  }

  // User operations
  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Analytics
  async getDashboardMetrics(userId?: string): Promise<DashboardMetrics> {
    const vehicles = await this.getVehicles(userId);
    const diagnostics = await this.getDiagnostics();
    const serviceRecords = await this.getServiceRecords();

    const totalRevenue = serviceRecords.reduce((sum, record) => sum + record.totalCost, 0);
    const activeDiagnostics = diagnostics.filter(d => d.status === 'pending').length;
    const completedDiagnostics = diagnostics.filter(d => d.status === 'completed').length;

    // Calculate average diagnostic time (mock calculation)
    const avgDiagnosticTime = 18; // minutes

    // Mock customer satisfaction
    const customerSatisfaction = 4.8;

    return {
      totalVehicles: vehicles.length,
      activeDiagnostics,
      completedDiagnostics,
      totalRevenue,
      avgDiagnosticTime,
      customerSatisfaction
    };
  }
}

export const db = new Database();

