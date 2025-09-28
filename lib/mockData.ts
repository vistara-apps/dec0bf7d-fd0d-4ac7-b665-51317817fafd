import { Vehicle, Diagnostic, ServiceRecord, DashboardMetrics, User } from './types';

export const mockUser: User = {
  userId: 'user-1',
  name: 'Alex Rodriguez',
  email: 'alex@autodiagnostics.ai',
  role: 'mechanic',
  subscriptionTier: 'pro',
  avatar: '/api/placeholder/40/40'
};

export const mockVehicles: Vehicle[] = [
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

export const mockDiagnostics: Diagnostic[] = [
  {
    diagnosticId: 'diag-1',
    vehicleId: 'vehicle-1',
    timestamp: '2024-01-22T10:30:00Z',
    dataType: 'obd2',
    dataUrl: '/api/diagnostic-data/diag-1.json',
    aiAnalysis: 'Engine misfire detected in cylinder 2. Likely causes: faulty spark plug or ignition coil.',
    detectedFaults: ['Engine Misfire - Cylinder 2', 'O2 Sensor - Bank 1'],
    estimatedCost: 350,
    status: 'completed',
    confidence: 0.92,
    recommendations: ['Replace spark plug in cylinder 2', 'Check ignition coil', 'Inspect O2 sensor']
  },
  {
    diagnosticId: 'diag-2',
    vehicleId: 'vehicle-2',
    timestamp: '2024-01-22T14:15:00Z',
    dataType: 'video',
    dataUrl: '/api/diagnostic-data/diag-2.mp4',
    aiAnalysis: 'Brake pad wear detected from audio analysis. Recommend inspection.',
    detectedFaults: ['Brake Pad Wear - Front'],
    estimatedCost: 280,
    status: 'completed',
    confidence: 0.87,
    recommendations: ['Inspect brake pads', 'Check brake fluid level', 'Test brake performance']
  },
  {
    diagnosticId: 'diag-3',
    vehicleId: 'vehicle-3',
    timestamp: '2024-01-22T16:45:00Z',
    dataType: 'audio',
    dataUrl: '/api/diagnostic-data/diag-3.wav',
    aiAnalysis: 'Processing audio data for engine analysis...',
    detectedFaults: [],
    estimatedCost: 0,
    status: 'pending',
    confidence: 0,
    recommendations: []
  }
];

export const mockServiceRecords: ServiceRecord[] = [
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
    status: 'completed'
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
    status: 'completed'
  }
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalVehicles: 25,
  activeDiagnostics: 3,
  completedDiagnostics: 1788,
  totalRevenue: 47500,
  avgDiagnosticTime: 18, // minutes
  customerSatisfaction: 4.8
};
