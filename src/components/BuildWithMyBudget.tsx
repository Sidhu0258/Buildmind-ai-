import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR, generatePreliminaryAllocation, evaluateProjectAffordability } from '../services/budgetCalculator';
import { QualityLevel, BudgetFlexibility, FinancingPreference } from '../types/budget';
import { 
  Compass, 
  Sparkles, 
  Home, 
  Building, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  Layers, 
  ArrowRight,
  HardHat,
  BrickWall,
  Zap,
  Droplets,
  Paintbrush,
  DoorClosed,
  Users,
  CreditCard
} from 'lucide-react';

export const BuildWithMyBudget: React.FC = () => {
  const { createNewProjectFromBudget } = useBudget();

  // Wizard state
  const [budgetAmount, setBudgetAmount] = useState<number>(3000000); // ₹30 Lakh default
  const [customInput, setCustomInput] = useState<string>('3000000');
  const [location, setLocation] = useState<string>('Whitefield, Bengaluru, KA');
  const [plotArea, setPlotArea] = useState<number>(1500);
  const [builtUpArea, setBuiltUpArea] = useState<number>(2000);
  const [propertyType, setPropertyType] = useState<string>('3BHK Duplex');
  const [floors, setFloors] = useState<number>(2);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [quality, setQuality] = useState<QualityLevel>('Standard');
  const [flexibility, setFlexibility] = useState<BudgetFlexibility>('Slightly Flexible');
  const [financing, setFinancing] = useState<FinancingPreference>('Milestone-based');
  const [specialReqs, setSpecialReqs] = useState<string>('Solar conduit provision, rainwater harvesting sump');
  const [planGenerated, setPlanGenerated] = useState<boolean>(true);

  // Evaluate affordability and generate plan
  const affordability = evaluateProjectAffordability({
    budget: budgetAmount,
    builtUpAreaSqFt: builtUpArea,
    qualityLevel: quality,
    location,
    projectType: propertyType
  });

  const estimatedCost = Math.round(budgetAmount * 0.95);
  const contingency = Math.round(budgetAmount * 0.05);

  const allocations = generatePreliminaryAllocation({
    totalBudget: budgetAmount,
    builtUpAreaSqFt: builtUpArea,
    qualityLevel: quality,
    location,
    floors
  });

  const handleQuickBudgetSelect = (amount: number) => {
    setBudgetAmount(amount);
    setCustomInput(amount.toString());
  };

  const handleApplyToProject = () => {
    createNewProjectFromBudget({
      name: `${propertyType} (${builtUpArea} sq.ft) - ${location.split(',')[0]}`,
      location,
      budget: budgetAmount,
      builtUpAreaSqFt: builtUpArea,
      plotAreaSqFt: plotArea,
      floors,
      bedrooms,
      qualityPreference: quality,
      budgetFlexibility: flexibility,
      financingPreference: financing
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
            🧭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Turnkey Generator</span>
              <span className="text-xs text-slate-400">• Dynamic Architectural Feasibility</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">Build With My Budget</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Define your financial envelope first. BuildMind AI calibrates the full ecosystem—contractors, materials, engineers, finishing, and cashflow schedule—to safely achieve your home within budget.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>1. What is your budget target?</span>
            </h3>

            {/* Quick Range Selection Pills (Prompt Section 2 & 9) */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Preset Benchmarks:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '₹10 Lakh', val: 1000000 },
                  { label: '₹20 Lakh', val: 2000000 },
                  { label: '₹25 Lakh', val: 2500000 },
                  { label: '₹30 Lakh', val: 3000000 },
                  { label: '₹50 Lakh', val: 5000000 },
                  { label: '₹1 Crore+', val: 10000000 },
                ].map(tier => (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => handleQuickBudgetSelect(tier.val)}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-colors ${
                      budgetAmount === tier.val
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exact Custom Amount */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Enter Exact Amount (₹):</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  step="50000"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    const parsed = Number(e.target.value);
                    if (parsed > 0) setBudgetAmount(parsed);
                  }}
                  className="w-full text-base font-extrabold text-slate-900 pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Formatted: <strong className="text-slate-800">{formatINR(budgetAmount)}</strong>
              </div>
            </div>

            {/* Quality Preference */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Preferred Quality Tier:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Budget', 'Standard', 'Premium'] as QualityLevel[]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-colors ${
                      quality === q
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Flexibility */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Budget Flexibility:</label>
              <select
                value={flexibility}
                onChange={(e) => setFlexibility(e.target.value as BudgetFlexibility)}
                className="w-full text-xs font-medium text-slate-900 px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Strict">Strict budget (Hard Cap)</option>
                <option value="Slightly Flexible">Slightly flexible (±5%)</option>
                <option value="Flexible for Quality">Flexible for better quality (±15%)</option>
              </select>
            </div>

            {/* Built-up Area & Plot */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Built-Up Area (sq.ft):</label>
                <input
                  type="number"
                  step="100"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                  className="w-full text-xs font-bold text-slate-900 px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Plot Area (sq.ft):</label>
                <input
                  type="number"
                  step="100"
                  value={plotArea}
                  onChange={(e) => setPlotArea(Number(e.target.value))}
                  className="w-full text-xs font-bold text-slate-900 px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Location & Bedrooms */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Location:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs text-slate-900 px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Floors / BHK:</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-xs font-medium text-slate-900 px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="2BHK Ground Floor">2BHK Ground</option>
                  <option value="3BHK Duplex">3BHK Duplex (G+1)</option>
                  <option value="4BHK Independent Villa">4BHK Villa (G+2)</option>
                </select>
              </div>
            </div>

            <button
              id="btn-generate-budget-plan"
              onClick={() => setPlanGenerated(true)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide shadow-xs transition-colors"
            >
              Recalculate Turnkey Feasibility
            </button>
          </div>
        </div>

        {/* Right Output: Generated Preliminary Project Plan (Section 9 & 23) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Plan Summary Card */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Project Plan</span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  🏠 {propertyType} ({builtUpArea} sq.ft)
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                affordability.verdict === 'YES' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : affordability.verdict === 'POSSIBLY'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {affordability.verdict === 'YES' ? '🟢 Within Budget' : affordability.verdict === 'POSSIBLY' ? '🟡 Possibly Feasible' : '🔴 Budget Shortfall'}
              </span>
            </div>

            {/* Financial Quick Strip */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Target Budget</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">{formatINR(budgetAmount)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Estimated Cost</div>
                <div className="text-base font-extrabold text-indigo-950 mt-0.5">{formatINR(estimatedCost)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Contingency</div>
                <div className="text-base font-extrabold text-emerald-700 mt-0.5">{formatINR(contingency)}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-200/60">
              {affordability.summary}
            </p>

            {/* Recommended Trades & Material Suppliers (Section 23) */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recommended Ecosystem Breakdown</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Construction Materials */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <BrickWall className="w-3.5 h-3.5 text-slate-600" />
                      🧱 Materials
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">{formatINR(allocations.materials.allocatedAmount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Tata Tiscon 550D Rebars & UltraTech WeatherShield
                  </div>
                </div>

                {/* Contractors */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5 text-slate-600" />
                      👷 Contractors & Labour
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">{formatINR(allocations.labour.allocatedAmount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Balaji Masonry (Turnkey RCC framing & brickwork)
                  </div>
                </div>

                {/* Engineers & Architecture */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-slate-600" />
                      📐 Engineers & Architects
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">{formatINR(allocations.professional_services.allocatedAmount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Er. R. Sundaram (STAAD.Pro load calculations)
                  </div>
                </div>

                {/* Electricians */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-slate-600" />
                      ⚡ Electricians
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">{formatINR(allocations.electrical.allocatedAmount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Apex Electrical Solutions (FR-LSH concealed wiring)
                  </div>
                </div>

                {/* Plumbers */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-slate-600" />
                      🚰 Plumbers
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">{formatINR(allocations.plumbing.allocatedAmount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    AquaGuard Specialists (Astral CPVC / UPVC)
                  </div>
                </div>

                {/* Painters */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Paintbrush className="w-3.5 h-3.5 text-slate-600" />
                      🎨 Painters
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">{formatINR(allocations.painting.allocatedAmount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Precision Paint (Asian Paints Royale / Apex)
                  </div>
                </div>
              </div>
            </div>

            {/* Launch as Active Project Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Ready to make this your live project context?
              </div>
              <button
                id="btn-apply-turnkey-plan"
                onClick={handleApplyToProject}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Adopt Plan as Live Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
