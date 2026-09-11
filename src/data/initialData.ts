import { 
  ProjectContext, 
  RecommendationTierItem, 
  ProfessionalServiceItem, 
  PropertyListingItem, 
  OptimizationOpportunity,
  GuardianAlert,
  AuditLogEntry
} from '../types/budget';

export const INITIAL_PROJECT: ProjectContext = {
  id: 'proj-blr-01',
  name: 'Greenwood Villa - 3BHK Duplex',
  location: 'Whitefield, Bengaluru, KA',
  projectType: '3BHK Duplex',
  builtUpAreaSqFt: 2000,
  plotAreaSqFt: 1500,
  floors: 2,
  bedrooms: 3,
  currentPhase: 'Brickwork & Plastering',
  
  totalBudget: 3000000, // ₹30,00,000
  preferredSpendingLimit: 2850000,
  maxAcceptableBudget: 3150000,
  contingencyReserve: 150000, // ₹1,50,000
  qualityPreference: 'Standard',
  budgetFlexibility: 'Slightly Flexible',
  financingPreference: 'Milestone-based',
  alreadySpentAtStart: 0,

  categories: {
    materials: {
      id: 'materials',
      name: 'Construction Materials',
      icon: 'BrickWall',
      allocatedAmount: 1200000, // ₹12,00,000
      spentAmount: 640000,
      committedAmount: 320000,
      quotedAmount: 1180000,
      estimatedAmount: 1200000,
      notes: 'TMT FE550D Steel & UltraTech OPC 53 Grade Cement'
    },
    labour: {
      id: 'labour',
      name: 'Labour & Masonry Crew',
      icon: 'HardHat',
      allocatedAmount: 600000, // ₹6,00,000
      spentAmount: 310000,
      committedAmount: 180000,
      quotedAmount: 590000,
      estimatedAmount: 600000,
      notes: 'Turnkey RCC framing, masonry & scaffolding contract'
    },
    electrical: {
      id: 'electrical',
      name: 'Electrical & Automation',
      icon: 'Zap',
      allocatedAmount: 200000, // ₹2,00,000
      spentAmount: 40000,
      committedAmount: 60000,
      quotedAmount: 218000, // Alert: ₹18,000 higher than allocation!
      estimatedAmount: 200000,
      notes: 'Concealed wiring, distribution boards & point wiring'
    },
    plumbing: {
      id: 'plumbing',
      name: 'Plumbing & Drainage',
      icon: 'Droplets',
      allocatedAmount: 150000, // ₹1,50,000
      spentAmount: 50000,
      committedAmount: 40000,
      quotedAmount: 145000,
      estimatedAmount: 150000,
      notes: 'Astral CPVC/UPVC water and sewage lines'
    },
    painting: {
      id: 'painting',
      name: 'Painting & Surface Work',
      icon: 'Paintbrush',
      allocatedAmount: 120000, // ₹1,20,000
      spentAmount: 0,
      committedAmount: 30000,
      quotedAmount: 115000,
      estimatedAmount: 120000,
      notes: 'Asian Paints Apex exterior & Royale interior emulsion'
    },
    doors_windows: {
      id: 'doors_windows',
      name: 'Doors & Windows',
      icon: 'DoorClosed',
      allocatedAmount: 200000, // ₹2,00,000
      spentAmount: 80000,
      committedAmount: 70000,
      quotedAmount: 195000,
      estimatedAmount: 200000,
      notes: 'Solid teak main door, Fenesta UPVC acoustic glass windows'
    },
    finishing: {
      id: 'finishing',
      name: 'Finishing & Tiles',
      icon: 'Layers',
      allocatedAmount: 200000, // ₹2,00,000
      spentAmount: 50000,
      committedAmount: 70000,
      quotedAmount: 190000,
      estimatedAmount: 200000,
      notes: 'Kajaria double-charge vitrified tiles, granite kitchen platform'
    },
    professional_services: {
      id: 'professional_services',
      name: 'Professional Services',
      icon: 'Compass',
      allocatedAmount: 100000, // ₹1,00,000
      spentAmount: 60000,
      committedAmount: 30000,
      quotedAmount: 95000,
      estimatedAmount: 100000,
      notes: 'Structural engineer certification, architectural drawings'
    },
    transportation: {
      id: 'transportation',
      name: 'Transportation & Crane',
      icon: 'Truck',
      allocatedAmount: 80000, // ₹80,000
      spentAmount: 10000,
      committedAmount: 20000,
      quotedAmount: 75000,
      estimatedAmount: 80000,
      notes: 'Material logistics, sand unloading, concrete transit'
    },
    contingency: {
      id: 'contingency',
      name: 'Contingency Reserve',
      icon: 'ShieldAlert',
      allocatedAmount: 150000, // ₹1,50,000
      spentAmount: 0,
      committedAmount: 0,
      quotedAmount: 0,
      estimatedAmount: 150000,
      notes: 'Unassigned emergency reserve for material spikes or unpredicted subsoil work'
    }
  },

  transactions: [
    {
      id: 'tx-001',
      projectId: 'proj-blr-01',
      category: 'materials',
      description: 'Tata Tiscon 550D TMT Rebars (6.5 Metric Tonnes)',
      amount: 420000,
      currency: 'INR',
      date: '2026-08-14',
      status: 'spent',
      source: 'purchase',
      supplierOrProvider: 'Sri Krishna Steels & Infra',
      notes: 'Foundation and Ground Floor slab reinforcement. Mill-test certificate verified.'
    },
    {
      id: 'tx-002',
      projectId: 'proj-blr-01',
      category: 'materials',
      description: 'UltraTech Super Cement (350 Bags)',
      amount: 145000,
      currency: 'INR',
      date: '2026-08-20',
      status: 'spent',
      source: 'purchase',
      supplierOrProvider: 'South India Cement Agencies',
      notes: 'Grade 53 PPC for column casting.'
    },
    {
      id: 'tx-003',
      projectId: 'proj-blr-01',
      category: 'materials',
      description: 'Coarse River Sand & M-Sand 30 Tons',
      amount: 75000,
      currency: 'INR',
      date: '2026-08-28',
      status: 'spent',
      source: 'purchase',
      supplierOrProvider: 'Deccan Aggregates Hub',
      notes: 'Sieved manufactured sand for brick masonry.'
    },
    {
      id: 'tx-004',
      projectId: 'proj-blr-01',
      category: 'labour',
      description: 'Phase 1 Substructure & Column Casting Milestone',
      amount: 210000,
      currency: 'INR',
      date: '2026-09-01',
      status: 'spent',
      source: 'contract',
      supplierOrProvider: 'Balaji Masonry Contractors',
      notes: 'Certified completion of excavation, footing, and plinth beam.'
    },
    {
      id: 'tx-005',
      projectId: 'proj-blr-01',
      category: 'labour',
      description: 'Phase 2 Ground Floor Slab Pouring Milestone',
      amount: 100000,
      currency: 'INR',
      date: '2026-09-06',
      status: 'spent',
      source: 'contract',
      supplierOrProvider: 'Balaji Masonry Contractors',
      notes: 'Casting complete, 21-day curing supervised.'
    },
    {
      id: 'tx-006',
      projectId: 'proj-blr-01',
      category: 'professional_services',
      description: 'Structural Stamping & Municipal Sanction Drawings',
      amount: 60000,
      currency: 'INR',
      date: '2026-07-29',
      status: 'spent',
      source: 'direct_expense',
      supplierOrProvider: 'Er. R. Sundaram Structural Consultants',
      notes: 'Soil test bore logs & earthquake resistant RCC load calculations.'
    },
    {
      id: 'tx-007',
      projectId: 'proj-blr-01',
      category: 'doors_windows',
      description: 'Main Teak Wood Frame & Panel Advance',
      amount: 80000,
      currency: 'INR',
      date: '2026-09-02',
      status: 'spent',
      source: 'purchase',
      supplierOrProvider: 'Malabar Timber & Joinery Works',
      notes: 'Seasoned CP Teak with brass hinges and Godrej smart lock prep.'
    },
    {
      id: 'tx-008',
      projectId: 'proj-blr-01',
      category: 'plumbing',
      description: 'Underground Sump & Drainage Piping Supplies',
      amount: 50000,
      currency: 'INR',
      date: '2026-09-04',
      status: 'spent',
      source: 'purchase',
      supplierOrProvider: 'Astral Flow Direct Supply',
      notes: 'Heavy duty schedule 80 pipes.'
    },
    {
      id: 'tx-009',
      projectId: 'proj-blr-01',
      category: 'finishing',
      description: 'Granite Slabs for Kitchen Countertop & Staircase',
      amount: 50000,
      currency: 'INR',
      date: '2026-09-08',
      status: 'spent',
      source: 'purchase',
      supplierOrProvider: 'Rajasthan Granite World',
      notes: 'Black Galaxy granite 20mm calibrated.'
    },
    {
      id: 'tx-010',
      projectId: 'proj-blr-01',
      category: 'electrical',
      description: 'Concealed Conduit & Distribution Boxes Advance',
      amount: 40000,
      currency: 'INR',
      date: '2026-09-07',
      status: 'spent',
      source: 'purchase',
      supplierOrProvider: 'Havells Electrical Point',
      notes: 'Heavy gauge PVC conduits routed prior to plastering.'
    },
    {
      id: 'tx-011',
      projectId: 'proj-blr-01',
      category: 'transportation',
      description: 'Concrete Pump Crane Hire (Two Pours)',
      amount: 10000,
      currency: 'INR',
      date: '2026-08-30',
      status: 'spent',
      source: 'direct_expense',
      supplierOrProvider: 'Bangalore Heavy Equipment Services',
      notes: '4-hour boom placer dispatch.'
    },
    // Committed POs (Signed contracts)
    {
      id: 'tx-012',
      projectId: 'proj-blr-01',
      category: 'materials',
      description: 'Upper Floor Slab TMT Steel Purchase Order #PO-882',
      amount: 320000,
      currency: 'INR',
      date: '2026-09-09',
      status: 'committed',
      source: 'contract',
      supplierOrProvider: 'Sri Krishna Steels & Infra',
      notes: 'Delivery scheduled for next Monday.'
    },
    {
      id: 'tx-013',
      projectId: 'proj-blr-01',
      category: 'labour',
      description: 'First Floor Masonry & Plastering Contract Balance',
      amount: 180000,
      currency: 'INR',
      date: '2026-09-05',
      status: 'committed',
      source: 'contract',
      supplierOrProvider: 'Balaji Masonry Contractors',
      notes: 'Payable upon lintel level completion.'
    },
    {
      id: 'tx-014',
      projectId: 'proj-blr-01',
      category: 'doors_windows',
      description: 'Fenesta Soundproof UPVC Windows PO',
      amount: 70000,
      currency: 'INR',
      date: '2026-09-07',
      status: 'committed',
      source: 'contract',
      supplierOrProvider: 'Fenesta Windows Partner',
      notes: 'Glazed sliding panels with bug mesh.'
    },
    {
      id: 'tx-015',
      projectId: 'proj-blr-01',
      category: 'electrical',
      description: 'Concealed Wiring Execution Work Order',
      amount: 60000,
      currency: 'INR',
      date: '2026-09-08',
      status: 'committed',
      source: 'contract',
      supplierOrProvider: 'ElectroSafe Certified Technicians',
      notes: 'Phase 1 wiring execution.'
    }
  ],

  auditTrail: [
    {
      id: 'aud-001',
      projectId: 'proj-blr-01',
      timestamp: '2026-07-15 10:30 AM',
      type: 'BUDGET_CHANGE',
      description: 'Initial Project Budget Created',
      newValue: '₹28,00,000',
      reason: 'Initial 3BHK G+1 construction target set during onboarding',
      user: 'Praveen Kumar (Owner)'
    },
    {
      id: 'aud-002',
      projectId: 'proj-blr-01',
      timestamp: '2026-08-01 02:15 PM',
      type: 'BUDGET_CHANGE',
      description: 'Budget Increased to ₹30,00,000',
      previousValue: '₹28,00,000',
      newValue: '₹30,00,000',
      reason: 'Added dedicated solar conduit routing and upgraded to UPVC acoustic glazing',
      user: 'Praveen Kumar (Owner)'
    },
    {
      id: 'aud-003',
      projectId: 'proj-blr-01',
      timestamp: '2026-08-14 11:45 AM',
      type: 'PURCHASE_COMMITTED',
      description: 'Committed PO for Tata Tiscon Steel (₹4,20,000)',
      newValue: '₹4,20,000',
      reason: 'Foundation steel requirement with 10-day price lock',
      user: 'BuildMind Procurement'
    },
    {
      id: 'aud-004',
      projectId: 'proj-blr-01',
      timestamp: '2026-09-05 04:20 PM',
      type: 'ALLOCATION_CHANGE',
      description: 'Reallocated ₹20,000 from Painting to Plumbing',
      previousValue: 'Painting ₹1,40,000 / Plumbing ₹1,30,000',
      newValue: 'Painting ₹1,20,000 / Plumbing ₹1,50,000',
      reason: 'Subsoil drainage pit deepened based on structural recommendation',
      user: 'Praveen Kumar (Owner)'
    }
  ],

  activeAlerts: [
    {
      id: 'alert-01',
      severity: 'high',
      category: 'electrical',
      title: 'Electrical Quotations Exceed Category Allocation',
      message: 'Your received electrical contractor quotation is ₹2,18,000, which is ₹18,000 higher than the planned ₹2,00,000 allocation. BuildMind AI found 3 certified alternative professionals with verified market pricing that fit your budget without cutting safety specifications.',
      varianceAmount: 18000,
      suggestedAction: 'Review competitive bids or reallocate ₹18,000 from Contingency Reserve.',
      alternatives: [
        {
          name: 'Apex Electrical Solutions (Class-1 License)',
          type: 'Licensed Electrical Contractor',
          estimatedCost: 194000,
          savings: 24000,
          rating: 4.8,
          contact: '+91 98801 23410'
        },
        {
          name: 'PowerGrid Pro Electrics',
          type: 'Turnkey Residential Wiring',
          estimatedCost: 198000,
          savings: 20000,
          rating: 4.7,
          contact: '+91 99002 87654'
        },
        {
          name: 'Vidyut Safe Installations',
          type: 'Certified Wiremen Collective',
          estimatedCost: 190000,
          savings: 28000,
          rating: 4.9,
          contact: '+91 98450 11928'
        }
      ],
      timestamp: '2026-09-10 09:15 AM',
      status: 'active'
    },
    {
      id: 'alert-02',
      severity: 'medium',
      category: 'materials',
      title: 'Bulk Cement Purchasing Window Alert',
      message: 'Upcoming monsoon price revision announced by major South India cement cartels (+₹18/bag next Monday). Booking remaining 200 bags now locks in ₹390/bag, saving ₹14,000.',
      varianceAmount: 14000,
      suggestedAction: 'Issue advance purchase order to Sri Krishna Steels & Infra.',
      timestamp: '2026-09-11 08:30 AM',
      status: 'active'
    }
  ]
};

