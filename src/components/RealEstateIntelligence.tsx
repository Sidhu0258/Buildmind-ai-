import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { MOCK_PROPERTIES } from '../data/initialData';
import { PropertyListingItem } from '../types/budget';
import { 
  Building2, 
  Search, 
  MapPin, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Info, 
  ShieldCheck, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';

export const RealEstateIntelligence: React.FC = () => {
  const { project, updatePreferences } = useBudget();
  const [propertyBudget, setPropertyBudget] = useState<number>(8000000); // ₹80 Lakh from prompt
  const [showStretchOptions, setShowStretchOptions] = useState<boolean>(project.budgetFlexibility !== 'Strict');

  const filteredProperties = MOCK_PROPERTIES.filter(prop => {
    if (prop.isStretchOption) {
      return showStretchOptions;
    }
    return prop.listPrice <= propertyBudget;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Real Estate Fiscal Engine</span>
              <span className="text-xs text-slate-400">• Transparent Acquisition Breakdown</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">Real Estate Budget Intelligence</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Dissects property search results beyond the sticker price. Clearly separates bare List Price from statutory government Stamp Duty, Registration, and Legal Verification costs.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Range Controls (Section 13 Example) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Property Budget</span>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">
              Target: {formatINR(propertyBudget)} <span className="text-xs text-slate-500 font-normal">(Preferred: {formatINR(propertyBudget * 0.9)} – {formatINR(propertyBudget)})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showStretchOptions}
                onChange={(e) => setShowStretchOptions(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 accent-slate-900"
              />
              <span>Allow Stretch Options ({formatINR(propertyBudget)} – {formatINR(propertyBudget * 1.07)})</span>
            </label>
          </div>
        </div>

        {/* Quick Range Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {[
            { label: '₹60 Lakh', val: 6000000 },
            { label: '₹75 Lakh', val: 7500000 },
            { label: '₹80 Lakh (Prompt Benchmark)', val: 8000000 },
            { label: '₹1.0 Crore', val: 10000000 },
            { label: '₹1.5 Crore', val: 15000000 },
          ].map(item => (
            <button
              key={item.val}
              onClick={() => setPropertyBudget(item.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                propertyBudget === item.val
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProperties.map(prop => (
          <div
            key={prop.id}
            id={`property-card-${prop.id}`}
            className={`rounded-xl border overflow-hidden bg-white shadow-xs flex flex-col justify-between transition-all ${
              prop.isStretchOption ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
            }`}
          >
            <div>
              {/* Image */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={prop.imageUrl}
                  alt={prop.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white uppercase tracking-wider">
                    {prop.type}
                  </span>
                  {prop.isStretchOption && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                      Stretch Option
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-extrabold">
                  {formatINR(prop.listPrice)} List Price
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{prop.title}</h3>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{prop.location}</span>
                  </div>
                </div>

                {/* Statutory Costs Table (Section 13 Requirement) */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Estimated Acquisition Costs (Statutory Breakdown)
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Stamp Duty (~5.5%):</span>
                    <span className="font-medium text-slate-800">{formatINR(prop.estimatedAcquisitionCosts.stampDuty)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Registration Fee (~1%):</span>
                    <span className="font-medium text-slate-800">{formatINR(prop.estimatedAcquisitionCosts.registrationFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Legal Verification & Khata:</span>
                    <span className="font-medium text-slate-800">{formatINR(prop.estimatedAcquisitionCosts.legalVerification)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                    <span>Total Additional Outlay:</span>
                    <span className="text-amber-700">+{formatINR(prop.estimatedAcquisitionCosts.totalAcquisitionCost)}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200 flex items-center justify-between text-xs">
                  <span className="text-indigo-900 font-bold">Total Projected Outlay:</span>
                  <span className="text-sm font-extrabold text-indigo-950">{formatINR(prop.totalProjectedOutlay)}</span>
                </div>

                {/* Highlights */}
                <div className="space-y-1">
                  {prop.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="text-[10px] text-slate-400 italic mb-2">
                *Estimated costs are non-binding municipal approximations.
              </div>
              <button
                id={`btn-analyze-prop-${prop.id}`}
                className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                Inquire Property & Verification
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
