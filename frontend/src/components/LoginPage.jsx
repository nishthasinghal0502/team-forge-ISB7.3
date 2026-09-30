import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function LoginPage({ initialMode = "login", onNavigate }) {
  const { login, signup, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState(initialMode); // "login" | "signup"

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI / Error State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Field Touched / Real-Time Validation State
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 6;
  const isConfirmValid = mode === "login" || password === confirmPassword;
  const isNameValid = mode === "login" || name.trim().length >= 1;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate inputs before sending
    if (!isEmailValid) {
      setErrorMessage("Please enter a valid email address (e.g. founder@domain.com).");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "signup" && !isConfirmValid) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (mode === "signup" && !isNameValid) {
      setErrorMessage("Please enter your name.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        await signup(name, email, password);
        setSuccessMessage("Account created successfully! Redirecting to dashboard...");
      } else {
        await login(email, password);
        setSuccessMessage("Welcome back! Redirecting to dashboard...");
      }

      onNavigate("app");
    } catch (err) {
      setErrorMessage(err.message || "Authentication failed. Please verify your credentials.");
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
      await loginWithGoogle(credentialResponse.credential);
      setSuccessMessage("Google authentication successful! Redirecting to dashboard...");
      onNavigate("app");
    } catch (err) {
      setErrorMessage(err.message || "Google authentication failed. Please try email sign-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Top Header / Navigation */}
      <header className="login-top-nav">
        <button
          type="button"
          onClick={() => onNavigate("landing")}
          className="login-back-btn"
          id="btn-auth-back"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back to Home</span>
        </button>

        <div className="login-brand-logo" onClick={() => onNavigate("landing")} style={{ cursor: "pointer" }}>
          <img src="/idea_validator_logo.jpg" alt="VYIBE" className="auth-logo-img" />
          <span className="login-brand-badge">AUTH</span>
        </div>
      </header>

      {/* Main Glassmorphism Card */}
      <div className="login-card-wrapper">
        <div className="login-header-section">
          <div className="login-header-tag">
            {mode === "signup" ? "New Founder Registration" : "Confidential Founder Access"}
          </div>
          <h1 className="login-title">
            {mode === "signup" ? "Create your venture account" : "Sign in to Team Forge"}
          </h1>
          <p className="login-subtitle">
            {mode === "signup"
              ? "Access autonomous market research, competitor intel, and your conversational startup advisor."
              : "Access your validated startup dossiers and conversational advisor."}
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="login-alert-box alert-success" role="status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="login-alert-box alert-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Official Google OAuth Button */}
        {GOOGLE_CLIENT_ID ? (
          <div className="login-google-container">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrorMessage("Google authentication failed or was cancelled.")}
                theme="outline"
                size="large"
                shape="rectangular"
                text={mode === "signup" ? "signup_with" : "signin_with"}
                width={380}
              />
            </GoogleOAuthProvider>
          </div>
        ) : (
          <div className="google-setup-notice">
            <span className="notice-icon">ℹ️</span>
            <span>Google Sign-In is configuring. Please use direct email sign-in below.</span>
          </div>
        )}

        {/* Divider */}
        <div className="login-divider">
          <span>or continue with email</span>
        </div>

        {/* 2. Email/Password Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {mode === "signup" && (
            <div className="login-input-group">
              <label htmlFor="auth-name-input" className="login-input-label">
                Full Name
              </label>
              <input
                id="auth-name-input"
                type="text"
                className={`login-text-input ${touched.name && !isNameValid ? "input-invalid" : ""}`}
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur("name")}
                required
                autoComplete="name"
              />
              {touched.name && !isNameValid && (
                <span className="auth-field-error">Please enter your full name.</span>
              )}
            </div>
          )}

          <div className="login-input-group">
            <label htmlFor="auth-email-input" className="login-input-label">
              Email Address
            </label>
            <input
              id="auth-email-input"
              type="email"
              className={`login-text-input ${touched.email && !isEmailValid ? "input-invalid" : ""}`}
              placeholder="founder@venture.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              required
              autoComplete="email"
            />
            {touched.email && !isEmailValid && (
              <span className="auth-field-error">Please enter a valid email format (e.g. founder@domain.com).</span>
            )}
          </div>

          <div className="login-input-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="auth-password-input" className="login-input-label">
                Password
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="auth-forgot-btn"
                  id="btn-forgot-password"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="auth-password-input"
              type="password"
              className={`login-text-input ${touched.password && !isPasswordValid ? "input-invalid" : ""}`}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
            {touched.password && !isPasswordValid && (
              <span className="auth-field-error">Password must be at least 6 characters long.</span>
            )}
          </div>

          {mode === "signup" && (
            <div className="login-input-group">
              <label htmlFor="auth-confirm-input" className="login-input-label">
                Confirm Password
              </label>
              <input
                id="auth-confirm-input"
                type="password"
                className={`login-text-input ${touched.confirmPassword && !isConfirmValid ? "input-invalid" : ""}`}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                required
                autoComplete="new-password"
              />
              {touched.confirmPassword && !isConfirmValid && (
                <span className="auth-field-error">Passwords do not match.</span>
              )}
            </div>
          )}

          <button
            type="submit"
            onClick={handleSubmit}
            className="login-submit-btn"
            disabled={isSubmitting}
            id="btn-auth-submit"
          >
            {isSubmitting ? (
              <span className="login-btn-loading">
                <span className="spinner-dots" />
                <span>{mode === "signup" ? "Creating account..." : "Signing in..."}</span>
              </span>
            ) : mode === "signup" ? (
              "Create Account \u2192"
            ) : (
              "Sign In \u2192"
            )}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="login-footer-meta">
          {mode === "signup" ? (
            <p className="auth-switch-text">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setSuccessMessage("");
                  setMode("login");
                  onNavigate("login");
                }}
                className="auth-switch-btn"
                id="btn-switch-to-login"
              >
                Log In
              </button>
            </p>
          ) : (
            <p className="auth-switch-text">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setSuccessMessage("");
                  setMode("signup");
                  onNavigate("signup");
                }}
                className="auth-switch-btn"
                id="btn-switch-to-signup"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password Modal (Stub) */}
      {showForgotModal && (
        <div className="auth-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Password Reset</h3>
              <button type="button" onClick={() => setShowForgotModal(false)} className="close-btn">
                ✕
              </button>
            </div>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.5", margin: "14px 0" }}>
              Self-service password recovery is currently being connected to our automated email dispatch system. Please contact support or sign in with your registered Google account.
            </p>
            <button
              type="button"
              className="login-submit-btn"
              onClick={() => setShowForgotModal(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
