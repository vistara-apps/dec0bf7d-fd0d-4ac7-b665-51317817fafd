export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    diagnosticsPerMonth: number;
    vehicles: number;
    reports: number;
    storageGB: number;
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 20,
    interval: 'month',
    features: [
      'AI Fault Detection',
      'Basic Reporting',
      'Email Support',
      '5GB Storage'
    ],
    limits: {
      diagnosticsPerMonth: 50,
      vehicles: 10,
      reports: 25,
      storageGB: 5
    }
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 50,
    interval: 'month',
    features: [
      'Everything in Basic',
      'Predictive Maintenance',
      'Advanced AI Features',
      'Fleet Management',
      'Priority Support',
      '25GB Storage',
      'Custom Reports'
    ],
    limits: {
      diagnosticsPerMonth: 500,
      vehicles: 100,
      reports: 250,
      storageGB: 25
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 150,
    interval: 'month',
    features: [
      'Everything in Professional',
      'Unlimited Diagnostics',
      'API Access',
      'White-label Solution',
      'Dedicated Support',
      'Unlimited Storage',
      'Custom Integrations'
    ],
    limits: {
      diagnosticsPerMonth: -1, // unlimited
      vehicles: -1, // unlimited
      reports: -1, // unlimited
      storageGB: -1 // unlimited
    }
  }
];

export class SubscriptionService {
  static getPlan(planId: string): SubscriptionPlan | null {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || null;
  }

  static getAllPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  }

  static calculateUsageLimits(userPlan: string, currentUsage: {
    diagnosticsThisMonth: number;
    totalVehicles: number;
    reportsThisMonth: number;
    storageUsedGB: number;
  }): {
    canCreateDiagnostic: boolean;
    canAddVehicle: boolean;
    canGenerateReport: boolean;
    canUploadFile: boolean;
    limits: SubscriptionPlan['limits'];
  } {
    const plan = this.getPlan(userPlan);
    if (!plan) {
      return {
        canCreateDiagnostic: false,
        canAddVehicle: false,
        canGenerateReport: false,
        canUploadFile: false,
        limits: { diagnosticsPerMonth: 0, vehicles: 0, reports: 0, storageGB: 0 }
      };
    }

    const limits = plan.limits;

    return {
      canCreateDiagnostic: limits.diagnosticsPerMonth === -1 || currentUsage.diagnosticsThisMonth < limits.diagnosticsPerMonth,
      canAddVehicle: limits.vehicles === -1 || currentUsage.totalVehicles < limits.vehicles,
      canGenerateReport: limits.reports === -1 || currentUsage.reportsThisMonth < limits.reports,
      canUploadFile: limits.storageGB === -1 || currentUsage.storageUsedGB < limits.storageGB,
      limits
    };
  }

  static getUpgradeOptions(currentPlan: string): SubscriptionPlan[] {
    const currentIndex = SUBSCRIPTION_PLANS.findIndex(plan => plan.id === currentPlan);
    if (currentIndex === -1) return SUBSCRIPTION_PLANS;

    return SUBSCRIPTION_PLANS.slice(currentIndex + 1);
  }

  static calculateSavings(yearly: boolean = false): { monthly: number; yearly: number } {
    const proPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'pro')!;
    const monthlyPrice = proPlan.price;
    const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount for yearly

    if (yearly) {
      const monthlySavings = monthlyPrice - (yearlyPrice / 12);
      return {
        monthly: Math.round(monthlySavings),
        yearly: Math.round(yearlyPrice)
      };
    }

    return {
      monthly: monthlyPrice,
      yearly: yearlyPrice
    };
  }

  static async createCheckoutSession(planId: string, userId: string): Promise<string> {
    // In production, integrate with Stripe, PayPal, or other payment processor
    // For demo, return mock checkout URL
    const plan = this.getPlan(planId);
    if (!plan) {
      throw new Error('Invalid plan');
    }

    // Mock checkout URL
    return `/checkout/${planId}?user=${userId}&price=${plan.price}`;
  }

  static async cancelSubscription(userId: string): Promise<boolean> {
    // In production, cancel with payment processor
    // For demo, just return success
    console.log(`Cancelled subscription for user ${userId}`);
    return true;
  }

  static async updateSubscription(userId: string, newPlanId: string): Promise<boolean> {
    // In production, update with payment processor
    // For demo, just return success
    console.log(`Updated subscription for user ${userId} to ${newPlanId}`);
    return true;
  }

  static getBillingHistory(userId: string): Array<{
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
  }> {
    // Mock billing history
    return [
      {
        id: 'inv-001',
        date: '2024-01-01',
        amount: 50,
        status: 'paid',
        description: 'Professional Plan - January 2024'
      },
      {
        id: 'inv-002',
        date: '2023-12-01',
        amount: 50,
        status: 'paid',
        description: 'Professional Plan - December 2023'
      }
    ];
  }
}

