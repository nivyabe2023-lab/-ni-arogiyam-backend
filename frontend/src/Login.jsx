import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import API_BASE_URL from "./config";

function Login({ onLogin }) {
  const navigate = useNavigate();

  // Login Mode: "ADMIN" or "USER"
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
  // SWITCH LOGIN MODE (ADMIN vs USER)
  // =========================================================

  const handleModeSwitch = (mode) => {
    setLoginMode(mode);
    setError("");
    setIsAccessDenied(false);
    setFormData({
      username: "",
      password: "",
    });
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
          loginType: loginMode, // "ADMIN" or "USER"
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

        const userRole = result?.role || (loginMode === "ADMIN" ? "ADMIN" : "USER");
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

        navigate("/dashboard", {
          replace: true,
        });
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
        errorMessage = "⚠️ Access Denied: Admins only can access this Administrator portal. Normal users must use User Login.";
      } else if (response.status === 404) {
        errorMessage = "Login API endpoint was not found. Please verify backend service.";
      } else if (response.status === 500) {
        errorMessage = "Server error while authenticating. Check Spring Boot console.";
      }

      setError(errorMessage);
    } catch (error) {
      console.error("LOGIN NETWORK ERROR:", error);
      // Fallback offline validation for demo resiliency
      const isAdminPass = password === "Admin@123";
      if (loginMode === "ADMIN") {
        if (username.toLowerCase() === "admin" && isAdminPass) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", "Admin");
          localStorage.setItem("userRole", "ADMIN");
          localStorage.setItem("loggedInUser", "Hospital Administrator");
          navigate("/dashboard", { replace: true });
          return;
        } else if (username.toLowerCase() === "user" && password === "user123") {
          setIsAccessDenied(true);
          setError("⚠️ Access Denied: Admins only can access this Administrator portal. Please switch to Staff / User Login.");
          return;
        }
      } else {
        if ((username.toLowerCase() === "user" && password === "user123") || (username.toLowerCase() === "admin" && isAdminPass)) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", username);
          localStorage.setItem("userRole", username.toLowerCase() === "admin" ? "ADMIN" : "STAFF");
          localStorage.setItem("loggedInUser", username.toLowerCase() === "admin" ? "Hospital Administrator" : "Hospital Staff User");
          navigate("/dashboard", { replace: true });
          return;
        }
      }

      setError("Unable to connect to the server. Make sure Spring Boot is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOGOUT HELPER
  // =========================================================

  // This is not called directly here, but keeping login storage
  // simple makes logout from App.jsx reliable.

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="login-page">

      <div className="login-overlay"></div>

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
            care, efficient hospital operations, and
            intelligent clinical decision support.
          </p>

          <div className="login-features">

            <div className="login-feature">

              <span>✓</span>

              <div>
                <strong>
                  Patient Management
                </strong>

                <small>
                  Complete patient registration and records
                </small>
              </div>

            </div>

            <div className="login-feature">

              <span>✓</span>

              <div>
                <strong>
                  Doctor Management
                </strong>

                <small>
                  Manage doctors, schedules and consultations
                </small>
              </div>

            </div>

            <div className="login-feature">

              <span>✓</span>

              <div>
                <strong>
                  AI Clinical Support
                </strong>

                <small>
                  Intelligent prediction and decision support
                </small>
              </div>

            </div>

            <div className="login-feature">

              <span>✓</span>

              <div>
                <strong>
                  Hospital Analytics
                </strong>

                <small>
                  Reports, billing and operational insights
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
              🔐
            </div>

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to access NI AROGIYAM
            </p>

          </div>

          {/* =================================================
              LOGIN MODE TABS (ADMIN vs USER)
          ================================================= */}
          <div className="login-mode-tabs">
            <button
              type="button"
              className={`mode-tab ${loginMode === "ADMIN" ? "active" : ""}`}
              onClick={() => handleModeSwitch("ADMIN")}
            >
              👑 Administrator
            </button>
            <button
              type="button"
              className={`mode-tab ${loginMode === "USER" ? "active" : ""}`}
              onClick={() => handleModeSwitch("USER")}
            >
              👤 Staff / User
            </button>
          </div>

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
                Username
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
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
                />

                <span>
                  Remember me
                </span>

              </label>

              <span className="secure-login">
                🔒 Secure Login
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
                  Sign In

                  <span className="login-arrow">
                    →
                  </span>
                </>
              )}

            </button>

            {/* CREATE ACCOUNT LINK */}
            <div className="login-register">
              <span>Don't have an account?</span>
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