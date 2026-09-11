import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { MOCK_OPTIMIZATION_OPPORTUNITIES } from '../data/initialData';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Layers, 
  Truck, 
  PackageCheck, 
  CalendarClock,
  TrendingDown,
  Info
} from 'lucide-react';
import { OptimizationOpportunity } from '../types/budget';

export const BudgetOptimizationAgent: React.FC = () => {
  const { project, calculations, applyScenario } = useBudget();
  const [appliedOpts, setAppliedOpts] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const totalPotentialSavings = MOCK_OPTIMIZATION_OPPORTUNITIES.reduce(
    (acc, opp) => acc + opp.potentialSavings, 
    0
  );

  const handleApplyOptimization = (opp: OptimizationOpportunity) => {
    if (appliedOpts.includes(opp.id)) return;

    // Apply the savings directly via scenario or project update
    applyScenario({
      categoryDeltas: {
        [opp.category]: -opp.potentialSavings
      },
      reason: `Optimization: ${opp.title} (Saved ${formatINR(opp.potentialSavings)})`
    });

    setAppliedOpts([...appliedOpts, opp.id]);
  };

  const filteredOpportunities = selectedFilter === 'ALL'
    ? MOCK_OPTIMIZATION_OPPORTUNITIES
    : MOCK_OPTIMIZATION_OPPORTUNITIES.filter(o => o.category === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
              💡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Autonomous Savings Engine</span>
                <span className="text-xs text-slate-400">• Structural Integrity Guard</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mt-1">Budget Optimization Agent</h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                Identifies verified price advantages across certified suppliers, bulk consolidated deliveries, and trade scheduling efficiencies. Every proposal explicitly outlines the trade-off.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-300">Total Identifiable Safe Savings</div>
              <div className="text-xl font-extrabold text-emerald-400">{formatINR(totalPotentialSavings)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Strict Structural Safety Rule Banner (Section 11 & 26 Mandatory Requirement) */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
            Engineering & Safety Protocol Active
          </h4>
          <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
            BuildMind AI strictly prohibits downgrading structural steel grade (FE 550D), column reinforcement diameter, foundation depth, or cement grade (OPC 53) to save money. All cost optimizations are achieved via <strong>logistics consolidation, direct mill distributor sourcing, and trade synchronization</strong>.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['ALL', 'materials', 'electrical', 'finishing', 'labour'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat === 'ALL' ? 'All Opportunities' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Concrete Optimization Cards: Current Cost -> Alternative -> Savings -> Trade-off */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpportunities.map((opp) => {
          const isApplied = appliedOpts.includes(opp.id);

          return (
            <div
              key={opp.id}
              id={`optimization-card-${opp.id}`}
              className={`p-5 rounded-xl border transition-all ${
                isApplied 
                  ? 'bg-emerald-50/50 border-emerald-300' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wide">
                  {opp.category} • {opp.type.replace('_', ' ')}
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Save {formatINR(opp.potentialSavings)}
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 mt-2.5">{opp.title}</h4>

              {/* 4-Step Explanation Bar Required by Section 11 */}
              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center pb-2 border-b border-slate-200">
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Current Cost</div>
                    <div className="font-bold text-slate-700 mt-0.5">{formatINR(opp.currentCost)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Alternative</div>
                    <div className="font-bold text-slate-900 mt-0.5">{formatINR(opp.alternativeCost)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-700 font-medium">Potential Saving</div>
                    <div className="font-extrabold text-emerald-700 mt-0.5">-{formatINR(opp.potentialSavings)}</div>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-800 text-[11px]">Trade-Off Assessment: </span>
                  <span className="text-slate-600 text-[11px]">{opp.tradeOff}</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Action: {opp.actionableStep}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Alternative: {opp.providerAlternative}</span>
                <button
                  id={`btn-apply-opt-${opp.id}`}
                  onClick={() => handleApplyOptimization(opp)}
                  disabled={isApplied}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isApplied
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-2xs'
                  }`}
                >
                  {isApplied ? 'Applied to Budget' : 'Execute Optimization'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
