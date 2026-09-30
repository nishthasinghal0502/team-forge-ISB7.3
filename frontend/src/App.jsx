import { useState, useEffect, useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import UserAuthHeader from "./components/UserAuthHeader";
import UserReportsModal from "./components/UserReportsModal";
import ExtractedMetadata from "./components/ExtractedMetadata";
import ResultsSummary from "./components/ResultsSummary";
import CategorySection from "./components/CategorySection";
import MarketOpportunity from "./components/MarketOpportunity";
import CustomerSegments from "./components/CustomerSegments";
import CompetitorAnalysis from "./components/CompetitorAnalysis";
import WhiteSpaceAnalysis from "./components/WhiteSpaceAnalysis";
import SWOTAnalysis from "./components/SWOTAnalysis";
import MVPRecommendation from "./components/MVPRecommendation";
import GTMStrategy from "./components/GTMStrategy";
import StartupAdvisorChat from "./components/StartupAdvisorChat";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import { useAuth } from "./context/AuthContext";

// Auto-detect backend: use local server on localhost, otherwise fallback to deployed Render backend
const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:8000"
    : "https://team-forge-backend.onrender.com");

const CATEGORIES = [
  { key: "Competitors", title: "COMPETITORS" },
  { key: "Industry News", title: "INDUSTRY NEWS" },
  { key: "Customer Demand", title: "CUSTOMER DEMAND" },
  { key: "Market Size & Trends", title: "MARKET SIZE & TRENDS" },
];

const RESEARCH_STAGES = [
  { id: 1, label: "Extracting idea parameters & domain keywords" },
  { id: 2, label: "Executing multi-vector live web research" },
  { id: 3, label: "Synthesizing customer demand & market sizing" },
  { id: 4, label: "Triangulating defensible market white-space" },
  { id: 5, label: "Synthesizing SWOT matrix & strategic risk roadmap" },
  { id: 6, label: "Scoping evidence-grounded MVP & go-to-market blueprint" },
];

