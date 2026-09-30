# VYIBE — Complete System Architecture & Technology Stack Specification
**Autonomous Multi-Agent Venture Intelligence Swarm (Project Team Forge ISB7.3)**

![VYIBE System Architecture Diagram](docs/images/vyibe_architecture_diagram.jpg)

---

## 1. Architectural Topology Overview

**VYIBE** (*Validate Your Idea Before Execution*) is architected as an event-driven, decoupled multi-agent venture diligence platform. The system coordinates an autonomous swarm of 8 domain-specific intelligence agents, a conversational advisory partner, and a deterministic sanitization engine to transform unstructured startup concepts into publication-grade venture dossiers in under 60 seconds.

The platform is organized into six interconnected architectural tiers:
1. **Client / Presentation Layer** (React 19 + Vite + Vercel Edge)
2. **API Gateway & Orchestration Layer** (FastAPI + Render Cloud)
3. **CrewAI Multi-Agent Diligence Pipeline** (10 Sequential Stages)
4. **External Services & Real-Time Data Layer** (Tavily AI Search, DuckDuckGo, TLS SMTP, Resend)
5. **LLM Inference & Foundation Model Layer** (Groq Cloud LPUs with Cascading Failover: Qwen 3.8 27B / GPT-OSS 120B / GPT-OSS 20B)
6. **Supporting Infrastructure & Persistence Tier** (SQLite, SQLAlchemy, PyJWT, LRU Cache)

---

## 2. Comprehensive Component & Technology Stack Mapping

