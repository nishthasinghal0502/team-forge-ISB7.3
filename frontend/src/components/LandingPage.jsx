import React, { useState, useEffect } from "react";
import "./LandingPage.css";

// 5 Orchestrated Pipeline Stages representing the Multi-Agent Crew
const AGENT_STAGES = [
  {
    id: "extraction",
    stepNumber: "01",
    name: "Idea Extraction Agent",
    badge: "CONCEPT DECONSTRUCTION",
    tagline: "Deconstructs unstructured founder vision into core hypotheses",
    description:
      "Analyzes your raw startup pitch, extracts core value propositions, formalizes primary customer personas, and creates structured search vectors for downstream empirical investigation.",
    tools: ["Tavily Query Generator", "Hypothesis Extraction", "ICP Persona Modeling"],
    metrics: "Structured Hypothesis Mapping",
    sampleOutput: {
      type: "Extracted Concept Schema",
      title: "Contract Automation for Mid-Market B2B",
      content:
        "• Core Hypothesis: Mid-market legal teams spend 60% of review time on redundant vendor redlines.\n• Primary ICP: In-house General Counsels at 200-1000 employee tech firms.\n• Monetization Mechanism: Annual tiered SaaS based on seat volume and contract throughput.",
    },
  },
  {
    id: "retrieval",
    stepNumber: "02",
    name: "Web Search & Data Retrieval",
    badge: "LIVE WEB GROUNDING",
    tagline: "Autonomous multi-vector query synthesis across live search indexes",
    description:
      "Executes parallel targeted search queries via Tavily across recent industry filings, tech publications, and trade reports. Filters out dead links and stale training data to extract authentic source URLs.",
    tools: ["Tavily Live Search", "Domain Authority Filter", "URL Citation Validator"],
    metrics: "15-25 verified live empirical sources",
    sampleOutput: {
      type: "Live Empirical Evidence Stream",
      title: "Real-Time Verified Search Grounding",
      content:
        "[1] 'State of Contract Intelligence 2026' - lawtech.org/reports/contract-ai (Auth: 88%)\n[2] 'Enterprise SaaS Legal Sizing' - venturepulse.io/market-data (Auth: 92%)\n[3] 'Vendor Risk Review Benchmark' - enterpriseb2b.com/insights (Auth: 85%)",
    },
  },
  {
    id: "parallel_intel",
    stepNumber: "03",
    name: "Deep Intelligence Swarm",
    badge: "PARALLEL AGENT CREW",
    tagline: "Concurrent market sizing, competitor feature matrix & white-space mapping",
    description:
      "Four specialized agents run simultaneously: Competitor Agent scrapes rival pricing tiers and moats; Market Sizing Agent models TAM/SAM with CAGR benchmarks; White-Space Engine detects unserved voids; SWOT Agent maps defensive moats.",
    tools: ["CrewAI Orchestrator", "Quantitative CAGR Model", "White-Space Gap Engine"],
    metrics: "4 parallel specialized research vectors",
    sampleOutput: {
      type: "Synthesized Market & Competitor Findings",
      title: "Competitive Landscape & Market Sizing",
      content:
        "• Direct Competitors Indexed: Ironclad, SpotDraft, Juro, Robin AI.\n• Pricing Benchmark: Incumbents charge $12k-$25k/yr enterprise minimums.\n• White-Space Gap: SMB-friendly self-serve contract triage with zero legal ops setup.\n• Market Model: TAM $24.8B (14.2% CAGR) | SAM $4.2B mid-market addressable.",
    },
  },
  {
    id: "execution",
    stepNumber: "04",
    name: "MVP & GTM Architect",
    badge: "EXECUTION BLUEPRINT",
    tagline: "Pragmatic build-vs-buy engineering and customer acquisition playbooks",
    description:
      "Translates research insights into actionable execution steps. Outlines the 4-week minimal viable product architecture and devises the zero-to-one go-to-market acquisition channels for your first 100 customers.",
    tools: ["Architecture Blueprints", "Build-vs-Buy Matrix", "GTM Channel Funnel"],
    metrics: "4-week MVP roadmap + First 100 acquisition plan",
    sampleOutput: {
      type: "Actionable Execution Architecture",
      title: "4-Week Technical Blueprint & GTM Channels",
      content:
        "• Week 1-2: Core redline parser with PDF text extraction (Build vs Buy: Embed LangChain + Tavily).\n• Week 3-4: Founder dashboard with exportable legal review summaries.\n• Initial Wedge: Outbound cold email to Series A/B Finance & Legal directors with free audit tool.",
    },
  },
  {
    id: "synthesis",
    stepNumber: "05",
    name: "Interactive Advisor & PDF Dossier",
    badge: "CONTINUOUS DILIGENCE",
    tagline: "Conversational venture partner strictly grounded in your validated dossier",
    description:
      "Compiles all findings into an investor-ready executive PDF dossier, triggers optional background email delivery, and mounts a real-time conversational advisor trained on your specific citations.",
    tools: ["ReportLab PDF Engine", "SendGrid Email Dispatch", "Citation-Grounded LLM"],
    metrics: "Zero-hallucination interactive diligence chat",
    sampleOutput: {
      type: "Conversational Advisor Interaction",
      title: "Founder Question & Grounded Response",
      content:
        "Founder: 'How should we price against SpotDraft?'\nAdvisor: 'SpotDraft starts at $15k/yr targeting 500+ employees. You should price at $299/mo per seat with no annual lock-in to capture the 50-200 employee segment they neglect (Source [2]).'",
    },
  },
];