export const MOCK_THREE_TIER_MATERIALS: Record<string, RecommendationTierItem[]> = {
  cement: [
    {
      id: 'mat-cem-01',
      name: 'Dalmia DSP Cement (OPC 53 Grade)',
      brandOrProvider: 'Dalmia Bharat Ltd',
      tier: 'BUDGET',
      category: 'materials',
      unitPrice: 380,
      unit: '50kg Bag',
      estimatedQuantity: 300,
      estimatedTotal: 114000,
      budgetImpact: -18000,
      fitsBudget: true,
      qualityLevel: 'Budget',
      advantages: ['Economical bulk rate', 'High initial setting strength', 'IS:12269 certified'],
      disadvantages: ['Slightly lower impermeability compared to slag blend', 'Requires strict 21-day continuous moist curing'],
      safetyCertified: true,
      specs: '53 Grade Ordinary Portland Cement for structural framing'
    },
    {
      id: 'mat-cem-02',
      name: 'UltraTech Super WeatherShield Cement',
      brandOrProvider: 'Aditya Birla Group',
      tier: 'BALANCED',
      category: 'materials',
      unitPrice: 420,
      unit: '50kg Bag',
      estimatedQuantity: 300,
      estimatedTotal: 126000,
      budgetImpact: 0,
      fitsBudget: true,
      qualityLevel: 'Standard',
      advantages: ['Micro-fine particles ensure maximum density', 'Integrated water repellency minimizes dampness', 'India’s #1 trusted brand'],
      disadvantages: ['Marginally higher cost per bag (+₹40 vs economy brands)'],
      safetyCertified: true,
      specs: 'Engineered PPC with active silica for crack resistance'
    },
    {
      id: 'mat-cem-03',
      name: 'ACC Concrete+ Xtra Strong Shield',
      brandOrProvider: 'ACC Holcim Group',
      tier: 'PREMIUM',
      category: 'materials',
      unitPrice: 465,
      unit: '50kg Bag',
      estimatedQuantity: 300,
      estimatedTotal: 139500,
      budgetImpact: 13500,
      fitsBudget: false,
      qualityLevel: 'Premium',
      advantages: ['Advanced crystalline waterproofing compounds inside', 'Exceptional sulfate & chloride resistance', '15% higher compressive strength'],
      disadvantages: ['Premium price point', 'Over-spec for non-coastal residential builds'],
      safetyCertified: true,
      specs: 'Specialized high-density foundation & column blend'
    }
  ],
  steel: [
    {
      id: 'mat-stl-01',
      name: 'Kamdhenu Nxt TMT Rebars FE 500D',
      brandOrProvider: 'Kamdhenu Ltd',
      tier: 'BUDGET',
      category: 'materials',
      unitPrice: 58000,
      unit: 'Metric Tonne',
      estimatedQuantity: 5,
      estimatedTotal: 290000,
      budgetImpact: -30000,
      fitsBudget: true,
      qualityLevel: 'Budget',
      advantages: ['Double rib pattern for decent concrete grip', 'Cost effective', 'BIS 1786 compliant'],
      disadvantages: ['Yield elongation marginally lower than 550D in seismic zones'],
      safetyCertified: true,
      specs: 'FE 500D Primary billet rolled'
    },
    {
      id: 'mat-stl-02',
      name: 'Tata Tiscon 550D Super Ductile',
      brandOrProvider: 'Tata Steel',
      tier: 'BALANCED',
      category: 'materials',
      unitPrice: 64000,
      unit: 'Metric Tonne',
      estimatedQuantity: 5,
      estimatedTotal: 320000,
      budgetImpact: 0,
      fitsBudget: true,
      qualityLevel: 'Standard',
      advantages: ['Unmatched seismic earthquake resistance', 'Super ductile with zero micro-cracks on bending', 'GreenPro certified eco-manufacturing'],
      disadvantages: ['Standard market pricing with limited distributor discounts'],
      safetyCertified: true,
      specs: 'FE 550D Pure virgin iron ore processed'
    },
    {
      id: 'mat-stl-03',
      name: 'JSW Neosteel Pure TMT FE 550D CRS (Corrosion Resistant)',
      brandOrProvider: 'JSW Steel',
      tier: 'PREMIUM',
      category: 'materials',
      unitPrice: 69000,
      unit: 'Metric Tonne',
      estimatedQuantity: 5,
      estimatedTotal: 345000,
      budgetImpact: 25000,
      fitsBudget: false,
      qualityLevel: 'Premium',
      advantages: ['Copper-Chromium alloy for 2x corrosion resistance in subsoil', 'Higher fire resistance up to 600°C', 'Automated robotic bar bundling'],
      disadvantages: ['Higher capital requirement (+₹25,000 for batch)'],
      safetyCertified: true,
      specs: 'FE 550D Corrosion Resistant Steel alloy'
    }
  ],
  tiles: [
    {
      id: 'mat-til-01',
      name: 'Orientbell Glazed Porcelain Vitrified (600x600mm)',
      brandOrProvider: 'Orientbell Tiles',
      tier: 'BUDGET',
      category: 'finishing',
      unitPrice: 48,
      unit: 'sq.ft',
      estimatedQuantity: 1800,
      estimatedTotal: 86400,
      budgetImpact: -28600,
      fitsBudget: true,
      qualityLevel: 'Budget',
      advantages: ['High stain resistance', 'Quick availability in multiple neutral shades', 'Economical laying cost'],
      disadvantages: ['Single layer body', 'Edge beveling requires careful tile spacer leveling'],
      safetyCertified: true,
      specs: 'Nano polished porcelain finish'
    },
    {
      id: 'mat-til-02',
      name: 'Kajaria Eternity Double Charge Vitrified (800x1200mm)',
      brandOrProvider: 'Kajaria Ceramics',
      tier: 'BALANCED',
      category: 'finishing',
      unitPrice: 72,
      unit: 'sq.ft',
      estimatedQuantity: 1800,
      estimatedTotal: 129600,
      budgetImpact: 0,
      fitsBudget: true,
      qualityLevel: 'Standard',
      advantages: ['4mm thick wear layer resists scratches for 25+ years', 'Expansive 800x1200mm format creates seamless look', 'Zero water absorption (<0.05%)'],
      disadvantages: ['Requires skilled tile adhesive laying crew rather than basic cement mortar'],
      safetyCertified: true,
      specs: 'Double-pressed heavy traffic vitrified slab'
    },
    {
      id: 'mat-til-03',
      name: 'Simpolo Signature Sintered Stone Large Slabs (1200x2400mm)',
      brandOrProvider: 'Simpolo Ceramics',
      tier: 'PREMIUM',
      category: 'finishing',
      unitPrice: 135,
      unit: 'sq.ft',
      estimatedQuantity: 1800,
      estimatedTotal: 243000,
      budgetImpact: 113400,
      fitsBudget: false,
      qualityLevel: 'Premium',
      advantages: ['Looks indistinguishable from Italian Statuario marble', 'Heat and scratch immune', 'Continuous bookmatch veining'],
      disadvantages: ['Requires suction lifters and specialized cutters to install', 'Exceeds standard allocation'],
      safetyCertified: true,
      specs: '9mm Sintered Porcelain Architectural Slab'
    }
  ],
  paint: [
    {
      id: 'mat-pnt-01',
      name: 'Tractor Emulsion Interior & Ace Exterior',
      brandOrProvider: 'Asian Paints',
      tier: 'BUDGET',
      category: 'painting',
      unitPrice: 18,
      unit: 'sq.ft (2 coats)',
      estimatedQuantity: 4500,
      estimatedTotal: 81000,
      budgetImpact: -34000,
      fitsBudget: true,
      qualityLevel: 'Budget',
      advantages: ['Reliable matte finish', 'Great coverage per litre', 'Lead-free formulation'],
      disadvantages: ['Limited washability for wall stains', '3-year exterior life'],
      safetyCertified: true,
      specs: 'Standard acrylic copolymer emulsion'
    },
    {
      id: 'mat-pnt-02',
      name: 'Apcolite Premium Satin & Apex WeatherProof',
      brandOrProvider: 'Asian Paints',
      tier: 'BALANCED',
      category: 'painting',
      unitPrice: 25,
      unit: 'sq.ft (2 coats)',
      estimatedQuantity: 4500,
      estimatedTotal: 112500,
      budgetImpact: 0,
      fitsBudget: true,
      qualityLevel: 'Standard',
      advantages: ['Rich sheen with anti-fungal silicon technology', 'Fully washable with damp sponge', '5-year performance warranty'],
      disadvantages: ['Requires proper wall putty sanding for flawless sheen'],
      safetyCertified: true,
      specs: 'Cross-linking polymer with Teflon surface protector'
    },
    {
      id: 'mat-pnt-03',
      name: 'Royale Aspira Ultra Luxury with Teflon',
      brandOrProvider: 'Asian Paints',
      tier: 'PREMIUM',
      category: 'painting',
      unitPrice: 38,
      unit: 'sq.ft (2 coats)',
      estimatedQuantity: 4500,
      estimatedTotal: 171000,
      budgetImpact: 56000,
      fitsBudget: false,
      qualityLevel: 'Premium',
      advantages: ['Crack bridging elasticity up to 2mm', 'Anti-bacterial flame retardant', 'Silky metallic reflectance'],
      disadvantages: ['Significant premium cost', 'Requires multi-coat primer leveling'],
      safetyCertified: true,
      specs: 'Elastomeric hydrophobic luxury coating'
    }
  ]
};

