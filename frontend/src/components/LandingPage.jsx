import React from "react";
import "./LandingPage.css";

export default function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page-root">
      {/* Top Header Navigation */}
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          <div className="landing-brand" onClick={() => onNavigate("landing")} style={{ cursor: "pointer" }}>
            <img src="/idea_validator_logo.jpg" alt="VYIBE — Validate Your Idea Before Execution" className="landing-brand-logo-img" />
          </div>

          <div className="landing-nav-actions">
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
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="landing-hero-section">
        <div className="landing-hero-content">
          <div className="landing-badge">
            <span className="landing-pulse-dot" />
            <span>Autonomous Venture Intelligence</span>
          </div>

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
              onClick={() => onNavigate("signup")}
              id="landing-hero-start-btn"
            >
              <span>Get Started Free</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <button
              type="button"
              className="landing-cta-secondary"
              onClick={() => onNavigate("login")}
              id="landing-hero-login-btn"
            >
              Log In
            </button>
          </div>

          <div className="landing-hero-trust-row">
            <span className="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Multi-Agent Research Pipeline</span>
            </span>
            <span className="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Verified Search Citations</span>
            </span>
            <span className="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Instant PDF & Email Dossiers</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT SHOWCASE */}
      <section className="landing-showcase-section">
        <div className="landing-showcase-frame">
          <div className="showcase-frame-header">
            <div className="frame-dots">
              <span className="dot dot-red" />
              <span className="dot dot-amber" />
              <span className="dot dot-green" />
            </div>
            <div className="frame-address-bar">
              <span className="address-lock">🔒</span>
              <span className="address-url">teamforge.ai/app/dossier-report</span>
            </div>
            <div className="frame-badge">CONFIDENTIAL FOUNDER DOSSIER</div>
          </div>

          <div className="showcase-frame-body">
            {/* Mock Navigation Ribbon */}
            <div className="mock-quick-nav">
              <span className="mock-nav-label">✦ JUMP TO:</span>
              <span className="mock-pill active">Overview</span>
              <span className="mock-pill">White-Space</span>
              <span className="mock-pill">Market Sizing</span>
              <span className="mock-pill">Competitors</span>
              <span className="mock-pill">SWOT</span>
              <span className="mock-pill">MVP Scope</span>
              <span className="mock-pill">GTM</span>
              <span className="mock-pill">Advisor</span>
            </div>

            {/* Metrics Row */}
            <div className="mock-metrics-row">
              <div className="mock-stat-card highlight">
                <div className="stat-number">18</div>
                <div className="stat-label">Empirical Sources</div>
                <div className="stat-desc">Across 4 research vectors</div>
              </div>
              <div className="mock-stat-card">
                <div className="stat-number">6</div>
                <div className="stat-label">Competitors</div>
                <div className="stat-desc">Direct & substitutes indexed</div>
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

            {/* Mock Content Snippet */}
            <div className="mock-dossier-preview">
              <div className="mock-preview-col">
                <div className="mock-section-title">EXECUTIVE MARKET SIZING</div>
                <div className="mock-data-bar">
                  <div className="bar-fill" style={{ width: "65%" }}>TAM $24.8B (14.2% CAGR)</div>
                </div>
                <p className="mock-text-line">
                  Validated against verified trade index reports and enterprise buyer expansion rates.
                </p>
              </div>
              <div className="mock-preview-col">
                <div className="mock-section-title">INTERACTIVE VENTURE PARTNER</div>
                <div className="mock-chat-bubble bot">
                  <span className="bot-role">ADVISOR</span>
                  <p>Based on competitor pricing gaps in the enterprise HR tier, an upfront seat-tier model yields the highest early velocity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE GRID (4 cards) */}
      <section className="landing-features-section">
        <div className="landing-section-header">
          <span className="section-kicker">FOUR CORE RESEARCH ENGINES</span>
          <h2 className="section-heading">Rigorous Validation Grounded in Verified Signals</h2>
          <p className="section-sub">
            Every analysis is autonomously retrieved, language-filtered, and cross-referenced by specialized agents.
          </p>
        </div>

        <div className="landing-features-grid">
          {/* Card 1: SWOT & Risk Analysis */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
            <h3 className="feature-title">SWOT & Risk Analysis</h3>
            <p className="feature-desc">
              Identifies core strengths, defensive moats, technical execution risks, and regulatory threats with pragmatic mitigation strategies before writing code.
            </p>
            <div className="feature-tag">AGENTIC MATRIX</div>
          </div>

          {/* Card 2: Competitor Intelligence */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h3 className="feature-title">Competitor Intelligence</h3>
            <p className="feature-desc">
              Surfaces direct and indirect competitors across live search indexes, tracking pricing models, key feature gaps, and domain authority comparisons.
            </p>
            <div className="feature-tag">LIVE WEB SEARCH</div>
          </div>

          {/* Card 3: Market Sizing & White-Space Mapping */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h3 className="feature-title">Market Sizing & White-Space Mapping</h3>
            <p className="feature-desc">
              Estimates TAM and SAM with verified CAGR forecast benchmarks while identifying underserved founder opportunities where rivals underdeliver.
            </p>
            <div className="feature-tag">QUANTITATIVE MODEL</div>
          </div>

          {/* Card 4: Conversational AI Advisor */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="feature-title">Conversational AI Advisor</h3>
            <p className="feature-desc">
              Chat with a dedicated venture partner strictly grounded in your idea's citations to interrogate unit economics, go-to-market roadmaps, and target personas.
            </p>
            <div className="feature-tag">STRICT ANTI-HALLUCINATION</div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-left">
            <div className="footer-brand" onClick={() => onNavigate("landing")} style={{ cursor: "pointer" }}>
              <img src="/idea_validator_logo.jpg" alt="VYIBE" className="footer-brand-logo-img" />
            </div>
            <p className="footer-copy">
              Autonomous Startup Idea Validator & Market Intelligence Dossiers.
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
