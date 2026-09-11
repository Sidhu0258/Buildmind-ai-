import React, { useState, useRef, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { askBudgetAI } from '../services/geminiService';
import { formatINR } from '../services/budgetCalculator';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Maximize2, 
  Minimize2, 
  User, 
  ArrowRight, 
  MessageSquare,
  Zap,
  HelpCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actionType?: string;
}

export const FloatingAIAssistant: React.FC = () => {
  const { project, calculations, setActiveTab } = useBudget();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      text: `Hello! I am your **BuildMind AI Budget Sentinel**.\n\nI have live context for **${project.name}**:\n• Remaining: **${formatINR(calculations.remainingBudget)}**\n• Committed/Spent: **${formatINR(calculations.amountSpent + calculations.committedCost)}**\n• Contingency: **${formatINR(calculations.contingencyRemaining)}**\n\nHow can I guide your financial decisions today?`,
      timestamp: 'Just now'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const samplePrompts = [
    'Can I finish within budget?',
    'Best cement within budget',
    'Where am I overspending?',
    'Reduce cost without cutting safety',
    'Electrician under ₹50,000'
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await askBudgetAI(textToSend, project, calculations);
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now() + 1}`,
        sender: 'agent',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: response.actionType
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: 'I ran into an issue connecting to the budget evaluation engine. Please try asking again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionType?: string) => {
    if (!actionType) return;
    if (actionType === 'NAVIGATE_OPTIMIZER') setActiveTab('optimizer');
    else if (actionType === 'SHOW_MATERIALS') setActiveTab('materials');
    else if (actionType === 'SHOW_SERVICES') setActiveTab('professionals');
    else if (actionType === 'NAVIGATE_REAL_ESTATE') setActiveTab('real_estate');
    else if (actionType === 'NAVIGATE_DASHBOARD') setActiveTab('dashboard');
    // keep drawer open or close depending on preference
  };

  return (
    <div className="fixed bottom-5 sm:bottom-6 left-4 sm:left-6 z-50 flex flex-col items-start select-none">
      {/* Floating Chat Pop-up Dialog (Bottom Left) */}
      {isOpen && (
        <div
          id="floating-ai-chat-window"
          className={`mb-3 bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200 animate-in slide-in-from-bottom-5 fade-in ${
            isExpanded 
              ? 'w-[90vw] sm:w-[560px] h-[80vh] max-h-[720px]' 
              : 'w-[90vw] sm:w-[420px] h-[520px] max-h-[75vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-700/60 shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Highlighted AI Assistant Logo Symbol in Header */}
              <div className="relative flex items-center justify-center">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-extrabold shadow-md ring-2 ring-amber-400/40">
                  <Bot className="w-5 h-5 text-slate-950" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-white tracking-tight">BuildMind AI Assistant</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Live Sentinel
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate max-w-[200px]">
                  {project.name} • Avail: {formatINR(calculations.remainingBudget)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isExpanded ? 'Restore Size' : 'Expand View'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Prompts:</span>
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] font-medium text-slate-700 bg-white hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 border border-slate-200 px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors shadow-2xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-slate-50/40">
            {messages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[90%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser ? 'bg-slate-900 text-white' : 'bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 shadow-xs'
                  }`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`rounded-xl p-3 text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-slate-900 text-white font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/80'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {msg.actionType && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleActionClick(msg.actionType)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
                        >
                          <span>Open Recommended Tool</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className={`text-[9px] mt-1 ${isUser ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 animate-bounce">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 shadow-2xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  Analyzing budget context & specifications...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                id="floating-ai-input"
                type="text"
                placeholder="Ask about budget, prices, trade-offs..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50 bg-slate-50"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-40 transition-colors shadow-xs flex items-center gap-1 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom-Left Trigger Button with Hover & Highlight Logo Symbol */}
      <div className="relative group">
        {/* Ambient Glow Aura Behind Logo (activates on hover) */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-2xl blur-md opacity-30 group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 animate-pulse group-hover:scale-110 pointer-events-none"></div>

        {/* The Interactive Bottom-Left Button */}
        <button
          id="homescreen-left-bottom-ai-assistant"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Assistant"
          className="relative flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-slate-950/95 hover:bg-slate-900 text-white shadow-xl border border-amber-400/40 hover:border-amber-400 transition-all duration-300 focus:outline-hidden group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
        >
          {/* Highlight AI Assistant Logo Symbol */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-extrabold shadow-md ring-2 ring-amber-300/60 group-hover:ring-4 group-hover:ring-amber-400 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.9)] transition-all duration-300 group-hover:rotate-6">
            <Bot className="w-6 h-6 text-slate-950 transition-transform duration-300 group-hover:scale-110" />
            
            {/* Sparkle highlight indicator on top of symbol */}
            <div className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-slate-900 border border-amber-300 text-amber-300 shadow-xs group-hover:scale-110 transition-transform">
              <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>

          {/* Label with dynamic highlight typography */}
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                AI ASSISTANT
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-[10px] font-medium text-slate-300 group-hover:text-white transition-colors flex items-center gap-1">
              <span>Budget Sentinel</span>
              <span className="text-amber-400 font-bold">•</span>
              <span className="text-amber-300/90 font-semibold">{isOpen ? 'Close' : 'Ask AI'}</span>
            </div>
          </div>
        </button>

        {/* Hover Highlight Tooltip (Pops up when user hovers over the button) */}
        {!isOpen && (
          <div className="absolute left-full ml-3 bottom-0.5 hidden group-hover:flex items-center pointer-events-none z-50 animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl py-2 px-3 shadow-xl border border-amber-400/40 whitespace-nowrap flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
              <div>
                <div className="font-bold text-amber-300">BuildMind AI Assistant</div>
                <div className="text-[11px] text-slate-300">Click to chat with live project budget intelligence</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
