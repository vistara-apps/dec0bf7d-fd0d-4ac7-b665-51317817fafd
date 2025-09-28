import { AIService } from './ai-service';
import { db } from './database';
import { ServiceRecord, Vehicle } from './types';

export interface PredictiveInsight {
  component: string;
  predictedFailureDate: string;
  confidence: number;
  recommendedAction: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
}

export interface VehicleHealthReport {
  overallHealthScore: number;
  predictions: PredictiveInsight[];
  maintenanceSchedule: Array<{
    component: string;
    dueDate: string;
    type: 'preventive' | 'predictive';
  }>;
  riskFactors: string[];
}

export class PredictiveAnalyticsService {
  static async generateVehicleHealthReport(vehicleId: string): Promise<VehicleHealthReport> {
    try {
      const vehicle = await db.getVehicle(vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      const serviceHistory = await db.getServiceRecords(vehicleId);
      const currentMileage = vehicle.mileage || 0;

      // Get AI predictions
      const aiPredictions = await AIService.generatePredictiveInsights(
        serviceHistory,
        currentMileage
      );

      // Enhance predictions with additional logic
      const enhancedPredictions = await this.enhancePredictions(
        aiPredictions.predictions,
        serviceHistory,
        vehicle
      );

      // Generate maintenance schedule
      const maintenanceSchedule = this.generateMaintenanceSchedule(
        vehicle,
        serviceHistory
      );

      // Calculate risk factors
      const riskFactors = this.calculateRiskFactors(
        enhancedPredictions,
        vehicle,
        serviceHistory
      );

      return {
        overallHealthScore: aiPredictions.overallHealthScore,
        predictions: enhancedPredictions,
        maintenanceSchedule,
        riskFactors
      };
    } catch (error) {
      console.error('Error generating health report:', error);
      return {
        overallHealthScore: 50,
        predictions: [],
        maintenanceSchedule: [],
        riskFactors: ['Unable to generate health report']
      };
    }
  }

  private static async enhancePredictions(
    aiPredictions: any[],
    serviceHistory: ServiceRecord[],
    vehicle: Vehicle
  ): Promise<PredictiveInsight[]> {
    return aiPredictions.map(prediction => {
      // Calculate urgency based on confidence and time to failure
      const daysToFailure = Math.max(1, Math.ceil(
        (new Date(prediction.predictedFailureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ));

      let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (prediction.confidence > 0.8 && daysToFailure < 30) {
        urgency = 'critical';
      } else if (prediction.confidence > 0.6 && daysToFailure < 90) {
        urgency = 'high';
      } else if (prediction.confidence > 0.4 && daysToFailure < 180) {
        urgency = 'medium';
      }

      // Estimate cost based on component type
      const estimatedCost = this.estimateRepairCost(prediction.component);

      return {
        ...prediction,
        urgency,
        estimatedCost
      };
    });
  }

  private static estimateRepairCost(component: string): number {
    const costMap: Record<string, number> = {
      'Brake Pads': 150,
      'Brake Rotors': 300,
      'Oil Filter': 25,
      'Air Filter': 30,
      'Spark Plugs': 120,
      'Battery': 200,
      'Tires': 600,
      'Transmission Fluid': 80,
      'Coolant': 60,
      'Timing Belt': 500,
      'Suspension': 400,
      'Exhaust System': 350,
      'Fuel System': 250,
      'Electrical System': 300
    };

    // Find closest match
    for (const [key, cost] of Object.entries(costMap)) {
      if (component.toLowerCase().includes(key.toLowerCase())) {
        return cost;
      }
    }

    return 150; // Default estimate
  }

  private static generateMaintenanceSchedule(
    vehicle: Vehicle,
    serviceHistory: ServiceRecord[]
  ): Array<{
    component: string;
    dueDate: string;
    type: 'preventive' | 'predictive';
  }> {
    const schedule = [];
    const currentMileage = vehicle.mileage || 0;
    const currentDate = new Date();

    // Standard maintenance intervals
    const maintenanceItems = [
      { component: 'Oil Change', interval: 5000, type: 'preventive' as const },
      { component: 'Tire Rotation', interval: 8000, type: 'preventive' as const },
      { component: 'Brake Inspection', interval: 12000, type: 'preventive' as const },
      { component: 'Air Filter', interval: 15000, type: 'preventive' as const },
      { component: 'Transmission Service', interval: 30000, type: 'preventive' as const },
      { component: 'Coolant Flush', interval: 30000, type: 'preventive' as const },
      { component: 'Timing Belt', interval: 60000, type: 'preventive' as const },
    ];

    for (const item of maintenanceItems) {
      // Find last service of this type
      const lastService = serviceHistory
        .filter(record => record.description.toLowerCase().includes(item.component.toLowerCase()))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      let dueMileage = currentMileage + item.interval;
      if (lastService) {
        // Estimate mileage at last service (rough calculation)
        const monthsSinceService = (currentDate.getTime() - new Date(lastService.date).getTime()) / (1000 * 60 * 60 * 24 * 30);
        const estimatedMileageAtService = Math.max(0, currentMileage - (monthsSinceService * 1000)); // Rough 1000 miles/month
        dueMileage = estimatedMileageAtService + item.interval;
      }

      // Estimate due date (rough calculation: 12 miles per day average)
      const milesUntilDue = dueMileage - currentMileage;
      const daysUntilDue = milesUntilDue / 12;
      const dueDate = new Date(currentDate.getTime() + (daysUntilDue * 24 * 60 * 60 * 1000));

      schedule.push({
        component: item.component,
        dueDate: dueDate.toISOString().split('T')[0],
        type: item.type
      });
    }

    return schedule;
  }

  private static calculateRiskFactors(
    predictions: PredictiveInsight[],
    vehicle: Vehicle,
    serviceHistory: ServiceRecord[]
  ): string[] {
    const riskFactors = [];
    const currentDate = new Date();
    const vehicleAge = currentDate.getFullYear() - vehicle.year;

    // Age-related risks
    if (vehicleAge > 10) {
      riskFactors.push('Vehicle is over 10 years old - increased failure risk');
    }

    // High mileage risks
    if (vehicle.mileage && vehicle.mileage > 150000) {
      riskFactors.push('High mileage vehicle - monitor critical components');
    }

    // Recent service gaps
    const lastServiceDate = serviceHistory.length > 0
      ? new Date(Math.max(...serviceHistory.map(r => new Date(r.date).getTime())))
      : null;

    if (lastServiceDate) {
      const daysSinceLastService = (currentDate.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastService > 180) { // 6 months
        riskFactors.push('Extended period since last service');
      }
    }

    // Critical predictions
    const criticalPredictions = predictions.filter(p => p.urgency === 'critical');
    if (criticalPredictions.length > 0) {
      riskFactors.push(`${criticalPredictions.length} critical component(s) need immediate attention`);
    }

    // Service history gaps
    const lastOilChange = serviceHistory.find(r =>
      r.description.toLowerCase().includes('oil')
    );
    if (lastOilChange) {
      const daysSinceOilChange = (currentDate.getTime() - new Date(lastOilChange.date).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceOilChange > 120) { // 4 months
        riskFactors.push('Overdue oil change');
      }
    }

    return riskFactors;
  }
}

