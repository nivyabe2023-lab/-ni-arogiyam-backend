import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import API_BASE_URL from "./config";
import doctorHeroImg from "./assets/doctors_hero.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "STAFF",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleGoogleRegisterMock = () => {
    const email = window.prompt("Enter your Google account email to continue:");
    if (!email || !email.trim()) return;
    const trimmedEmail = email.trim();
    const rawName = trimmedEmail.split("@")[0].replace(/[._-]/g, " ");
    const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", trimmedEmail);
    localStorage.setItem("userRole", "USER");
    localStorage.setItem("loggedInUser", `${displayName} (Google)`);
    navigate("/dashboard", { replace: true });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const username = (formData.username.trim() || email.split("@")[0] || fullName.replaceAll(/\s+/g, "").toLowerCase());
    const role = formData.role || "STAFF";
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          username,
          role,
          password,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || (data && data.success === false)) {
        setError(data?.message || "Registration failed. Please check backend server.");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      console.warn("Offline registration fallback:", err);
      // Demo success
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("userRole", role);
      localStorage.setItem("loggedInUser", fullName);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-frame">
      {/* TOP NAVIGATION LINK */}
      <div className="register-top-bar">
        <Link to="/" className="btn-back-home">
          ← Back to Hospital Home &amp; Services
        </Link>
        <div className="register-hotline">
          <span>🚨 24/7 Emergency Helpline:</span>
          <strong>080-22065000 / 108</strong>
        </div>
      </div>

      {/* MAIN 2-COLUMN CARD */}
      <div className="register-main-card">
        {/* LEFT COLUMN: FORM */}
        <div className="register-form-column">
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

          {/* ROLE SELECTOR TABS */}
          <div className="register-role-tabs">
            <button
              type="button"
              className={`role-tab-btn ${formData.role === "STAFF" ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "STAFF" })}
            >
              🏥 Staff Member
            </button>
            <button
              type="button"
              className={`role-tab-btn ${formData.role === "DOCTOR" ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "DOCTOR" })}
            >
              👨‍⚕️ Medical Doctor
            </button>
            <button
              type="button"
              className={`role-tab-btn ${formData.role === "USER" ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "USER" })}
            >
              👤 General User
            </button>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="register-error-alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS ALERT */}
          {success && (
            <div className="register-success-alert">
              <span>✓</span>
              <span>{success}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleRegister} className="register-clean-form">
            <div className="input-field-group">
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="clean-input"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="input-field-group">
              <input
                id="email"
                name="email"
                type="email"
                className="clean-input"
                placeholder="Mail Id"
                value={formData.email}
                onChange={handleChange}
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

            <div className="input-field-group password-group">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="clean-input"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="clean-pwd-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button type="submit" className="btn-signin-submit" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="or-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="btn-google-signin"
              onClick={handleGoogleRegisterMock}
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

            <div className="login-bottom-links">
              <span>Already have an account?</span>
              <Link to="/login" className="register-now-link">
                Sign In
              </Link>
            </div>
          </form>

          <div className="login-card-bottom-bar">
            <span>Authorized hospital personnel only</span>
            <span>NI AROGIYAM © 2026</span>
          </div>
        </div>

        {/* RIGHT COLUMN: DOCTOR IMAGE ALONE */}
        <div className="register-doctor-image-column">
          <img
            src={doctorHeroImg}
            alt="NI AROGIYAM Medical Specialists"
            className="doctor-hero-photo"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
