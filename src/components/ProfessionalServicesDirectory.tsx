import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { MOCK_PROFESSIONALS } from '../data/initialData';
import { ProfessionalServiceItem } from '../types/budget';
import { 
  Users, 
  Search, 
  Star, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  Briefcase
} from 'lucide-react';

interface ProfessionalServicesDirectoryProps {
  onOpenProcurementModal: (item: {
    category: any;
    description: string;
    amount: number;
    supplierOrProvider: string;
  }) => void;
}

export const ProfessionalServicesDirectory: React.FC<ProfessionalServicesDirectoryProps> = ({ onOpenProcurementModal }) => {
  const { project, calculations } = useBudget();
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [userCustomBudget, setUserCustomBudget] = useState<number>(60000);
  const [customBudgetCategory, setCustomBudgetCategory] = useState<string>('painting');

  const roles = [
    'ALL',
    'Architect',
    'Structural Engineer',
    'General Contractor',
    'Electrician',
    'Plumber',
    'Painter',
    'Carpenter'
  ];

  const getBadgeForProfessional = (prof: ProfessionalServiceItem) => {
    // Dynamic calculation against userCustomBudget if trade matches or against default allocation
    let fit = prof.budgetFit;
    if (selectedRole !== 'ALL' && userCustomBudget > 0) {
      if (prof.estimatedTotal <= userCustomBudget) {
        fit = 'WITHIN_BUDGET';
      } else if (prof.estimatedTotal <= userCustomBudget * 1.15) {
        fit = 'NEAR_BUDGET';
      } else {
        fit = 'ABOVE_BUDGET';
      }
    }

    switch (fit) {
      case 'WITHIN_BUDGET':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Within Budget
          </span>
        );
      case 'NEAR_BUDGET':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Near Budget
          </span>
        );
      case 'ABOVE_BUDGET':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Above Budget
          </span>
        );
    }
  };

  const filteredProfessionals = MOCK_PROFESSIONALS.filter(prof => {
    if (selectedRole === 'ALL') return true;
    return prof.role === selectedRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
            👷
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Certified Trade Network</span>
              <span className="text-xs text-slate-400">• Verified Experience & Reputation</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">Professional Services & Trade Contractors</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Filter engineers, electricians, plumbers, carpenters, and painters by your specified service budget cap. Ranked comprehensively by experience, verified ratings, code compliance, and affordability.
            </p>
          </div>
        </div>
      </div>

      {/* Service Budget Filter Bar (Section 14 Example: "I have ₹60,000 for painting") */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-slate-700 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">Define Service Budget Cap:</div>
            <p className="text-[11px] text-slate-500">Test bids against custom limits (e.g., "I have ₹60,000 for painting")</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
            <input
              type="number"
              step="5000"
              value={userCustomBudget}
              onChange={(e) => setUserCustomBudget(Number(e.target.value))}
              className="w-36 text-xs font-bold text-slate-900 pl-7 pr-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">allocated limit for trade search</span>
        </div>
      </div>

      {/* Trade Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedRole === role
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {role === 'ALL' ? 'All Professionals' : role}
          </button>
        ))}
      </div>

      {/* Professionals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProfessionals.map(prof => (
          <div
            key={prof.id}
            id={`professional-card-${prof.id}`}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-extrabold text-slate-900">{prof.name}</h3>
                    {prof.verified && (
                      <span title="Verified License">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 fill-indigo-50" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{prof.role}</span>
                    <span>• {prof.experienceYears} Years Exp</span>
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 stroke-none mr-0.5" />
                      {prof.rating} ({prof.reviewsCount})
                    </span>
                  </div>
                </div>

                {getBadgeForProfessional(prof)}
              </div>

              {/* Location & Availability */}
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {prof.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {prof.availability}
                </span>
              </div>

              {/* Skills / Scope tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {prof.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Rates & Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Quoted Rate</div>
                <div className="text-sm font-extrabold text-slate-900">
                  {formatINR(prof.quotedRate)} <span className="text-xs font-normal text-slate-500">/ {prof.rateUnit}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Est. Total: <strong>{formatINR(prof.estimatedTotal)}</strong>
                </div>
              </div>

              <button
                id={`btn-book-prof-${prof.id}`}
                onClick={() => onOpenProcurementModal({
                  category: prof.role === 'Electrician' ? 'electrical' : prof.role === 'Plumber' ? 'plumbing' : prof.role === 'Painter' ? 'painting' : prof.role === 'Carpenter' ? 'doors_windows' : 'labour',
                  description: `${prof.role} Contract - ${prof.name}`,
                  amount: prof.estimatedTotal,
                  supplierOrProvider: prof.name
                })}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors"
              >
                Issue Work Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
