import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldAlert 
} from 'lucide-react';

export const BudgetHistoryAuditTrail: React.FC = () => {
  const { project, calculations } = useBudget();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const logs = project.auditTrail || [];

  const filteredLogs = logs.filter(item => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const actionText = (item.action || item.description || '').toLowerCase();
      const detailsText = (item.details || item.reason || '').toLowerCase();
      const userText = (item.changedBy || item.user || '').toLowerCase();
      return (
        actionText.includes(q) ||
        detailsText.includes(q) ||
        userText.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
            📜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Fiscal Governance</span>
              <span className="text-xs text-slate-400">• Complete Immutable History</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">Budget History & Audit Trail</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Section 18 compliance: Every budget revision, quotation commitment, expense drawdown, and category reallocation is permanently timestamped with user origin and reason.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'INITIAL_BUDGET', label: 'Initial Baseline' },
            { id: 'BUDGET_ADJUSTMENT', label: 'Budget Revisions' },
            { id: 'CATEGORY_REALLOCATION', label: 'Reallocations' },
            { id: 'CONTINGENCY_DRAWDOWN', label: 'Contingency' },
            { id: 'QUOTE_APPROVED', label: 'Quotes Approved' },
            { id: 'EXPENSE_RECORDED', label: 'Expenses Paid' },
            { id: 'SCENARIO_APPLIED', label: 'Simulations' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                filterType === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, details, user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* History Timeline */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
          <span>{filteredLogs.length} Audit Trail Records Found</span>
          <span>Chronological Log</span>
        </div>

        <div className="space-y-3">
          {filteredLogs.map(item => (
            <div
              key={item.id}
              id={`audit-item-${item.id}`}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">• {item.timestamp}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                      {item.changedBy || item.user || 'System'}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">{item.action || item.description}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{item.details || item.reason}</p>
                </div>
              </div>

              <div className="text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                {item.amountChanged !== undefined && item.amountChanged !== 0 && (
                  <div className={`text-sm font-extrabold ${item.amountChanged > 0 ? 'text-slate-900' : 'text-emerald-700'}`}>
                    {item.amountChanged > 0 ? `+${formatINR(item.amountChanged)}` : formatINR(item.amountChanged)}
                  </div>
                )}
                {item.newBudgetTotal !== undefined && (
                  <div className="text-[11px] text-slate-500 font-medium">
                    New Total: <strong>{formatINR(item.newBudgetTotal)}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