### 2.1 Client Presentation Layer (Frontend)
- **Framework & Bundler**: **React 19.0.0** + **Vite 5.4.21**
- **Hosting / Edge CDN**: **Vercel** (Global Edge Network, automatic SSL, zero-downtime atomic deployments)
- **Styling Architecture**: **Bespoke Vanilla CSS** on a **Warm Editorial Research Canvas** (`#FAF8F5`, `#111111`, `#D99B26`)
  - Typography: `Instrument Serif` (editorial display headlines), `Inter` (high-contrast UI body), and `Space Mono` (analytical data tags)
  - Micro-Animations: Custom `@keyframes fadeInUp` with cubic-bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`), live pulsing engine indicators, and responsive input elevation
- **Interactive UI Sub-Modules**:
  - **Google OAuth Login**: One-tap founder authentication via `@react-oauth/google` with automatic JWT hydration
  - **Venture Diligence Console**: 16px rounded card with live status indicator (`8-Agent Swarm Ready`), dual borders, and responsive parameter inputs
  - **1-Click Sample Concept Chips**: Instant test pre-loaders (`LegalTech AI`, `Fleet Telematics`, `MedTech Denial AI`)
  - **Live 10-Stage Stepper**: Real-time visual progress indicator tracking agent execution states
  - **Dossier Library & History**: "📁 My Reports" slide-out modal fetching historical dossiers via `GET /api/reports/my`
  - **Publication-Grade A4 PDF Export**: Dedicated `@media print` stylesheets formatting all 12 analytical sections with zero web chrome and `page-break-inside: avoid`
  - **Email Automation Toggle**: Custom iOS-style toggle switch activating background asynchronous research
  - **Interactive Venture Advisor**: Slide-out drawer powering multi-turn contextual conversations grounded in active dossier citations

---

### 2.2 External Services & Data Layer
- **Tavily AI Search API (Primary Web RAG)**:
  - High-precision, LLM-optimized search engine providing structured markdown snippets, source URLs, and publication timestamps in under 1 second.
  - Divided into 4 distinct tool vectors: `search_competitors`, `search_customer_demand`, `search_market_size`, and `search_industry_news`.
- **DuckDuckGo Search (Failover Search)**:
  - Native Python fallback scraper activated automatically if Tavily reaches monthly credit limits or rate boundaries.
- **Web Intelligence & Industry News APIs**:
  - Ingestion of live venture funding signals, regulatory announcements, and analyst report previews (Gartner, Grand View Research).
- **Email Delivery Services**:
  - **Primary**: Standard **Gmail TLS SMTP** (`smtp.gmail.com:587`) for zero-cost transactional email dispatching.
  - **Secondary / Scaled**: **Resend API** / Brevo integration for high-volume enterprise deliverability.
  - **Local Fallback**: Local HTML preview storage (`backend/data/emails/{job_id}.html`) when SMTP credentials are unconfigured.

---

### 2.3 Backend Gateway & Orchestrator (FastAPI + Render Cloud)
- **Runtime & Web Framework**: **Python 3.11+** running on **FastAPI 0.115.0** and **Uvicorn ASGI**
- **Cloud Infrastructure**: **Render Cloud** (Linux Containerized Web Service, automated CI/CD from `main` branch)
- **Core Platform Capabilities**:
  - **REST API Endpoints**: Synchronous validation (`POST /api/validate`), async submission (`POST /api/validate/async`), job polling (`GET /api/jobs/{id}`), and advisor queries (`POST /api/advisor/chat`)
  - **Pydantic v2 Contract Layer**: Strict runtime serialization and input/output contract enforcement across all 10 stages (`schemas/models.py`)
  - **Native BackgroundTasks**: Asynchronous worker execution executing 60-second multi-agent pipelines in Python's internal event loop without Celery or Redis
  - **JWT Authentication Engine**: 7-day signed HMAC-SHA256 session tokens with cryptographic verification against Google OAuth public keys
  - **Externalized Prompt Templates**: 14 Markdown prompt files under `backend/prompts/` dynamically interpolated at runtime by `PromptLoader`

---

### 2.4 The 10-Stage Multi-Agent Pipeline

The core intelligence layer coordinates 10 specialized stages:

| Stage # | Stage Name | Implementation | Function & Contract Output |
| :---: | :--- | :--- | :--- |
| **1** | **Idea Extraction** | LLM Agent (`qwen-2.5-32b`) | Deconstructs unstructured pitches into structured parameters: Core Problem, Solution Thesis, Target Audience (ICP), Revenue Model, and Vertical Keywords. |
| **2** | **Market Research** | CrewAI Autonomous Agent + Tavily Tools | Autonomously formulates search queries, evaluates incoming payloads, and queries 4 vectors (Competitors, Demand, Sizing, News) with Selective Autonomy. |
| **3** | **Data Retrieval & Sanitization** | Deterministic Python Engine | Deduplicates URLs, strips promotional web noise, and enforces a strict **1,500-character snippet budget per citation** to prevent context truncation. |
| **4** | **Market Analysis** | LLM Agent (`qwen-2.5-32b`) | Computes verifiable TAM/SAM/SOM market sizing, compound annual growth rate (CAGR), growth drivers, regulatory barriers, and customer personas. |
| **5** | **Competitor Analysis** | LLM Agent (`qwen-2.5-32b`) | Discovers named direct and indirect market competitors, pricing structures, core capabilities, and feature differentiation vectors. |
| **6** | **White-Space Engine** | Deterministic Triangulation Engine | Mathematically triangulates verified customer complaints against competitor voids to project defensible market opportunities into a 2x2 matrix. |
| **7** | **SWOT Analysis** | LLM Agent (`qwen-2.5-32b`) | Synthesizes an empirical 4-quadrant strategic matrix (Strengths, Weaknesses, Opportunities, Threats) paired with a 12-month risk mitigation plan. |
| **8** | **MVP Roadmap** | LLM Agent (`qwen-2.5-32b`) | Translates validated white-space into a disciplined 3-phase engineering roadmap (Phase 1 Core MVP, Phase 2, Phase 3) with an explicit "Anti-Scope". |
| **9** | **GTM Strategy** | LLM Agent (`qwen-2.5-32b`) | Formulates a customer acquisition plan, conversion funnels, low-CAC distribution channels, and launch milestones (Day 1, 30, 90). |
| **10** | **Startup Advisor** | LLM Agent (`qwen-2.5-32b`) + LRU Cache | Multi-turn conversational partner (`POST /api/advisor/chat`) answering strategic questions grounded strictly in the validated dossier's empirical data. |

---

### 2.5 LLM Infrastructure & Groq Cloud LPU Inference Tier
- **Inference Engine**: **Groq Cloud LPUs (Language Processing Units)**
  - Operates ultra-low latency token generation (500+ tokens/sec) on Groq custom silicon hardware.
  - **Cascading Failover Architecture**: Automatic fallback across model pool upon rate limits (HTTP 429) or transient timeouts with exponential backoff:
    1. **Primary Model**: `qwen/qwen3.8-27b` (Exceptional JSON schema adherence, structured parameter extraction, and high analytical throughput).
    2. **Cascading Fallback 1**: `openai/gpt-oss-120b` (Deep strategic reasoning for complex market synthesis, crew orchestration, and multi-agent tasks).
    3. **Cascading Fallback 2**: `openai/gpt-oss-20b` (High-efficiency secondary failover model).
    4. **Cascading Fallback 3**: `allam-2-7b` (Fast emergency fallback model).
    5. **Resiliency Pool**: `groq/compound`, `groq/compound-mini`, `qwen/qwen3.6-27b`.
  - **Output Sanitization**: Strips reasoning `<think>` tags, markdown fences, and trailing text to guarantee valid JSON serialization.

---

### 2.6 Supporting Infrastructure & Persistence Tier
- **Database & Relational Storage**:
  - **SQLite3** (`backend/data/team_forge.db`): Zero-cost embedded ACID relational database.
  - Tables:
    - `users`: `id`, `email`, `name`, `avatar_url`, `created_at`
    - `validation_jobs`: `job_id`, `user_id`, `idea_text`, `email`, `status`, `result_json`, `created_at`, `completed_at`
- **Security & Reliability**:
  - Input Coherence Defense (word-frequency heuristic filtering out gibberish or spam pitches).
  - Strict Rate Limiting and global exception handlers preventing server crashes.
  - Bounded LRU Cache (`MAX_CACHE_ENTRIES = 100`) preventing memory leaks on 512MB RAM cloud tiers.
- **Environment & Configuration Management**:
  - Centralized Pydantic settings management (`config.py`) reading from `.env`.
  - Zero hardcoded API keys or secrets in source code.

---

## 3. End-to-End Execution Flow

### 3.1 Synchronous Flow (`POST /api/validate`)
1. **Submission**: Founder submits pitch via the Executive Venture Console.
2. **Extraction**: `IdeaExtractionAgent` parses parameters and vertical domain keywords.
3. **Autonomous RAG**: `MarketResearchAgent` queries Tavily search tools across 4 categories.
4. **Sanitization**: Results are deduplicated and budgeted to 1,500 characters per source.
5. **Synthesis**: Downstream agents compute Market Sizing, Competitors, White-Space, SWOT, MVP, and GTM.
6. **Delivery**: Full JSON payload is returned to the frontend; UI renders the complete 12-module dossier.

### 3.2 Asynchronous Flow (`POST /api/validate/async`)
1. **Enqueuing**: Founder enables *"Asynchronous Research & Email Delivery"* and submits form.
2. **Immediate 202 Response**: Backend creates a `validation_jobs` row in SQLite with status `queued` and returns `HTTP 202 Accepted` with `{ job_id }` in under 200ms.
3. **Background Worker**: Native FastAPI `BackgroundTasks` executes the 10-stage pipeline concurrently.
4. **Client Polling**: If the user remains on page, client polls `GET /api/jobs/{id}` every 3 seconds.
5. **Automated Email Dispatch**: On completion, `email_service` compiles a responsive HTML executive summary with deep links and sends it via TLS SMTP to the founder's inbox.
6. **Safe Tab Closure**: The user can safely navigate away or shut down their laptop anytime; the report is delivered to their email and stored in SQLite under "My Reports".

---

## 4. Anti-Hallucination & Honest Grounding Invariants

1. **Citation Grounding Contract**: Every quantitative figure (TAM, SAM, SOM, CAGR) must include a direct URL citation from the live search payload. If no source cites a specific number, the system explicitly returns `null` or an empty array rather than inventing an estimate.
2. **Named Entity Verification**: Competitor names are extracted strictly from search snippets using a 1,500-character budget per source, preventing fictional entity creation.
3. **`[HONEST GROUNDING NOTICE]`**: If live search engines return zero citations for a category (e.g., Customer Demand for deep-tech pitches), the frontend renders an explicit amber notice rather than synthesizing synthetic data.
