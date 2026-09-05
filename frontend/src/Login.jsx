import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import API_BASE_URL from "./config";
import doctorHeroImg from "./assets/doctors_hero.png";

function Login({ onLogin }) {
  const navigate = useNavigate();

  // Login Mode: "ADMIN", "DOCTOR", "WARDEN", or "USER"
  const [loginMode, setLoginMode] = useState("ADMIN");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Google Account Chooser Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [systemEmails, setSystemEmails] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("system_google_emails") || "[]");
    } catch {
      return [];
    }
  });

  // Handle Input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    if (error) {
      setError("");
      setIsAccessDenied(false);
    }
  };

  // Switch Login Mode - Always start with empty inputs (no auto-fill)
  const handleModeSwitch = (mode) => {
    setLoginMode(mode);
    setError("");
    setIsAccessDenied(false);
    setFormData({
      username: "",
      password: "",
    });
  };

  const handleOpenGoogleModal = () => {
    setGoogleError("");
    setGoogleEmail("");
    setShowGoogleModal(true);
  };

  const handleCloseGoogleModal = () => {
    setShowGoogleModal(false);
    setGoogleError("");
    setGoogleEmail("");
  };

  const handleSelectGoogleEmail = (selectedEmail) => {
    executeGoogleLogin(selectedEmail);
  };

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    const email = googleEmail.trim();
    if (!email) {
      setGoogleError("Please enter your Google email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setGoogleError("Please enter a valid email address (e.g. user@gmail.com).");
      return;
    }
    executeGoogleLogin(email);
  };

  const executeGoogleLogin = (email) => {
    const rawName = email.split("@")[0].replace(/[._-]/g, " ");
    const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    try {
      const existing = JSON.parse(localStorage.getItem("system_google_emails") || "[]");
      const updated = [email, ...existing.filter((e) => e.toLowerCase() !== email.toLowerCase())].slice(0, 5);
      localStorage.setItem("system_google_emails", JSON.stringify(updated));
      setSystemEmails(updated);
    } catch {
      // ignore
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", email);
    localStorage.setItem("userRole", "USER");
    localStorage.setItem("loggedInUser", `${displayName} (Google)`);

    setShowGoogleModal(false);
    navigate("/dashboard", { replace: true });
  };

  // Submit Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsAccessDenied(false);

    const username = formData.username.trim();
    const password = formData.password;

    if (!username || !password) {
      setError("Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    const loginUrl = `${API_BASE_URL}/api/auth/login`;

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          loginType: loginMode,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      let result = null;

      if (contentType.includes("application/json")) {
        try {
          result = await response.json();
        } catch {
          result = null;
        }
      } else {
        try {
          const text = await response.text();
          result = { message: text };
        } catch {
          result = null;
        }
      }

      if (response.ok && result?.success !== false) {
        let userRole = result?.role || (loginMode === "WARDEN" ? "CHIEF_WARDEN" : loginMode === "DOCTOR" ? "DOCTOR" : loginMode === "ADMIN" ? "ADMIN" : "USER");
        const displayName = result?.fullName || result?.username || username;

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("loggedInUser", displayName);

        if (result) {
          localStorage.setItem("user", JSON.stringify(result));
          if (result.token) localStorage.setItem("token", result.token);
          if (result.accessToken) localStorage.setItem("accessToken", result.accessToken);
        }

        if (typeof onLogin === "function") {
          onLogin(result);
        }

        if (userRole === "CHIEF_WARDEN" || userRole === "WARDEN") {
          navigate("/beds", { replace: true });
        } else if (userRole === "DOCTOR") {
          navigate("/appointments", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      let errorMessage = "Invalid username or password.";
      if (result?.message && String(result.message).trim()) {
        errorMessage = result.message;
      } else if (typeof result === "string" && result.trim()) {
        errorMessage = result;
      } else if (result?.error && String(result.error).trim()) {
        errorMessage = result.error;
      }

      if (response.status === 403 || errorMessage.toLowerCase().includes("access denied")) {
        setIsAccessDenied(true);
        errorMessage = "⚠️ Access Denied: Please select the appropriate role mode for your account.";
      }

      setError(errorMessage);
    } catch (networkErr) {
      console.warn("Offline demo login fallback:", networkErr);

      const normalizedU = username.replaceAll(/\s+/g, "").toLowerCase();

      if (normalizedU === "chiefwarden" && password === "Chiefwarden@123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", "chief warden");
        localStorage.setItem("userRole", "CHIEF_WARDEN");
        localStorage.setItem("loggedInUser", "Chief Bed Warden");
        navigate("/beds", { replace: true });
        return;
      }

      if (username.toLowerCase() === "admin" && (password === "Admin@123" || password === "admin" || password === "admin123")) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", "Admin");
        localStorage.setItem("userRole", "ADMIN");
        localStorage.setItem("loggedInUser", "Hospital Administrator");
        navigate("/dashboard", { replace: true });
        return;
      }

      if (loginMode === "DOCTOR" || normalizedU.startsWith("dr") || normalizedU.includes("doctor")) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userRole", "DOCTOR");
        localStorage.setItem("loggedInUser", username.startsWith("Dr.") ? username : `Dr. ${username}`);
        navigate("/appointments", { replace: true });
        return;
      }

      if ((username.toLowerCase() === "user" && password === "user123") || (username.toLowerCase() === "staff" && password === "staff123") || password.length >= 4) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userRole", username.toLowerCase() === "staff" ? "STAFF" : "USER");
        localStorage.setItem("loggedInUser", username.toLowerCase() === "staff" ? "Hospital Staff User" : username);
        navigate("/dashboard", { replace: true });
        return;
      }

      setError("Unable to authenticate. Please check your credentials or select another login mode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-frame">
      {/* TOP NAVIGATION LINK */}
      <div className="login-top-bar">
        <Link to="/" className="btn-back-home">
          ← Back to Hospital Home &amp; Services
        </Link>
      </div>

      {/* MAIN 2-COLUMN CARD */}
      <div className="login-main-card">
        {/* LEFT COLUMN: FORM */}
        <div className="login-form-column">
          {/* HOSPITAL BRAND LOGO */}
          <div className="hospital-brand-header">
            <div className="stethoscope-logo">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-svg-logo">
                <path d="M14 8C14 5.79086 15.7909 4 18 4H30C32.2091 4 34 5.79086 34 8V18C34 23.5228 29.5228 28 24 28C18.4772 28 14 23.5228 14 18V8Z" stroke="#065f46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 28V36C24 40.4183 27.5817 44 32 44C36.4183 44 40 40.4183 40 36V30" stroke="#065f46" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="40" cy="30" r="4" fill="#10b981"/>
                <path d="M24 12C22 10 19 11 19 14C19 18 24 21 24 21C24 21 29 18 29 14C29 11 26 10 24 12Z" fill="#10b981"/>
              </svg>
            </div>
            <div className="brand-title-wrap">
              <h1 className="brand-heading">NI AROGIYAM</h1>
              <span className="brand-subtext">INTELLIGENT HEALTHCARE SYSTEM</span>
            </div>
          </div>

          <h2 className="welcome-heading">Welcome !</h2>

          {/* ROLE MODE TABS */}
          <div className="role-switcher-row">
            <button
              type="button"
              className={`role-tab-btn ${loginMode === "ADMIN" ? "active" : ""}`}
              onClick={() => handleModeSwitch("ADMIN")}
            >
              👑 Administrator
            </button>
            <button
              type="button"
              className={`role-tab-btn ${loginMode === "DOCTOR" ? "active" : ""}`}
              onClick={() => handleModeSwitch("DOCTOR")}
            >
              👨‍⚕️ Doctor
            </button>
            <button
              type="button"
              className={`role-tab-btn ${loginMode === "WARDEN" ? "active" : ""}`}
              onClick={() => handleModeSwitch("WARDEN")}
            >
              🛏️ Bed Warden
            </button>
            <button
              type="button"
              className={`role-tab-btn ${loginMode === "USER" ? "active" : ""}`}
              onClick={() => handleModeSwitch("USER")}
            >
              👤 Staff / User
            </button>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="login-error-alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="login-clean-form">
            <div className="input-field-group">
              <input
                id="username"
                name="username"
                type="text"
                className="clean-input"
                placeholder={
                  loginMode === "DOCTOR"
                    ? "Doctor Username / Mail Id"
                    : loginMode === "WARDEN"
                    ? "Warden Username"
                    : "Username / Mail Id"
                }
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
                required
              />
            </div>

            <div className="input-field-group password-group">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="clean-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="clean-pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="form-remember-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <span className="secure-badge">🔒 Secure Login</span>
            </div>

            <button type="submit" className="btn-signin-submit" disabled={loading}>
              {loading ? (
                <span className="btn-spinner-wrap">
                  <span className="btn-spinner"></span> Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {loginMode === "USER" && (
              <>
                <div className="or-divider">
                  <span>or</span>
                </div>

                <button
                  type="button"
                  className="btn-google-signin"
                  onClick={handleOpenGoogleModal}
                  disabled={loading}
                >
                  <svg className="google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </>
            )}

            <div className="login-bottom-links">
              <span>Don't have an account?</span>
              <Link to="/register" className="register-now-link">
                Create Account
              </Link>
            </div>
          </form>

          <div className="login-card-bottom-bar">
            <span>Authorized hospital personnel only</span>
            <span>NI AROGIYAM © 2026</span>
          </div>
        </div>

        {/* RIGHT COLUMN: DOCTOR IMAGE ALONE */}
        <div className="login-doctor-image-column">
          <img
            src={doctorHeroImg}
            alt="NI AROGIYAM Medical Specialists"
            className="doctor-hero-photo"
          />
        </div>
      </div>

      {/* GOOGLE ACCOUNT SELECTION MODAL */}
      {showGoogleModal && (
        <div className="google-modal-overlay" onClick={handleCloseGoogleModal}>
          <div className="google-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="google-modal-header">
              <svg className="google-modal-logo" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 className="google-modal-title">Sign in with Google</h3>
              <p className="google-modal-subtitle">Choose an account or enter your email to continue to NI AROGIYAM</p>
            </div>

            {systemEmails.length > 0 && (
              <div className="google-accounts-list">
                {systemEmails.map((email) => (
                  <button
                    key={email}
                    type="button"
                    className="google-account-item"
                    onClick={() => handleSelectGoogleEmail(email)}
                  >
                    <div className="google-account-avatar">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <div className="google-account-info">
                      <span className="google-account-name">{email.split("@")[0]}</span>
                      <span className="google-account-email">{email}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleGoogleSubmit}>
              <div className="google-input-group">
                <label htmlFor="google-email-input">
                  {systemEmails.length > 0 ? "Or use another Google account:" : "Enter your Google account email:"}
                </label>
                <input
                  id="google-email-input"
                  type="email"
                  className="google-email-input"
                  placeholder="name@gmail.com"
                  value={googleEmail}
                  onChange={(e) => {
                    setGoogleEmail(e.target.value);
                    if (googleError) setGoogleError("");
                  }}
                  autoFocus
                />
                {googleError && (
                  <div className="google-modal-error">
                    <span>⚠️</span>
                    <span>{googleError}</span>
                  </div>
                )}
              </div>

              <div className="google-modal-actions">
                <button
                  type="button"
                  className="google-btn-cancel"
                  onClick={handleCloseGoogleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="google-btn-continue"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
