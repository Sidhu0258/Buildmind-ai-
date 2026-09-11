import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { QualityLevel, BudgetFlexibility, FinancingPreference } from '../types/budget';
import { 
  Building2, 
  X, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CreditCard,
  Sliders,
  DollarSign
} from 'lucide-react';

interface BudgetOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetOnboardingModal: React.FC<BudgetOnboardingModalProps> = ({
  isOpen,
  onClose
}) => {
  const { project, updatePreferences, adjustProjectBudget } = useBudget();

  const [totalBudget, setTotalBudget] = useState<number>(project.totalBudget);
  const [preferredLimit, setPreferredLimit] = useState<number>(project.preferredSpendingLimit);
  const [maxCeiling, setMaxCeiling] = useState<number>(project.maxAcceptableBudget);
  const [quality, setQuality] = useState<QualityLevel>(project.qualityPreference);
  const [flexibility, setFlexibility] = useState<BudgetFlexibility>(project.budgetFlexibility);
  const [contingencyPct, setContingencyPct] = useState<number>(Math.round((project.contingencyReserve / project.totalBudget) * 100) || 10);
  const [financing, setFinancing] = useState<FinancingPreference>(project.financingPreference);

  if (!isOpen) return null;

  const quickRanges = [
    { label: 'Under ₹10 Lakh', amount: 800000 },
    { label: '₹10–25 Lakh', amount: 1800000 },
    { label: '₹25–50 Lakh', amount: 3000000 },
    { label: '₹50L–1 Crore', amount: 6500000 },
    { label: '₹1 Crore+', amount: 12000000 }
  ];

  const handleQuickRange = (amt: number) => {
    setTotalBudget(amt);
    setPreferredLimit(Math.round(amt * 0.9));
    setMaxCeiling(Math.round(amt * 1.1));
  };

  const handleSave = () => {
    adjustProjectBudget(totalBudget, 'Updated in Project Budget Onboarding Wizard');
    updatePreferences({
      preferredSpendingLimit: preferredLimit,
      maxAcceptableBudget: maxCeiling,
      qualityPreference: quality,
      budgetFlexibility: flexibility,
      contingencyReserve: Math.round(totalBudget * (contingencyPct / 100)),
      financingPreference: financing
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-lg">
              ⚙️
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Project Budget Configuration</h3>
              <p className="text-xs text-slate-500">Section 2 Centralized Onboarding Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Range Selection Pills */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Quick Budget Range Selection:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickRanges.map(range => (
              <button
                key={range.label}
                type="button"
                onClick={() => handleQuickRange(range.amount)}
                className={`py-2 px-2.5 text-xs font-bold rounded-xl border transition-all text-center ${
                  totalBudget === range.amount
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exact Amount Inputs */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Total Available Budget (₹):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                step="50000"
                value={totalBudget}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTotalBudget(val);
                  setPreferredLimit(Math.round(val * 0.9));
                  setMaxCeiling(Math.round(val * 1.1));
                }}
                className="w-full text-base font-extrabold text-slate-900 pl-8 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Currently: <strong>{formatINR(totalBudget)}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Preferred Spending Limit (₹):
              </label>
              <input
                type="number"
                step="25000"
                value={preferredLimit}
                onChange={(e) => setPreferredLimit(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 px-3 py-2 border border-slate-300 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Target below budget</span>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Maximum Acceptable Ceiling (₹):
              </label>
              <input
                type="number"
                step="25000"
                value={maxCeiling}
                onChange={(e) => setMaxCeiling(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 px-3 py-2 border border-slate-300 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Absolute hard ceiling</span>
            </div>
          </div>
        </div>

        {/* Quality Preference */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Preferred Quality Level:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Budget', 'Standard', 'Premium'] as QualityLevel[]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuality(q)}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  quality === q
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Flexibility */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Budget Flexibility:
          </label>
          <select
            value={flexibility}
            onChange={(e) => setFlexibility(e.target.value as BudgetFlexibility)}
            className="w-full text-xs font-medium text-slate-900 px-3 py-2 border border-slate-300 rounded-xl bg-white"
          >
            <option value="Strict">Strict (Hard Cap - No deviations permitted)</option>
            <option value="Slightly Flexible">Slightly flexible (±5% buffer allowed)</option>
            <option value="Flexible for Quality">Flexible for quality (±15% for superior durability)</option>
          </select>
        </div>

        {/* Emergency Contingency Reserve Slider (Prompt Section 2: Auto-recommend 5-15%) */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Emergency / Contingency Reserve:</span>
            <span className="text-emerald-700 font-extrabold">{contingencyPct}% ({formatINR(Math.round(totalBudget * (contingencyPct / 100)))})</span>
          </div>
          <input
            type="range"
            min="5"
            max="20"
            step="1"
            value={contingencyPct}
            onChange={(e) => setContingencyPct(Number(e.target.value))}
            className="w-full accent-slate-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>5% (Lean)</span>
            <span>10% (Recommended)</span>
            <span>20% (Conservative)</span>
          </div>
        </div>

        {/* Financing Preference */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Financing & Cashflow Preference:
          </label>
          <select
            value={financing}
            onChange={(e) => setFinancing(e.target.value as FinancingPreference)}
            className="w-full text-xs font-medium text-slate-900 px-3 py-2 border border-slate-300 rounded-xl bg-white"
          >
            <option value="Self-funded">Self-funded (Liquid personal capital)</option>
            <option value="Bank loan">Bank construction loan (Tranche releases)</option>
            <option value="Milestone-based">Milestone-based (Pay as stages complete)</option>
            <option value="Phased construction">Phased construction (Pause between stages)</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="btn-save-onboarding-preferences"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Update Project Context</span>
          </button>
        </div>
      </div>
    </div>
  );
};
