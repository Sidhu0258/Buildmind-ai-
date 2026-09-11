import React, { useState, useRef, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { askBudgetAI } from '../services/geminiService';
import { formatINR } from '../services/budgetCalculator';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  ArrowRight, 
  Compass, 
  ShieldAlert, 
  Store, 
  Layers 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actionType?: string;
}

export const NaturalLanguageBudgetChat: React.FC = () => {
  const { project, calculations, setActiveTab } = useBudget();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'agent',
      text: `Hello! I am your **BuildMind AI Budget Intelligence Sentinel**. I have full context of your project: **${project.name}** in ${project.location}.\n\n• Total Budget: **${formatINR(project.totalBudget)}**\n• Committed + Paid: **${formatINR(calculations.amountSpent + calculations.committedCost)}**\n• Available Remaining: **${formatINR(calculations.remainingBudget)}**\n• Contingency: **${formatINR(calculations.contingencyRemaining)}** intact\n\nAsk me anything about your project finances or select a command below!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const sampleCommands = [
    'Can I finish this project within my current budget?',
    'Find the best cement within my budget.',
    'Which category is costing me the most?',
    'Find an electrician under ₹50,000 for the complete work.',
    'I have ₹10 lakh left. What should I purchase next?',
    'My budget is getting exceeded. Reduce the cost without compromising critical quality.',
    'Find a 3BHK under ₹70 lakh.',
    'How much more money will I need?'
  ];

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
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
        id: `msg-${Date.now() + 1}`,
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
          id: `msg-err-${Date.now()}`,
          sender: 'agent',
          text: 'I ran into an unexpected error retrieving live budget context. Please retry your question.',
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 text-white shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Master Agent Dialogue</span>
              <span className="text-xs text-slate-400">• Budget Context Embedded</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">Natural Language Budget AI</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Ask any question in plain language. The Master Agent evaluates your real-time budget, committed contracts, verified contractor quotations, and safety standards before answering.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Command Chips (Prompt Section 10 Examples) */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Command Prompts:</div>
        <div className="flex flex-wrap gap-2">
          {sampleCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(cmd)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-2xs text-left"
            >
              "{cmd}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser ? 'bg-slate-900 text-white' : 'bg-amber-400 text-slate-950 shadow-2xs'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`rounded-xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-white text-slate-800 border border-slate-200/80'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  {msg.actionType && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <button
                        onClick={() => handleActionClick(msg.actionType)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
                      >
                        <span>Open Related Module</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] mt-1.5 ${isUser ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-md">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-500 shadow-2xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Evaluating budget context, vendor prices & structural codes...
              </div>
            </div>
          )}

          <div ref={scrollEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="budget-chat-input"
              type="text"
              placeholder="Ask: 'Find best cement within my budget' or 'Can I finish within budget?'"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
            />
            <button
              id="budget-chat-send-btn"
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
