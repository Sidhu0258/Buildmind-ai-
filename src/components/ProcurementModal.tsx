import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { CategoryKey } from '../types/budget';
import { 
  ShieldAlert, 
  ShoppingCart, 
  Check, 
  AlertTriangle, 
  Layers, 
  X, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ProcurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseDetails: {
    category: CategoryKey;
    description: string;
    amount: number;
    supplierOrProvider: string;
  } | null;
}

export const ProcurementModal: React.FC<ProcurementModalProps> = ({
  isOpen,
  onClose,
  purchaseDetails
}) => {
  const { project, calculations, recordTransaction, setActiveTab } = useBudget();
  const [selectedAction, setSelectedAction] = useState<'proceed' | 'contingency' | 'reallocate' | 'lower_cost'>('proceed');
  const [successRecorded, setSuccessRecorded] = useState<boolean>(false);

  if (!isOpen || !purchaseDetails) return null;

  const currentCategory = project.categories[purchaseDetails.category] || {
    name: 'General',
    allocatedAmount: 100000,
    spentAmount: 0,
    committedAmount: 0
  };

  const costOfPurchase = purchaseDetails.amount;
  const currentTotalSpent = calculations.amountSpent;
  const remainingTotalAfter = calculations.remainingBudget - costOfPurchase;
  
  const categoryAvailable = currentCategory.allocatedAmount - (currentCategory.spentAmount + currentCategory.committedAmount);
  const categoryExceededBy = costOfPurchase > categoryAvailable ? costOfPurchase - categoryAvailable : 0;
  const isCategoryOverrun = categoryExceededBy > 0;

  const handleConfirm = () => {
    recordTransaction({
      category: purchaseDetails.category,
      description: purchaseDetails.description,
      amount: costOfPurchase,
      type: 'EXPENSE',
      supplierOrProvider: purchaseDetails.supplierOrProvider,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`
    });

    setSuccessRecorded(true);
    setTimeout(() => {
      setSuccessRecorded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Procurement Budget Confirmation</h3>
              <p className="text-xs text-slate-500">Section 16 Fiscal Safeguard Gate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Purchase Summary */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
          <div className="font-bold text-slate-900 text-sm">{purchaseDetails.description}</div>
          <div className="text-slate-500">Supplier: <strong className="text-slate-700">{purchaseDetails.supplierOrProvider}</strong></div>
          <div className="text-slate-500">Target Category: <strong className="text-slate-700">{currentCategory.name}</strong></div>
        </div>

        {/* 5-Field Breakdown Required by Section 16 */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
            <span className="text-slate-600">Total Authorized Project Budget:</span>
            <span className="font-bold text-slate-900">{formatINR(calculations.totalBudget)}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
            <span className="text-slate-600">Current Amount Spent to Date:</span>
            <span className="font-bold text-slate-900">{formatINR(currentTotalSpent)}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-lg bg-amber-50/70 border border-amber-200">
            <span className="text-amber-900 font-semibold">Cost of this Purchase:</span>
            <span className="font-extrabold text-amber-900">{formatINR(costOfPurchase)}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
            <span className="text-slate-600">Remaining Project Budget After Purchase:</span>
            <span className={`font-bold ${remainingTotalAfter >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {formatINR(remainingTotalAfter)}
            </span>
          </div>
          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
            <span className="text-slate-600">Current Category Balance Remaining:</span>
            <span className="font-bold text-slate-900">{formatINR(categoryAvailable)}</span>
          </div>
        </div>

        {/* Overrun Warning Notice (Prompt Example in Section 16) */}
        {isCategoryOverrun ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-rose-900">
                  ⚠️ This purchase will exceed your remaining {currentCategory.name} budget by {formatINR(categoryExceededBy)}.
                </div>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  BuildMind AI requires you to select an authorized mitigation strategy:
                </p>
              </div>
            </div>

            {/* User Decision Options */}
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-800 p-2 rounded bg-white border border-rose-200 cursor-pointer">
                <input
                  type="radio"
                  name="overrun_action"
                  checked={selectedAction === 'contingency'}
                  onChange={() => setSelectedAction('contingency')}
                  className="accent-slate-900"
                />
                <span>Draw difference ({formatINR(categoryExceededBy)}) from Emergency Contingency Reserve</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-800 p-2 rounded bg-white border border-rose-200 cursor-pointer">
                <input
                  type="radio"
                  name="overrun_action"
                  checked={selectedAction === 'proceed'}
                  onChange={() => setSelectedAction('proceed')}
                  className="accent-slate-900"
                />
                <span>Proceed anyway and absorb variance in {currentCategory.name} category</span>
              </label>

              <label 
                onClick={() => {
                  onClose();
                  setActiveTab('optimizer');
                }}
                className="flex items-center justify-between text-xs font-medium text-slate-800 p-2 rounded bg-white border border-rose-200 cursor-pointer hover:bg-slate-50"
              >
                <span>Switch to lower-cost alternative brand/supplier</span>
                <span className="text-amber-700 font-bold">Open Optimizer →</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fits comfortably within your {currentCategory.name} allocation. No overruns triggered.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-procurement"
            onClick={handleConfirm}
            disabled={successRecorded}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            {successRecorded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Recorded to Ledger!</span>
              </>
            ) : (
              <span>Authorize & Record Expense</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