// Expanded 8-Engine Capabilities
const CAPABILITY_ENGINES = [
  {
    id: "web_grounding",
    title: "Live Empirical Web Grounding",
    iconColor: "#059669",
    category: "LIVE SEARCH",
    description:
      "Never relies on static or hallucinated training data. Autonomous multi-vector web queries retrieve verifiable statistics with live, clickable source citations.",
    metricBadge: "Live Indexing",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: "competitors",
    title: "Competitor & Pricing Matrix",
    iconColor: "#2563EB",
    category: "BENCHMARKING",
    description:
      "Surfaces direct, indirect, and emerging rivals. Evaluates feature parity, pricing structures, customer review complaints, and domain authority.",
    metricBadge: "Direct & Indirect",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "market_sizing",
    title: "Quantitative Market Sizing (TAM/SAM)",
    iconColor: "#D97706",
    category: "FINANCIAL MODEL",
    description:
      "Combines top-down industry reports with bottom-up calculation models (Customer Count × Price Point) backed by verified compound annual growth rates (CAGR).",
    metricBadge: "TAM / SAM / SOM",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "white_space",
    title: "Proprietary White-Space Radar",
    iconColor: "#7C3AED",
    category: "OPPORTUNITY FIT",
    description:
      "Uncovers high-conviction underserved customer voids where existing competitors are rated poorly, overpriced, or technically rigid.",
    metricBadge: "High-Margin Gaps",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
  },
  {
    id: "mvp_scope",
    title: "MVP Scoping & Architecture Blueprint",
    iconColor: "#0284C7",
    category: "ENGINEERING",
    description:
      "Separates must-have pilot features from bloat. Delivers a concrete 4-week development roadmap with build-vs-buy recommendations for your tech stack.",
    metricBadge: "4-Week Roadmap",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    id: "gtm_strategy",
    title: "Go-To-Market & Acquisition Flywheel",
    iconColor: "#DC2626",
    category: "DISTRIBUTION",
    description:
      "Identifies your first 100 customer acquisition channels, target buyer triggers, outbound sequences, and defensible viral or enterprise distribution loops.",
    metricBadge: "First 100 Users",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "swot_risk",
    title: "SWOT & Execution Risk Matrix",
    iconColor: "#EA580C",
    category: "DEFENSIBILITY",
    description:
      "Evaluates core technological hurdles, unfair advantages, regulatory blockers, and competitor retaliation tactics with proactive mitigations.",
    metricBadge: "Risk Mitigation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "advisor_export",
    title: "Conversational Partner & PDF Dossiers",
    iconColor: "#4F46E5",
    category: "DILIGENCE SUITE",
    description:
      "Chat with an AI venture partner strictly trained on your research citations. Export an investor-grade executive PDF dossier or receive it asynchronously via email.",
    metricBadge: "PDF & Async Email",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

// Comparison Matrix
const COMPARISON_ROWS = [
  {
    dimension: "Information Freshness",
    chatgpt: "Static training data (knowledge cutoff months or years old)",
    vyibe: "Real-time live web indexing via Tavily across fresh industry filings & news",
  },
  {
    dimension: "Empirical Citations",
    chatgpt: "Hallucinated or dead URLs without verified domain authority",
    vyibe: "Verified, clickable source citations with domain reliability metrics",
  },
  {
    dimension: "Market Sizing (TAM/SAM)",
    chatgpt: "Generic multi-billion estimates with zero formula or math breakdown",
    vyibe: "Bottom-up (Customer Count × Price) & top-down models with CAGR benchmarks",
  },
  {
    dimension: "Competitor Benchmarking",
    chatgpt: "Names big legacy players; misses active pricing tiers & features",
    vyibe: "Comprehensive direct/indirect pricing tiers, feature matrix & moat gap analysis",
  },
  {
    dimension: "White-Space Discovery",
    chatgpt: "Generic platitudes ('Build an intuitive interface and focus on CX')",
    vyibe: "Algorithmic discovery of unaddressed customer pain points where incumbents fail",
  },
  {
    dimension: "Execution Blueprint",
    chatgpt: "Generic high-level suggestions without technical build-vs-buy specifics",
    vyibe: "Actionable 4-week MVP feature scope, build-vs-buy matrix & first 100 GTM channels",
  },
  {
    dimension: "Ongoing Diligence",
    chatgpt: "Context window drifts, loses track of previous research details",
    vyibe: "Conversational venture partner strictly anchored to your empirical dossier",
  },
  {
    dimension: "Deliverables & Sharing",
    chatgpt: "Manual copy-pasting unstructured text from a chat thread",
    vyibe: "One-click investor-grade PDF dossier & async background email delivery",
  },
];

// Interactive Mock Tabs for Terminal Simulation
const MOCK_TABS = [
  {
    id: "overview",
    label: "Overview",
    sectionTitle: "EXECUTIVE MARKET SIZING",
    barText: "TAM $24.8B (14.2% CAGR)",
    barWidth: "68%",
    summary:
      "Validated against verified trade index reports and bottom-up expansion metrics across enterprise buyers.",
    advisorRole: "ADVISOR (GROUNDED)",
    advisorText:
      "Based on competitor pricing gaps in the enterprise tier, an upfront seat-tier model yields the highest early velocity without triggering incumbent retaliation.",
    citation: "Source [1]: lawtech.org/reports/contract-ai (Auth: 88%)",
  },
  {
    id: "whitespace",
    label: "White-Space",
    sectionTitle: "EMPIRICAL WHITE-SPACE VOID",
    barText: "94% Conviction Triangulation",
    barWidth: "94%",
    summary:
      "Cross-referencing incumbent feature gaps detected an unserved void: lightweight automated redline triage for mid-market legal teams.",
    advisorRole: "ADVISOR (GROUNDED)",
    advisorText:
      "Legacy CLM platforms ignore firms under 500 headcount due to high onboarding costs. You have a defensible 18-month wedge.",
    citation: "Source [3]: venturepulse.io/market-data (Auth: 92%)",
  },
  {
    id: "market",
    label: "Market Sizing",
    sectionTitle: "BOTTOM-UP SIZING ANALYSIS",
    barText: "SAM $4.2B Addressable Wedge",
    barWidth: "48%",
    summary:
      "Model benchmarks 38,000 tech mid-market organizations at $110k ACV, expanding at 14.2% CAGR through 2030.",
    advisorRole: "ADVISOR (GROUNDED)",
    advisorText:
      "With $4.2B addressable market and strong macro tailwinds, capturing just 2.5% market share represents a $105M ARR business.",
    citation: "Source [2]: enterpriseb2b.com/insights (Auth: 85%)",
  },
  {
    id: "competitors",
    label: "Competitors",
    sectionTitle: "PRICING & MOAT DEFICIT MATRIX",
    barText: "4 Direct Incumbents Profiled",
    barWidth: "75%",
    summary:
      "Ironclad and SpotDraft start at $15k–$25k/yr enterprise minimums with rigid annual contracts and 4-week sales cycles.",
    advisorRole: "ADVISOR (GROUNDED)",
    advisorText:
      "Legacy CLM vendors cannot lower floor prices below $12k/yr without cannibalizing their direct sales commission structures.",
    citation: "Source [4]: g2.com/categories/clm-software (Auth: 94%)",
  },
  {
    id: "swot",
    label: "SWOT",
    sectionTitle: "STRATEGIC MOATS & RISKS",
    barText: "Top 3 Execution Risks Roadmapped",
    barWidth: "82%",
    summary:
      "Core internal advantage lies in proprietary parsing pipeline; primary mitigation is automated human review trigger on clause ambiguity.",
    advisorRole: "ADVISOR (GROUNDED)",
    advisorText:
      "Clause mismatch risk is mitigated via confidence scoring: redlines under 90% confidence trigger a human-in-the-loop review prompt.",
    citation: "Source [5]: legaltech-review.io/benchmarks (Auth: 89%)",
  },
  {
    id: "mvp",
    label: "MVP Scope",
    sectionTitle: "4-WEEK CRITICAL PATH BLUEPRINT",
    barText: "Week 1–4 Release Architecture",
    barWidth: "55%",
    summary:
      "Scraped requirements translate to a 3-feature core: PDF text extraction parser, change highlighter, and exportable legal summary.",
    advisorRole: "ADVISOR (GROUNDED)",
    advisorText:
      "API processing overhead averages $0.014 per document page. At $299/mo per seat with 500 pages/mo cap, gross margins exceed 88%.",
    citation: "Source [2]: saas-metrics.org/cloud-margins (Auth: 91%)",
  },
  {
    id: "gtm",
    label: "GTM",
    sectionTitle: "TRACTION & CHANNEL FUNNELS",
    barText: "3 Validated Acquisition Channels",
    barWidth: "62%",
    summary:
      "Primary wedge: Outbound targeted email to Series A/B Finance & Legal leaders offering a zero-cost contract risk audit.",
    advisorRole: "ADVISOR (GROUNDED)",
    advisorText:
      "By offering an instant automated contract scan instead of a sales demo, sales cycles compress from 45 days down to 8 days.",
    citation: "Source [6]: saastr.com/zero-to-one-gtm (Auth: 93%)",
  },
  {
    id: "advisor",
    label: "Advisor",
    sectionTitle: "INTERACTIVE VENTURE PARTNER",
    barText: "Zero-Hallucination Diligence Chat",
    barWidth: "90%",
    summary:
      "Conversational advisor strictly anchored to empirical citations extracted during this research run.",
    advisorRole: "ADVISOR (GROUNDED)",
    advisorText:
      "The dossier compiles instantly into an investor-ready executive PDF complete with citations, SWOT matrices, and GTM milestones.",
    citation: "Source [1]: vyibe.ai/docs/investor-dossiers (Auth: 99%)",
  },
];

export default function LandingPage({ onNavigate, user, onLogout }) {
  const [selectedStage, setSelectedStage] = useState(0);
  const [activeMockIndex, setActiveMockIndex] = useState(0);

  const activeStage = AGENT_STAGES[selectedStage];
  const currentTab = MOCK_TABS[activeMockIndex] || MOCK_TABS[0];

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    // Strict threshold and negative bottom margin: only triggers when user actually scrolls 100px past element boundary
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const targets = document.querySelectorAll(".scroll-reveal");
    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-page-root">
      {/* Top Header Navigation */}
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          <div className="landing-brand" onClick={() => onNavigate(user ? "app" : "landing")} style={{ cursor: "pointer" }} title="VYIBE">
            <img src="/idea_validator_logo.png" alt="VYIBE — Validate Your Idea Before Execution" className="landing-brand-logo-img" />
          </div>

          <nav className="landing-nav-links">
            <a href="#pipeline-section" className="nav-anchor-link">Agent Workflow</a>
            <a href="#capabilities-section" className="nav-anchor-link">Capabilities</a>
            <a href="#comparison-section" className="nav-anchor-link">Why VYIBE</a>
          </nav>

          <div className="landing-nav-actions">
            {user ? (
              <div className="landing-nav-user-cluster">
                <div className="landing-user-badge" title={user.email}>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name || "User"} className="landing-avatar-img" />
                  ) : (
                    <span className="landing-avatar-fallback">{(user.name || user.email || "U")[0].toUpperCase()}</span>
                  )}
                  <span className="landing-user-email">{user.email}</span>
                </div>
                <button
                  type="button"
                  className="landing-btn-primary"
                  onClick={() => onNavigate("app")}
                  id="landing-nav-app-btn"
                >
                  Go to App &rarr;
                </button>
                {onLogout && (
                  <button
                    type="button"
                    className="landing-btn-secondary"
                    onClick={onLogout}
                    id="landing-nav-logout-btn"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="landing-btn-secondary"
                  onClick={() => onNavigate("login")}
                  id="landing-nav-login"
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="landing-btn-primary"
                  onClick={() => onNavigate("signup")}
                  id="landing-nav-signup"
                >
                  Get Started Free &rarr;
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="landing-hero-section">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Validate Your Startup Idea in Minutes with AI Market Research
          </h1>

          <p className="landing-hero-sub">
            Real-time competitor research, market sizing, SWOT analysis, MVP scoping, and go-to-market strategy — grounded in live search data, not generic advice.
          </p>

          <div className="landing-hero-ctas">
            <button
              type="button"
              className="landing-cta-primary"
              onClick={() => onNavigate(user ? "app" : "signup")}
              id="landing-hero-start-btn"
            >
              <span>{user ? "Open Venture Validator" : "Get Started Free"}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            {!user && (
              <button
                type="button"
                className="landing-cta-secondary"
                onClick={() => onNavigate("login")}
                id="landing-hero-login-btn"
              >
                Log In
              </button>
            )}
          </div>

          <div className="landing-hero-trust-row">
            <span className="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline className="trust-polyline" points="20 6 9 17 4 12" />
              </svg>
              <span>8-Agent Autonomous Swarm</span>
            </span>
            <span className="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline className="trust-polyline" points="20 6 9 17 4 12" />
              </svg>
              <span>Verified Live Search Citations</span>
            </span>
            <span className="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline className="trust-polyline" points="20 6 9 17 4 12" />
              </svg>
              <span>MVP Blueprint & GTM Roadmap</span>
            </span>
            <span className="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline className="trust-polyline" points="20 6 9 17 4 12" />
              </svg>
              <span>Instant PDF & Email Dossiers</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT SHOWCASE */}
      <section className="landing-showcase-section scroll-reveal">
        <div className="landing-showcase-frame">
          <div className="showcase-frame-header">
            <div className="frame-dots">
              <span className="dot dot-red" />
              <span className="dot dot-amber" />
              <span className="dot dot-green" title="Live Agent Engine Connected" />
            </div>
            <div className="frame-address-bar">
              <span className="address-lock">🔒</span>
              <span className="address-url">vyibe.ai/app/dossier-report</span>
            </div>
            <div className="frame-badge">VENTURE INTELLIGENCE DOSSIER</div>
          </div>

          <div className="showcase-frame-body">
            {/* Interactive Mock Navigation Ribbon */}
            <div className="mock-quick-nav">
              <span className="mock-nav-label">✦ JUMP TO:</span>
              {MOCK_TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`mock-pill ${activeMockIndex === idx ? "active" : ""}`}
                  onClick={() => setActiveMockIndex(idx)}
                  title={`View ${tab.label} intelligence preview`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Metrics Row */}
            <div className="mock-metrics-row">
              <div className="mock-stat-card highlight">
                <div className="stat-number">18</div>
                <div className="stat-label">Empirical Sources</div>
                <div className="stat-desc">Across 4 live research vectors</div>
              </div>
              <div className="mock-stat-card">
                <div className="stat-number">6</div>
                <div className="stat-label">Competitors</div>
                <div className="stat-desc">Direct, indirect & substitutes</div>
              </div>
              <div className="mock-stat-card">
                <div className="stat-number">4</div>
                <div className="stat-label">White-Space Gaps</div>
                <div className="stat-desc">High-conviction market fits</div>
              </div>
              <div className="mock-stat-card">
                <div className="stat-number">3</div>
                <div className="stat-label">User Personas</div>
                <div className="stat-desc">Buying triggers & budgets</div>
              </div>
            </div>

            {/* Dynamic Mock Content Preview */}
            <div className="mock-dossier-preview">
              <div className="mock-preview-col preview-col-analysis">
                <div className="mock-section-title">{currentTab.sectionTitle}</div>
                <div className="mock-data-bar">
                  <div className="bar-fill" style={{ width: currentTab.barWidth }}>
                    {currentTab.barText}
                  </div>
                </div>
                <p className="mock-text-line">{currentTab.summary}</p>
              </div>
              <div className="mock-preview-col preview-col-advisor">
                <div className="mock-section-title">{currentTab.advisorRole}</div>
                <div className="mock-chat-bubble bot">
                  <span className="bot-role">CONVERSATIONAL PARTNER</span>
                  <p className="bot-message-text">{currentTab.advisorText}</p>
                  <span className="bot-citation-pill">{currentTab.citation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE MULTI-AGENT WORKFLOW PIPELINE */}
      <section className="landing-pipeline-section scroll-reveal" id="pipeline-section">
        <div className="landing-section-header">
          <span className="section-kicker">ORCHESTRATED MULTI-AGENT SWARM</span>
          <h2 className="section-heading">How 8 Autonomous Agents Validate Your Concept</h2>
          <p className="section-sub">
            Single-prompt AI produces vague advice. VYIBE orchestrates an autonomous crew of specialized agents executing in rigorous sequence with live search feedback loops.
          </p>
        </div>

        {/* Interactive Step Navigator */}
        <div className="pipeline-stepper-container">
          <div className="pipeline-stepper">
            <div
              className="pipeline-tracer-line"
              style={{ width: `${((selectedStage + 1) / AGENT_STAGES.length) * 100}%` }}
            />
            {AGENT_STAGES.map((stage, idx) => (
              <button
                key={stage.id}
                type="button"
                className={`pipeline-step-btn ${selectedStage === idx ? "active" : ""}`}
                onClick={() => setSelectedStage(idx)}
              >
                <span className="step-num">{stage.stepNumber}</span>
                <span className="step-label">{stage.name}</span>
                <span className="step-pill">{stage.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Stage Detail Inspector */}
        <div className="stage-detail-card">
          <div className="stage-detail-header">
            <div className="stage-meta-left">
              <span className="stage-badge-tag">{activeStage.badge}</span>
              <h3 className="stage-title">{activeStage.name}</h3>
              <p className="stage-tagline">{activeStage.tagline}</p>
            </div>
            <div className="stage-meta-right">
              <div className="stage-metric-box">
                <span className="metric-title">TARGET CAPABILITY</span>
                <span className="metric-val">{activeStage.metrics}</span>
              </div>
            </div>
          </div>

          <div className="stage-detail-grid">
            <div className="stage-info-panel">
              <h4 className="panel-subheading">AGENT MISSION & ARCHITECTURE</h4>
              <p className="panel-desc">{activeStage.description}</p>

              <h4 className="panel-subheading">SPECIALIZED TOOLING STACK</h4>
              <div className="panel-tools-row">
                {activeStage.tools.map((tool) => (
                  <span key={tool} className="tool-pill">
                    ⚡ {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="stage-output-panel">
              <div className="panel-output-header">
                <span className="output-tag">{activeStage.sampleOutput.type}</span>
              </div>
              <h5 className="output-title">{activeStage.sampleOutput.title}</h5>
              <pre className="output-snippet">{activeStage.sampleOutput.content}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPANDED 8-ENGINE CAPABILITIES GRID */}
      <section className="landing-capabilities-section" id="capabilities-section">
        <div className="landing-section-header">
          <span className="section-kicker">COMPREHENSIVE VENTURE INTELLIGENCE</span>
          <h2 className="section-heading">Eight Specialized Engines. One Investor-Grade Dossier.</h2>
          <p className="section-sub">
            From empirical search grounding and competitor moats to 4-week MVP engineering blueprints and customer acquisition playbooks.
          </p>
        </div>

        <div className="landing-capabilities-grid scroll-reveal">
          {CAPABILITY_ENGINES.map((engine) => (
            <div key={engine.id} className="capability-card">
              <div className="capability-top">
                <div className="capability-icon-box">
                  {engine.icon}
                </div>
                <span className="capability-metric-badge">{engine.metricBadge}</span>
              </div>
              <h3 className="capability-title">{engine.title}</h3>
              <p className="capability-desc">{engine.description}</p>
              <div className="capability-cat">{engine.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY VYIBE: COMPARISON MATRIX */}
      <section className="landing-comparison-section scroll-reveal" id="comparison-section">
        <div className="landing-section-header">
          <span className="section-kicker">RIGOR OVER GUESSWORK</span>
          <h2 className="section-heading">Generic ChatGPT vs. VYIBE Multi-Agent Swarm</h2>
          <p className="section-sub">
            Why founders trust dedicated autonomous research pipelines over single-prompt conversational models.
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="th-dimension">Evaluation Vector</th>
                <th className="th-generic">Generic Chatbot (ChatGPT / Claude)</th>
                <th className="th-vyibe">VYIBE Multi-Agent Platform</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx}>
                  <td className="td-dimension">{row.dimension}</td>
                  <td className="td-generic">
                    <div className="table-cell-flex">
                      <span className="cross-icon">✕</span>
                      <span>{row.chatgpt}</span>
                    </div>
                  </td>
                  <td className="td-vyibe">
                    <div className="table-cell-flex">
                      <span className="check-icon">✓</span>
                      <span>{row.vyibe}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="landing-cta-banner scroll-reveal">
        <div className="cta-banner-inner">
          <div className="cta-badge">ZERO RISK • REAL-TIME GROUNDING</div>
          <h2 className="cta-heading">Test Your Startup Hypothesis Before Writing Code</h2>
          <p className="cta-sub">
            Join hundreds of founders who validate real demand, identify competitor gaps, and build defensible ventures with autonomous AI research.
          </p>
          <div className="cta-actions">
            <button
              type="button"
              className="landing-cta-primary large"
              onClick={() => onNavigate("signup")}
              id="landing-cta-bottom-signup"
            >
              <span>Validate My Startup Idea Free</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-left">
            <div className="footer-brand" onClick={() => onNavigate("landing")} style={{ cursor: "pointer" }}>
              <img src="/idea_validator_logo.png" alt="VYIBE" className="footer-brand-logo-img" />
            </div>
            <p className="footer-copy">
              Autonomous Startup Idea Validator & Market Intelligence Dossiers. Grounded in live web research, competitor pricing models, and quantitative opportunity discovery.
            </p>
          </div>

          <div className="footer-links">
            <button type="button" onClick={() => onNavigate("login")} className="footer-link-btn">
              Log In
            </button>
            <button type="button" onClick={() => onNavigate("signup")} className="footer-link-btn">
              Create Account
            </button>
            <span className="footer-meta">© {new Date().getFullYear()} Team Forge. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
