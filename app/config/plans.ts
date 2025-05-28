// config/plans.ts
export interface PlanLimits {
  storiesPerWeek: number;
  platforms: number;
  demographics: number;
  lifestyles: number;
  users: number;
  price: number;
}

export interface Plan {
  id: string;
  name: string;
  limits: PlanLimits;
  features: string[];
  popular?: boolean;
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    limits: {
      storiesPerWeek: 1,
      platforms: 2,
      demographics: 3,
      lifestyles: 3,
      users: 2,
      price: 0
    },
    features: ['Basic story generation', 'Limited platforms', 'Community support']
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    limits: {
      storiesPerWeek: 5,
      platforms: 3,
      demographics: 3,
      lifestyles: 3,
      users: 2,
      price: 97
    },
    features: ['Enhanced story generation', 'More platforms', 'Email support']
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    limits: {
      storiesPerWeek: 5,
      platforms: 5,
      demographics: 3,
      lifestyles: 3,
      users: 2,
      price: 197
    },
    features: ['Advanced features', 'All platforms', 'Priority support'],
    popular: true
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    limits: {
      storiesPerWeek: -1, // unlimited
      platforms: 10,
      demographics: 6,
      lifestyles: 6,
      users: 5,
      price: 497
    },
    features: ['Unlimited stories', 'Custom integrations', 'Dedicated support']
  }
};

export const getPlanLimits = (planId: string): PlanLimits => {
  return PLANS[planId]?.limits || PLANS.free.limits;
};

export const canExceedLimit = (planId: string, type: keyof PlanLimits, current: number): boolean => {
  const limits = getPlanLimits(planId);
  const limit = limits[type];
  return limit === -1 || current < limit;
};
