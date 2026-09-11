import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  HardHat,
  X
} from 'lucide-react';

interface AdSlide {
  id: string;
  category: string;
  brandName: string;
  companyName: string;
  tagline: string;
  headline: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  accentColor: string;
  badgeBg: string;
  cardBg: string;
  theme: 'amber' | 'blue' | 'yellow';
  visualType: 'cement' | 'steel' | 'waterproofing';
  callToAction: string;
  certifications: string[];
}

const AD_SLIDES: AdSlide[] = [
  {
    id: 'ultratech-cement',
    category: 'Cement & Concrete Solutions',
    brandName: 'UltraTech Cement',
    companyName: 'Aditya Birla Group',
    tagline: "The Engineer's Choice",
    headline: 'High-Strength OPC 53 & Super PPC for Durable Foundations',
    description: 'Engineered with micro-fine particle distribution to refine concrete capillary pores, reduce thermal micro-cracking, and deliver rapid 28-day compressive strength exceeding 53 MPa for long-span slabs and structural columns.',
    highlights: [
      'Early strength gain speeds up formwork de-shuttering',
      'High resistance against sulfate and chloride ingress',
      'Tamper-evident 50 kg moisture-barrier packaging'
    ],
    specs: [
      { label: 'Grade Standard', value: 'IS 12269 & IS 1489' },
      { label: '28-Day Strength', value: '≥ 53 - 58 N/mm²' },
      { label: 'Standard Setting Time', value: 'Initial ≥ 30 min' },
      { label: 'Ideal Applications', value: 'Foundations, Beams, Slabs' }
    ],
    accentColor: 'from-amber-600 to-yellow-500',
    badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-300',
    cardBg: 'from-slate-900 via-slate-800 to-amber-950/40',
    theme: 'amber',
    visualType: 'cement',
    callToAction: 'View Cement Specifications',
    certifications: ['BIS 12269:2013', 'GreenPro Level 1', 'ISO 9001:2015']
  },
  {
    id: 'tata-tiscon-steel',
    category: 'Structural Steel & High-Yield TMT',
    brandName: 'Tata Tiscon 550D',
    companyName: 'Tata Steel Limited',
    tagline: 'Joy of Building Safely',
    headline: 'Super-Ductile Fe 550D Rebars with Earthquake Resistance',
    description: 'Manufactured through controlled thermo-mechanical quenching for a toughened martensite outer rim and flexible ferrite-pearlite core. Delivers 16% minimum elongation to safely absorb seismic shear waves without brittle fracturing.',
    highlights: [
      'Superior ductility absorbs high seismic energy',
      'Strict control of tramp elements (P & S < 0.075%)',
      'Superior rib bond geometry prevents slip in concrete'
    ],
    specs: [
      { label: 'Steel Grade', value: 'Fe 550D Super Ductile' },
      { label: 'Minimum Yield Strength', value: '550 N/mm²' },
      { label: 'Minimum Elongation', value: '16.0% (IS Spec: 14.5%)' },
      { label: 'Corrosion Shield', value: 'Clean Billets, Low Impurity' }
    ],
    accentColor: 'from-sky-500 to-blue-600',
    badgeBg: 'bg-sky-500/10 text-sky-700 border-sky-300',
    cardBg: 'from-slate-950 via-slate-900 to-sky-950/40',
    theme: 'blue',
    visualType: 'steel',
    callToAction: 'Explore Rebar Specifications',
    certifications: ['IS 1786:2008 Grade Fe 550D', 'GreenPro Eco-Certified', '100% Virgin Steel']
  },
  {
    id: 'dr-fixit-chemicals',
    category: 'Structural Waterproofing & Admixtures',
    brandName: 'Dr. Fixit',
    companyName: 'Pidilite Industries',
    tagline: 'The Waterproofing Experts',
    headline: 'Comprehensive Capillary Sealing from Footing to Terrace',
    description: 'Integral liquid waterproofing admixture (Dr. Fixit LW+) and two-component flexible polymer coating (Pidifin 2K). Fills microscopic voids during concrete hydration to permanently prevent rising dampness, efflorescence, and rebar rust.',
    highlights: [
      'Reduces water permeability by over 50%',
      'Eliminates honeycombing and increases workability',
      'Protection against alkali-silica reactivity & seepage'
    ],
    specs: [
      { label: 'Standard Admixture', value: 'Dr. Fixit LW+ 200ml/bag' },
      { label: 'Polymer Membrane', value: 'Pidifin 2K Elastic Barrier' },
      { label: 'Testing Compliance', value: 'IS 2645 & IS 9103' },
      { label: 'Target Substrates', value: 'Basements, Sunken Slabs, Roofs' }
    ],
    accentColor: 'from-amber-500 to-emerald-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    cardBg: 'from-slate-900 via-slate-900 to-emerald-950/30',
    theme: 'yellow',
    visualType: 'waterproofing',
    callToAction: 'View Waterproofing Specs',
    certifications: ['IS 2645:2003', 'ASTM C 494 Type A', 'Green Building Rated']
  }
];

