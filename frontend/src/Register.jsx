import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import API_BASE_URL from "./config";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "STAFF", // "STAFF" or "USER" - ADMIN is prohibited
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = async (e) => {

    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");


    // =======================================================
    // FRONTEND VALIDATION
    // =======================================================

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.username.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {

      setError(
        "Please fill in all fields."
      );

      return;
    }

    // Prohibit Admin and Chief Warden account registration
    const normUser = formData.username.trim().replaceAll(/\s+/g, "").toLowerCase();
    if (
      normUser === "admin" ||
      normUser === "chiefwarden" ||
      formData.role === "ADMIN" ||
      formData.role === "CHIEF_WARDEN"
    ) {
      setError(
        "Administrator and Chief Bed Warden accounts are system-managed. You may only register Doctor, Staff, or User accounts."
      );
      return;
    }


    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    if (
      formData.password.length < 6
    ) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    try {

      setLoading(true);


      console.log(
        "================================="
      );

      console.log(
        "REGISTRATION STARTED"
      );

      console.log(
        "================================="
      );

      console.log(
        "Backend URL:",
        `${API_BASE_URL}/api/auth/register`
      );


      // =====================================================
      // REGISTER API
      // =====================================================

      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            fullName:
              formData.fullName.trim(),

            email:
              formData.email.trim(),

            username:
              formData.username.trim(),

            role:
              formData.role,

            password:
              formData.password,

            confirmPassword:
              formData.confirmPassword,

          }),
        }
      );


      console.log(
        "Register HTTP Status:",
        response.status
      );


      // =====================================================
      // READ RESPONSE
      // =====================================================

      let data = null;

      try {

        data = await response.json();

      } catch (jsonError) {

        console.error(
          "Unable to read registration response:",
          jsonError
        );

        setError(
          "Invalid response received from server."
        );

        return;
      }


      console.log(
        "Registration Response:",
        data
      );


      // =====================================================
      // REGISTRATION FAILED
      // =====================================================

      if (
        !response.ok ||
        !data ||
        data.success !== true
      ) {

        setError(
          data?.message ||
          "Registration failed."
        );

        return;
      }


      // =====================================================
      // REGISTRATION SUCCESS
      // =====================================================

      console.log(
        "================================="
      );

      console.log(
        "REGISTRATION SUCCESSFUL"
      );

      console.log(
        "Username:",
        formData.username
      );

      console.log(
        "Email:",
        formData.email
      );

      console.log(
        "================================="
      );


      setSuccess(
        "Account created successfully. Redirecting to login..."
      );


      // =====================================================
      // CLEAR FORM
      // =====================================================

      setFormData({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });


      // =====================================================
      // GO TO LOGIN
      // =====================================================

      setTimeout(() => {

        navigate(
          "/login",
          {
            replace: true,
          }
        );

      }, 1500);


    } catch (err) {

      console.error(
        "Registration error:",
        err
      );

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="register-page">

      <div className="register-card">


        {/* =================================================
            LEFT SIDE
            ================================================= */}

        <div className="register-left">

          <div className="register-logo">
            N
          </div>

          <h1>
            NI AROGIYAM
          </h1>

          <h2>
            Intelligent Hospital
            <br />
            Management System
          </h2>

          <p>
            Create your account and access
            intelligent healthcare management.
          </p>


          <div className="register-features">

            <div>
              ✓ Patient Management
            </div>

            <div>
              ✓ Doctor Management
            </div>

            <div>
              ✓ Appointments
            </div>

            <div>
              ✓ Laboratory & Pharmacy
            </div>

            <div>
              ✓ Billing & Reports
            </div>

            <div>
              ✓ AI Prediction
            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <div className="register-right">

          <div className="register-form-container">


            {/* HEADER */}

            <div className="register-header">

              <h2>
                Create Your Account
              </h2>

              <p>
                Register to access NI AROGIYAM
              </p>

            </div>


            {/* ERROR */}

            {error && (

              <div className="register-error">
                {error}
              </div>

            )}


            {/* SUCCESS */}

            {success && (

              <div className="register-success">
                {success}
              </div>

            )}


            {/* FORM */}

            <form
              onSubmit={handleRegister}
            >

              {/* RESTRICTION NOTICE */}
              <div style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "12.5px",
                color: "#065f46",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span>🛡️</span>
                <span>
                  <strong>Notice:</strong> Administrator and Chief Bed Warden accounts are system-managed. You can create <strong>Doctor</strong>, <strong>Staff</strong>, or <strong>User / Patient</strong> accounts below.
                </span>
              </div>

              {/* ACCOUNT TYPE / ROLE */}
              <div className="register-field">
                <label htmlFor="role">
                  Account Type / Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f9fafb",
                    color: "#1e293b",
                    fontWeight: "500",
                    outline: "none"
                  }}
                >
                  <option value="DOCTOR">👨‍⚕️ Doctor (Medical Consultant / Physician)</option>
                  <option value="STAFF">🏥 Hospital Staff (Nurse / Frontdesk / Admin Assistant)</option>
                  <option value="USER">👤 Patient / General Hospital User</option>
                </select>
              </div>

              {/* FULL NAME */}

              <div className="register-field">

                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="name"
                />

              </div>


              {/* EMAIL */}

              <div className="register-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />

              </div>


              {/* USERNAME */}

              <div className="register-field">

                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="username"
                />

              </div>


              {/* PASSWORD */}

              <div className="register-field">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="new-password"
                />

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="register-field">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="new-password"
                />

              </div>


              {/* REGISTER BUTTON */}

              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >

                {loading
                  ? "Creating Account..."
                  : "Create Account →"}

              </button>

            </form>


            {/* LOGIN LINK */}

            <div className="register-login">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign In
              </Link>

            </div>


          </div>

        </div>

      </div>

    </div>

  );
}

export default Register;