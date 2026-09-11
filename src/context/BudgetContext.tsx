import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { 
  ProjectContext, 
  BudgetCalculations, 
  CategoryKey, 
  FinancialTransaction, 
  AuditLogEntry, 
  GuardianAlert, 
  AffordabilityAnswer,
  QualityLevel,
  BudgetFlexibility,
  FinancingPreference
} from '../types/budget';
import { INITIAL_PROJECT } from '../data/initialData';
import { 
  calculateBudgetMetrics, 
  generatePreliminaryAllocation, 
  evaluateProjectAffordability,
  formatINR 
} from '../services/budgetCalculator';

interface BudgetContextType {
  project: ProjectContext;
  calculations: BudgetCalculations;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Actions
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'projectId'>) => void;
  recordTransaction: (tx: any) => void;
  commitPurchase: (purchase: {
    category: CategoryKey;
    description: string;
    amount: number;
    supplierOrProvider: string;
    notes?: string;
  }) => { success: boolean; willOverrun: boolean; projectedFinal: number; remainingAfter: number };
  
  updateCategoryAllocation: (category: CategoryKey, newAmount: number, reason?: string) => void;
  adjustProjectBudget: (newBudget: number, reason: string) => void;
  updatePreferences: (updates: {
    qualityPreference?: QualityLevel;
    budgetFlexibility?: BudgetFlexibility;
    financingPreference?: FinancingPreference;
    contingencyReserve?: number;
    preferredSpendingLimit?: number;
    maxAcceptableBudget?: number;
  }) => void;

  resolveAlert: (alertId: string, resolutionAction: 'apply_alternative' | 'reallocate_contingency' | 'dismiss') => void;
  applyScenario: (changes: {
    budgetDelta?: number;
    categoryDeltas?: Partial<Record<CategoryKey, number>>;
    qualityChange?: QualityLevel;
    reason: string;
  }) => void;

  resetToDefaultProject: () => void;
  createNewProjectFromBudget: (params: {
    name: string;
    location: string;
    budget: number;
    builtUpAreaSqFt: number;
    plotAreaSqFt?: number;
    floors?: number;
    bedrooms?: number;
    qualityPreference: QualityLevel;
    budgetFlexibility: BudgetFlexibility;
    financingPreference: FinancingPreference;
  }) => void;

  checkAffordability: (params: {
    budget: number;
    builtUpAreaSqFt: number;
    qualityLevel: QualityLevel;
    location: string;
  }) => AffordabilityAnswer;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ProjectContext>(() => {
    // Attempt to read local storage or fall back to INITIAL_PROJECT
    try {
      const saved = localStorage.getItem('buildmind_project_v1') || localStorage.getItem('buildpilot_project_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PROJECT;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Automatically recalculate metrics whenever project context changes
  const calculations = useMemo(() => {
    return calculateBudgetMetrics(project);
  }, [project]);

  // Helper to persist state
  const saveProject = (updated: ProjectContext) => {
    setProject(updated);
    try {
      localStorage.setItem('buildmind_project_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const addTransaction = (tx: Omit<FinancialTransaction, 'id' | 'projectId'>) => {
    const newId = `tx-${Date.now()}`;
    const newTx: FinancialTransaction = {
      ...tx,
      id: newId,
      projectId: project.id
    };

    // Update category totals
    const cat = project.categories[tx.category];
    const updatedCategory = { ...cat };

    if (tx.status === 'spent') {
      updatedCategory.spentAmount += tx.amount;
    } else if (tx.status === 'committed') {
      updatedCategory.committedAmount += tx.amount;
    } else if (tx.status === 'quoted') {
      updatedCategory.quotedAmount = Math.max(updatedCategory.quotedAmount, tx.amount);
    }

    const updatedCategories = {
      ...project.categories,
      [tx.category]: updatedCategory
    };

    const newAuditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      projectId: project.id,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      type: tx.status === 'spent' ? 'EXPENSE_ADDED' : tx.status === 'committed' ? 'PURCHASE_COMMITTED' : 'QUOTATION_ADDED',
      description: `${tx.description} (${formatINR(tx.amount)})`,
      newValue: formatINR(tx.amount),
      reason: `Logged under ${cat.name} by user`,
      user: 'Praveen Kumar (Owner)'
    };

    const updatedProject: ProjectContext = {
      ...project,
      categories: updatedCategories,
      transactions: [newTx, ...project.transactions],
      auditTrail: [newAuditEntry, ...project.auditTrail]
    };

    saveProject(updatedProject);
  };

  const commitPurchase = (purchase: {
    category: CategoryKey;
    description: string;
    amount: number;
    supplierOrProvider: string;
    notes?: string;
  }) => {
    const cat = project.categories[purchase.category];
    const remainingInCat = cat.allocatedAmount - (cat.spentAmount + cat.committedAmount);
    const willCatOverrun = purchase.amount > remainingInCat;

    const projectedFinal = calculations.projectedFinalCost + (willCatOverrun ? (purchase.amount - remainingInCat) : 0);
    const willProjectOverrun = projectedFinal > project.totalBudget;
    const remainingAfter = calculations.remainingBudget - purchase.amount;

    // Log the transaction as committed
    addTransaction({
      category: purchase.category,
      description: purchase.description,
      amount: purchase.amount,
      currency: 'INR',
      date: new Date().toISOString().split('T')[0],
      status: 'committed',
      source: 'purchase',
      supplierOrProvider: purchase.supplierOrProvider,
      notes: purchase.notes || 'Direct procurement purchase order confirmed'
    });

    return {
      success: true,
      willOverrun: willProjectOverrun,
      projectedFinal,
      remainingAfter
    };
  };

  const updateCategoryAllocation = (category: CategoryKey, newAmount: number, reason?: string) => {
    const current = project.categories[category];
    const prevAmount = current.allocatedAmount;
    if (prevAmount === newAmount) return;

    const updatedCategories = {
      ...project.categories,
      [category]: {
        ...current,
        allocatedAmount: newAmount
      }
    };

    const newAuditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      projectId: project.id,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      type: 'ALLOCATION_CHANGE',
      description: `Reallocated ${current.name}`,
      previousValue: formatINR(prevAmount),
      newValue: formatINR(newAmount),
      reason: reason || 'Manual user category budget adjustment',
      user: 'Praveen Kumar (Owner)'
    };

    saveProject({
      ...project,
      categories: updatedCategories,
      auditTrail: [newAuditEntry, ...project.auditTrail]
    });
  };

  const adjustProjectBudget = (newBudget: number, reason: string) => {
    const prevBudget = project.totalBudget;
    if (prevBudget === newBudget) return;

    const newAuditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      projectId: project.id,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      type: 'BUDGET_CHANGE',
      description: `Total Project Budget changed from ${formatINR(prevBudget)} to ${formatINR(newBudget)}`,
      previousValue: formatINR(prevBudget),
      newValue: formatINR(newBudget),
      reason: reason || 'User adjusted project budget',
      user: 'Praveen Kumar (Owner)'
    };

    saveProject({
      ...project,
      totalBudget: newBudget,
      preferredSpendingLimit: Math.round(newBudget * 0.95),
      maxAcceptableBudget: Math.round(newBudget * 1.08),
      auditTrail: [newAuditEntry, ...project.auditTrail]
    });
  };

  const updatePreferences = (updates: {
    qualityPreference?: QualityLevel;
    budgetFlexibility?: BudgetFlexibility;
    financingPreference?: FinancingPreference;
    contingencyReserve?: number;
    preferredSpendingLimit?: number;
    maxAcceptableBudget?: number;
  }) => {
    saveProject({
      ...project,
      ...updates
    });
  };

  const resolveAlert = (alertId: string, resolutionAction: 'apply_alternative' | 'reallocate_contingency' | 'dismiss') => {
    const alert = project.activeAlerts.find(a => a.id === alertId);
    if (!alert) return;

    let auditReason = '';
    let updatedCategories = { ...project.categories };

    if (resolutionAction === 'reallocate_contingency') {
      const contingency = updatedCategories.contingency;
      const targetCat = updatedCategories[alert.category];
      const shiftAmt = alert.varianceAmount;

      if (contingency.allocatedAmount >= shiftAmt) {
        contingency.allocatedAmount -= shiftAmt;
        targetCat.allocatedAmount += shiftAmt;
        auditReason = `Reallocated ${formatINR(shiftAmt)} from Contingency Reserve to resolve ${targetCat.name} quote variance.`;
      }
    } else if (resolutionAction === 'apply_alternative') {
      auditReason = `Switched to competitive alternative proposal for ${alert.category} saving ${formatINR(alert.varianceAmount)}.`;
    } else {
      auditReason = `User dismissed alert: ${alert.title}.`;
    }

    const updatedAlerts = project.activeAlerts.map(a => 
      a.id === alertId ? { ...a, status: 'resolved' as const } : a
    );

    const newAuditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      projectId: project.id,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      type: 'GUARDIAN_ALERT_DISMISSED',
      description: `Resolved Guardian Alert: ${alert.title}`,
      reason: auditReason,
      user: 'Praveen Kumar (Owner)'
    };

    saveProject({
      ...project,
      categories: updatedCategories,
      activeAlerts: updatedAlerts,
      auditTrail: [newAuditEntry, ...project.auditTrail]
    });
  };

  const applyScenario = (changes: {
    budgetDelta?: number;
    categoryDeltas?: Partial<Record<CategoryKey, number>>;
    qualityChange?: QualityLevel;
    reason: string;
  }) => {
    let newBudget = project.totalBudget + (changes.budgetDelta || 0);
    let updatedCategories = { ...project.categories };

    if (changes.categoryDeltas) {
      Object.entries(changes.categoryDeltas).forEach(([key, delta]) => {
        const catKey = key as CategoryKey;
        if (updatedCategories[catKey] && delta) {
          updatedCategories[catKey] = {
            ...updatedCategories[catKey],
            allocatedAmount: Math.max(10000, updatedCategories[catKey].allocatedAmount + delta)
          };
        }
      });
    }

    const newAuditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      projectId: project.id,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      type: 'SCENARIO_APPLIED',
      description: `Applied Simulation Scenario: ${changes.reason}`,
      previousValue: formatINR(project.totalBudget),
      newValue: formatINR(newBudget),
      reason: changes.reason,
      user: 'Praveen Kumar (Owner)'
    };

    saveProject({
      ...project,
      totalBudget: newBudget,
      qualityPreference: changes.qualityChange || project.qualityPreference,
      categories: updatedCategories,
      auditTrail: [newAuditEntry, ...project.auditTrail]
    });
  };

  const resetToDefaultProject = () => {
    saveProject(INITIAL_PROJECT);
  };

  const createNewProjectFromBudget = (params: {
    name: string;
    location: string;
    budget: number;
    builtUpAreaSqFt: number;
    plotAreaSqFt?: number;
    floors?: number;
    bedrooms?: number;
    qualityPreference: QualityLevel;
    budgetFlexibility: BudgetFlexibility;
    financingPreference: FinancingPreference;
  }) => {
    const allocations = generatePreliminaryAllocation({
      totalBudget: params.budget,
      builtUpAreaSqFt: params.builtUpAreaSqFt,
      qualityLevel: params.qualityPreference,
      location: params.location,
      floors: params.floors || 2
    });

    const newProj: ProjectContext = {
      id: `proj-${Date.now()}`,
      name: params.name || `${params.builtUpAreaSqFt} sq.ft Construction`,
      location: params.location || 'Bengaluru, KA',
      projectType: '3BHK Duplex',
      builtUpAreaSqFt: params.builtUpAreaSqFt,
      plotAreaSqFt: params.plotAreaSqFt || Math.round(params.builtUpAreaSqFt * 0.75),
      floors: params.floors || 2,
      bedrooms: params.bedrooms || 3,
      currentPhase: 'Planning & Approval',
      
      totalBudget: params.budget,
      preferredSpendingLimit: Math.round(params.budget * 0.95),
      maxAcceptableBudget: Math.round(params.budget * 1.08),
      contingencyReserve: allocations.contingency.allocatedAmount,
      qualityPreference: params.qualityPreference,
      budgetFlexibility: params.budgetFlexibility,
      financingPreference: params.financingPreference,
      alreadySpentAtStart: 0,

      categories: allocations,
      transactions: [],
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          projectId: `proj-${Date.now()}`,
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          type: 'BUDGET_CHANGE',
          description: `Created new project with ${formatINR(params.budget)} budget`,
          newValue: formatINR(params.budget),
          reason: `Onboarded with ${params.qualityPreference} quality profile`,
          user: 'Praveen Kumar (Owner)'
        }
      ],
      activeAlerts: []
    };

    saveProject(newProj);
    setActiveTab('dashboard');
  };

  const checkAffordability = (params: {
    budget: number;
    builtUpAreaSqFt: number;
    qualityLevel: QualityLevel;
    location: string;
  }) => {
    return evaluateProjectAffordability({
      budget: params.budget,
      builtUpAreaSqFt: params.builtUpAreaSqFt,
      qualityLevel: params.qualityLevel,
      location: params.location,
      projectType: project.projectType
    });
  };

  return (
    <BudgetContext.Provider
      value={{
        project,
        calculations,
        activeTab,
        setActiveTab,
        addTransaction,
        recordTransaction: addTransaction,
        commitPurchase,
        updateCategoryAllocation,
        adjustProjectBudget,
        updatePreferences,
        resolveAlert,
        applyScenario,
        resetToDefaultProject,
        createNewProjectFromBudget,
        checkAffordability
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetContextProvider = BudgetProvider;