export const ConstructionAdCarousel: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeModalSlide, setActiveModalSlide] = useState<AdSlide | null>(null);
  const [showDisclaimerTooltip, setShowDisclaimerTooltip] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotating loop every 5.5 seconds; does not permanently stop
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!isPaused && !activeModalSlide) {
        setCurrentSlideIndex((prev) => (prev + 1) % AD_SLIDES.length);
      }
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeModalSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % AD_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + AD_SLIDES.length) % AD_SLIDES.length);
  };

  const currentSlide = AD_SLIDES[currentSlideIndex];

  return (
    <section 
      id="construction-advertisement-carousel"
      aria-label="Construction Brands Advertisement Carousel"
      className="w-full mb-6 relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Top Section Header: Advertisement Label & Verification Status */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Featured Construction Brands &bull; Sponsored Showcase
          </span>
          <div className="relative">
            <button
              id="ad-disclaimer-info-btn"
              type="button"
              onClick={() => setShowDisclaimerTooltip(!showDisclaimerTooltip)}
              onMouseEnter={() => setShowDisclaimerTooltip(true)}
              onMouseLeave={() => setShowDisclaimerTooltip(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
              aria-label="Advertisement Disclosure"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            {showDisclaimerTooltip && (
              <div className="absolute left-0 bottom-full mb-2 w-72 sm:w-80 p-3 bg-slate-900 text-slate-200 text-xs rounded-xl shadow-xl border border-slate-700 z-50 animate-in fade-in zoom-in-95 leading-relaxed">
                <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Transparency Disclosure
                </div>
                Displayed as an educational market showcase of real construction products. BuildMind AI does not claim official exclusive partnership or endorsement unless explicitly verified.
              </div>
            )}
          </div>
        </div>

        {/* Small Slide Counter */}
        <div className="text-[11px] font-semibold text-slate-500 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
          Slide {currentSlideIndex + 1} of {AD_SLIDES.length}
        </div>
      </div>

      {/* Main Wide Card Banner Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white transition-all duration-300">
        {/* Slides Track with smooth slide animation */}
        <div className="relative w-full overflow-hidden min-h-[260px] sm:min-h-[220px] md:min-h-[200px]">
          {AD_SLIDES.map((slide, index) => {
            const isActive = index === currentSlideIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out flex flex-col justify-between ${
                  isActive 
                    ? 'opacity-100 translate-x-0 pointer-events-auto z-10' 
                    : index < currentSlideIndex 
                      ? 'opacity-0 -translate-x-full pointer-events-none z-0' 
                      : 'opacity-0 translate-x-full pointer-events-none z-0'
                }`}
              >
                {/* Background Styling with subtle industrial pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white overflow-hidden">
                  {/* Subtle Grid Accent */}
                  <div 
                    className="absolute inset-0 opacity-[0.07]" 
                    style={{
                      backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                      backgroundSize: '18px 18px'
                    }}
                  />
                  {/* Ambient Glow */}
                  <div className={`absolute -right-16 -bottom-16 w-80 h-80 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${slide.accentColor}`} />
                </div>

                {/* Banner Content Area */}
                <div className="relative z-10 p-4 sm:p-6 lg:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 h-full">
                  {/* Left Column: Brand, Tagline, Headline, Highlights */}
                  <div className="flex-1 max-w-2xl">
                    {/* Top Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-amber-400 text-slate-950 shadow-xs">
                        Sponsored / Advertisement
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800/90 text-slate-200 border border-slate-700">
                        {slide.category}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                        &bull; {slide.companyName}
                      </span>
                    </div>

                    {/* Brand Title & Tagline */}
                    <div className="flex items-baseline gap-2.5 mb-1.5">
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {slide.brandName}
                      </h3>
                      <span className="text-xs sm:text-sm font-medium text-amber-400/90 italic">
                        "{slide.tagline}"
                      </span>
                    </div>

                    {/* Headline */}
                    <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug mb-2">
                      {slide.headline}
                    </p>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {slide.description}
                    </p>

                    {/* Highlights Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {slide.highlights.map((item, hIdx) => (
                        <span 
                          key={hIdx}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-200 bg-slate-800/80 border border-slate-700/80 px-2 py-0.5 rounded-md"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Visual Product Graphic & Action CTA */}
                  <div className="w-full md:w-auto flex md:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                    {/* Visual Graphic Representation */}
                    <div className="flex items-center gap-3">
                      {/* Product Visual Mockup Card */}
                      <div className="relative w-28 sm:w-36 h-20 sm:h-24 rounded-xl bg-slate-800/90 border border-slate-700 p-2 flex flex-col justify-between shadow-inner overflow-hidden">
                        {/* Dynamic Product Visual Based on Type */}
                        {slide.visualType === 'cement' && (
                          <>
                            <div className="flex items-center justify-between text-[10px] font-bold text-amber-400">
                              <span>OPC 53</span>
                              <HardHat className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <div className="my-auto text-center">
                              <div className="text-xs font-black text-white">UltraTech</div>
                              <div className="text-[9px] text-slate-400">SUPER CEMENT</div>
                              <div className="text-[8px] text-emerald-400 font-mono mt-0.5">IS 12269 CERTIFIED</div>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                              <div className="w-4/5 h-full bg-amber-400 rounded-full" />
                            </div>
                          </>
                        )}

                        {slide.visualType === 'steel' && (
                          <>
                            <div className="flex items-center justify-between text-[10px] font-bold text-sky-400">
                              <span>TISCON 550D</span>
                              <Layers className="w-3.5 h-3.5 text-sky-400" />
                            </div>
                            <div className="my-auto flex items-center justify-center gap-1 py-1">
                              {/* Ribbed rebar mockup bars */}
                              <div className="w-2.5 h-10 rounded-sm bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 border border-slate-600 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#334155_2px,#334155_4px)] opacity-60" />
                              </div>
                              <div className="w-3 h-12 rounded-sm bg-gradient-to-b from-sky-300 via-slate-100 to-slate-400 border border-sky-400 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#0284c7_2px,#0284c7_4px)] opacity-60" />
                              </div>
                              <div className="w-2.5 h-10 rounded-sm bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 border border-slate-600 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#334155_2px,#334155_4px)] opacity-60" />
                              </div>
                            </div>
                            <div className="text-[8px] text-center text-sky-300 font-mono">SUPER DUCTILE</div>
                          </>
                        )}

                        {slide.visualType === 'waterproofing' && (
                          <>
                            <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                              <span>DR. FIXIT</span>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="my-auto text-center">
                              <div className="text-xs font-black text-amber-400">LW+ & 2K</div>
                              <div className="text-[9px] text-slate-300">TOTAL SEAL</div>
                              <div className="text-[8px] text-emerald-300 font-mono mt-0.5">ZERO MOISTURE</div>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                              <div className="w-11/12 h-full bg-emerald-400 rounded-full" />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Key Technical Specs Pill */}
                      <div className="hidden lg:flex flex-col text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Specification</span>
                        <span className="text-xs font-bold text-white">{slide.specs[0].value}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold mt-1">Compliance</span>
                        <span className="text-xs font-semibold text-emerald-400">{slide.specs[1].value}</span>
                      </div>
                    </div>

                    {/* Interactive Button to Explore Real Specs */}
                    <button
                      id={`ad-cta-${slide.id}`}
                      type="button"
                      onClick={() => setActiveModalSlide(slide)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-100 text-slate-900 shadow-md transition-all duration-150 hover:scale-[1.02] cursor-pointer shrink-0"
                    >
                      <span>{slide.callToAction}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Control Buttons (Left / Right) */}
        <button
          id="ad-carousel-prev-btn"
          type="button"
          onClick={prevSlide}
          aria-label="Previous Construction Advertisement"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/80 shadow-md backdrop-blur-xs transition-all hover:scale-105"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          id="ad-carousel-next-btn"
          type="button"
          onClick={nextSlide}
          aria-label="Next Construction Advertisement"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/80 shadow-md backdrop-blur-xs transition-all hover:scale-105"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Bottom Pagination Bar: Exactly 3 Pagination Dots (● ○ ○) */}
        <div 
          id="ad-carousel-pagination"
          className="bg-slate-950/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between z-20 relative"
        >
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <span>Featured Brand:</span>
            <strong className="text-white">{currentSlide.brandName}</strong>
          </div>

          {/* Exactly 3 Dots */}
          <div className="flex items-center gap-2">
            {AD_SLIDES.map((slide, index) => {
              const isActive = index === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  id={`ad-dot-${index + 1}`}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}: ${slide.brandName}`}
                  className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    isActive 
                      ? 'w-6 h-2.5 bg-amber-400 shadow-xs' 
                      : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
            Auto-rotates &bull; Click to switch
          </div>
        </div>
      </div>

      {/* Real Construction Material Technical Information Modal */}
      {activeModalSlide && (
        <div 
          id="ad-product-specs-modal"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalSlide(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-slate-900 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    Product Specification Sheet
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeModalSlide.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {activeModalSlide.brandName}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeModalSlide.companyName} &bull; {activeModalSlide.tagline}
                </p>
              </div>
              <button
                id="close-ad-specs-modal-btn"
                type="button"
                onClick={() => setActiveModalSlide(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs leading-relaxed">
              <p className="text-slate-600 text-sm">
                {activeModalSlide.description}
              </p>

              {/* Technical Specifications Grid */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="font-bold text-slate-800 text-xs mb-2">Technical Standards & Code Compliance</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {activeModalSlide.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">{spec.label}</div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="font-bold text-slate-800 text-xs mb-1.5">Verified Indian & Global Standards:</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalSlide.certifications.map((cert, cIdx) => (
                    <span 
                      key={cIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Sponsored Advertisement Notice:</strong> Displayed for civil engineering planning and market product comparison. BuildMind AI provides independent budget intelligence and is not liable for manufacturer variations or regional supply pricing.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModalSlide(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
