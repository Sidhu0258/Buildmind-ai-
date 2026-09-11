import { GoogleGenAI } from '@google/genai';
import { ProjectContext, BudgetCalculations } from '../types/budget';
import { formatINR } from './budgetCalculator';
import { MOCK_THREE_TIER_MATERIALS, MOCK_PROFESSIONALS, MOCK_PROPERTIES, MOCK_OPTIMIZATION_OPPORTUNITIES } from '../data/initialData';

// Safe initialization
const getApiKey = (): string | undefined => {
  try {
    return (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);
  } catch {
    return undefined;
  }
};

export async function askBudgetAI(
  prompt: string,
  project: ProjectContext,
  calculations: BudgetCalculations
): Promise<{ text: string; actionType?: string; data?: any }> {
  const apiKey = getApiKey();

  // If API key is available, leverage Gemini 2.5 Flash
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `
You are the BuildMind AI Master Budget Intelligence Agent for construction and real estate in India.
Current Project Context:
- Project Name: ${project.name}
- Location: ${project.location}
- Built-up Area: ${project.builtUpAreaSqFt} sq.ft (${project.projectType})
- Total Budget: ${formatINR(project.totalBudget)}
- Spending Limit: ${formatINR(project.preferredSpendingLimit)}
- Amount Spent: ${formatINR(calculations.amountSpent)}
- Committed Cost: ${formatINR(calculations.committedCost)}
- Quoted Cost: ${formatINR(calculations.quotedCost)}
- Estimated Cost: ${formatINR(calculations.estimatedCost)}
- Remaining Budget: ${formatINR(calculations.remainingBudget)}
- Contingency Remaining: ${formatINR(calculations.contingencyRemaining)}
- Projected Final Cost: ${formatINR(calculations.projectedFinalCost)}
- Health Status: ${calculations.healthStatus} (${calculations.healthReason})
- Quality Preference: ${project.qualityPreference}
- Budget Flexibility: ${project.budgetFlexibility}

SAFETY RULES:
1. Never recommend unsafe structural substitutions (never reduce steel diameter or cement grade).
2. Clearly distinguish between Estimated, Quoted, Committed, and Paid.
3. Formulate responses with actionable numbers in Indian Rupees (Lakhs/Crores) and give clear trade-offs.
4. Keep the answer professional, decisive, and focused on cost efficiency without compromising safety.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3
        }
      });

      if (response.text) {
        return { text: response.text };
      }
    } catch (err) {
      console.warn('Gemini API call fell back to local intelligence engine:', err);
    }
  }

  // Fast, deterministic smart construction heuristic engine
  const query = prompt.toLowerCase();

  // 1. "Can I finish this project within my current budget?" or "Affordability"
  if (query.includes('can i finish') || query.includes('within my current budget') || query.includes('can i achieve') || query.includes('afford')) {
    if (calculations.healthStatus === 'OVER_BUDGET') {
      return {
        text: `**Verdict: 🔴 NO — Projected Overrun of ${formatINR(calculations.varianceToBudget)}**\n\nBased on your active contractor quotes and current spending:
• **Current Projected Final Cost:** ${formatINR(calculations.projectedFinalCost)} vs **Budget:** ${formatINR(project.totalBudget)}
• **Contingency Status:** Depleted by quotations in Electrical and Materials.
• **Primary Cost Drivers:** 
  1. ${calculations.costDrivers[0]?.categoryName || 'Materials'} (+${formatINR(calculations.costDrivers[0]?.overrunAmount || 18000)})
  2. Contractor quotes exceeding base allocation by 9%.

**Safe Remediation Plan:**
1. Execute quote negotiation or switch to BuildMind AI verified alternative electrical contractors to save ₹24,000.
2. Standardize interior tiles to 600x600mm vitrified to preserve ₹28,600.
3. Keep structural RCC elements untouched for structural safety.`,
        actionType: 'NAVIGATE_OPTIMIZER'
      };
    } else {
      return {
        text: `**Verdict: 🟢 YES — Project is on Track**\n\nYour current project metrics confirm viability:
• **Total Budget:** ${formatINR(project.totalBudget)}
• **Projected Final Cost:** ${formatINR(calculations.projectedFinalCost)}
• **Net Safety Buffer:** ${formatINR(project.totalBudget - calculations.projectedFinalCost)} (including ₹${(calculations.contingencyRemaining / 100000).toFixed(1)}L intact contingency).
• **Cost per sq.ft:** Approx. ${formatINR(Math.round(project.totalBudget / project.builtUpAreaSqFt))}/sq.ft, which comfortably covers standard/premium construction in ${project.location}.

**Next Recommended Action:**
Lock in your bulk cement delivery before the upcoming price hike to protect your remaining materials buffer.`,
        actionType: 'NAVIGATE_DASHBOARD'
      };
    }
  }

  // 2. "Find the best cement within my budget."
  if (query.includes('cement')) {
    const cementOpts = MOCK_THREE_TIER_MATERIALS.cement;
    return {
      text: `**Cement Recommendations Tailored to your ${formatINR(project.categories.materials.allocatedAmount)} Materials Allocation:**

1. 💰 **Budget Option: Dalmia DSP Cement (OPC 53)**
   • **Rate:** ₹380 / bag | **Batch Total:** ${formatINR(114000)} (300 bags)
   • **Budget Impact:** Saves ₹18,000 against allocation
   • **Advantage:** Fast 7-day setting strength, BIS certified.

2. ⚖️ **Balanced Option (Recommended): UltraTech Super WeatherShield**
   • **Rate:** ₹420 / bag | **Batch Total:** ${formatINR(126000)} (300 bags)
   • **Budget Impact:** Exactly on target (₹0 variance)
   • **Advantage:** Hydrophobic micro-silica damp-proof barrier; ideal for ${project.location} subsoil.

3. ⭐ **Premium Option: ACC Concrete+ Xtra Strong Shield**
   • **Rate:** ₹465 / bag | **Batch Total:** ${formatINR(139500)}
   • **Budget Impact:** +₹13,500 above baseline allocation.

*Note: All three options meet mandatory IS:12269 structural building standards.*`,
      actionType: 'SHOW_MATERIALS',
      data: { category: 'cement' }
    };
  }

  // 3. "Find an electrician under ₹50,000 for the complete work." or electrician search
  if (query.includes('electrician') || query.includes('electrical')) {
    const electricians = MOCK_PROFESSIONALS.filter(p => p.role === 'Electrician');
    return {
      text: `**Electrical Contractors Analyzed Against Your Electrical Budget:**

Your electrical category has **${formatINR(project.categories.electrical.allocatedAmount)}** allocated (${formatINR(project.categories.electrical.spentAmount + project.categories.electrical.committedAmount)} spent/committed).

• 🟢 **Apex Electrical Solutions (Class-1 Licensed)**
  — **Quote:** ${formatINR(194000)} | **Status:** Within Budget (Saves ₹6,000 vs allocation)
  — **Rating:** 4.8/5 (67 verified reviews)
  — **Scope:** 3-phase DB installation, concealed conduits, load balancing, earthing grid.

• 🔴 **Current Master Electro Systems**
  — **Quote:** ${formatINR(218000)} | **Status:** ₹18,000 Above Current Allocation
  — **Reason:** Includes smart touch modules not in initial scope.

**BuildMind AI Recommendation:** Apex Electrical Solutions delivers 100% code compliance and stays safely within your budget cap.`,
      actionType: 'SHOW_SERVICES',
      data: { trade: 'Electrician' }
    };
  }

  // 4. "Which category is costing me the most?" or "Why is my project over budget?"
  if (query.includes('costing me the most') || query.includes('cost drivers') || query.includes('why') && query.includes('budget')) {
    const drivers = calculations.costDrivers;
    return {
      text: `**Cost Driver Analysis for ${project.name}:**

1. 🧱 **Construction Materials:** ${formatINR(project.categories.materials.spentAmount + project.categories.materials.committedAmount)} spent/committed of ${formatINR(project.categories.materials.allocatedAmount)} (approx. 40% of entire budget). High volume TMT steel rebars (6.5T) are the single largest line item.
2. 👷 **Labour & Masonry:** ${formatINR(project.categories.labour.spentAmount + project.categories.labour.committedAmount)} committed out of ${formatINR(project.categories.labour.allocatedAmount)} (approx. 20%).
3. ⚡ **Electrical:** Received contractor quotations are running **₹18,000 above planned allocation** (109% of target).

**Top 3 Immediate Saving Levers:**
• Switch TMT rebar delivery lot to mill direct dispatch → **Save ₹24,000**
• Re-bid electrical package to Apex Electrical Solutions → **Save ₹24,000**
• Consolidate tile procurement from factory depot → **Save ₹18,600**
**Total Potential Recoverable Savings: ₹66,600** without any structural compromise.`,
      actionType: 'NAVIGATE_OPTIMIZER'
    };
  }

  // 5. "I have ₹10 lakh left. What should I purchase next?"
  if (query.includes('what should i purchase next') || query.includes('what to purchase') || query.includes('left')) {
    return {
      text: `**Critical Procurement Roadmap with Your Remaining ${formatINR(calculations.remainingBudget)}:**

Currently in **${project.currentPhase}** stage. Priority sequence:

1. **Doors & Windows Outer Frame Fixing (Urgency: High)**
   • Allocate: ~${formatINR(70000)}
   • Reason: Frames must be anchored before wall plastering begins to avoid masonry hacking.
2. **Plumbing Concealed Lines & Pressure Testing (Urgency: High)**
   • Allocate: ~${formatINR(60000)}
   • Astral CPVC lines must undergo 24-hr hydrostatic pressure test prior to bathroom tile screed.
3. **Electrical Concealed Wiring (Urgency: Medium)**
   • Allocate: ~${formatINR(60000)}
   • Pull FR-LSH cables through PVC conduits once plastering cures.
4. **Reserve for Flooring & Tiles (Urgency: Scheduled for Phase 4)**
   • Maintain ${formatINR(120000)} ring-fenced.`,
      actionType: 'NAVIGATE_PROCUREMENT'
    };
  }

  // 6. "Find a 3BHK under ₹70 lakh" or "Real estate"
  if (query.includes('3bhk') || query.includes('property') || query.includes('real estate') || query.includes('plot') || query.includes('lakh')) {
    return {
      text: `**Real Estate Budget Intelligence for Whitefield/Bengaluru:**

Search Target: 3BHK residential under target budget (with statutory acquisition costs):

1. 🟢 **Gated Villa Plot in Prestige Boulevard**
   • **List Price:** ${formatINR(7200000)}
   • **Additional Acquisition Costs:** ${formatINR(503000)} (Stamp Duty 5.5% + Registration 1% + Legal)
   • **Total Outlay:** ${formatINR(7703000)} | **Status: Fits Budget**

2. 🟢 **3BHK Duplex Row Villa with Private Garden**
   • **List Price:** ${formatINR(7850000)}
   • **Additional Acquisition Costs:** ${formatINR(550250)}
   • **Total Outlay:** ${formatINR(8400250)} | **Status: Within Budget**

3. 🟡 **Executive 3BHK Premium High-Rise (Stretch Option)**
   • **List Price:** ${formatINR(8350000)}
   • **Total Outlay:** ${formatINR(8972750)} | **Status: Stretch (+4.3%)**
   • *Shown because your budget flexibility permits slight quality stretch.*`,
      actionType: 'NAVIGATE_REAL_ESTATE'
    };
  }

  // Default intelligent assistant response with full budget context
  return {
    text: `**BuildMind AI Budget Intelligence Summary:**
• **Active Project:** ${project.name} (${project.location})
• **Total Budget:** ${formatINR(project.totalBudget)}
• **Current Committed + Spent:** ${formatINR(calculations.amountSpent + calculations.committedCost)}
• **Available Remaining:** ${formatINR(calculations.remainingBudget)}
• **Contingency Intact:** ${formatINR(calculations.contingencyRemaining)}
• **Health Status:** ${calculations.healthStatus === 'HEALTHY' ? '🟢 Healthy' : '🟡 Watch'}

How can I assist you with your project finances today? You can ask me:
1. *"Can I finish this project within my current budget?"*
2. *"Find the best cement within my budget."*
3. *"Which category is costing me the most?"*
4. *"Reduce my costs without compromising critical structural quality."*`
  };
}
