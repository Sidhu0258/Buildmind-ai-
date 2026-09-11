import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatINR } from '../services/budgetCalculator';
import { BMLogo } from './BMLogo';
import { UserAccount } from './UserLoginModal';
import { 
  Building2, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  HelpCircle,
  History,
  Store,
  Users,
  Compass,
  Sliders,
  ChevronDown,
  RotateCcw,
  User
} from 'lucide-react';

interface NavbarProps {
  onOpenOnboarding: () => void;
  onOpenAffordability: () => void;
  onOpenNewExpense: () => void;
  onOpenLogin: () => void;
  currentUser: UserAccount | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenOnboarding, 
  onOpenAffordability,
  onOpenNewExpense,
  onOpenLogin,
  currentUser
}) => {
  const { project, calculations, activeTab, setActiveTab, resetToDefaultProject } = useBudget();
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const getHealthBadge = () => {
    switch (calculations.healthStatus) {
      case 'HEALTHY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Within Budget
          </span>
        );
      case 'WATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Watch List
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            At Risk
          </span>
        );
      case 'OVER_BUDGET':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Over Budget
          </span>
        );
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Budget Dashboard', icon: Layers },
    { id: 'guardian', label: 'Budget Guardian', icon: ShieldAlert, badge: project.activeAlerts.filter(a => a.status === 'active').length },
    { id: 'optimizer', label: 'Savings Optimizer', icon: Sparkles },
    { id: 'build_with_budget', label: 'Build With My Budget', icon: Compass },
    { id: 'simulator', label: 'What If? Simulator', icon: Sliders },
    { id: 'materials', label: 'Materials 3-Tier', icon: Store },
    { id: 'professionals', label: 'Contractors & Trades', icon: Users },
    { id: 'real_estate', label: 'Real Estate', icon: Building2 },
    { id: 'history', label: 'Audit Trail', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner with Project Context & Core Health */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          {/* Logo & Project Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <BMLogo size="md" showText={true} />
            <div className="h-6 w-px bg-slate-200 mx-0.5 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <button 
                  id="project-switcher-btn"
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition-colors border border-slate-200"
                >
                  <span className="truncate max-w-[130px] sm:max-w-[200px]">{project.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                {project.location} • {project.builtUpAreaSqFt} sq.ft • {project.currentPhase}
              </p>
            </div>
          </div>

          {/* Project Switcher Dropdown */}
          {showProjectDropdown && (
            <div className="absolute top-16 left-28 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Active Project Context</div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 mb-3">
                <div className="text-sm font-semibold text-slate-900">{project.name}</div>
                <div className="text-xs text-slate-600 mt-0.5">{project.projectType} • {formatINR(project.totalBudget)}</div>
                <div className="text-xs text-slate-500 mt-1">Status: {project.qualityPreference} Quality • {project.budgetFlexibility}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => { setShowProjectDropdown(false); onOpenOnboarding(); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Create / Configure Project</span>
                  <span className="text-slate-400">+ New</span>
                </button>
                <button 
                  onClick={() => { setShowProjectDropdown(false); resetToDefaultProject(); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Demo Project Data</span>
                </button>
              </div>
            </div>
          )}

          {/* Key Metrics Pill & Quick Actions:
              Order: Remaining Budget -> Over Budget -> Can I Afford This? -> Record Expense -> User Login */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* 1. Remaining Budget & 2. Over Budget status */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
              <div className="text-right">
                <div className="text-[10px] font-medium text-slate-500">Remaining Budget</div>
                <div className="text-xs font-bold text-slate-900">{formatINR(calculations.remainingBudget)}</div>
              </div>
              <div className="h-5 w-px bg-slate-200 mx-1"></div>
              {getHealthBadge()}
            </div>

            {/* 3. Can I Afford This? */}
            <button
              id="nav-affordability-btn"
              onClick={onOpenAffordability}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Can I Afford This?</span>
              <span className="sm:hidden">Afford?</span>
            </button>

            {/* 4. Record Expense */}
            <button
              id="nav-log-expense-btn"
              onClick={onOpenNewExpense}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <span className="text-sm leading-none font-bold">+</span>
              <span className="hidden sm:inline">Record Expense</span>
              <span className="sm:hidden">Expense</span>
            </button>

            {/* 5. User Login */}
            {currentUser ? (
              <button
                id="nav-user-account-btn"
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition-all cursor-pointer"
                title={`${currentUser.name} (${currentUser.role})`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[75px] sm:max-w-[100px] truncate hidden sm:inline">{currentUser.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </button>
            ) : (
              <button
                id="nav-user-login-btn"
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">User Login</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-amber-400 text-slate-900' : 'bg-rose-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
