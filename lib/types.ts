export interface Vehicle {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  owner?: string;
  mileage?: number;
  lastService?: string;
}

export interface Diagnostic {
  diagnosticId: string;
  vehicleId: string;
  timestamp: string;
  dataType: 'video' | 'audio' | 'text' | 'obd2';
  dataUrl?: string;
  aiAnalysis?: string;
  detectedFaults: string[];
  estimatedCost: number;
  status: 'pending' | 'completed' | 'failed';
  confidence?: number;
  recommendations?: string[];
}

export interface ServiceRecord {
  recordId: string;
  vehicleId: string;
  date: string;
  description: string;
  partsUsed: string[];
  laborCost: number;
  totalCost: number;
  mechanicId: string;
  mechanicName: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'mechanic' | 'engineer' | 'customer';
  subscriptionTier: 'basic' | 'pro';
  avatar?: string;
}

export interface DashboardMetrics {
  totalVehicles: number;
  activeDiagnostics: number;
  completedDiagnostics: number;
  totalRevenue: number;
  avgDiagnosticTime: number;
  customerSatisfaction: number;
}

export interface AIAnalysisResult {
  faults: Array<{
    component: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    estimatedCost: number;
    urgency: number;
  }>;
  recommendations: string[];
  confidence: number;
  estimatedRepairTime: number;
  totalEstimatedCost: number;
}
