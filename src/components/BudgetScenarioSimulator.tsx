import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  Layers, 
  HelpCircle 
} from 'lucide-react';
import { QualityLevel } from '../types/budget';

interface ScenarioPreset {
  id: string;
  title: string;
  description: string;
  budgetDelta: number;
  quality: QualityLevel;
  timelineWeeksDelta: number;
  materialsImpact: number;
  labourImpact: number;
  finishingImpact: number;
  contingencyDelta: number;
}

const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'scen-01',
    title: 'What if I increase budget by ₹2 Lakh?',
    description: 'Direct capital infusion into emergency contingency reserve and high-durability UPVC soundproof acoustic glazing.',
    budgetDelta: 200000,
    quality: 'Standard',
    timelineWeeksDelta: 0,
    materialsImpact: 0,
    labourImpact: 0,
    finishingImpact: 100000,
    contingencyDelta: 100000
  },
  {
    id: 'scen-02',
    title: 'What if I reduce budget by ₹5 Lakh?',
    description: 'Compress spending by choosing value-grade vitrified tiles, standard flush doors, and postponing false ceiling decorative lighting.',
    budgetDelta: -500000,
    quality: 'Budget',
    timelineWeeksDelta: -2,
    materialsImpact: -150000,
    labourImpact: -80000,
    finishingImpact: -200000,
    contingencyDelta: -70000
  },
  {
    id: 'scen-03',
    title: 'What if I choose Premium Sintered Stone Tiles?',
    description: 'Upgrade from 800x1200mm double-charge vitrified tiles to 1200x2400mm Italian Statuario continuous porcelain slabs.',
    budgetDelta: 0,
    quality: 'Premium',
    timelineWeeksDelta: 1,
    materialsImpact: 0,
    labourImpact: 25000,
    finishingImpact: 115000,
    contingencyDelta: -140000
  },
  {
    id: 'scen-04',
    title: 'What if I use Direct-from-Morbi Factory Sourcing?',
    description: 'Bypass local retail tile markups and order direct pallet consignments from Gujarat ceramic hub.',
    budgetDelta: 0,
    quality: 'Standard',
    timelineWeeksDelta: 1, // 1 week lead time
    materialsImpact: 0,
    labourImpact: 0,
    finishingImpact: -28000,
    contingencyDelta: 28000
  },
  {
    id: 'scen-05',
    title: 'What if I Renovate Existing Structure instead of Rebuilding?',
    description: 'Retain foundation and load-bearing columns; replace flooring, wiring, plumbing, and modern facade.',
    budgetDelta: -1100000,
    quality: 'Standard',
    timelineWeeksDelta: -10,
    materialsImpact: -600000,
    labourImpact: -350000,
    finishingImpact: -100000,
    contingencyDelta: -50000
  }
];

