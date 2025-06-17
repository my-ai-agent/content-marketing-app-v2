// config/plans.ts
export interface PlanLimits {
  storiesPerWeek: number;
  imageStorage: number;        // Storage in MB
  qrCodesActive: number;       // How many QR codes can be live
  demographics: number;
  lifestyles: number;
  users: number;
  schedulingFeatures: boolean; // Week/month scheduling capability
  analyticsLevel: string;      // 'basic' | 'advanced' | 'premium'
  photoAttribution: boolean;   // Custom photo credits
  price: number;
  trialDays: number;
}

export interface Plan {
  id: string;
  name: string;
  limits: PlanLimits;
  features: string[];
  popular?: boolean;
  description: string;         // NEW: Short description for marketing
}

export const PLANS: Record<string, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Get consistent with professional tourism content',
    limits: {
      storiesPerWeek: 2,
      imageStorage: 500,           // 500MB storage
      qrCodesActive: 5,
      demographics: 4,             // Reduced from 6 for clear tiering
      lifestyles: 4,               // Reduced from 6 for clear tiering  
      users: 1,
      schedulingFeatures: false,   // Manual posting only
      analyticsLevel: 'basic',     // QR scan counts only
      photoAttribution: true,      // Custom photo credits
      price: 47,
      trialDays: 7
    },
    features: [
      '2 professional stories per week',
      'Unlimited images per story',
      '500MB storage with auto-compression',
      'Photo attribution & location tags',
      'Universal QR distribution to all platforms',
      'Basic QR scan analytics',
      '7-day free trial'
    ]
  },

  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Set your week\'s content on Monday, then focus on your guests',
    limits: {
      storiesPerWeek: 7,           // Daily content = clear value
      imageStorage: 2000,          // 2GB storage
      qrCodesActive: 25,
      demographics: 6,             // All generations
      lifestyles: 6,               // All lifestyles
      users: 3,                    // Small team collaboration
      schedulingFeatures: true,    // Week scheduler - "Set and Smile"
      analyticsLevel: 'advanced',  // Engagement tracking, click-through rates
      photoAttribution: true,
      price: 147,
      trialDays: 7
    },
    features: [
      '7 stories per week (daily professional content)',
      'Unlimited images per story',
      '2GB storage with smart compression',
      'Week scheduler - "Set and Smile"',
      'Advanced QR analytics & engagement tracking',
      'All generational psychology profiles',
      'Small team collaboration (3 users)',
      '7-day free trial'
    ],
    popular: true
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete tourism marketing ecosystem for large operations',
    limits: {
      storiesPerWeek: -1,          // Unlimited stories
      imageStorage: -1,            // Unlimited storage
      qrCodesActive: -1,           // Unlimited active QR codes
      demographics: 6,             // All options
      lifestyles: 6,               // All options
      users: -1,                   // Unlimited team members
      schedulingFeatures: true,    // Month scheduler + bulk operations
      analyticsLevel: 'premium',   // Full dashboard + data exports
      photoAttribution: true,
      price: 547,
      trialDays: 7
    },
    features: [
      'Unlimited stories and content generation',
      'Unlimited images and storage',
      'Month scheduler with bulk operations',
      'Premium analytics dashboard with exports',
      'White-label QR landing pages',
      'Unlimited team collaboration',
      'Priority support with dedicated account manager',
      'API access for custom integrations',
      '7-day free trial'
    ]
  }
};

// Helper functions
export const getPlanLimits = (planId: string): PlanLimits => {
  return PLANS[planId]?.limits || PLANS.starter.limits;
};

export const canExceedLimit = (planId: string, type: keyof PlanLimits, current: number): boolean => {
  const limits = getPlanLimits(planId);
  const limit = limits[type];
  
  // -1 means unlimited
  if (limit === -1) return true;
  
  // For boolean fields, just return the boolean value
  if (typeof limit === 'boolean') return limit;
  
  // For string fields (like analyticsLevel), handle separately
  if (typeof limit === 'string') return true;
  
  // For numeric fields, check if current usage is below limit
  return current < (limit as number);
};

export const getPlanFeatures = (planId: string): string[] => {
  return PLANS[planId]?.features || [];
};

export const isPlanPopular = (planId: string): boolean => {
  return PLANS[planId]?.popular || false;
};

export const getPlanPrice = (planId: string): number => {
  return PLANS[planId]?.limits.price || 0;
};

export const getPlanDescription = (planId: string): string => {
  return PLANS[planId]?.description || '';
};

// New function for QR code management
export const canCreateQRCode = (planId: string, currentActiveQRs: number): boolean => {
  const limits = getPlanLimits(planId);
  return limits.qrCodesActive === -1 || currentActiveQRs < limits.qrCodesActive;
};

// New function for story creation
export const canCreateStory = (planId: string, storiesThisWeek: number): boolean => {
  const limits = getPlanLimits(planId);
  return limits.storiesPerWeek === -1 || storiesThisWeek < limits.storiesPerWeek;
};

// New function for team management
export const canAddUser = (planId: string, currentUsers: number): boolean => {
  const limits = getPlanLimits(planId);
  return limits.users === -1 || currentUsers < limits.users;
};

// Storage management
export const canUploadImage = (planId: string, currentStorageUsed: number, imageSize: number): boolean => {
  const limits = getPlanLimits(planId);
  if (limits.imageStorage === -1) return true; // Unlimited
  
  const totalAfterUpload = currentStorageUsed + imageSize;
  return totalAfterUpload <= limits.imageStorage;
};

// Analytics access
export const getAnalyticsAccess = (planId: string): string => {
  const limits = getPlanLimits(planId);
  return limits.analyticsLevel;
};

// Scheduling features
export const hasSchedulingFeatures = (planId: string): boolean => {
  const limits = getPlanLimits(planId);
  return limits.schedulingFeatures;
};
