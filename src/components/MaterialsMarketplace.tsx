import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { MOCK_THREE_TIER_MATERIALS } from '../data/initialData';
import { RecommendationTierItem } from '../types/budget';
import { 
  Store, 
  Search, 
  Check, 
  X, 
  ShieldCheck, 
  Truck, 
  ShoppingCart, 
  Sparkles, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface MaterialsMarketplaceProps {
  onOpenProcurementModal: (item: {
    category: any;
    description: string;
    amount: number;
    supplierOrProvider: string;
  }) => void;
}

export const MaterialsMarketplace: React.FC<MaterialsMarketplaceProps> = ({ onOpenProcurementModal }) => {
  const { project, calculations } = useBudget();
  const [activeCategory, setActiveCategory] = useState<string>('cement');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentItems = MOCK_THREE_TIER_MATERIALS[activeCategory] || [];

  // Filter based on search
  const filteredItems = searchQuery
    ? currentItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brandOrProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specs.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentItems;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
            🧱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">3-Tier Recommendation Engine</span>
              <span className="text-xs text-slate-400">• Budget Aware Procurement</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">Materials 3-Tier Marketplace</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Real-time catalog comparing Budget, Balanced, and Premium certified materials against your active allocation in {project.name}.
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'cement', label: 'Cement & Concrete' },
            { id: 'steel', label: 'TMT Steel Rebars' },
            { id: 'tiles', label: 'Tiles & Slabs' },
            { id: 'paint', label: 'Emulsion & Paint' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand, spec, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* 3-Tier Grid: Budget, Balanced, Premium (Section 7 & 15) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isBudget = item.tier === 'BUDGET';
          const isBalanced = item.tier === 'BALANCED';
          const isPremium = item.tier === 'PREMIUM';

          return (
            <div
              key={item.id}
              id={`material-tier-${item.id}`}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                isBalanced
                  ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900/10 relative'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {isBalanced && (
                <div className="absolute -top-2.5 right-4 bg-slate-900 text-amber-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Recommended Balance
                </div>
              )}

              <div className="space-y-3">
                {/* Header tier badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide flex items-center gap-1 ${
                    isBudget 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : isBalanced 
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' 
                      : 'bg-purple-50 text-purple-800 border border-purple-200'
                  }`}>
                    {isBudget && '💰 Budget Option'}
                    {isBalanced && '⚖️ Balanced Option'}
                    {isPremium && '⭐ Premium Option'}
                  </span>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    item.fitsBudget 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.fitsBudget ? 'Fits Budget' : 'Exceeds Target'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">{item.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{item.brandOrProvider} • {item.specs}</div>
                </div>

                {/* Price & Quantity Breakdown */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Unit Rate:</span>
                    <span className="font-extrabold text-slate-900">
                      {formatINR(item.unitPrice)} / {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Est. Project Quantity:</span>
                    <span className="font-bold text-slate-700">{item.estimatedQuantity} {item.unit}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-700 font-bold">Estimated Total:</span>
                    <span className="font-extrabold text-slate-900">{formatINR(item.estimatedTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Budget Impact:</span>
                    <span className={item.budgetImpact <= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                      {item.budgetImpact === 0 ? 'Exact Baseline' : item.budgetImpact < 0 ? `Saves ${formatINR(Math.abs(item.budgetImpact))}` : `+${formatINR(item.budgetImpact)} over`}
                    </span>
                  </div>
                </div>

                {/* Advantages */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Key Advantages:</div>
                  {item.advantages.map((adv, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>

                {/* Disadvantages */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Trade-Offs / Notes:</div>
                  {item.disadvantages.map((dis, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-500">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{dis}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Intent / Procurement Modal trigger */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  id={`btn-procure-${item.id}`}
                  onClick={() => onOpenProcurementModal({
                    category: item.category,
                    description: `${item.name} (${item.estimatedQuantity} ${item.unit})`,
                    amount: item.estimatedTotal,
                    supplierOrProvider: item.brandOrProvider
                  })}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                    isBalanced
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Initiate Procurement Control</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