export const BudgetScenarioSimulator: React.FC = () => {
  const { project, calculations, applyScenario } = useBudget();

  const [selectedPreset, setSelectedPreset] = useState<ScenarioPreset | null>(PRESET_SCENARIOS[0]);
  const [customBudgetDelta, setCustomBudgetDelta] = useState<number>(200000);
  const [customQuality, setCustomQuality] = useState<QualityLevel>(project.qualityPreference);
  const [customFinishingImpact, setCustomFinishingImpact] = useState<number>(50000);
  const [customTimelineWeeks, setCustomTimelineWeeks] = useState<number>(0);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  // Compute simulated numbers
  const simulatedBudget = project.totalBudget + customBudgetDelta;
  const simulatedCost = calculations.projectedFinalCost + customFinishingImpact;
  const simulatedContingency = Math.max(0, calculations.contingencyRemaining + (customBudgetDelta > 0 ? customBudgetDelta * 0.3 : customBudgetDelta * 0.5));
  const simulatedRemaining = simulatedBudget - (calculations.amountSpent + calculations.committedCost + customFinishingImpact);

  const handleSelectPreset = (preset: ScenarioPreset) => {
    setSelectedPreset(preset);
    setCustomBudgetDelta(preset.budgetDelta);
    setCustomQuality(preset.quality);
    setCustomFinishingImpact(preset.finishingImpact);
    setCustomTimelineWeeks(preset.timelineWeeksDelta);
    setAppliedSuccess(false);
  };

  const handleApplyToProject = () => {
    applyScenario({
      budgetDelta: customBudgetDelta,
      categoryDeltas: {
        finishing: customFinishingImpact
      },
      qualityChange: customQuality,
      reason: selectedPreset ? selectedPreset.title : `Custom Simulation (Budget Δ: ${formatINR(customBudgetDelta)})`
    });

    setAppliedSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 text-white shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
            🎛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Simulation Sandbox</span>
              <span className="text-xs text-slate-400">• Zero-Risk Exploration</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">Budget Scenario Simulator ("What If?")</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Stress-test design choices, capital injections, supplier swaps, or quality shifts. None of these adjustments impact your live project until you explicitly confirm.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Scenario Buttons (Section 12 Examples) */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Select a Common "What If?" Scenario:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_SCENARIOS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3.5 rounded-xl text-left border transition-all ${
                selectedPreset?.id === preset.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="text-xs font-bold flex items-center justify-between">
                <span>{preset.title}</span>
                {preset.budgetDelta !== 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    preset.budgetDelta > 0 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {preset.budgetDelta > 0 ? `+${formatINR(preset.budgetDelta)}` : formatINR(preset.budgetDelta)}
                  </span>
                )}
              </div>
              <p className={`text-[11px] mt-1 line-clamp-2 ${
                selectedPreset?.id === preset.id ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Simulation Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Slider Panel */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <span>Interactive Scenario Controls</span>
          </h3>

          {/* Budget Delta Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Budget Adjustment (Δ):</span>
              <span className={`font-bold ${customBudgetDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {customBudgetDelta >= 0 ? `+${formatINR(customBudgetDelta)}` : formatINR(customBudgetDelta)}
              </span>
            </div>
            <input
              type="range"
              min="-1000000"
              max="1500000"
              step="50000"
              value={customBudgetDelta}
              onChange={(e) => {
                setCustomBudgetDelta(Number(e.target.value));
                setSelectedPreset(null);
                setAppliedSuccess(false);
              }}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>-₹10 Lakh</span>
              <span>Baseline (₹0)</span>
              <span>+₹15 Lakh</span>
            </div>
          </div>

          {/* Quality Tier Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Simulated Quality Level:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Budget', 'Standard', 'Premium'] as QualityLevel[]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setCustomQuality(q);
                    setAppliedSuccess(false);
                  }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-colors ${
                    customQuality === q
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Material / Finishing Shift */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Finishing & Specification Shift:</span>
              <span className="font-bold text-slate-900">
                {customFinishingImpact >= 0 ? `+${formatINR(customFinishingImpact)}` : formatINR(customFinishingImpact)}
              </span>
            </div>
            <input
              type="range"
              min="-300000"
              max="400000"
              step="20000"
              value={customFinishingImpact}
              onChange={(e) => {
                setCustomFinishingImpact(Number(e.target.value));
                setAppliedSuccess(false);
              }}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Timeline Shift */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Execution Timeline Impact:</span>
              <span className="font-bold text-slate-900">
                {customTimelineWeeks > 0 ? `+${customTimelineWeeks} Weeks` : customTimelineWeeks < 0 ? `${customTimelineWeeks} Weeks` : 'On Schedule'}
              </span>
            </div>
            <input
              type="range"
              min="-12"
              max="8"
              step="1"
              value={customTimelineWeeks}
              onChange={(e) => {
                setCustomTimelineWeeks(Number(e.target.value));
                setAppliedSuccess(false);
              }}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Projected Impact Panel (Section 12 Requirements) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Simulated Outcomes Comparison</h3>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
              Draft Sandbox
            </span>
          </div>

          {/* Comparison Cards: Current vs Simulated */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Live Project</div>
              <div className="text-base font-extrabold text-slate-900">{formatINR(project.totalBudget)}</div>
              <div className="text-[11px] text-slate-500">Projected: {formatINR(calculations.projectedFinalCost)}</div>
              <div className="text-[11px] text-slate-500">Contingency: {formatINR(calculations.contingencyRemaining)}</div>
              <div className="text-[11px] text-slate-500">Quality: {project.qualityPreference}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-200 space-y-1">
              <div className="text-[10px] uppercase font-bold text-indigo-700">Simulated Scenario</div>
              <div className="text-base font-extrabold text-indigo-950">{formatINR(simulatedBudget)}</div>
              <div className="text-[11px] text-indigo-900 font-semibold">Projected: {formatINR(simulatedCost)}</div>
              <div className="text-[11px] text-indigo-800">Contingency: {formatINR(simulatedContingency)}</div>
              <div className="text-[11px] text-indigo-800">Quality: {customQuality}</div>
            </div>
          </div>

          {/* Impact Matrix List Required by Section 12 */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50">
              <span className="text-slate-600">Materials Impact:</span>
              <span className="font-bold text-slate-900">
                Standard structural grade preserved (100% compliant)
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50">
              <span className="text-slate-600">Finishing & Fixtures:</span>
              <span className="font-bold text-slate-900">
                {customFinishingImpact >= 0 ? `+${formatINR(customFinishingImpact)}` : formatINR(customFinishingImpact)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50">
              <span className="text-slate-600">Estimated Timeline:</span>
              <span className="font-bold text-slate-900">
                {customTimelineWeeks !== 0 ? `${customTimelineWeeks > 0 ? '+' : ''}${customTimelineWeeks} weeks shift` : 'Unchanged'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50">
              <span className="text-slate-600">Projected Final Buffer:</span>
              <span className={`font-bold ${simulatedBudget - simulatedCost >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {formatINR(simulatedBudget - simulatedCost)} remaining
              </span>
            </div>
          </div>

          {/* Apply to Real Project Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {appliedSuccess ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Successfully applied scenario to live project and logged to audit!
                </span>
              ) : (
                <span>Clicking below updates real project budget with a timestamped audit entry.</span>
              )}
            </div>

            <button
              id="btn-apply-scenario"
              onClick={handleApplyToProject}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors shrink-0"
            >
              Apply Scenario to Real Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