export const MOCK_PROFESSIONALS: ProfessionalServiceItem[] = [
  {
    id: 'prof-001',
    name: 'Er. R. Sundaram Consultants',
    role: 'Structural Engineer',
    experienceYears: 18,
    rating: 4.9,
    reviewsCount: 84,
    quotedRate: 25000,
    rateUnit: 'Per Project Design',
    estimatedTotal: 25000,
    budgetFit: 'WITHIN_BUDGET',
    availability: 'Immediate (2 days lead)',
    location: 'Indiranagar, Bengaluru',
    verified: true,
    skills: ['Seismic Zone 3 Design', 'STAAD.Pro Load Simulation', 'Soil Bore Log Analysis']
  },
  {
    id: 'prof-002',
    name: 'Balaji Masonry & Civil Contractors',
    role: 'General Contractor',
    experienceYears: 14,
    rating: 4.8,
    reviewsCount: 112,
    quotedRate: 290,
    rateUnit: 'Per sq.ft Labour',
    estimatedTotal: 580000,
    budgetFit: 'WITHIN_BUDGET',
    availability: 'Active on Site',
    location: 'Whitefield, Bengaluru',
    verified: true,
    skills: ['RCC Columns & Slabs', 'Wire-cut Brickwork', 'Waterproofing']
  },
  {
    id: 'prof-003',
    name: 'Apex Electrical Solutions (Class-1 License)',
    role: 'Electrician',
    experienceYears: 12,
    rating: 4.8,
    reviewsCount: 67,
    quotedRate: 95,
    rateUnit: 'Per Electrical Point',
    estimatedTotal: 194000,
    budgetFit: 'WITHIN_BUDGET',
    availability: 'Available in 3 days',
    location: 'Marathahalli, Bengaluru',
    verified: true,
    skills: ['Concealed FR Wiring', '3-Phase Load Balancing', 'EV Charger Provision']
  },
  {
    id: 'prof-004',
    name: 'Current Master Electro Systems',
    role: 'Electrician',
    experienceYears: 9,
    rating: 4.6,
    reviewsCount: 42,
    quotedRate: 110,
    rateUnit: 'Per Electrical Point',
    estimatedTotal: 218000,
    budgetFit: 'ABOVE_BUDGET', // Above current allocation
    availability: 'Immediate',
    location: 'Koramangala, Bengaluru',
    verified: true,
    skills: ['Smart Home Automation', 'Schneider Modular Boards']
  },
  {
    id: 'prof-005',
    name: 'AquaGuard Plumbing Specialists',
    role: 'Plumber',
    experienceYears: 11,
    rating: 4.9,
    reviewsCount: 78,
    quotedRate: 14000,
    rateUnit: 'Per Bathroom Turnkey',
    estimatedTotal: 140000,
    budgetFit: 'WITHIN_BUDGET',
    availability: 'Available next week',
    location: 'HSR Layout, Bengaluru',
    verified: true,
    skills: ['Concealed Diverters', 'Hydro-pneumatic Pressure Lines', 'Solar Water Geyser']
  },
  {
    id: 'prof-006',
    name: 'Precision Paint Craftsmen',
    role: 'Painter',
    experienceYears: 8,
    rating: 4.7,
    reviewsCount: 53,
    quotedRate: 12,
    rateUnit: 'Per sq.ft Labour',
    estimatedTotal: 54000,
    budgetFit: 'WITHIN_BUDGET',
    availability: 'Available on notice',
    location: 'Bellandur, Bengaluru',
    verified: true,
    skills: ['Airless Spray Finish', 'Two-Coat Putty Buffing', 'Waterproofing Base']
  },
  {
    id: 'prof-007',
    name: 'Royal Teak & Modular Woodworkers',
    role: 'Carpenter',
    experienceYears: 16,
    rating: 4.8,
    reviewsCount: 91,
    quotedRate: 350,
    rateUnit: 'Per sq.ft Joinery',
    estimatedTotal: 175000,
    budgetFit: 'NEAR_BUDGET',
    availability: 'Available in 10 days',
    location: 'Sarjapur Road, Bengaluru',
    verified: true,
    skills: ['Solid Wood Door Frames', 'Marine Ply Wardrobes', 'Hettich Soft-Close Hardware']
  },
  {
    id: 'prof-008',
    name: 'Studio Vistara Architects',
    role: 'Architect',
    experienceYears: 10,
    rating: 4.9,
    reviewsCount: 65,
    quotedRate: 40,
    rateUnit: 'Per sq.ft Full Design',
    estimatedTotal: 80000,
    budgetFit: 'WITHIN_BUDGET',
    availability: 'Accepting new projects',
    location: 'CBD, Bengaluru',
    verified: true,
    skills: ['Vastu Compliant 3D Elevation', 'Natural Ventilation Planning', 'Municipal Sanction']
  }
];

