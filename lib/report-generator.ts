import { Diagnostic, ServiceRecord, Vehicle } from './types';
import { db } from './database';

export interface RepairReport {
  id: string;
  vehicle: Vehicle;
  diagnostic: Diagnostic;
  serviceRecords: ServiceRecord[];
  totalEstimatedCost: number;
  estimatedRepairTime: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  generatedAt: string;
  validUntil: string;
}

export interface CostBreakdown {
  parts: Array<{
    name: string;
    cost: number;
    quantity: number;
  }>;
  labor: {
    hours: number;
    ratePerHour: number;
    total: number;
  };
  taxes: number;
  total: number;
}

export class ReportGenerator {
  static async generateRepairReport(
    diagnosticId: string,
    includeServiceHistory: boolean = true
  ): Promise<RepairReport> {
    const diagnostic = await db.getDiagnostic(diagnosticId);
    if (!diagnostic) {
      throw new Error('Diagnostic not found');
    }

    const vehicle = await db.getVehicle(diagnostic.vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const serviceRecords = includeServiceHistory
      ? await db.getServiceRecords(vehicle.vehicleId)
      : [];

    const costBreakdown = this.calculateCostBreakdown(diagnostic);
    const priority = this.determinePriority(diagnostic);

    const report: RepairReport = {
      id: `report-${diagnosticId}`,
      vehicle,
      diagnostic,
      serviceRecords: serviceRecords.slice(-5), // Last 5 service records
      totalEstimatedCost: costBreakdown.total,
      estimatedRepairTime: this.estimateRepairTime(diagnostic),
      priority,
      recommendations: diagnostic.recommendations || [],
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    return report;
  }

  private static calculateCostBreakdown(diagnostic: Diagnostic): CostBreakdown {
    const parts: Array<{ name: string; cost: number; quantity: number }> = [];

    // Parse detected faults to estimate parts
    diagnostic.detectedFaults.forEach(fault => {
      const partEstimate = this.estimatePartCost(fault);
      if (partEstimate) {
        parts.push(partEstimate);
      }
    });

    const partsTotal = parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0);

    // Estimate labor (assume 1-3 hours per major fault)
    const laborHours = Math.max(1, Math.min(3, diagnostic.detectedFaults.length));
    const laborRate = 85; // $85/hour average
    const laborTotal = laborHours * laborRate;

    const subtotal = partsTotal + laborTotal;
    const taxes = subtotal * 0.08; // 8% tax

    return {
      parts,
      labor: {
        hours: laborHours,
        ratePerHour: laborRate,
        total: laborTotal
      },
      taxes,
      total: subtotal + taxes
    };
  }

  private static estimatePartCost(faultDescription: string): { name: string; cost: number; quantity: number } | null {
    const partCosts: Record<string, { name: string; cost: number }> = {
      'brake': { name: 'Brake Pads', cost: 120 },
      'rotor': { name: 'Brake Rotors', cost: 180 },
      'spark plug': { name: 'Spark Plugs', cost: 40 },
      'battery': { name: 'Car Battery', cost: 150 },
      'oil filter': { name: 'Oil Filter', cost: 15 },
      'air filter': { name: 'Air Filter', cost: 25 },
      'tire': { name: 'Tire', cost: 150 },
      'transmission': { name: 'Transmission Fluid', cost: 45 },
      'coolant': { name: 'Coolant', cost: 30 },
      'timing belt': { name: 'Timing Belt Kit', cost: 350 },
      'suspension': { name: 'Suspension Component', cost: 200 },
      'exhaust': { name: 'Exhaust Component', cost: 175 },
      'fuel': { name: 'Fuel System Part', cost: 125 },
      'electrical': { name: 'Electrical Component', cost: 150 }
    };

    const lowerFault = faultDescription.toLowerCase();
    for (const [key, part] of Object.entries(partCosts)) {
      if (lowerFault.includes(key)) {
        return {
          name: part.name,
          cost: part.cost,
          quantity: 1
        };
      }
    }

    return null;
  }

  private static estimateRepairTime(diagnostic: Diagnostic): number {
    // Base time per fault type
    const timeEstimates: Record<string, number> = {
      'brake': 2,
      'battery': 0.5,
      'oil': 0.5,
      'filter': 0.25,
      'spark': 1,
      'transmission': 1.5,
      'coolant': 1,
      'timing': 4,
      'suspension': 3,
      'exhaust': 2.5,
      'fuel': 2,
      'electrical': 1.5
    };

    let totalHours = 0;
    diagnostic.detectedFaults.forEach(fault => {
      const lowerFault = fault.toLowerCase();
      for (const [key, hours] of Object.entries(timeEstimates)) {
        if (lowerFault.includes(key)) {
          totalHours += hours;
          break;
        }
      }
    });

    return Math.max(0.5, Math.min(8, totalHours)); // Between 0.5 and 8 hours
  }

  private static determinePriority(diagnostic: Diagnostic): 'low' | 'medium' | 'high' | 'critical' {
    const criticalKeywords = ['brake', 'steering', 'engine failure', 'transmission', 'safety'];
    const highKeywords = ['electrical', 'cooling', 'fuel system'];
    const mediumKeywords = ['performance', 'noise', 'vibration'];

    const allFaults = diagnostic.detectedFaults.join(' ').toLowerCase();

    if (criticalKeywords.some(keyword => allFaults.includes(keyword))) {
      return 'critical';
    }
    if (highKeywords.some(keyword => allFaults.includes(keyword))) {
      return 'high';
    }
    if (mediumKeywords.some(keyword => allFaults.includes(keyword))) {
      return 'medium';
    }

    return 'low';
  }

  static async generatePDFReport(report: RepairReport): Promise<Buffer> {
    // In a real implementation, this would use a PDF library like pdfkit or puppeteer
    // For now, return a mock PDF buffer
    const pdfContent = `
REPAIR ESTIMATE REPORT
======================

Vehicle: ${report.vehicle.year} ${report.vehicle.make} ${report.vehicle.model}
VIN: ${report.vehicle.vin}

Diagnostic Summary:
${report.diagnostic.aiAnalysis}

Detected Faults:
${report.diagnostic.detectedFaults.map(fault => `- ${fault}`).join('\n')}

Estimated Cost: $${report.totalEstimatedCost.toFixed(2)}
Estimated Time: ${report.estimatedRepairTime} hours
Priority: ${report.priority.toUpperCase()}

Recommendations:
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

Generated: ${new Date(report.generatedAt).toLocaleDateString()}
Valid Until: ${new Date(report.validUntil).toLocaleDateString()}
    `;

    return Buffer.from(pdfContent);
  }

  static async generateServiceHistoryReport(vehicleId: string): Promise<{
    vehicle: Vehicle;
    serviceRecords: ServiceRecord[];
    totalSpent: number;
    averageServiceInterval: number;
    upcomingServices: string[];
  }> {
    const vehicle = await db.getVehicle(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const serviceRecords = await db.getServiceRecords(vehicleId);
    const totalSpent = serviceRecords.reduce((sum, record) => sum + record.totalCost, 0);

    // Calculate average service interval
    const sortedRecords = serviceRecords
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let totalInterval = 0;
    let intervalCount = 0;

    for (let i = 1; i < sortedRecords.length; i++) {
      const interval = new Date(sortedRecords[i].date).getTime() - new Date(sortedRecords[i-1].date).getTime();
      totalInterval += interval;
      intervalCount++;
    }

    const averageServiceInterval = intervalCount > 0
      ? totalInterval / intervalCount / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    // Generate upcoming services (simplified)
    const upcomingServices = [
      'Oil change due in 2 weeks',
      'Tire rotation due in 1 month',
      'Brake inspection due in 2 months'
    ];

    return {
      vehicle,
      serviceRecords,
      totalSpent,
      averageServiceInterval: Math.round(averageServiceInterval),
      upcomingServices
    };
  }
}

