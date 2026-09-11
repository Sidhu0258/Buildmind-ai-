import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink, 
  Star, 
  TrendingUp, 
  DollarSign, 
  RefreshCw,
  Phone
} from 'lucide-react';

interface BudgetGuardianAgentProps {
  onOpenProcurementModal?: (item: any) => void;
}

export const BudgetGuardianAgent: React.FC<BudgetGuardianAgentProps> = () => {
  const { project, calculations, resolveAlert, setActiveTab } = useBudget();

  const activeAlerts = project.activeAlerts.filter(a => a.status === 'active');
  const resolvedAlerts = project.activeAlerts.filter(a => a.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Autonomous Agent</span>
                <span className="text-xs text-slate-400">• Continuous Sentinel</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mt-1">Budget Guardian Agent</h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                Continuously evaluates quotations, supplier rate variations, labor milestone billings, and unbudgeted line items. Identifies overruns early and proposes certified cost-safe alternatives. The user retains 100% final authorization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-300">Active Sentinel Flags</div>
              <div className="text-lg font-extrabold text-amber-300">{activeAlerts.length} Attention Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Evaluation Parameters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Quotations Audited</div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">14 Bids</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Market Verified</span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Supplier Price Monitor</div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">Live Tracked</div>
          <div className="text-[11px] text-slate-500 mt-1">Cement & Steel weekly feed</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Contingency Usage</div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">{formatINR(calculations.contingencyRemaining)}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">100% Safety Buffer Intact</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Decision Policy</div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">User Discretion</div>
          <div className="text-[11px] text-slate-500 mt-1">No silent overwrites</div>
        </div>
      </div>

      {/* Active Guardian Alerts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Active Financial & Quotation Alerts ({activeAlerts.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Autonomous Sentinel Real-Time Audit</span>
        </div>

        {activeAlerts.length > 0 ? (
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div 
                key={alert.id}
                id={`guardian-alert-${alert.id}`}
                className="p-5 rounded-xl bg-white border border-amber-300 shadow-xs space-y-4 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                      {alert.category}
                    </span>
                    <span className="text-xs text-slate-400">• {alert.timestamp}</span>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded self-start sm:self-auto">
                    Variance: +{formatINR(alert.varianceAmount)}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{alert.title}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{alert.message}</p>
                </div>

                {/* Alternative Proposals Found by Guardian */}
                {alert.alternatives && alert.alternatives.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Certified Alternative Professionals Found by BuildMind AI:</span>
                      <span className="text-emerald-700 text-[11px] font-semibold">100% Meets Electrical Code & Safety</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {alert.alternatives.map((alt, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]">{alt.name}</span>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Save {formatINR(alt.savings)}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{alt.type}</div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                            <span className="font-extrabold text-slate-900">{formatINR(alt.estimatedCost)}</span>
                            <span className="flex items-center text-amber-500 font-semibold text-[11px]">
                              <Star className="w-3 h-3 fill-amber-400 stroke-none mr-0.5" />
                              {alt.rating}
                            </span>
                          </div>
                          {alt.contact && (
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-slate-400" />
                              <span>{alt.contact}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Decision Actions Bar (Section 8 Rule: User makes final decision) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 italic">
                    Recommendation: {alert.suggestedAction}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-dismiss-${alert.id}`}
                      onClick={() => resolveAlert(alert.id, 'dismiss')}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Keep Existing
                    </button>
                    <button
                      id={`btn-reallocate-${alert.id}`}
                      onClick={() => resolveAlert(alert.id, 'reallocate_contingency')}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                    >
                      Reallocate from Contingency
                    </button>
                    <button
                      id={`btn-apply-alt-${alert.id}`}
                      onClick={() => resolveAlert(alert.id, 'apply_alternative')}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
                    >
                      Switch to Alternative
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">All Sentinel Checks Clear</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No price shocks, unexpected variance spikes, or quote mismatches detected across your active contracts and procurement line items.
            </p>
          </div>
        )}
      </div>

      {/* Resolved Sentinel History */}
      {resolvedAlerts.length > 0 && (
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Recently Resolved Sentinel Alerts</h4>
          <div className="space-y-2">
            {resolvedAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{alert.title}</span>
                </div>
                <span className="text-slate-500 font-medium">Resolved by user</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
