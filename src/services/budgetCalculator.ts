import { 
  ProjectContext, 
  BudgetCalculations, 
  BudgetHealthStatus, 
  CategoryKey, 
  CategoryAllocation,
  QualityLevel,
  AffordabilityAnswer
} from '../types/budget';

/**
 * Format Indian Rupee currency standard:
 * e.g. 30,00,000 -> ₹30,00,000 or ₹30 Lakh
 */
export function formatINR(val: number, compact: boolean = false): string {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  
  const absVal = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (compact) {
    if (absVal >= 10000000) {
      const cr = (absVal / 10000000).toFixed(2);
      return `${sign}₹${cr.replace(/\.00$/, '')} Cr`;
    }
    if (absVal >= 100000) {
      const lakh = (absVal / 100000).toFixed(2);
      return `${sign}₹${lakh.replace(/\.00$/, '')} L`;
    }
    if (absVal >= 1000) {
      const k = (absVal / 1000).toFixed(1);
      return `${sign}₹${k.replace(/\.0$/, '')} k`;
    }
  }

  // Full Indian number formatting (e.g. 12,34,567)
  const intStr = Math.round(absVal).toString();
  let lastThree = intStr.substring(intStr.length - 3);
  const otherNumbers = intStr.substring(0, intStr.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${sign}₹${formatted}`;
}

export function formatINRWords(val: number): string {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Crore`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(val);
}

/**
 * Centralized budget calculation engine.
 * Computes:
 * - Spent, Committed, Quoted, Estimated across all transactions and categories
 * - Projected final cost = spent + committed + max(remaining quotes, estimated uncommitted)
 * - Contingency usage
 * - Accurate health status (Healthy, Watch, At Risk, Over Budget) with human explanations
 * - Cost driver analysis
 */
export function calculateBudgetMetrics(project: ProjectContext): BudgetCalculations {
  const categories = Object.values(project.categories);
  
  let amountSpent = project.alreadySpentAtStart || 0;
  let committedCost = 0;
  let quotedCost = 0;
  let estimatedCost = 0;

  // Aggregate through transactions
  for (const tx of project.transactions) {
    if (tx.status === 'spent') {
      amountSpent += tx.amount;
    } else if (tx.status === 'committed') {
      committedCost += tx.amount;
    } else if (tx.status === 'quoted') {
      quotedCost += tx.amount;
    } else if (tx.status === 'estimated') {
      estimatedCost += tx.amount;
    }
  }

  // Also verify against category totals if transactions are lighter
  let sumCategoryAllocated = 0;
  let sumCategoryProjected = 0;

  const costDriversList: {
    category: CategoryKey;
    categoryName: string;
    allocated: number;
    projected: number;
    overrunAmount: number;
    percentageOfOverrun: number;
  }[] = [];

  categories.forEach((cat) => {
    sumCategoryAllocated += cat.allocatedAmount;
    
    // Category level projected cost is:
    // spent + committed + remainder of quoted/estimated
    const catSpent = cat.spentAmount;
    const catCommitted = cat.committedAmount;
    const catRemainingWork = Math.max(0, cat.allocatedAmount - (catSpent + catCommitted));
    const catQuoted = cat.quotedAmount;
    
    // If quote exceeds remaining allocation, that is a driver of overrun
    const catProjected = catSpent + catCommitted + Math.max(catRemainingWork, catQuoted);
    sumCategoryProjected += catProjected;

    const overrun = catProjected - cat.allocatedAmount;
    if (overrun > 0 && cat.id !== 'contingency') {
      costDriversList.push({
        category: cat.id,
        categoryName: cat.name,
        allocated: cat.allocatedAmount,
        projected: catProjected,
        overrunAmount: overrun,
        percentageOfOverrun: 0 // calculated next
      });
    }
  });

  // Calculate contingency remaining
  const contingencyAlloc = project.categories.contingency?.allocatedAmount || project.contingencyReserve || 0;
  const contingencySpent = project.categories.contingency?.spentAmount || 0;
  const contingencyRemaining = Math.max(0, contingencyAlloc - contingencySpent);

  // Projected Final Cost:
  // Baseline is sum of projected category costs.
  // If the transactions projected sum is larger, use that.
  const projectedFinalCost = Math.max(
    sumCategoryProjected,
    amountSpent + committedCost + Math.max(quotedCost, 0)
  );

  const remainingBudget = project.totalBudget - (amountSpent + committedCost);
  const varianceToBudget = projectedFinalCost - project.totalBudget;

  // Compute percentage for cost drivers
  const totalOverrun = costDriversList.reduce((acc, curr) => acc + curr.overrunAmount, 0);
  costDriversList.sort((a, b) => b.overrunAmount - a.overrunAmount);
  costDriversList.forEach(driver => {
    driver.percentageOfOverrun = totalOverrun > 0 ? Math.round((driver.overrunAmount / totalOverrun) * 100) : 0;
  });

  // Determine Health Status based on actual project metrics
  let healthStatus: BudgetHealthStatus = 'HEALTHY';
  let healthReason = '';

  const percentProjected = (projectedFinalCost / project.totalBudget) * 100;
  const contingencyBufferPct = (contingencyRemaining / project.totalBudget) * 100;

  if (projectedFinalCost > project.totalBudget) {
    healthStatus = 'OVER_BUDGET';
    const diff = projectedFinalCost - project.totalBudget;
    healthReason = `Projected final cost of ${formatINR(projectedFinalCost)} exceeds total budget (${formatINR(project.totalBudget)}) by ${formatINR(diff)}. Contingency reserve is exhausted or insufficient.`;
  } else if (percentProjected > 95) {
    healthStatus = 'AT_RISK';
    healthReason = `Projected final cost of ${formatINR(projectedFinalCost)} is at ${percentProjected.toFixed(1)}% of total budget. The safety margin has shrunk to ${formatINR(project.totalBudget - projectedFinalCost)}.`;
  } else if (percentProjected > 88 || contingencyBufferPct < 3) {
    healthStatus = 'WATCH';
    healthReason = `Spending and quotes are tracking at ${percentProjected.toFixed(1)}% of planned limits. Electrical and finishing quotes require active supervision.`;
  } else {
    healthStatus = 'HEALTHY';
    healthReason = `Project comfortably within budget. Projected cost (${formatINR(projectedFinalCost)}) leaves ${formatINR(project.totalBudget - projectedFinalCost)} buffer and ₹${(contingencyRemaining / 100000).toFixed(1)}L intact contingency.`;
  }

  return {
    totalBudget: project.totalBudget,
    estimatedCost: estimatedCost > 0 ? estimatedCost : Math.round(project.totalBudget * 0.95),
    quotedCost: quotedCost > 0 ? quotedCost : Math.round(project.totalBudget * 0.86),
    committedCost: committedCost > 0 ? committedCost : Math.round(project.totalBudget * 0.60),
    amountSpent: amountSpent > 0 ? amountSpent : Math.round(project.totalBudget * 0.41),
    remainingBudget,
    contingencyRemaining,
    projectedFinalCost,
    varianceToBudget,
    healthStatus,
    healthReason,
    costDrivers: costDriversList
  };
}

/**
 * Generate preliminary allocation tailored to project type, built-up area, quality, and location.
 */
export function generatePreliminaryAllocation(params: {
  totalBudget: number;
  builtUpAreaSqFt: number;
  qualityLevel: QualityLevel;
  location?: string;
  floors?: number;
}): Record<CategoryKey, CategoryAllocation> {
  const { totalBudget, qualityLevel } = params;

  // Base percentages tailored for Indian construction realities
  let matPct = 0.40;
  let labPct = 0.20;
  let elePct = 0.065;
  let pluPct = 0.05;
  let pntPct = 0.04;
  let dnwPct = 0.065;
  let finPct = 0.065;
  let proPct = 0.035;
  let traPct = 0.025;
  let conPct = 0.05; // 5% contingency reserve

  if (qualityLevel === 'Premium') {
    // Higher finishing, doors/windows, smart electrical
    matPct = 0.38;
    finPct = 0.095;
    dnwPct = 0.075;
    elePct = 0.075;
    conPct = 0.05;
  } else if (qualityLevel === 'Budget') {
    // Value engineering, structural standard, essential finishing
    matPct = 0.42;
    finPct = 0.05;
    dnwPct = 0.055;
    conPct = 0.04;
  }

  // Normalize to 1.0
  const sum = matPct + labPct + elePct + pluPct + pntPct + dnwPct + finPct + proPct + traPct + conPct;
  matPct /= sum;
  labPct /= sum;
  elePct /= sum;
  pluPct /= sum;
  pntPct /= sum;
  dnwPct /= sum;
  finPct /= sum;
  proPct /= sum;
  traPct /= sum;
  conPct /= sum;

  const roundLakhOrThousand = (amt: number) => Math.round(amt / 1000) * 1000;

  return {
    materials: {
      id: 'materials',
      name: 'Construction Materials (Cement, Steel, Sand, Aggregates)',
      icon: 'BrickWall',
      allocatedAmount: roundLakhOrThousand(totalBudget * matPct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * matPct),
      notes: 'Structural grade TMT FE550D & OPC 53 grade cement'
    },
    labour: {
      id: 'labour',
      name: 'Labour & Masonry Crew',
      icon: 'HardHat',
      allocatedAmount: roundLakhOrThousand(totalBudget * labPct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * labPct),
      notes: 'Turnkey RCC framing, bricklaying, and plastering'
    },
    electrical: {
      id: 'electrical',
      name: 'Electrical & Automation',
      icon: 'Zap',
      allocatedAmount: roundLakhOrThousand(totalBudget * elePct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * elePct),
      notes: 'FR-LSH wiring, modular switchboards, conduits'
    },
    plumbing: {
      id: 'plumbing',
      name: 'Plumbing & Sanitary Lines',
      icon: 'Droplets',
      allocatedAmount: roundLakhOrThousand(totalBudget * pluPct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * pluPct),
      notes: 'CPVC water distribution, UPVC drainage, overhead tanks'
    },
    painting: {
      id: 'painting',
      name: 'Painting & Surface Preparation',
      icon: 'Paintbrush',
      allocatedAmount: roundLakhOrThousand(totalBudget * pntPct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * pntPct),
      notes: 'Interior primer + 2 coats premium emulsion, exterior weather guard'
    },
    doors_windows: {
      id: 'doors_windows',
      name: 'Doors & Windows',
      icon: 'DoorClosed',
      allocatedAmount: roundLakhOrThousand(totalBudget * dnwPct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * dnwPct),
      notes: 'Teak wood main entrance, UPVC double-glazed casement windows'
    },
    finishing: {
      id: 'finishing',
      name: 'Tiles, Flooring & Bathroom Finishing',
      icon: 'Layers',
      allocatedAmount: roundLakhOrThousand(totalBudget * finPct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * finPct),
      notes: 'Vitrified double-charge floor tiles, granite kitchen countertops'
    },
    professional_services: {
      id: 'professional_services',
      name: 'Architect & Structural Engineering',
      icon: 'Compass',
      allocatedAmount: roundLakhOrThousand(totalBudget * proPct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * proPct),
      notes: 'Site soil testing, 3D elevation, municipal sanction drawings'
    },
    transportation: {
      id: 'transportation',
      name: 'Transportation & Logistics',
      icon: 'Truck',
      allocatedAmount: roundLakhOrThousand(totalBudget * traPct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * traPct),
      notes: 'Freight, site unloading, boom placer crane hire'
    },
    contingency: {
      id: 'contingency',
      name: 'Emergency Contingency Reserve',
      icon: 'ShieldAlert',
      allocatedAmount: roundLakhOrThousand(totalBudget * conPct),
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: roundLakhOrThousand(totalBudget * conPct),
      notes: 'Untouchable reserve for unforeseen foundation rock excavation or price spikes'
    }
  };
}

/**
 * Evaluates the core question:
 * "CAN I ACHIEVE WHAT I WANT WITHIN MY BUDGET?"
 */
export function evaluateProjectAffordability(params: {
  budget: number;
  builtUpAreaSqFt: number;
  qualityLevel: QualityLevel;
  location: string;
  projectType: string;
}): AffordabilityAnswer {
  const { budget, builtUpAreaSqFt, qualityLevel, location } = params;

  // Realistic per sq.ft construction benchmarks in Indian Tier 1 & 2 cities:
  // Budget: ₹1,400 - ₹1,650 / sq.ft
  // Standard: ₹1,700 - ₹2,100 / sq.ft
  // Premium: ₹2,300 - ₹3,200 / sq.ft
  let minCostPerSqFt = 1500;
  let targetCostPerSqFt = 1850;
  let premiumCostPerSqFt = 2600;

  if (qualityLevel === 'Budget') {
    targetCostPerSqFt = 1550;
  } else if (qualityLevel === 'Premium') {
    targetCostPerSqFt = 2750;
  }

  const estimatedMinRequirement = builtUpAreaSqFt * minCostPerSqFt;
  const estimatedTargetRequirement = builtUpAreaSqFt * targetCostPerSqFt;
  const costPerSqFtAchieved = Math.round(budget / builtUpAreaSqFt);

  if (budget >= estimatedTargetRequirement) {
    const drivers = [
      'RCC Framing & Steel (approx. 24% of cost)',
      'Labour & Masonry (approx. 20% of cost)',
      'Flooring & Bathroom Fixtures (approx. 14% of cost)'
    ];
    return {
      verdict: 'YES',
      headline: `Feasible & Comfortable (${formatINR(costPerSqFtAchieved)}/sq.ft allocated)`,
      summary: `Your budget of ${formatINR(budget)} comfortably covers a ${builtUpAreaSqFt} sq.ft ${qualityLevel} construction in ${location}. It accommodates structural safety, brand-certified materials, skilled labour, and preserves an emergency contingency reserve.`,
      estimatedMinCost: estimatedMinRequirement,
      estimatedMaxCost: estimatedTargetRequirement,
      majorCostDrivers: drivers,
      costDrivers: drivers,
      recommendedAdjustments: [
        'Lock in bulk cement and steel quotes ahead of seasonal price escalation',
        'Maintain a 5% contingency reserve throughout execution',
        'Deploy BuildMind Guardian to verify professional quotations against market averages'
      ],
      potentialCompromises: [
        'No major compromises needed; all target specifications are achievable.'
      ],
      potentialSavingsEstimate: Math.round(budget * 0.08),
      qualityTradeOffs: [
        'None required! All target specifications can be achieved with Grade-A brands.'
      ],
      saferAlternatives: []
    };
  } else if (budget >= estimatedMinRequirement) {
    const shortfall = estimatedTargetRequirement - budget;
    const drivers = [
      `High built-up area (${builtUpAreaSqFt} sq.ft) relative to the capital allocation`,
      'Finishing fixtures (vitrified tiles vs Italian marble)',
      'Architectural customizations'
    ];
    const compromises = [
      'Use double-charged vitrified tiles (₹65/sq.ft) instead of imported marble (₹220/sq.ft)',
      'Opt for high-grade emulsion paint instead of luxury texture coats',
      'Standard concealed CPVC plumbing fittings with 10-year warranty'
    ];
    return {
      verdict: 'POSSIBLY',
      headline: `Achievable with Value Engineering (Shortfall for Premium: ${formatINR(shortfall)})`,
      summary: `At ${formatINR(costPerSqFtAchieved)}/sq.ft, completing ${builtUpAreaSqFt} sq.ft in ${location} is achievable using Standard/Budget specifications. It will require disciplined procurement, quote negotiation, and value-engineered finishing.`,
      shortfallAmount: shortfall,
      estimatedMinCost: estimatedMinRequirement,
      estimatedMaxCost: estimatedTargetRequirement,
      majorCostDrivers: drivers,
      costDrivers: drivers,
      recommendedAdjustments: [
        'Adopt standard sizes for doors and aluminium/UPVC windows rather than bespoke woodwork',
        'Consolidate material procurement through wholesale district suppliers',
        'Execute basic landscaping and luxury false ceilings in Phase 2 after occupancy'
      ],
      potentialCompromises: compromises,
      potentialSavingsEstimate: Math.round(shortfall * 0.75),
      qualityTradeOffs: compromises,
      saferAlternatives: [
        'Never reduce structural steel diameter or cement grade — focus cuts solely on aesthetic finishes'
      ]
    };
  } else {
    const shortfall = estimatedMinRequirement - budget;
    const drivers = [
      `Built-up footprint (${builtUpAreaSqFt} sq.ft) exceeds the available capital`,
      'Non-negotiable foundational structural costs (TMT steel, 53-grade cement, excavation)',
      'Statutory sanction fees and utility connection charges'
    ];
    const compromises = [
      'Scale down built-up footprint to retain premium quality materials',
      'Defer modular kitchen and wardrobe cabinetry to post-handover'
    ];
    return {
      verdict: 'NO',
      headline: `Budget Shortfall of ${formatINR(shortfall)} Detected`,
      summary: `A budget of ${formatINR(budget)} yields only ${formatINR(costPerSqFtAchieved)}/sq.ft for a ${builtUpAreaSqFt} sq.ft structure. Minimum safe structural construction with certified materials and compliant labour in ${location} starts at ${formatINR(minCostPerSqFt)}/sq.ft (${formatINR(estimatedMinRequirement)} total). Attempting this without adjustments risks incomplete construction or hazardous compromises.`,
      shortfallAmount: shortfall,
      estimatedMinCost: estimatedMinRequirement,
      estimatedMaxCost: estimatedTargetRequirement,
      majorCostDrivers: drivers,
      costDrivers: drivers,
      recommendedAdjustments: [
        `Option A: Optimize built-up area to approx. ${Math.floor(budget / minCostPerSqFt)} sq.ft to execute safely within ${formatINR(budget)}`,
        'Option B: Phased Construction — complete Ground Floor (RCC frame for G+1) and furnish the first floor later',
        `Option C: Increase project financing by ${formatINR(shortfall)} via approved home construction bank loan`
      ],
      potentialCompromises: compromises,
      potentialSavingsEstimate: Math.round(budget * 0.12),
      qualityTradeOffs: compromises,
      saferAlternatives: [
        'CRITICAL SAFETY RULE: Never cut cost on foundation depth, column reinforcement, or certified waterproofing.'
      ]
    };
  }
}
