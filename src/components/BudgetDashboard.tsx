import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  PieChart as PieIcon, 
  FileSpreadsheet, 
  ArrowUpRight, 
  Zap, 
  Compass, 
  Sliders, 
  Plus, 
  DollarSign, 
  Info,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { CategoryKey } from '../types/budget';

interface BudgetDashboardProps {
  onOpenNewExpense: () => void;
  onOpenAffordability: () => void;
  onOpenOnboarding: () => void;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  onOpenNewExpense,
  onOpenAffordability,
  onOpenOnboarding
}) => {
  const { 
    project, 
    calculations, 
    setActiveTab, 
    updateCategoryAllocation, 
    adjustProjectBudget 
  } = useBudget();

  const [editingCategory, setEditingCategory] = useState<CategoryKey | null>(null);
  const [reallocateAmount, setReallocateAmount] = useState<number>(0);
  const [showAdjustBudgetModal, setShowAdjustBudgetModal] = useState(false);
  const [newTotalBudgetInput, setNewTotalBudgetInput] = useState<string>(project.totalBudget.toString());
  const [budgetChangeReason, setBudgetChangeReason] = useState<string>('');

  // Overrun prompt handler
  const handleOverrunAction = (action: 'reduce' | 'increase' | 'review') => {
    if (action === 'reduce') {
      setActiveTab('optimizer');
    } else if (action === 'increase') {
      setShowAdjustBudgetModal(true);
    } else {
      // scroll to or highlight cost drivers
      const elem = document.getElementById('cost-drivers-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getHealthBadgeLarge = () => {
    switch (calculations.healthStatus) {
      case 'HEALTHY':
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Project Budget Status</span>
                <span className="text-sm font-extrabold text-emerald-800">🟢 Within Budget (Healthy)</span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">{calculations.healthReason}</p>
            </div>
          </div>
        );
      case 'WATCH':
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Project Budget Status</span>
                <span className="text-sm font-extrabold text-amber-800">🟡 Watch Status (Limit Approaching)</span>
              </div>
              <p className="text-xs text-amber-700 mt-0.5">{calculations.healthReason}</p>
            </div>
          </div>
        );
      case 'AT_RISK':
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700">Project Budget Status</span>
                <span className="text-sm font-extrabold text-orange-800">🟠 At Risk (Approaching Cap)</span>
              </div>
              <p className="text-xs text-orange-700 mt-0.5">{calculations.healthReason}</p>
            </div>
          </div>
        );
      case 'OVER_BUDGET':
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Project Budget Status</span>
                <span className="text-sm font-extrabold text-rose-800">🔴 Over Budget Alert</span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">{calculations.healthReason}</p>
            </div>
          </div>
        );
    }
  };

  const categoriesList = Object.values(project.categories);
  const spentPct = Math.min(100, Math.round((calculations.amountSpent / project.totalBudget) * 100));
  const committedPct = Math.min(100, Math.round(((calculations.amountSpent + calculations.committedCost) / project.totalBudget) * 100));
  const projectedPct = Math.min(100, Math.round((calculations.projectedFinalCost / project.totalBudget) * 100));

  return (
    <div className="space-y-6">
      {/* User Controlled Budget Overrun Notice (Section 19) */}
      {calculations.projectedFinalCost > project.totalBudget && (
        <div id="overrun-alert-banner" className="p-4 rounded-xl bg-rose-50 border border-rose-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-rose-900 flex items-center gap-2">
                  <span>⚠️ Projected Cost Overrun Warning</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-200 text-rose-800">
                    +{formatINR(calculations.projectedFinalCost - project.totalBudget)} over budget
                  </span>
                </div>
                <p className="text-xs text-rose-700 mt-1 max-w-2xl">
                  Your projected final cost of <strong>{formatINR(calculations.projectedFinalCost)}</strong> is higher than your authorized budget limit of <strong>{formatINR(project.totalBudget)}</strong>. BuildMind AI will never alter your budget without your consent. Choose your decision:
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                id="btn-reduce-costs"
                onClick={() => handleOverrunAction('reduce')}
                className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
              >
                Reduce Costs (Optimizer)
              </button>
              <button
                id="btn-increase-budget"
                onClick={() => handleOverrunAction('increase')}
                className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-2xs"
              >
                Increase Budget
              </button>
              <button
                id="btn-review-categories"
                onClick={() => handleOverrunAction('review')}
                className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
              >
                Review Drivers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero 8 Core Metric Cards (Section 3 Requirement) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Master Budget Intelligence</h1>
            <p className="text-xs text-slate-500">Live fiscal status, projected final outlay, committed contracts, and contingency safety margin.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-adjust-project-budget"
              onClick={() => setShowAdjustBudgetModal(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Adjust Budget Cap
            </button>
            <button
              id="btn-open-onboarding-edit"
              onClick={onOpenOnboarding}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Preferences
            </button>
          </div>
        </div>

        {/* 8 Primary Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Total Budget */}
          <div id="card-metric-total-budget" className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Budget</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {formatINR(calculations.totalBudget)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Limit: {formatINR(project.preferredSpendingLimit)}</span>
              <span className="text-slate-400">Max: {formatINR(project.maxAcceptableBudget)}</span>
            </div>
          </div>

          {/* 2. Estimated Cost */}
          <div id="card-metric-estimated-cost" className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Cost</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {formatINR(calculations.estimatedCost)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Rate: ~{formatINR(Math.round(calculations.estimatedCost / project.builtUpAreaSqFt))}/sq.ft
            </div>
          </div>

          {/* 3. Quoted Cost */}
          <div id="card-metric-quoted-cost" className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Quoted Cost</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {formatINR(calculations.quotedCost)}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              Active verified vendor bids
            </div>
          </div>

          {/* 4. Committed Cost */}
          <div id="card-metric-committed-cost" className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Committed Cost</div>
            <div className="text-xl sm:text-2xl font-extrabold text-indigo-950 mt-1 tracking-tight">
              {formatINR(calculations.committedCost)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Signed POs & work contracts
            </div>
          </div>

          {/* 5. Amount Spent */}
          <div id="card-metric-amount-spent" className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Amount Spent</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {formatINR(calculations.amountSpent)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {spentPct}% of total budget paid
            </div>
          </div>

          {/* 6. Remaining Budget */}
          <div id="card-metric-remaining-budget" className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Remaining Budget</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-900 mt-1 tracking-tight">
              {formatINR(calculations.remainingBudget)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Available for future phases
            </div>
          </div>

          {/* 7. Contingency Remaining */}
          <div id="card-metric-contingency" className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Contingency Reserve</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {formatINR(calculations.contingencyRemaining)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Emergency safety buffer
            </div>
          </div>

          {/* 8. Projected Final Cost */}
          <div id="card-metric-projected-cost" className={`p-4 rounded-xl shadow-xs transition-all border ${
            calculations.projectedFinalCost > project.totalBudget 
              ? 'bg-rose-50/50 border-rose-300' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Projected Final Cost</div>
            <div className={`text-xl sm:text-2xl font-extrabold mt-1 tracking-tight ${
              calculations.projectedFinalCost > project.totalBudget ? 'text-rose-700' : 'text-slate-900'
            }`}>
              {formatINR(calculations.projectedFinalCost)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {projectedPct}% of authorized budget
            </div>
          </div>
        </div>
      </div>

      {/* Health Indicator Banner */}
      {getHealthBadgeLarge()}

      {/* Progress & Outlay Visual Bar */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Capital Commitment & Outflow Progression</h3>
            <p className="text-xs text-slate-500">Visual mapping of Paid Outlay vs Committed Contracts vs Total Budget Ceiling.</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-900"></span>
              <span className="text-slate-600">Spent ({spentPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600"></span>
              <span className="text-slate-600">Committed ({committedPct - spentPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
              <span className="text-slate-600">Remaining ({100 - committedPct}%)</span>
            </div>
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div 
            style={{ width: `${spentPct}%` }} 
            className="bg-slate-900 h-full transition-all duration-500" 
            title={`Spent: ${formatINR(calculations.amountSpent)}`}
          />
          <div 
            style={{ width: `${Math.max(0, committedPct - spentPct)}%` }} 
            className="bg-indigo-600 h-full transition-all duration-500" 
            title={`Committed: ${formatINR(calculations.committedCost)}`}
          />
          <div 
            style={{ width: `${Math.max(0, 100 - committedPct)}%` }} 
            className="bg-emerald-500 h-full transition-all duration-500" 
            title={`Remaining: ${formatINR(calculations.remainingBudget)}`}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-medium">
          <span>₹0</span>
          <span>50% ({formatINR(project.totalBudget * 0.5)})</span>
          <span>Target Budget: {formatINR(project.totalBudget)}</span>
        </div>
      </div>

      {/* Cost Drivers Analysis Section (Prompt Section 21) */}
      <div id="cost-drivers-section" className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-700" />
              <span>Cost Driver Analysis</span>
            </h3>
            <p className="text-xs text-slate-500">Identifies lines where active quotations or spending track above initial allocation.</p>
          </div>
          <button
            id="btn-goto-optimizer"
            onClick={() => setActiveTab('optimizer')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
          >
            <span>View Safe Savings Levers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {calculations.costDrivers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {calculations.costDrivers.map((driver, idx) => (
              <div key={driver.category} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">#{idx + 1} Cost Driver</span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    +{formatINR(driver.overrunAmount)}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1">{driver.categoryName}</div>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">
                  <span>Allocated: {formatINR(driver.allocated)}</span>
                  <span>Projected: {formatINR(driver.projected)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All category quotations and commitments are currently tracking strictly within their respective allocations.</span>
          </div>
        )}
      </div>

      {/* Category Allocation & Reallocation Grid (Prompt Section 5) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <span>Category Budget Allocations</span>
            </h3>
            <p className="text-xs text-slate-500">Generated automatically based on {project.builtUpAreaSqFt} sq.ft, {project.qualityPreference} quality tier, and {project.location}. Click 'Adjust' to reallocate between trades.</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-500">Total Allocated:</span>
            <span className="font-bold text-slate-900">
              {formatINR(categoriesList.reduce((acc, c) => acc + c.allocatedAmount, 0))}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {categoriesList.map((cat) => {
            const catSpentAndCommitted = cat.spentAmount + cat.committedAmount;
            const catRemaining = cat.allocatedAmount - catSpentAndCommitted;
            const pct = Math.min(100, Math.round((catSpentAndCommitted / cat.allocatedAmount) * 100));
            const isEditing = editingCategory === cat.id;

            return (
              <div 
                key={cat.id} 
                id={`category-card-${cat.id}`}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                    {cat.id === 'contingency' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Reserve
                      </span>
                    )}
                  </div>
                  <button
                    id={`btn-edit-cat-${cat.id}`}
                    onClick={() => {
                      if (isEditing) {
                        setEditingCategory(null);
                      } else {
                        setEditingCategory(cat.id);
                        setReallocateAmount(cat.allocatedAmount);
                      }
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs"
                  >
                    {isEditing ? 'Cancel' : 'Adjust'}
                  </button>
                </div>

                {isEditing ? (
                  <div className="mt-3 p-2.5 rounded bg-white border border-slate-200 space-y-2">
                    <label className="text-xs font-medium text-slate-700">Reallocate Allocation Amount (₹):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="5000"
                        value={reallocateAmount}
                        onChange={(e) => setReallocateAmount(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                      />
                      <button
                        onClick={() => {
                          updateCategoryAllocation(cat.id, reallocateAmount, `Manual reallocation by user to ${formatINR(reallocateAmount)}`);
                          setEditingCategory(null);
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded bg-slate-900 text-white hover:bg-slate-800"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between mt-2">
                      <div>
                        <span className="text-base font-extrabold text-slate-900">{formatINR(cat.allocatedAmount)}</span>
                        <span className="text-[11px] text-slate-400 ml-1.5">allocated</span>
                      </div>
                      <div className="text-xs text-right">
                        <span className="text-slate-500 font-medium">Spent: </span>
                        <span className="font-bold text-slate-800">{formatINR(catSpentAndCommitted)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div 
                        style={{ width: `${pct}%` }} 
                        className={`h-full ${pct > 90 ? 'bg-amber-500' : 'bg-slate-900'}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
                      <span>Remaining: {formatINR(catRemaining)}</span>
                      {cat.quotedAmount > 0 && (
                        <span className={cat.quotedAmount > cat.allocatedAmount ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                          Quoted: {formatINR(cat.quotedAmount)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Adjust Project Budget Modal */}
      {showAdjustBudgetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Adjust Total Project Budget</h3>
              <button 
                onClick={() => setShowAdjustBudgetModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              BuildMind AI tracks all adjustments in the timestamped Audit Trail to preserve historical fiscal governance.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">New Total Budget Amount (₹):</label>
              <input 
                type="number"
                value={newTotalBudgetInput}
                onChange={(e) => setNewTotalBudgetInput(e.target.value)}
                className="w-full text-base font-bold text-slate-900 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
              <div className="text-[11px] text-slate-500 mt-1">
                Currently: {formatINR(project.totalBudget)}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Reason for Adjustment:</label>
              <input 
                type="text"
                placeholder="e.g. Added solar panel installation, Bank loan approved"
                value={budgetChangeReason}
                onChange={(e) => setBudgetChangeReason(e.target.value)}
                className="w-full text-xs text-slate-900 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAdjustBudgetModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = Number(newTotalBudgetInput);
                  if (val > 0) {
                    adjustProjectBudget(val, budgetChangeReason || 'User updated project budget');
                    setShowAdjustBudgetModal(false);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
              >
                Confirm & Log to Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
