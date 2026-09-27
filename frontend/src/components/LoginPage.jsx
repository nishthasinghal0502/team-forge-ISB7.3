import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./LoginPage.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function LoginPage({ user, onLogin, onLogout, onBack }) {
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid Gmail or work email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await onLogin(`dev_${cleanEmail}`);
      setSuccessMessage(`Welcome back! Authenticated as ${cleanEmail}`);
      setTimeout(() => {
        if (onBack) onBack();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await onLogin(credentialResponse.credential);
      setSuccessMessage("Google authentication successful!");
      setTimeout(() => {
        if (onBack) onBack();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || "Google authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Top Bar Navigation */}
      <nav className="login-top-nav">
        <button type="button" className="login-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Dashboard</span>
        </button>

        <div className="login-brand-logo">
          <span>TEAM FORGE</span>
          <span className="login-brand-badge">AI Diligence</span>
        </div>
      </nav>

      {/* Main Login Card */}
      <div className="login-card-wrapper">
        <div className="login-header-section">
          <span className="login-header-tag">Founder Access</span>
          <h1 className="login-title">
            {user ? "Account Dashboard" : "Sign In to Team Forge"}
          </h1>
          <p className="login-subtitle">
            {user
              ? "You are currently signed in and have full access to your research library."
              : "Access your validated idea library, automated Gmail delivery, and interactive Startup Advisor."}
          </p>
        </div>

        {errorMessage && (
          <div className="login-error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="login-success-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {user ? (
          /* Profile view if already logged in */
          <div className="login-profile-card">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name || "User"} className="login-profile-avatar" />
            ) : (
              <div
                className="login-profile-avatar"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#111",
                  color: "#fff",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {(user.name || user.email || "F").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="login-profile-name">{user.name || "Founder"}</h2>
              <p className="login-profile-email">{user.email}</p>
            </div>

            <div className="login-profile-actions">
              <button type="button" className="login-dashboard-btn" onClick={onBack}>
                Open Research Dashboard &rarr;
              </button>
              <button type="button" className="login-logout-btn" onClick={onLogout}>
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        ) : (
          /* Sign-in Form */
          <>
            {GOOGLE_CLIENT_ID ? (
              <div className="login-google-container">
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setErrorMessage("Google authentication failed. Please try email sign-in.")}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    text="continue_with"
                    width="100%"
                  />
                </GoogleOAuthProvider>
              </div>
            ) : null}

            {GOOGLE_CLIENT_ID && (
              <div className="login-divider">
                <span>OR SIGN IN WITH EMAIL</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleEmailSubmit}>
              <div className="login-input-group">
                <label className="login-input-label" htmlFor="login-name">
                  Founder / Company Name (Optional)
                </label>
                <input
                  id="login-name"
                  type="text"
                  className="login-text-input"
                  placeholder="e.g. Sanjay Kumar"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="login-input-group">
                <label className="login-input-label" htmlFor="login-email">
                  Gmail / Work Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="login-text-input"
                  placeholder="e.g. founder@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In to Team Forge &rarr;</span>
                )}
              </button>
            </form>
          </>
        )}

        {/* Feature Highlights Footer */}
        <div className="login-features-box">
          <div className="login-features-title">Unlocked with Authentication:</div>
          <div className="login-features-list">
            <div className="login-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span><strong>Saved Reports:</strong> Revisit past validations in "My Validated Reports"</span>
            </div>
            <div className="login-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span><strong>Automated Delivery:</strong> Executive HTML dossiers sent to your Gmail</span>
            </div>
            <div className="login-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span><strong>Startup Advisor:</strong> Multi-turn venture advice grounded in live research</span>
            </div>
            <div className="login-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span><strong>PDF Export:</strong> Publication-grade investment memos ready to print</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
