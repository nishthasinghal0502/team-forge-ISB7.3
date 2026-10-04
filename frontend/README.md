# Frontend — Team Forge Validation Dashboard

The frontend is a modern, high-performance **React 19 + Vite** single-page application built for deep interactive exploration of autonomous venture validation reports. It features an **Editorial Light Theme** with fluid responsive grids, jump-navigation, real-time pipeline status tracking, and 12 dedicated analytical modules.

---

## 🎨 Design Philosophy & UX Architecture

- **Editorial Theme**: Clean ivory-to-slate gradient background (`#fafafa` / `#ffffff`), crisp typography (system font stack with geometric headings), refined borders (`border-slate-200`), and semantic badge coloring.
- **Fluid Layout**: Replaced rigid container widths with full-bleed responsive layouts (`w-full px-4 md:px-8 xl:px-12`) expanding to 3 and 4 columns on wide monitors.
- **§ Jump Navigation**: Sticky sub-header with single-section active tracking allowing one-click smooth scrolling directly to any analytical section.
- **Honest Grounding Notice**: Real-time contextual amber alert rendering directly above personas whenever customer demand evidence yields 0 web citations, ensuring transparent reporting of market data availability.
- **Scroll-Reveal System**: Strict `IntersectionObserver` scroll-triggered reveal with negative bottom bounds (`rootMargin: "0px 0px -100px 0px"`), preventing premature loading animations.

---

## 📁 Directory Structure

```
frontend/
├── public/                     # Static assets (favicons, brand logo, web manifest)
├── api/                        # Vercel serverless function (send-email.js)
├── src/
│   ├── components/             # 17 Modular UI & analytical presentation components
│   │   ├── LandingPage.jsx     # Modern executive hero landing page with live pipeline demo
│   │   ├── LoginPage.jsx       # Direct email login & Google One-Tap OAuth 2.0 portal
│   │   ├── UserAuthHeader.jsx  # Navigation bar with user profile, sign in, & reports modal trigger
│   │   ├── UserReportsModal.jsx# Dossier Library modal (view historical reports & download PDF)
│   │   ├── StartupAdvisorChat.jsx # Interactive slide-out conversational partner drawer
│   │   ├── CustomerSegments.jsx   # ICP personas & [HONEST GROUNDING NOTICE] banner
│   │   ├── CompetitorAnalysis.jsx # Competitor positioning, direct/indirect rivals, pricing
│   │   ├── ExtractedMetadata.jsx  # Structured pitch breakdown card & domain keywords
│   │   ├── GTMStrategy.jsx        # Go-to-market channels, CAC, funnels, milestones
│   │   ├── MarketOpportunity.jsx  # TAM / SAM / SOM sizing, CAGR & market barriers
│   │   ├── MVPRecommendation.jsx  # 3-phase product roadmap & technical risk triage
│   │   ├── SWOTAnalysis.jsx       # 4-quadrant strategic synthesis matrix
│   │   ├── WhiteSpaceAnalysis.jsx # Deterministic 2x2 opportunity gap radar & unaddressed pain
│   │   ├── ResultsSummary.jsx     # Composite diligence summary & metrics bar
│   │   ├── SourceCard.jsx         # Grounded web research citation card
│   │   ├── CategorySection.jsx    # Collapsible 4-category search source viewer
│   │   └── Header.jsx             # Minimal sub-header bar
│   ├── context/
│   │   └── AuthContext.jsx     # Global authentication state, JWT session & Google OAuth provider
│   ├── App.css                 # Comprehensive executive styling, layout tokens & micro-animations
│   ├── App.jsx                 # Core application controller, console state & 1-click sample loaders
│   ├── index.css               # Design tokens, typography variables, and reset rules
│   └── main.jsx                # React 19 root mount
├── index.html                  # HTML entry point with meta tags & SEO structure
├── package.json                # React 19.0.0, @react-oauth/google, Vite 5.4.21
└── vite.config.js              # Vite bundler configuration
```

---

## 🧩 Key Components Reference

| Component | Responsibility & Features |
| :--- | :--- |
| **`LandingPage.jsx`** | Executive marketing showcase with interactive live validation stepper demo, feature cards, and direct CTAs. |
| **`LoginPage.jsx`** | Google One-Tap OAuth 2.0 and direct email authentication with JWT session token issuance. |
| **`UserReportsModal.jsx`** | Historical dossier manager allowing founders to view past validations, trigger PDF exports, or email reports. |
| **`StartupAdvisorChat.jsx`** | Multi-turn conversational advisor drawer strictly bounded by active report citations (`POST /api/advisor/chat`). |
| **`ExtractedMetadata.jsx`** | Displays structured pitch attributes: Problem, Proposed Solution, Target Audience, Revenue Model, and Vertical. |
| **`MarketOpportunity.jsx`** | Visualizes Market Sizing (TAM/SAM/SOM), Market Growth CAGR, Growth Drivers, and Entry Barriers. |
| **`CompetitorAnalysis.jsx`** | Side-by-side comparison matrix of direct & indirect competitors, pricing tiers, and feature sets. |
| **`CustomerSegments.jsx`** | Buyer personas (ICP, pain points, willingness to pay) + conditional **`[HONEST GROUNDING NOTICE]`** alert banner. |
| **`WhiteSpaceAnalysis.jsx`** | 2x2 opportunity matrix highlighting unmet market needs, market gaps, and differentiation opportunities. |
| **`SWOTAnalysis.jsx`** | 4-quadrant strategic matrix (Strengths, Weaknesses, Opportunities, Threats) grounded in empirical findings. |
| **`MVPRecommendation.jsx`** | Phased execution roadmap (Phase 1 MVP, Phase 2, Phase 3), feature prioritization, and technical risk mitigation. |
| **`GTMStrategy.jsx`** | Go-To-Market strategy, distribution channels, customer acquisition cost strategies, and milestone timeline. |
| **`SourceCard.jsx`** | Verifiable web research citation card with domain badge, published date, and direct URL link. |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation & Run
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Launch Vite development server
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### Production Build
```bash
npm run build
npm run preview
```
Vite will compile production-optimized bundles into `frontend/dist/`.
