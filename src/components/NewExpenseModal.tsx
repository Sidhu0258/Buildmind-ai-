import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { CategoryKey } from '../types/budget';
import { X, Check, DollarSign } from 'lucide-react';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ isOpen, onClose }) => {
  const { project, recordTransaction } = useBudget();

  const [category, setCategory] = useState<CategoryKey>('materials');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [invoice, setInvoice] = useState<string>('');
  const [txType, setTxType] = useState<'EXPENSE' | 'COMMITMENT' | 'QUOTE'>('EXPENSE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!description.trim() || isNaN(num) || num <= 0) return;

    recordTransaction({
      category,
      description,
      amount: num,
      type: txType,
      supplierOrProvider: supplier || 'Direct Sourcing',
      invoiceNumber: invoice || `INV-${Date.now().toString().slice(-4)}`
    });

    onClose();
  };

  const categories = Object.values(project.categories);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              +
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Record Project Financial Item</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Transaction Type */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Entry Type:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'EXPENSE', label: 'Paid Expense' },
                { id: 'COMMITMENT', label: 'Signed Contract' },
                { id: 'QUOTE', label: 'Vendor Quote' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTxType(t.id as any)}
                  className={`py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                    txType === t.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
              className="w-full font-medium text-slate-900 px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} (Allocated: {formatINR(c.allocatedAmount)})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description / Item:</label>
            <input
              type="text"
              required
              placeholder="e.g. 150 bags UltraTech Cement OPC 53"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Amount (₹):</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                required
                step="100"
                placeholder="58000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 font-bold border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          {/* Supplier / Provider */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Supplier / Contractor Name:</label>
            <input
              type="text"
              placeholder="e.g. Balaji Building Supplies"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Record to Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
