import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR, evaluateProjectAffordability } from '../services/budgetCalculator';
import { QualityLevel } from '../types/budget';
import { 
  HelpCircle, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Sliders, 
  ShieldCheck 
} from 'lucide-react';

interface AffordabilityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AffordabilityCheckerModal: React.FC<AffordabilityCheckerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { project, setActiveTab } = useBudget();

  const [testBudget, setTestBudget] = useState<number>(project.totalBudget);
  const [testArea, setTestArea] = useState<number>(project.builtUpAreaSqFt);
  const [testQuality, setTestQuality] = useState<QualityLevel>(project.qualityPreference);
  const [testLocation, setTestLocation] = useState<string>(project.location);
  const [testType, setTestType] = useState<string>(project.projectType);

  if (!isOpen) return null;

  const result = evaluateProjectAffordability({
    budget: testBudget,
    builtUpAreaSqFt: testArea,
    qualityLevel: testQuality,
    location: testLocation,
    projectType: testType
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg">
              🎯
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Project Affordability Engine</h3>
              <p className="text-xs text-slate-500">"Can I achieve what I want within my budget?" (Section 6)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Evaluation Verdict */}
        <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          result.verdict === 'YES'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : result.verdict === 'POSSIBLY'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          <div className="shrink-0 mt-0.5">
            {result.verdict === 'YES' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
            {result.verdict === 'POSSIBLY' && <AlertTriangle className="w-6 h-6 text-amber-600" />}
            {result.verdict === 'NO' && <XCircle className="w-6 h-6 text-rose-600" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">Feasibility Verdict:</span>
              <span className="text-base font-black">
                {result.verdict === 'YES' && 'YES — Fully Achievable'}
                {result.verdict === 'POSSIBLY' && 'POSSIBLY — Feasible with Discipline'}
                {result.verdict === 'NO' && 'NO — Budget Shortfall Identified'}
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90">{result.summary}</p>
          </div>
        </div>

        {/* Live Input Controls */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Parameters Under Test</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Budget (₹):</label>
              <input
                type="number"
                step="50000"
                value={testBudget}
                onChange={(e) => setTestBudget(Number(e.target.value))}
                className="w-full font-bold text-slate-900 px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Built-Up Area (sq.ft):</label>
              <input
                type="number"
                step="100"
                value={testArea}
                onChange={(e) => setTestArea(Number(e.target.value))}
                className="w-full font-bold text-slate-900 px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quality Level:</label>
              <select
                value={testQuality}
                onChange={(e) => setTestQuality(e.target.value as QualityLevel)}
                className="w-full font-medium text-slate-900 px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Budget">Budget</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Typical Cost Band:</label>
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-800">
                {formatINR(result.estimatedMinCost)} – {formatINR(result.estimatedMaxCost)}
              </div>
            </div>
          </div>
        </div>

        {/* Cost Drivers */}
        <div className="space-y-1.5 text-xs">
          <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Identified Primary Cost Drivers:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.costDrivers.map((cd, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                <span>{cd}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Compromises & Adjustments */}
        <div className="space-y-1.5 text-xs">
          <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Recommended Engineering Adjustments:</div>
          <div className="space-y-1.5">
            {result.potentialCompromises.map((pc, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{pc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Structural Safety Notice */}
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Affordability calculations will never suggest compromising structural steel or foundations.</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              setActiveTab('optimizer');
            }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            Explore Safe Optimizations →
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
          >
            Close Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};