export const MOCK_PROPERTIES: PropertyListingItem[] = [
  {
    id: 'prop-001',
    title: 'Gated Villa Plot in Prestige Boulevard',
    location: 'Channasandra, Whitefield, Bengaluru',
    type: 'Plot',
    builtUpAreaSqFt: 0,
    plotSizeSqFt: 1500,
    listPrice: 7200000, // ₹72 Lakh (Within ₹70-80L range)
    estimatedAcquisitionCosts: {
      stampDuty: 396000, // 5.5%
      registrationFee: 72000, // 1%
      legalVerification: 35000,
      brokerageOrPortal: 0,
      totalAcquisitionCost: 503000
    },
    totalProjectedOutlay: 7703000,
    isStretchOption: false,
    fitsBudget: true,
    highlights: ['BMRDA Approved', 'Underground Utilities Ready', '40ft Wide Bitumen Road', 'Immediate Khata Transfer'],
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'prop-002',
    title: '3BHK Duplex Row Villa with Private Garden',
    location: 'Kadugodi, Whitefield, Bengaluru',
    type: 'Villa',
    builtUpAreaSqFt: 2150,
    plotSizeSqFt: 1350,
    listPrice: 7850000, // ₹78.5 Lakh
    estimatedAcquisitionCosts: {
      stampDuty: 431750,
      registrationFee: 78500,
      legalVerification: 40000,
      brokerageOrPortal: 0,
      totalAcquisitionCost: 550250
    },
    totalProjectedOutlay: 8400250,
    isStretchOption: false,
    fitsBudget: true,
    highlights: ['Corner Unit', 'Covered Car Parking', 'Borewell + Cauvery Water Line', 'Ready for Interior Fit-out'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'prop-003',
    title: 'Executive 3BHK Premium High-Rise Apartment',
    location: 'Hope Farm Junction, Bengaluru',
    type: 'Apartment',
    builtUpAreaSqFt: 1850,
    listPrice: 8350000, // ₹83.5 Lakh (Stretch Option for ₹80L budget)
    estimatedAcquisitionCosts: {
      stampDuty: 459250,
      registrationFee: 83500,
      legalVerification: 30000,
      brokerageOrPortal: 50000,
      totalAcquisitionCost: 622750
    },
    totalProjectedOutlay: 8972750,
    isStretchOption: true,
    fitsBudget: false,
    highlights: ['Stretch Option (+4.3% over budget)', 'Clubhouse & Olympic Pool', '200m from Metro Station', 'High Rental Yield'],
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60'
  }
];

export const MOCK_OPTIMIZATION_OPPORTUNITIES: OptimizationOpportunity[] = [
  {
    id: 'opt-001',
    category: 'materials',
    title: 'Switching Supplier A → Supplier B for TMT Rebars',
    type: 'alternative_supplier',
    currentCost: 344000,
    alternativeCost: 320000,
    potentialSavings: 24000,
    tradeOff: 'Secondary delivery lot scheduled for Wednesday instead of Monday (requires 2-day crane schedule shift). Grade FE 550D test certs remain identical.',
    isSafeStructural: true,
    actionableStep: 'Switch to Sri Krishna Steels & Infra authorized mill distributor consignment.',
    providerAlternative: 'Sri Krishna Steels & Infra'
  },
  {
    id: 'opt-002',
    category: 'electrical',
    title: 'Engage Class-1 Certified Local Electrical Collective',
    type: 'alternative_brand',
    currentCost: 218000,
    alternativeCost: 194000,
    potentialSavings: 24000,
    tradeOff: 'Uses Finolex FR-LSH wires with modular switches from Anchor Roma instead of Schneider premium glass touch panels.',
    isSafeStructural: true,
    actionableStep: 'Book Apex Electrical Solutions with 1-year free workmanship warranty.',
    providerAlternative: 'Apex Electrical Solutions'
  },
  {
    id: 'opt-003',
    category: 'finishing',
    title: 'Direct Factory Depot Procurement for Vitrified Tiles',
    type: 'bulk_purchase',
    currentCost: 129600,
    alternativeCost: 111000,
    potentialSavings: 18600,
    tradeOff: 'Order in single consolidated pallet directly from Morbi ceramic cluster depot. 5 extra days transit buffer needed.',
    isSafeStructural: true,
    actionableStep: 'Combine ground and first floor tile orders into single pallet dispatch.',
    providerAlternative: 'Morbi Ceramic Direct Depot'
  },
  {
    id: 'opt-004',
    category: 'labour',
    title: 'Consolidated Plastering & Scaffolding Weekday Shift',
    type: 'schedule_optimization',
    currentCost: 180000,
    alternativeCost: 168000,
    potentialSavings: 12000,
    tradeOff: 'Masonry team works in tandem with electrical chasing crew, preventing rework and double scaffolding rental days.',
    isSafeStructural: true,
    actionableStep: 'Synchronize electrical conduit inspection with civil plastering stage.',
    providerAlternative: 'Balaji Masonry Crew'
  }
];
