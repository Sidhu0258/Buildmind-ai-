export type QualityLevel = 'Budget' | 'Standard' | 'Premium';

export type BudgetFlexibility = 'Strict' | 'Slightly Flexible' | 'Flexible for Quality';

export type FinancingPreference = 'Self-funded' | 'Bank Loan' | 'Milestone-based' | 'Tranche Drawdown';

export type BudgetHealthStatus = 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'OVER_BUDGET';

export type CostItemStatus = 'estimated' | 'quoted' | 'committed' | 'spent';

export type CategoryKey = 
  | 'materials'
  | 'labour'
  | 'electrical'
  | 'plumbing'
  | 'painting'
  | 'doors_windows'
  | 'finishing'
  | 'professional_services'
  | 'transportation'
  | 'contingency';

export interface CategoryAllocation {
  id: CategoryKey;
  name: string;
  icon: string;
  allocatedAmount: number;
  spentAmount: number;
  committedAmount: number;
  quotedAmount: number;
  estimatedAmount: number;
  notes?: string;
  isLocked?: boolean;
}

export interface FinancialTransaction {
  id: string;
  projectId: string;
  category: CategoryKey;
  description: string;
  amount: number;
  currency?: string;
  date?: string;
  status?: CostItemStatus;
  type?: 'EXPENSE' | 'COMMITMENT' | 'QUOTE';
  source?: 'purchase' | 'contract' | 'quotation' | 'direct_expense' | 'refund';
  supplierOrProvider: string;
  notes?: string;
  invoiceUrl?: string;
  invoiceNumber?: string;
  quotationRef?: string;
}

export interface AuditLogEntry {
  id: string;
  projectId: string;
  timestamp: string;
  type: string;
  action?: string;
  description: string;
  details?: string;
  previousValue?: string | number;
  newValue?: string | number;
  amountChanged?: number;
  newBudgetTotal?: number;
  reason?: string;
  user: string;
  changedBy?: string;
}

export interface GuardianAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  category: CategoryKey;
  title: string;
  message: string;
  varianceAmount: number;
  suggestedAction: string;
  alternatives?: {
    name: string;
    type: string;
    estimatedCost: number;
    savings: number;
    rating: number;
    contact?: string;
  }[];
  timestamp: string;
  status: 'active' | 'dismissed' | 'resolved';
}

export interface OptimizationOpportunity {
  id: string;
  category: CategoryKey;
  title: string;
  type: 'alternative_brand' | 'alternative_supplier' | 'bulk_purchase' | 'waste_reduction' | 'negotiation' | 'schedule_optimization';
  currentCost: number;
  alternativeCost: number;
  potentialSavings: number;
  tradeOff: string;
  isSafeStructural: boolean; // Must be true!
  actionableStep: string;
  providerAlternative: string;
}

export interface RecommendationTierItem {
  id: string;
  name: string;
  brandOrProvider: string;
  tier: 'BUDGET' | 'BALANCED' | 'PREMIUM';
  category: CategoryKey;
  unitPrice: number;
  unit: string;
  estimatedQuantity: number;
  estimatedTotal: number;
  budgetImpact: number; // vs allocated remaining
  fitsBudget: boolean;
  qualityLevel: QualityLevel;
  advantages: string[];
  disadvantages: string[];
  safetyCertified: boolean;
  specs: string;
}

export interface ProfessionalServiceItem {
  id: string;
  name: string;
  role: 'Architect' | 'Structural Engineer' | 'General Contractor' | 'Electrician' | 'Plumber' | 'Painter' | 'Carpenter' | 'Masonry Worker';
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  quotedRate: number;
  rateUnit: string;
  estimatedTotal: number;
  budgetFit: 'WITHIN_BUDGET' | 'NEAR_BUDGET' | 'ABOVE_BUDGET';
  availability: string;
  location: string;
  verified: boolean;
  skills: string[];
}

export interface PropertyListingItem {
  id: string;
  title: string;
  location: string;
  type: 'Plot' | 'Villa' | 'Apartment' | 'Independent House';
  builtUpAreaSqFt: number;
  plotSizeSqFt?: number;
  listPrice: number;
  estimatedAcquisitionCosts: {
    stampDuty: number; // e.g. 5-6%
    registrationFee: number; // e.g. 1%
    legalVerification: number;
    brokerageOrPortal: number;
    totalAcquisitionCost: number;
  };
  totalProjectedOutlay: number;
  isStretchOption: boolean;
  fitsBudget: boolean;
  highlights: string[];
  imageUrl: string;
}

export interface ProjectContext {
  id: string;
  name: string;
  location: string;
  projectType: 'G+1 Independent Villa' | '3BHK Duplex' | '2BHK Apartment Renovation' | 'Commercial Office' | 'Custom Bungalow';
  builtUpAreaSqFt: number;
  plotAreaSqFt: number;
  floors: number;
  bedrooms: number;
  currentPhase: 'Planning & Approval' | 'Substructure & Foundation' | 'RCC Framing' | 'Brickwork & Plastering' | 'Finishing & Services' | 'Handover';
  
  // Budget Context fields
  totalBudget: number;
  preferredSpendingLimit: number;
  maxAcceptableBudget: number;
  contingencyReserve: number;
  
  qualityPreference: QualityLevel;
  budgetFlexibility: BudgetFlexibility;
  financingPreference: FinancingPreference;
  alreadySpentAtStart: number;
  
  categories: Record<CategoryKey, CategoryAllocation>;
  transactions: FinancialTransaction[];
  auditTrail: AuditLogEntry[];
  activeAlerts: GuardianAlert[];
}

export interface BudgetCalculations {
  totalBudget: number;
  estimatedCost: number;
  quotedCost: number;
  committedCost: number;
  amountSpent: number;
  remainingBudget: number;
  contingencyRemaining: number;
  projectedFinalCost: number;
  varianceToBudget: number; // projected - totalBudget
  healthStatus: BudgetHealthStatus;
  healthReason: string;
  costDrivers: {
    category: CategoryKey;
    categoryName: string;
    allocated: number;
    projected: number;
    overrunAmount: number;
    percentageOfOverrun: number;
  }[];
}

export interface AffordabilityAnswer {
  verdict: 'YES' | 'POSSIBLY' | 'NO';
  headline: string;
  summary: string;
  shortfallAmount?: number;
  majorCostDrivers: string[];
  costDrivers?: string[];
  recommendedAdjustments: string[];
  potentialCompromises?: string[];
  potentialSavingsEstimate: number;
  qualityTradeOffs: string[];
  saferAlternatives: string[];
  estimatedMinCost?: number;
  estimatedMaxCost?: number;
}
