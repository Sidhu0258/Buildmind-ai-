import React, { useState, useEffect } from 'react';
import { BudgetContextProvider, useBudget } from './context/BudgetContext';
import { Navbar } from './components/Navbar';
import { ConstructionAdCarousel } from './components/ConstructionAdCarousel';
import { UserLoginModal, UserAccount } from './components/UserLoginModal';
import { BudgetDashboard } from './components/BudgetDashboard';
import { BudgetGuardianAgent } from './components/BudgetGuardianAgent';
import { BudgetOptimizationAgent } from './components/BudgetOptimizationAgent';
import { BuildWithMyBudget } from './components/BuildWithMyBudget';
import { BudgetScenarioSimulator } from './components/BudgetScenarioSimulator';
import { MaterialsMarketplace } from './components/MaterialsMarketplace';
import { ProfessionalServicesDirectory } from './components/ProfessionalServicesDirectory';
import { RealEstateIntelligence } from './components/RealEstateIntelligence';
import { NaturalLanguageBudgetChat } from './components/NaturalLanguageBudgetChat';
import { BudgetHistoryAuditTrail } from './components/BudgetHistoryAuditTrail';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';

import { BudgetOnboardingModal } from './components/BudgetOnboardingModal';
import { AffordabilityCheckerModal } from './components/AffordabilityCheckerModal';
import { ProcurementModal } from './components/ProcurementModal';
import { NewExpenseModal } from './components/NewExpenseModal';

const AppContent: React.FC = () => {
  const { activeTab, project } = useBudget();

  // User session state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('buildmind_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Modal states
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAffordabilityOpen, setIsAffordabilityOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [procurementItem, setProcurementItem] = useState<{
    category: any;
    description: string;
    amount: number;
    supplierOrProvider: string;
  } | null>(null);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('buildmind_user_session', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('buildmind_user_session');
    } catch {
      // ignore
    }
  };

  const handleOpenProcurement = (item: {
    category: any;
    description: string;
    amount: number;
    supplierOrProvider: string;
  }) => {
    setProcurementItem(item);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navbar with live project, budget sentinel, and User Login */}
      <Navbar
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAffordability={() => setIsAffordabilityOpen(true)}
        onOpenNewExpense={() => setIsNewExpenseOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Real Construction Advertisement Carousel Banner (Immediately below Header) */}
        <ConstructionAdCarousel />

        {/* Dynamic App Views */}
        {activeTab === 'dashboard' && (
          <BudgetDashboard
            onOpenNewExpense={() => setIsNewExpenseOpen(true)}
            onOpenAffordability={() => setIsAffordabilityOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {activeTab === 'guardian' && (
          <BudgetGuardianAgent
            onOpenProcurementModal={handleOpenProcurement}
          />
        )}

        {activeTab === 'optimizer' && (
          <BudgetOptimizationAgent />
        )}

        {activeTab === 'build_with_budget' && (
          <BuildWithMyBudget />
        )}

        {activeTab === 'simulator' && (
          <BudgetScenarioSimulator />
        )}

        {activeTab === 'materials' && (
          <MaterialsMarketplace
            onOpenProcurementModal={handleOpenProcurement}
          />
        )}

        {activeTab === 'professionals' && (
          <ProfessionalServicesDirectory
            onOpenProcurementModal={handleOpenProcurement}
          />
        )}

        {activeTab === 'real_estate' && (
          <RealEstateIntelligence />
        )}

        {activeTab === 'ai_chat' && (
          <NaturalLanguageBudgetChat />
        )}

        {activeTab === 'history' && (
          <BudgetHistoryAuditTrail />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">BuildMind AI</span>
            <span>•</span>
            <span>User Budget Intelligence System (IS 456 & NBC Code Compliant)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Active Project: <strong>{project.name}</strong></span>
            <span>•</span>
            <span>Central Context Synchronized</span>
          </div>
        </div>
      </footer>

      {/* User Login & Account Modal */}
      <UserLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Global Modals */}
      <BudgetOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <AffordabilityCheckerModal
        isOpen={isAffordabilityOpen}
        onClose={() => setIsAffordabilityOpen(false)}
      />

      <NewExpenseModal
        isOpen={isNewExpenseOpen}
        onClose={() => setIsNewExpenseOpen(false)}
      />

      <ProcurementModal
        isOpen={procurementItem !== null}
        onClose={() => setProcurementItem(null)}
        purchaseDetails={procurementItem}
      />

      {/* Floating AI Assistant at Homescreen Left Bottom with Hover & Highlight Logo */}
      <FloatingAIAssistant />
    </div>
  );
};

export default function App() {
  return (
    <BudgetContextProvider>
      <AppContent />
    </BudgetContextProvider>
  );
}