export default function App() {
  const { user, token, isAuthenticated, loading, login, signup, loginWithGoogle, logout } = useAuth();

  // Client-Side Route State (landing | login | signup | app)
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      if (path === "/login") return "login";
      if (path === "/signup") return "signup";
      if (path === "/app" || path === "/dashboard") return "app";
      return "landing";
    }
    return "landing";
  });

  const navigateTo = (route) => {
    setCurrentRoute(route);
    if (typeof window !== "undefined" && window.history?.pushState) {
      let url = "/";
      if (route === "login") url = "/login";
      else if (route === "signup") url = "/signup";
      else if (route === "app" || route === "dashboard") url = "/app";
      window.history.pushState({ route }, "", url);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === "/login") setCurrentRoute("login");
      else if (path === "/signup") setCurrentRoute("signup");
      else if (path === "/app" || path === "/dashboard") setCurrentRoute("app");
      else setCurrentRoute("landing");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Route Protection & Automatic Redirection Guard
  useEffect(() => {
    if (loading) return; // Wait for initial session verification

    if (isAuthenticated) {
      // Already authenticated users visiting public landing, login, or signup are directed to the app
      if (currentRoute === "landing" || currentRoute === "login" || currentRoute === "signup") {
        navigateTo("app");
      }
    } else {
      // Unauthenticated users attempting to access protected /app or /dashboard are directed to login
      if (currentRoute === "app" || currentRoute === "dashboard") {
        navigateTo("login");
      }
    }
  }, [isAuthenticated, loading, currentRoute]);

  const [idea, setIdea] = useState("");
  const [productName, setProductName] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | async_running | done | error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeStage, setActiveStage] = useState(1);
  const [activeSection, setActiveSection] = useState("section-overview");

  const [showReportsModal, setShowReportsModal] = useState(false);

  // Email Delivery State
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [deliveryEmail, setDeliveryEmail] = useState(() => user?.email || "");

  useEffect(() => {
    if (user?.email) {
      setDeliveryEmail(user.email);
    }
  }, [user]);
  const [asyncJobInfo, setAsyncJobInfo] = useState(null);
  const [asyncElapsed, setAsyncElapsed] = useState(0);

  const pollingRef = useRef(null);

  // Sync email when user signs in
  useEffect(() => {
    if (user?.email && !deliveryEmail) {
      setDeliveryEmail(user.email);
    }
  }, [user]);

  // Check URL params for shared or emailed job_id
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("job_id");
    if (jobId) {
      fetch(`${API_URL}/api/jobs/${jobId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Job not found");
          return res.json();
        })
        .then((job) => {
          if (job.status === "completed" && job.result) {
            setResult(job.result);
            setStatus("done");
          } else if (job.status === "running" || job.status === "queued") {
            setAsyncJobInfo({
              jobId: job.job_id,
              email: job.email,
              status: job.status,
            });
            setStatus("async_running");
          }
        })
        .catch((err) => {
          console.error("Failed to load job from URL param:", err);
        });
    }
  }, []);


  // Dynamic step progression for loading or async_running
  useEffect(() => {
    if (status !== "loading" && status !== "async_running") {
      setActiveStage(1);
      return;
    }

    const stageInterval = setInterval(() => {
      setActiveStage((prev) => (prev < RESEARCH_STAGES.length ? prev + 1 : prev));
    }, 3200);

    return () => clearInterval(stageInterval);
  }, [status]);

  // Async polling timer
  useEffect(() => {
    if (status !== "async_running" || !asyncJobInfo?.jobId) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    const timer = setInterval(() => {
      setAsyncElapsed((prev) => prev + 1);
    }, 1000);

    const pollJob = async () => {
      try {
        const res = await fetch(`${API_URL}/api/jobs/${asyncJobInfo.jobId}`);
        if (!res.ok) return;
        const jobData = await res.json();

        if (jobData.status === "completed" && jobData.result) {
          clearInterval(timer);
          clearInterval(pollingRef.current);
          setResult(jobData.result);
          setStatus("done");
          setAsyncJobInfo(null);
        } else if (jobData.status === "failed") {
          clearInterval(timer);
          clearInterval(pollingRef.current);
          setErrorMessage(jobData.error_message || "Async validation failed.");
          setStatus("error");
          setAsyncJobInfo(null);
        }
      } catch (e) {
        console.warn("Async polling error:", e);
      }
    };

    pollingRef.current = setInterval(pollJob, 4000);

    return () => {
      clearInterval(timer);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [status, asyncJobInfo]);

  // Section observer for quick-jump navigation
  useEffect(() => {
    if (status !== "done") return;

    const sectionIds = [
      "section-overview",
      "section-context",
      "section-whitespace",
      "section-market",
      "section-personas",
      "section-competitors",
      "section-swot",
      "section-mvp",
      "section-gtm",
      "section-sources",
      "section-advisor",
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop - offset <= scrollY) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [status]);

  // When validation completes, automatically and smoothly scroll to the Executive Overview
  useEffect(() => {
    if (status === "done" && result) {
      const timer = setTimeout(() => {
        const topEl = document.getElementById("section-overview") || document.querySelector(".results");
        if (topEl) {
          topEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [status, result]);

  const handleJumpTo = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = 64;
      const elPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elPosition - navOffset,
        behavior: "smooth",
      });
      setActiveSection(targetId);
      if (window.history?.replaceState) {
        window.history.replaceState(null, "", `#${targetId}`);
      }
    }
  };


  function handleClearForm() {
    setIdea("");
    setProductName("");
    setIndustry("");
    setTargetAudience("");
    setErrorMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (idea.trim().length < 15) {
      setErrorMessage(
        "Please describe your startup idea in a bit more detail (at least 15 characters) so we can extract accurate domain context and market signals."
      );
      setStatus("error");
      return;
    }

    if (sendEmailNotification && (!deliveryEmail || !deliveryEmail.includes("@"))) {
      setErrorMessage("Please enter a valid Gmail / Email address to receive your validation dossier.");
      setStatus("error");
      return;
    }

    let cleanIdea = idea.trim().replace(/^(?:describe the startup concept|startup concept|idea|concept)\s*:\s*/i, "");
    let cleanProductName = productName.trim().replace(/^(?:startup\s*\/?\s*product name|product name|name)\s*:\s*/i, "");
    let cleanIndustry = industry.trim().replace(/^(?:industry or vertical|industry|vertical)\s*:\s*/i, "");
    let cleanTargetAudience = targetAudience.trim().replace(/^(?:target customer profile|target audience|target customer)\s*:\s*/i, "");

    setErrorMessage("");
    setResult(null);

    // If email delivery requested -> Async execution with background worker
    if (sendEmailNotification && deliveryEmail) {
      setStatus("async_running");
      setAsyncElapsed(0);
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/validate/async`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            idea: cleanIdea,
            product_name: cleanProductName || undefined,
            industry: cleanIndustry || undefined,
            target_audience: cleanTargetAudience || undefined,
            email: deliveryEmail.trim(),
            user_id: user?.id || undefined,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || `Async submission failed (${res.status})`);
        }

        const data = await res.json();
        setAsyncJobInfo({
          jobId: data.job_id,
          email: deliveryEmail.trim(),
          status: "queued",
          message: data.message,
        });
      } catch (err) {
        setErrorMessage(err.message || "Failed to submit async validation job.");
        setStatus("error");
      }
      return;
    }

    // Synchronous execution (traditional flow)
    setStatus("loading");
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/validate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          idea: cleanIdea,
          product_name: cleanProductName || undefined,
          industry: cleanIndustry || undefined,
          target_audience: cleanTargetAudience || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        let msg = "Request failed";
        if (typeof body.detail === "string") {
          msg = body.detail;
        } else if (Array.isArray(body.detail)) {
          msg = body.detail.map((err) => err.msg || JSON.stringify(err)).join(", ");
        } else if (body.detail && typeof body.detail === "object") {
          msg = body.detail.msg || JSON.stringify(body.detail);
        } else if (body.message) {
          msg = body.message;
        } else {
          msg = `Request failed (${res.status})`;
        }
        throw new Error(msg);
      }

      const data = await res.json();
      setResult(data);
      setStatus("done");
    } catch (err) {
      setErrorMessage(
        err.message || "Something went wrong during market analysis. Please check your backend connection and try again."
      );
      setStatus("error");
    }
  }

  const sourcesByCategory = result?.summary?.sources_by_category || {};
  if (result?.sources && Object.keys(sourcesByCategory).length === 0) {
    for (const cat of CATEGORIES) {
      sourcesByCategory[cat.key] = [];
    }
    for (const s of result.sources) {
      const catKey = s.category || "Industry News";
      if (!sourcesByCategory[catKey]) sourcesByCategory[catKey] = [];
      sourcesByCategory[catKey].push(s);
    }
  }

  const competitorCount = result?.competitor_analysis?.competitors?.length || 0;
  const segmentCount = result?.market_analysis?.customer_segments?.length || 0;
  const opportunityCount = result?.white_space_analysis?.opportunities?.length || 0;
  const hasFormContent = Boolean(idea || productName || industry || targetAudience);

  // 1. Loading state during session verification
  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-card">
          <div className="auth-spinner" />
          <p className="auth-loading-text">Verifying founder session...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Routes (Landing, Signup, or Login/Protected fallback)
  if (!isAuthenticated) {
    if (currentRoute === "landing") {
      return <LandingPage onNavigate={navigateTo} />;
    }
    if (currentRoute === "signup") {
      return <LoginPage initialMode="signup" onNavigate={navigateTo} />;
    }
    // Any other route when unauthenticated (/app, /login) safely renders LoginPage
    return <LoginPage initialMode="login" onNavigate={navigateTo} />;
  }

  return (
    <div className="page">
      <div className="top-navigation-bar">
        <div
          className="app-brand-logo"
          onClick={() => navigateTo("landing")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          title="VYIBE — Back to Home"
        >
          <img
            src="/idea_validator_logo.png"
            alt="VYIBE — Validate Your Idea Before Execution"
            className="app-header-logo-img"
          />
        </div>
        <UserAuthHeader
          user={user}
          token={token}
          onLogin={loginWithGoogle}
          onLogout={() => {
            logout();
            navigateTo("landing");
          }}
          onOpenReports={() => setShowReportsModal(true)}
          onNavigateToLogin={() => navigateTo("login")}
        />
      </div>

      <Header />

      <main className="dossier">
        <form className="submission-form" onSubmit={handleSubmit}>
          <div className="form-field main-idea-field">
            <label htmlFor="idea" className="field-label">
              DESCRIBE THE STARTUP CONCEPT <span className="label-required">*</span>
            </label>
            <textarea
              id="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup concept, target customer pain, core workflow, monetization mechanism, or key assumptions in detail."
              rows={5}
            />
            <div className="form-meta-row">
              <span className="char-count">
                {idea.length.toLocaleString()} {idea.length === 1 ? "character" : "characters"}
              </span>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="productName" className="field-label">
                STARTUP / PRODUCT NAME <span className="label-optional">(OPTIONAL)</span>
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. LegalMind AI"
              />
            </div>

            <div className="form-field">
              <label htmlFor="industry" className="field-label">
                INDUSTRY OR VERTICAL <span className="label-optional">(OPTIONAL)</span>
              </label>
              <input
                id="industry"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. LegalTech / Contract Automation"
              />
            </div>

            <div className="form-field">
              <label htmlFor="targetAudience" className="field-label">
                TARGET CUSTOMER PROFILE <span className="label-optional">(OPTIONAL)</span>
              </label>
              <input
                id="targetAudience"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. In-house General Counsels at mid-market SaaS"
              />
            </div>
          </div>

          {/* Email Automation Feature */}
          <div className="email-automation-card">
            <label className="email-checkbox-label">
              <input
                type="checkbox"
                checked={sendEmailNotification}
                onChange={(e) => setSendEmailNotification(e.target.checked)}
                className="email-checkbox"
              />
              <span className="email-checkbox-custom" />
              <div className="email-checkbox-text">
                <span className="email-checkbox-title">
                  ⚡ Asynchronous Research & Gmail Delivery <span className="free-tag">100% FREE</span>
                </span>
                <span className="email-checkbox-desc">
                  Don't want to wait on this screen? We'll run the multi-agent validation in the background and email the full intelligence report to your Gmail automatically.
                </span>
              </div>
            </label>

            {sendEmailNotification && (
              <div className="email-input-wrapper">
                <input
                  type="email"
                  className="email-delivery-input"
                  placeholder="Enter your Gmail address (e.g. founder@gmail.com)"
                  value={deliveryEmail}
                  onChange={(e) => setDeliveryEmail(e.target.value)}
                  required={sendEmailNotification}
                />
                <span className="email-delivery-hint">
                  ✉️ You can safely navigate away or close this browser tab anytime after starting.
                </span>
              </div>
            )}
          </div>

          <div className="form-actions">
            {hasFormContent && (
              <button
                type="button"
                className="btn btn-secondary btn-clear"
                onClick={handleClearForm}
                disabled={status === "loading" || status === "async_running"}
              >
                Clear Form
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === "loading" || status === "async_running" || idea.trim().length === 0}
            >
              {status === "loading" || status === "async_running"
                ? "Analyzing market signals…"
                : sendEmailNotification
                ? "Launch Async Validation & Email Report →"
                : "Validate startup idea →"}
            </button>
          </div>
        </form>

        {status === "error" && (
          <div className="error-banner" role="alert">
            <span className="error-prefix">VALIDATION NOTICE:</span> {errorMessage}
          </div>
        )}

        {/* Async Background Validation Notification Card */}
        {status === "async_running" && asyncJobInfo && (
          <div className="async-status-card">
            <div className="async-card-header">
              <div className="async-badge">
                <span className="pulsing-dot" />
                <span>BACKGROUND RESEARCH ACTIVE ({asyncElapsed}s)</span>
              </div>
              <span className="async-job-id">Job: #{asyncJobInfo.jobId}</span>
            </div>

            <div className="async-card-body">
              <h4 className="async-headline">
                Your Startup Dossier is being synthesized across 9 intelligence vectors
              </h4>
              <p className="async-subtext">
                Validation takes ~45-60 seconds. You do <strong>not</strong> need to stay on this page — we will deliver the executive dossier directly to <strong>{asyncJobInfo.email}</strong>.
              </p>
              <div className="async-callout">
                <span>💡 Feel free to close this tab or check your email shortly. Or stay right here — this view will automatically open the report the moment research completes!</span>
              </div>
            </div>

            <div className="research-stepper">
              {RESEARCH_STAGES.map((stg) => {
                const isDone = activeStage > stg.id;
                const isActive = activeStage === stg.id;
                return (
                  <div
                    key={stg.id}
                    className={`stepper-item ${isDone ? "step-done" : ""} ${isActive ? "step-active" : ""}`}
                  >
                    <span className="step-indicator">
                      {isDone ? "✓" : `0${stg.id}`}
                    </span>
                    <span className="step-text">{stg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Synchronous Loading State */}
        {status === "loading" && (
          <div className="loading-container">
            <div className="loading-status-badge">
              <span className="pulsing-dot" />
              <span className="loading-eyebrow">
                VALIDATING STARTUP CONCEPT ACROSS 9 INTELLIGENCE STAGES…
              </span>
            </div>

            <div className="research-stepper">
              {RESEARCH_STAGES.map((stg) => {
                const isDone = activeStage > stg.id;
                const isActive = activeStage === stg.id;
                return (
                  <div
                    key={stg.id}
                    className={`stepper-item ${isDone ? "step-done" : ""} ${isActive ? "step-active" : ""}`}
                  >
                    <span className="step-indicator">
                      {isDone ? "✓" : `0${stg.id}`}
                    </span>
                    <span className="step-text">{stg.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="skeleton-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-bar bar-tag" />
                  <div className="skeleton-bar bar-title" />
                  <div className="skeleton-bar bar-snippet-1" />
                  <div className="skeleton-bar bar-snippet-2" />
                  <div className="skeleton-footer">
                    <div className="skeleton-bar bar-host" />
                    <div className="skeleton-bar bar-score" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === "done" && result && (
          <section className="results">
            <nav className="quick-jump-nav" aria-label="Report sections">
              <span className="quick-jump-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6, verticalAlign: "middle" }} aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                JUMP TO:
              </span>
              <div className="quick-jump-links">
                {[
                  { id: "section-overview", label: "Overview", show: true },
                  { id: "section-context", label: "Idea Context", show: Boolean(result.extracted_data) },
                  { id: "section-whitespace", label: "White-Space Map", show: Boolean(result.white_space_analysis) },
                  { id: "section-market", label: "Market Sizing", show: Boolean(result.market_analysis) },
                  { id: "section-personas", label: "Personas", show: Boolean(result.market_analysis?.customer_segments?.length) },
                  { id: "section-competitors", label: "Competitors", show: Boolean(result.competitor_analysis) },
                  { id: "section-swot", label: "SWOT & Risks", show: Boolean(result.swot_analysis) },
                  { id: "section-mvp", label: "MVP Scope", show: Boolean(result.mvp_recommendation) },
                  { id: "section-gtm", label: "GTM Strategy", show: Boolean(result.gtm_strategy) },
                  { id: "section-sources", label: "Sources", show: Boolean(result.sources && result.sources.length > 0) },
                  { id: "section-advisor", label: "Advisor Chat", show: true },
                ]
                  .filter((sec) => sec.show)
                  .map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => handleJumpTo(e, sec.id)}
                      className={`jump-link ${activeSection === sec.id ? "active-jump" : ""}`}
                    >
                      {sec.label}
                    </a>
                  ))}
              </div>
            </nav>

            {/* Dossier Executive Actions Toolbar */}
            <div className="dossier-actions-bar">
              <div className="dossier-meta-group">
                <span className="dossier-pill-badge">CONFIDENTIAL FOUNDER DOSSIER</span>
                <span className="dossier-id-badge">ID: #{result.idea_id || "TF-DOSSIER"}</span>
              </div>
              <div className="dossier-btn-group">
                <button
                  type="button"
                  className="dossier-action-btn pdf-download-btn"
                  onClick={() => window.print()}
                  id="btn-download-pdf"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download as PDF</span>
                </button>

                {result.idea_id && (
                  <button
                    type="button"
                    className="dossier-action-btn email-send-action-btn"
                    onClick={async () => {
                      const emailTarget = user?.email || deliveryEmail || prompt("Enter email address to send report to:");
                      if (!emailTarget || !emailTarget.includes("@")) return;
                      try {
                        const headers = { "Content-Type": "application/json" };
                        if (token) headers["Authorization"] = `Bearer ${token}`;
                        const res = await fetch(`${API_URL}/api/jobs/${result.idea_id}/send-email`, {
                          method: "POST",
                          headers,
                          body: JSON.stringify({ email: emailTarget.trim() }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          alert(`Validation dossier successfully sent to ${data.email || emailTarget}!`);
                        } else {
                          alert(`Could not send email: ${data.detail || "Server error"}`);
                        }
                      } catch (e) {
                        alert(`Failed to send email: ${e.message}`);
                      }
                    }}
                    id="btn-dispatch-email"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>Email Dossier to Me</span>
                  </button>
                )}

                {result.idea_id && (
                  <a
                    href={`${API_URL}/api/jobs/${result.idea_id}/email-preview`}
                    target="_blank"
                    rel="noreferrer"
                    className="dossier-action-btn email-preview-link-btn"
                    id="btn-view-email"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>View Email Report</span>
                  </a>
                )}
              </div>
            </div>

            {/* Email report delivery notice */}
            <div className="email-status-banner">
              <span className="email-status-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
              <span className="email-status-text">
                <strong>Executive Dossier Dispatched:</strong> An autonomous summary report has been compiled and sent to your registered Gmail address.{" "}
                {result.idea_id && (
                  <a href={`${API_URL}/api/jobs/${result.idea_id}/email-preview`} target="_blank" rel="noreferrer" className="email-status-link">
                    Open / Preview Email Report &rarr;
                  </a>
                )}
              </span>
            </div>

            <ResultsSummary
              summary={result.summary}
              sources={result.sources}
              competitorCount={competitorCount}
              segmentCount={segmentCount}
              opportunityCount={opportunityCount}
            />

            {result.extracted_data && <ExtractedMetadata data={result.extracted_data} />}

            {result.white_space_analysis && (
              <WhiteSpaceAnalysis data={result.white_space_analysis} />
            )}

            {result.market_analysis && (
              <MarketOpportunity data={result.market_analysis} />
            )}

            {result.market_analysis?.customer_segments && (
              <CustomerSegments
                segments={result.market_analysis.customer_segments}
                demandSourceCount={result.summary?.counts?.["Customer Demand"] ?? 0}
              />
            )}

            {result.competitor_analysis && (
              <CompetitorAnalysis data={result.competitor_analysis} />
            )}

            {result.swot_analysis && (
              <SWOTAnalysis data={result.swot_analysis} />
            )}

            {result.mvp_recommendation && (
              <MVPRecommendation data={result.mvp_recommendation} />
            )}

            {result.gtm_strategy && (
              <GTMStrategy data={result.gtm_strategy} />
            )}

            <div id="section-sources" className="evidence-header-divider">
              <span className="evidence-divider-label">
                § SUPPORTING RESEARCH EVIDENCE & SOURCE CITATIONS
              </span>
            </div>

            {result.sources.length === 0 ? (
              <p className="empty-state">
                {result.summary?.message ||
                  "No search sources returned. Try refining domain keywords or category terms."}
              </p>
            ) : (
              <div className="categorized-results-container">
                {CATEGORIES.map((cat) => {
                  const sources = sourcesByCategory[cat.key] || [];
                  return (
                    <CategorySection
                      key={cat.key}
                      title={cat.title}
                      sources={sources}
                      initialLimit={3}
                    />
                  );
                })}
              </div>
            )}

            <StartupAdvisorChat
              ideaId={result.idea_id}
              currentView={activeSection}
              apiUrl={API_URL}
            />
          </section>
        )}
      </main>

      {/* User Saved Reports History Drawer */}
      <UserReportsModal
        token={token}
        user={user}
        apiUrl={API_URL}
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        onSelectReport={(selectedReport) => {
          setResult(selectedReport);
          setStatus("done");
        }}
      />
    </div>
  );
}
