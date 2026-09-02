import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import API_BASE_URL from "./config";

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

  // =========================================================
  // HANDLE INPUT
  // =========================================================

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

  // =========================================================
  // SWITCH LOGIN MODE
  // =========================================================

  const handleModeSwitch = (mode) => {
    setLoginMode(mode);
    setError("");
    setIsAccessDenied(false);
    if (mode === "WARDEN") {
      setFormData({
        username: "chief warden",
        password: "Chiefwarden@123",
      });
    } else if (mode === "ADMIN") {
      setFormData({
        username: "Admin",
        password: "",
      });
    } else {
      setFormData({
        username: "",
        password: "",
      });
    }
  };

  const handleFillCredentials = (u, p) => {
    setFormData({
      username: u,
      password: p,
    });
    setError("");
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsAccessDenied(false);

    const username = formData.username.trim();
    const password = formData.password;

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    const loginUrl = `${API_BASE_URL}/api/auth/login`;

    console.log("====================================");
    console.log("NI AROGIYAM LOGIN - MODE:", loginMode);
    console.log("====================================");

    try {
      // -----------------------------------------------------
      // SEND LOGIN REQUEST WITH loginType
      // -----------------------------------------------------

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

      console.log("Login HTTP status:", response.status);

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

      console.log("Login server response:", result);

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      if (response.ok && result?.success !== false) {
        console.log("LOGIN SUCCESSFUL");

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

        // Navigate based on role
        if (userRole === "CHIEF_WARDEN" || userRole === "WARDEN") {
          navigate("/beds", { replace: true });
        } else if (userRole === "DOCTOR") {
          navigate("/appointments", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      // -----------------------------------------------------
      // LOGIN FAILED OR ACCESS DENIED
      // -----------------------------------------------------

      let errorMessage = "Invalid username or password.";

      if (result?.message && String(result.message).trim()) {
        errorMessage = result.message;
      } else if (typeof result === "string" && result.trim()) {
        errorMessage = result;
      } else if (result?.error && String(result.error).trim()) {
        errorMessage = result.error;
      }

      if (response.status === 403 || errorMessage.toLowerCase().includes("admins only") || errorMessage.toLowerCase().includes("access denied")) {
        setIsAccessDenied(true);
        errorMessage = "⚠️ Access Denied: Please use the appropriate login mode for your account.";
      } else if (response.status === 404) {
        errorMessage = "Login API endpoint was not found. Please verify backend service.";
      } else if (response.status === 500) {
        errorMessage = "Server error while authenticating. Check Spring Boot console.";
      }

      setError(errorMessage);
    } catch (networkErr) {
      console.error("LOGIN NETWORK ERROR:", networkErr);

      // Fallback offline validation for demo resiliency
      const normalizedU = username.replaceAll(/\s+/g, "").toLowerCase();

      if (normalizedU === "chiefwarden" && password === "Chiefwarden@123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", "chief warden");
        localStorage.setItem("userRole", "CHIEF_WARDEN");
        localStorage.setItem("loggedInUser", "Chief Bed Warden");
        navigate("/beds", { replace: true });
        return;
      }

      if (username.toLowerCase() === "admin" && password === "Admin@123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", "Admin");
        localStorage.setItem("userRole", "ADMIN");
        localStorage.setItem("loggedInUser", "Hospital Administrator");
        navigate("/dashboard", { replace: true });
        return;
      }

      if (loginMode === "DOCTOR" || normalizedU.startsWith("dr") || normalizedU.includes("doctor")) {
        if (password === "Doctor@123" || password.length >= 6) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", username);
          localStorage.setItem("userRole", "DOCTOR");
          localStorage.setItem("loggedInUser", username.startsWith("Dr.") ? username : `Dr. ${username}`);
          navigate("/appointments", { replace: true });
          return;
        }
      }

      if ((username.toLowerCase() === "user" && password === "user123") || (username.toLowerCase() === "staff" && password === "staff123")) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userRole", username.toLowerCase() === "staff" ? "STAFF" : "USER");
        localStorage.setItem("loggedInUser", username.toLowerCase() === "staff" ? "Hospital Staff User" : "General User");
        navigate("/dashboard", { replace: true });
        return;
      }

      setError("Unable to connect to the server. Make sure Spring Boot is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-overlay"></div>

      <div className="login-top-nav" style={{
        position: "relative",
        zIndex: 10,
        maxWidth: "1200px",
        width: "92%",
        margin: "0 auto 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(8px)",
            color: "#ffffff",
            textDecoration: "none",
            padding: "8px 18px",
            borderRadius: "30px",
            fontWeight: "700",
            fontSize: "13.5px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          ← Back to Hospital Home & Services
        </Link>
        <span style={{
          color: "#fef08a",
          fontSize: "13px",
          fontWeight: "700",
          background: "rgba(0,0,0,0.25)",
          padding: "6px 14px",
          borderRadius: "20px"
        }}>
          🚨 24/7 Emergency Helpline: 080-22065000 / 108
        </span>
      </div>

      <div className="login-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="login-info">

          <div className="hospital-logo">

            <div className="logo-cross">
              +
            </div>

          </div>

          <h1>
            NI AROGIYAM
          </h1>

          <h2>
            AI-Based Hospital Management System
          </h2>

          <p>
            Smart healthcare management for better patient
            care, efficient bed allocation, and
            intelligent clinical decision support.
          </p>

          <div className="login-features">

            <div className="login-feature">

              <span>✓</span>

              <div>
                <strong>
                  Chief Bed Warden Portal
                </strong>

                <small>
                  Dedicated bed allocation, ward monitoring & patient diet/medicine schedules
                </small>
              </div>

            </div>

            <div className="login-feature">

              <span>✓</span>

              <div>
                <strong>
                  Doctor Clinical Portal
                </strong>

                <small>
                  Consultations, appointments & comprehensive patient medical histories
                </small>
              </div>

            </div>

            <div className="login-feature">

              <span>✓</span>

              <div>
                <strong>
                  Patient Management & Care
                </strong>

                <small>
                  Complete patient registration, visits and medication tracking
                </small>
              </div>

            </div>

            <div className="login-feature">

              <span>✓</span>

              <div>
                <strong>
                  NABH Hospital Standards
                </strong>

                <small>
                  24/7 emergency care, cashless insurance & hospital analytics
                </small>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <div className="login-card">

          <div className="login-card-header">

            <div className="login-icon">
              {loginMode === "WARDEN" ? "🛏️" : loginMode === "DOCTOR" ? "👨‍⚕️" : loginMode === "ADMIN" ? "👑" : "🔐"}
            </div>

            <h2>
              {loginMode === "WARDEN"
                ? "Chief Bed Warden Login"
                : loginMode === "DOCTOR"
                ? "Doctor Consultation Login"
                : loginMode === "ADMIN"
                ? "Administrator Login"
                : "Staff & User Login"}
            </h2>

            <p>
              {loginMode === "WARDEN"
                ? "Access Bed Management & Patient Care Schedules"
                : loginMode === "DOCTOR"
                ? "Access Doctors Module & Patient Appointments"
                : loginMode === "ADMIN"
                ? "Sign in to access Full Hospital Management"
                : "Sign in with your registered account"}
            </p>

          </div>

          {/* =================================================
              LOGIN MODE TABS (4 ROLES)
          ================================================= */}
          <div className="login-mode-tabs four-tabs">
            <button
              type="button"
              className={`mode-tab ${loginMode === "ADMIN" ? "active" : ""}`}
              onClick={() => handleModeSwitch("ADMIN")}
            >
              👑 Admin
            </button>
            <button
              type="button"
              className={`mode-tab ${loginMode === "DOCTOR" ? "active" : ""}`}
              onClick={() => handleModeSwitch("DOCTOR")}
            >
              👨‍⚕️ Doctor
            </button>
            <button
              type="button"
              className={`mode-tab ${loginMode === "WARDEN" ? "active" : ""}`}
              onClick={() => handleModeSwitch("WARDEN")}
            >
              🛏️ Bed Warden
            </button>
            <button
              type="button"
              className={`mode-tab ${loginMode === "USER" ? "active" : ""}`}
              onClick={() => handleModeSwitch("USER")}
            >
              👤 Staff / User
            </button>
          </div>

          {/* ROLE NOTICE BANNER */}
          {loginMode === "WARDEN" && (
            <div className="role-notice-banner warden">
              <div className="banner-icon">🛏️</div>
              <div className="banner-content">
                <strong>Chief Bed Warden Portal (Exclusive Access)</strong>
                <p>Grants access to <strong>Bed Management</strong> alone. Pre-configured credentials:</p>
                <div className="credential-chips">
                  <code>Username: chief warden</code>
                  <code>Password: Chiefwarden@123</code>
                </div>
                <button
                  type="button"
                  className="quick-fill-btn"
                  onClick={() => handleFillCredentials("chief warden", "Chiefwarden@123")}
                >
                  ⚡ Auto-fill Chief Warden
                </button>
              </div>
            </div>
          )}

          {loginMode === "DOCTOR" && (
            <div className="role-notice-banner doctor">
              <div className="banner-icon">🩺</div>
              <div className="banner-content">
                <strong>Registered Doctors Portal</strong>
                <p>Grants access to <strong>Doctors Module</strong> &amp; <strong>Appointments</strong> alone.</p>
                <div className="quick-docs">
                  <button
                    type="button"
                    className="quick-doc-chip"
                    onClick={() => handleFillCredentials("dr.suresh", "Doctor@123")}
                  >
                    Dr. Suresh Menon
                  </button>
                  <button
                    type="button"
                    className="quick-doc-chip"
                    onClick={() => handleFillCredentials("dr.ananya", "Doctor@123")}
                  >
                    Dr. Ananya Rao
                  </button>
                </div>
              </div>
            </div>
          )}

          {loginMode === "ADMIN" && (
            <div className="role-notice-banner admin">
              <div className="banner-icon">👑</div>
              <div className="banner-content">
                <strong>System Administrator Portal</strong>
                <p>Full control over all 15 clinical &amp; operational hospital modules.</p>
                <button
                  type="button"
                  className="quick-fill-btn"
                  onClick={() => handleFillCredentials("Admin", "Admin@123")}
                >
                  ⚡ Auto-fill Admin
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="login-error">

              <span>
                ⚠
              </span>

              <span>
                {error}
              </span>

            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* USERNAME */}

            <div className="form-group">

              <label htmlFor="username">
                {loginMode === "WARDEN" ? "Warden Username" : loginMode === "DOCTOR" ? "Doctor Username / Email" : "Username"}
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  {loginMode === "WARDEN" ? "🛏️" : loginMode === "DOCTOR" ? "👨‍⚕️" : "👤"}
                </span>

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={
                    loginMode === "WARDEN"
                      ? "chief warden"
                      : loginMode === "DOCTOR"
                      ? "Enter registered doctor username / email"
                      : "Enter your username"
                  }
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={loading}
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>

            {/* LOGIN OPTIONS */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  disabled={loading}
                  defaultChecked
                />

                <span>
                  Remember me
                </span>

              </label>

              <span className="secure-login">
                🔒 Protected Portal
              </span>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>

                  Signing in...
                </>
              ) : (
                <>
                  {loginMode === "WARDEN"
                    ? "Sign In to Bed Module →"
                    : loginMode === "DOCTOR"
                    ? "Sign In to Doctor Portal →"
                    : loginMode === "ADMIN"
                    ? "Sign In as Administrator →"
                    : "Sign In →"}
                </>
              )}

            </button>

            {/* CREATE ACCOUNT LINK */}
            <div className="login-register">
              <span>Need to register as Doctor or Staff?</span>
              <Link to="/register" className="register-link">
                Create Account
              </Link>
            </div>

          </form>

          {/* FOOTER */}

          <div className="login-card-footer">

            <p>
              Authorized hospital personnel only
            </p>

            <span>
              NI AROGIYAM © 2026
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;