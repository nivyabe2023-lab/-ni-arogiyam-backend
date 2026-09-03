import { useEffect, useState, Component } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  Outlet,
} from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "600px", margin: "40px auto", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏥</div>
          <h2 style={{ color: "#064e3b", marginBottom: "12px" }}>NI AROGIYAM</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            Something went wrong while displaying this page.
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
            style={{
              background: "#065f46",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

import "./App.css";
import "./Dashboard.css";

import HospitalLanding from "./HospitalLanding";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import Patients from "./Patients";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import Laboratory from "./Laboratory";
import Pharmacy from "./Pharmacy";
import Beds from "./Beds";
import Billing from "./Billing";
import AIPrediction from "./AIPrediction";
import Reports from "./Reports";
import Settings from "./Settings";

// St. John's Hospital Enhanced Modules
import EmergencyServices from "./EmergencyServices";
import Specialities from "./Specialities";
import HealthPackages from "./HealthPackages";
import InsuranceTPA from "./InsuranceTPA";
import PatientGuide from "./PatientGuide";

import API_BASE_URL from "./config";

/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard() {
  const userRole = (localStorage.getItem("userRole") || "ADMIN").toUpperCase();
  const isWarden = userRole === "CHIEF_WARDEN" || userRole === "WARDEN";
  const isDoctor = userRole === "DOCTOR";

  if (isWarden) {
    return <Navigate to="/beds" replace />;
  }
  if (isDoctor) {
    return <Navigate to="/appointments" replace />;
  }

  const DEFAULT_FALLBACK_DASHBOARD = {
    patients: 124,
    doctors: 48,
    appointments: 36,
    prescriptions: 92,
    medicines: 250,
    totalBills: 64,
    paidBills: 51,
    pendingBills: 13,
  };

  const [dashboard, setDashboard] = useState(DEFAULT_FALLBACK_DASHBOARD);
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/dashboard`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      console.log("Dashboard data:", data);

      setDashboard(data);
      setIsOfflineMode(false);
    } catch (err) {
      console.warn("Dashboard offline mode:", err);
      setDashboard((prev) => prev || DEFAULT_FALLBACK_DASHBOARD);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const searchItems = [
    {
      name: "Emergency & Blood Bank (24/7)",
      path: "/emergency",
      icon: "🚨",
    },
    {
      name: "Clinical Specialities & Departments",
      path: "/specialities",
      icon: "🩺",
    },
    {
      name: "Health Packages (Executive Checkup)",
      path: "/health-packages",
      icon: "📦",
    },
    {
      name: "Insurance & TPA Cashless Desk",
      path: "/insurance-tpa",
      icon: "💳",
    },
    {
      name: "Patient & Visitor Guide / Tariffs",
      path: "/patient-guide",
      icon: "ℹ️",
    },
    {
      name: "Patients",
      path: "/patients",
      icon: "👤",
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: "👨‍⚕️",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "📅",
    },
    {
      name: "Laboratory",
      path: "/laboratory",
      icon: "🧪",
    },
    {
      name: "Pharmacy",
      path: "/pharmacy",
      icon: "💊",
    },
    {
      name: "Beds",
      path: "/beds",
      icon: "🛏️",
    },
    {
      name: "Billing",
      path: "/billing",
      icon: "🧾",
    },
    {
      name: "AI Prediction",
      path: "/ai-prediction",
      icon: "🤖",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "📊",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
    },
  ];

  const filteredSearch = searchItems.filter((item) =>
    item.name
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const userName =
    localStorage.getItem("loggedInUser") || "Administrator";

  const patients = dashboard?.patients ?? 0;
  const doctors = dashboard?.doctors ?? 0;
  const appointments = dashboard?.appointments ?? 0;
  const prescriptions = dashboard?.prescriptions ?? 0;
  const medicines = dashboard?.medicines ?? 0;
  const totalBills = dashboard?.totalBills ?? 0;
  const paidBills = dashboard?.paidBills ?? 0;
  const pendingBills = dashboard?.pendingBills ?? 0;

  return (
    <div className="dashboard-page">

      {/* =====================================================
          TOP HEADER
          ===================================================== */}

      <div className="topbar">

        <div className="page-title">
          <h1>NI AROGIYAM</h1>

          <p>
            Intelligent Hospital Management System
          </p>
        </div>

        <div className="topbar-right">

          {/* SEARCH */}

          <div className="search-container">

            <div className="search-box">

              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search modules..."
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
              />

            </div>

            {searchText.trim() !== "" && (
              <div className="search-results">

                {filteredSearch.length > 0 ? (
                  filteredSearch.map((item) => (
                    <div
                      key={item.path}
                      className="search-result-item"
                      onClick={() => {
                        navigate(item.path);
                        setSearchText("");
                      }}
                    >

                      <span className="search-result-icon">
                        {item.icon}
                      </span>

                      <span>{item.name}</span>

                    </div>
                  ))
                ) : (
                  <div className="search-no-result">
                    <span>🔍</span>
                    No module found
                  </div>
                )}

              </div>
            )}

          </div>

          {/* ADMIN */}

          <div className="admin-profile">

            <div className="profile-avatar">
              {(typeof userName === "string" && userName.trim() ? userName.trim().charAt(0).toUpperCase() : "A") || "A"}
            </div>

            <div>
              <strong>{typeof userName === "string" && userName.trim() ? userName.trim() : "Administrator"}</strong>

              <small>Administrator</small>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          DASHBOARD CONTENT
          ===================================================== */}

      <div className="dashboard-content">

        {isOfflineMode && (
          <div style={{
            background: "#fef3c7",
            border: "1px solid #fde68a",
            padding: "12px 20px",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#92400e",
            fontSize: "13.5px",
            fontWeight: 600,
            gap: "14px",
            flexWrap: "wrap",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>⚡</span>
              <span><strong>Demo & Simulation Mode:</strong> Spring Boot backend (port 8080) is not connected. Showing simulated hospital operations telemetry.</span>
            </div>
            <button
              type="button"
              onClick={loadDashboard}
              style={{
                background: "#d97706",
                color: "#ffffff",
                border: "none",
                padding: "6px 16px",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "12.5px",
                cursor: "pointer"
              }}
            >
              ↻ Retry Spring Boot
            </button>
          </div>
        )}

        {/* TOOLBAR */}

        <div className="dashboard-toolbar">

          <div>
            <strong>Hospital Overview</strong>

            <span>
              Real-time hospital management summary
            </span>
          </div>

          <button
            className="refresh-dashboard"
            onClick={loadDashboard}
          >
            ↻ Refresh
          </button>

        </div>


        {/* ===================================================
            STATISTICS
            =================================================== */}

        <div className="stats-grid">

          <NavLink
            to="/patients"
            className="stat-card"
          >

            <div className="stat-icon">
              👤
            </div>

            <div className="stat-content">

              <span>Total Patients</span>

              <h2>{patients}</h2>

              <small className="positive">
                Patient Records
              </small>

            </div>

          </NavLink>


          <NavLink
            to="/doctors"
            className="stat-card"
          >

            <div className="stat-icon">
              👨‍⚕️
            </div>

            <div className="stat-content">

              <span>Total Doctors</span>

              <h2>{doctors}</h2>

              <small className="positive">
                Medical Staff
              </small>

            </div>

          </NavLink>


          <NavLink
            to="/appointments"
            className="stat-card"
          >

            <div className="stat-icon">
              📅
            </div>

            <div className="stat-content">

              <span>Appointments</span>

              <h2>{appointments}</h2>

              <small className="positive">
                Scheduled
              </small>

            </div>

          </NavLink>


          <NavLink
            to="/billing"
            className="stat-card"
          >

            <div className="stat-icon">
              💳
            </div>

            <div className="stat-content">

              <span>Total Bills</span>

              <h2>{totalBills}</h2>

              <small className="positive">
                Billing Records
              </small>

            </div>

          </NavLink>

        </div>


        {/* ===================================================
            MAIN GRID
            =================================================== */}

        <div className="dashboard-grid">

          {/* APPOINTMENTS */}

          <div className="panel">

            <div className="panel-header">

              <div>
                <h2>Appointments</h2>

                <p>
                  Current appointment overview
                </p>
              </div>

              <NavLink
                to="/appointments"
                className="view-button"
              >
                View All
              </NavLink>

            </div>

            <div className="appointment">

              <div className="patient-avatar">
                P
              </div>

              <div className="appointment-info">

                <strong>
                  Scheduled Appointments
                </strong>

                <span>
                  Total appointments in system
                </span>

              </div>

              <time>
                {appointments}
              </time>

            </div>

            <div className="appointment">

              <div className="patient-avatar">
                D
              </div>

              <div className="appointment-info">

                <strong>
                  Available Doctors
                </strong>

                <span>
                  Registered medical staff
                </span>

              </div>

              <time>
                {doctors}
              </time>

            </div>

          </div>


          {/* BED SUMMARY */}

          <div className="panel">

            <div className="panel-header">

              <div>
                <h2>Hospital Resources</h2>

                <p>
                  Current system resources
                </p>
              </div>

              <NavLink
                to="/beds"
                className="view-button"
              >
                Beds
              </NavLink>

            </div>

            <div className="bed-summary">

              <div className="bed-item">
                <span>Patients</span>
                <strong>{patients}</strong>
              </div>

              <div className="bed-item">
                <span>Doctors</span>
                <strong>{doctors}</strong>
              </div>

              <div className="bed-item">
                <span>Medicines</span>
                <strong>{medicines}</strong>
              </div>

              <div className="bed-item">
                <span>Prescriptions</span>
                <strong>{prescriptions}</strong>
              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            BILLING + QUICK ACTIONS
            =================================================== */}

        <div className="bottom-grid">

          {/* BILLING */}

          <div className="panel">

            <div className="panel-header">

              <div>
                <h2>Billing Overview</h2>

                <p>
                  Payment and billing status
                </p>
              </div>

              <NavLink
                to="/billing"
                className="view-button"
              >
                Billing
              </NavLink>

            </div>

            <div className="revenue-content">

              <div className="revenue-number">

                <span>Total Bills</span>

                <strong>{totalBills}</strong>

                <small>
                  Billing records
                </small>

              </div>

              <div className="revenue-details">

                <div className="revenue-detail">

                  <span>Paid</span>

                  <strong className="paid-text">
                    {paidBills}
                  </strong>

                </div>

                <div className="revenue-detail">

                  <span>Pending</span>

                  <strong className="pending-text">
                    {pendingBills}
                  </strong>

                </div>

              </div>

            </div>

            <div className="billing-progress">

              <div className="progress-label">

                <span>Payment completion</span>

                <strong>
                  {totalBills > 0
                    ? Math.round(
                        (paidBills / totalBills) *
                          100
                      )
                    : 0}
                  %
                </strong>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-value"
                  style={{
                    width: `${
                      totalBills > 0
                        ? Math.min(
                            (paidBills /
                              totalBills) *
                              100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                ></div>

              </div>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="panel">

            <div className="panel-header">

              <div>
                <h2>Quick Actions</h2>

                <p>
                  Frequently used modules
                </p>
              </div>

            </div>

            <div className="quick-actions">

              <NavLink
                to="/patients"
                className="quick-action"
              >
                <span className="quick-action-icon">
                  👤
                </span>

                Patients
              </NavLink>

              <NavLink
                to="/doctors"
                className="quick-action"
              >
                <span className="quick-action-icon">
                  👨‍⚕️
                </span>

                Doctors
              </NavLink>

              <NavLink
                to="/laboratory"
                className="quick-action"
              >
                <span className="quick-action-icon">
                  🧪
                </span>

                Laboratory
              </NavLink>

              <NavLink
                to="/pharmacy"
                className="quick-action"
              >
                <span className="quick-action-icon">
                  💊
                </span>

                Pharmacy
              </NavLink>

            </div>

          </div>

        </div>


        {/* ===================================================
            SUMMARY
            =================================================== */}

        <div className="panel dashboard-summary-panel">

          <div className="panel-header">

            <div>
              <h2>Hospital Activity Summary</h2>

              <p>
                Complete system activity
              </p>
            </div>

          </div>

          <div className="summary-grid">

            <NavLink
              to="/patients"
              className="summary-item"
            >

              <div className="summary-icon">
                👤
              </div>

              <div>
                <strong>{patients}</strong>
                <span>Patients</span>
              </div>

            </NavLink>


            <NavLink
              to="/doctors"
              className="summary-item"
            >

              <div className="summary-icon">
                👨‍⚕️
              </div>

              <div>
                <strong>{doctors}</strong>
                <span>Doctors</span>
              </div>

            </NavLink>


            <NavLink
              to="/appointments"
              className="summary-item"
            >

              <div className="summary-icon">
                📅
              </div>

              <div>
                <strong>{appointments}</strong>
                <span>Appointments</span>
              </div>

            </NavLink>


            <NavLink
              to="/pharmacy"
              className="summary-item"
            >

              <div className="summary-icon">
                💊
              </div>

              <div>
                <strong>{medicines}</strong>
                <span>Medicines</span>
              </div>

            </NavLink>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SIDEBAR
   ========================================================= */

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const userRole = (localStorage.getItem("userRole") || "ADMIN").toUpperCase();
  const isWarden = userRole === "CHIEF_WARDEN" || userRole === "WARDEN";
  const isDoctor = userRole === "DOCTOR";

  const userName =
    localStorage.getItem("loggedInUser") ||
    (isWarden ? "Chief Bed Warden" : isDoctor ? "Doctor" : "Administrator");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("user");

    if (onClose) onClose();

    navigate("/login", {
      replace: true,
    });
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const roleSubtitle = isWarden
    ? "Chief Bed Warden"
    : isDoctor
    ? "Medical Doctor"
    : userRole === "STAFF"
    ? "Hospital Staff"
    : userRole === "USER"
    ? "Patient / User"
    : "Administrator";

  const avatarChar = isWarden
    ? "W"
    : isDoctor
    ? "D"
    : typeof userName === "string" && userName.trim()
    ? userName.trim().charAt(0).toUpperCase()
    : "A";

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`}>

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            {isWarden ? "🛏️" : isDoctor ? "🩺" : "N"}
          </div>

          <div>
            <h2>NI AROGIYAM</h2>
            <span>
              {isWarden
                ? "Bed Warden Desk"
                : isDoctor
                ? "Doctor Clinical Desk"
                : "Hospital Management"}
            </span>
          </div>

          <button
            type="button"
            className="sidebar-close-mobile"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>

        </div>


        <nav className="sidebar-nav">

          {/* CHIEF BED WARDEN EXCLUSIVE ACCESS: BED MODULE ALONE */}
          {isWarden && (
            <>
              <div className="sidebar-section-label">
                <span>🛏️ BED & WARD OPERATIONS</span>
              </div>

              <NavLink
                to="/beds"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">🛏️</span>
                <span className="nav-text">Bed Management & Routines</span>
                <span className="nav-badge live">Live Ward</span>
              </NavLink>
            </>
          )}

          {/* DOCTOR EXCLUSIVE ACCESS: DOCTORS & APPOINTMENTS ALONE */}
          {isDoctor && (
            <>
              <div className="sidebar-section-label">
                <span>🩺 CLINICAL OPERATIONS</span>
              </div>

              <NavLink
                to="/appointments"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">📅</span>
                <span className="nav-text">Appointments & Patient History</span>
                <span className="nav-badge live">Live</span>
              </NavLink>

              <NavLink
                to="/doctors"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">👨‍⚕️</span>
                <span className="nav-text">Doctors Directory</span>
              </NavLink>
            </>
          )}

          {/* ADMINISTRATOR & GENERAL USERS: FULL NAVIGATION */}
          {!isWarden && !isDoctor && (
            <>
              <NavLink
                to="/"
                onClick={handleNavClick}
                className="sidebar-link public-portal-link"
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#6ee7b7",
                  border: "1px dashed rgba(52, 211, 153, 0.4)",
                  marginBottom: "12px"
                }}
              >
                <span className="nav-icon">🌐</span>
                <span className="nav-text">View Public Showcase</span>
              </NavLink>

              {/* SECTION 1: EMERGENCY & SPECIALITIES */}
              <div className="sidebar-section-label">
                <span>🚨 EMERGENCY & SERVICES</span>
              </div>

              <NavLink
                to="/emergency"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link emergency-nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">🚨</span>
                <span className="nav-text">24/7 Emergency & Blood</span>
                <span className="nav-badge live">Live</span>
              </NavLink>

              <NavLink
                to="/specialities"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">🩺</span>
                <span className="nav-text">Clinical Specialities</span>
              </NavLink>

              <NavLink
                to="/health-packages"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">📦</span>
                <span className="nav-text">Health Packages</span>
              </NavLink>

              <NavLink
                to="/insurance-tpa"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">💳</span>
                <span className="nav-text">Insurance & TPA Desk</span>
              </NavLink>

              <NavLink
                to="/patient-guide"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">ℹ️</span>
                <span className="nav-text">Patient & Visitor Guide</span>
              </NavLink>

              {/* SECTION 2: CLINICAL OPERATIONS */}
              <div className="sidebar-section-label">
                <span>🏥 CLINICAL OPERATIONS</span>
              </div>

              <NavLink
                to="/dashboard"
                end
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Dashboard</span>
              </NavLink>

              <NavLink
                to="/patients"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">👤</span>
                <span className="nav-text">Patients</span>
              </NavLink>

              <NavLink
                to="/doctors"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">👨‍⚕️</span>
                <span className="nav-text">Doctors</span>
              </NavLink>

              <NavLink
                to="/appointments"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">📅</span>
                <span className="nav-text">Appointments</span>
              </NavLink>

              <NavLink
                to="/laboratory"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">🧪</span>
                <span className="nav-text">Laboratory</span>
              </NavLink>

              <NavLink
                to="/pharmacy"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">💊</span>
                <span className="nav-text">Pharmacy</span>
              </NavLink>

              <NavLink
                to="/beds"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">🛏️</span>
                <span className="nav-text">Beds</span>
              </NavLink>

              <NavLink
                to="/billing"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">🧾</span>
                <span className="nav-text">Billing & Invoices</span>
              </NavLink>

              <NavLink
                to="/ai-prediction"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">🤖</span>
                <span className="nav-text">AI Prediction</span>
              </NavLink>

              <NavLink
                to="/reports"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Reports</span>
              </NavLink>

              {/* SECTION 3: SYSTEM ADMINISTRATION */}
              <div className="sidebar-section-label">
                <span>⚙️ SYSTEM CONFIGURATION</span>
              </div>

              <NavLink
                to="/settings"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Settings & DB</span>
              </NavLink>
            </>
          )}

        </nav>


        {/* USER PROFILE & DEDICATED LOGOUT */}

        <div className="sidebar-footer">

          <div className="sidebar-user-card">

            <div className="sidebar-user-avatar">
              {avatarChar}
            </div>

            <div className="sidebar-user-details">
              <strong title={typeof userName === "string" ? userName : "User"}>
                {typeof userName === "string" && userName.trim() ? userName.trim() : "User"}
              </strong>
              <small>{roleSubtitle}</small>
            </div>

          </div>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
}


/* =========================================================
   ROLE ROUTE GUARD
   ========================================================= */

function RoleRoute({ allowedRoles, children }) {
  const userRole = (localStorage.getItem("userRole") || "ADMIN").toUpperCase();
  const isWarden = userRole === "CHIEF_WARDEN" || userRole === "WARDEN";
  const isDoctor = userRole === "DOCTOR";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (isWarden) return <Navigate to="/beds" replace />;
    if (isDoctor) return <Navigate to="/appointments" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


/* =========================================================
   APPLICATION LAYOUT (ST. JOHN'S TOPBAR & ACCESSIBILITY)
   ========================================================= */

function ApplicationLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [isGreyscale, setIsGreyscale] = useState(false);
  const navigate = useNavigate();

  const handleIncreaseFont = () => {
    if (fontScale < 1.25) setFontScale((prev) => Math.min(prev + 0.1, 1.25));
  };

  const handleDecreaseFont = () => {
    if (fontScale > 0.85) setFontScale((prev) => Math.max(prev - 0.1, 0.85));
  };

  const handleResetFont = () => {
    setFontScale(1);
  };

  return (
    <div
      className={`app-layout ${isGreyscale ? "mode-greyscale" : ""}`}
      style={{ "--app-font-scale": fontScale }}
    >

      {/* ST. JOHN'S TOPBAR (ACCESSIBILITY & 24/7 EMERGENCY) */}
      <div className="stjohns-topbar">
        <div className="stjohns-topbar-left">
          <span className="accreditation-pill">
            ★ NABH & NABL ACCREDITED TERTIARY CARE HOSPITAL
          </span>
          <a href="tel:08022065000" className="top-emergency-hotline">
            <span className="pulse-icon">🚨</span>
            <span>24/7 Emergency & Trauma: <strong>080-22065000 / 108</strong></span>
          </a>
        </div>

        <div className="stjohns-topbar-right">
          {/* ACCESSIBILITY FONT CONTROLS */}
          <div className="accessibility-bar">
            <span className="acc-label">Accessibility:</span>
            <div className="font-controls">
              <button
                type="button"
                className="font-btn"
                onClick={handleDecreaseFont}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                className="font-btn"
                onClick={handleResetFont}
                title="Reset Font Size"
              >
                A
              </button>
              <button
                type="button"
                className="font-btn"
                onClick={handleIncreaseFont}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            <button
              type="button"
              className={`greyscale-toggle-btn ${isGreyscale ? "active" : ""}`}
              onClick={() => setIsGreyscale(!isGreyscale)}
              title="Toggle High Contrast / Greyscale"
            >
              🌗 {isGreyscale ? "Normal Color" : "High Contrast"}
            </button>
          </div>

          <button
            type="button"
            className="top-quick-btn view-site"
            onClick={() => navigate("/")}
            title="View Public Hospital Website & Services"
            style={{
              background: "#047857",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              fontWeight: "700"
            }}
          >
            🌐 Public Showcase
          </button>

          <button
            type="button"
            className="top-quick-btn ambulance"
            onClick={() => navigate("/emergency")}
          >
            🚑 Ambulance
          </button>

          <button
            type="button"
            className="top-quick-btn appointment"
            onClick={() => navigate("/appointments")}
          >
            📅 Book Appointment
          </button>
        </div>
      </div>

      {/* MOBILE TOP HEADER */}
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open Navigation Menu"
        >
          ☰
        </button>

        <div className="mobile-brand">
          <span className="mobile-logo">N</span>
          <span>NI AROGIYAM</span>
        </div>
      </header>

      {/* BODY LAYOUT: SIDEBAR ON LEFT, CONTENT ON RIGHT */}
      <div className="app-container">
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <main className="main-content">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

    </div>
  );
}


/* =========================================================
   APP
   ========================================================= */

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* PUBLIC HOSPITAL ADVERTISEMENT & SHOWCASE PORTAL (BEFORE LOGIN) */}
          <Route
            path="/"
            element={<HospitalLanding />}
          />
          <Route
            path="/home"
            element={<HospitalLanding />}
          />
          <Route
            path="/landing"
            element={<HospitalLanding />}
          />
          <Route
            path="/about"
            element={<HospitalLanding initialTab="about" />}
          />
          <Route
            path="/about-us"
            element={<HospitalLanding initialTab="about" />}
          />
          <Route
            path="/specialties"
            element={<HospitalLanding initialTab="specialties" />}
          />
          <Route
            path="/specialists"
            element={<HospitalLanding initialTab="specialties" />}
          />
          <Route
            path="/our-specialties"
            element={<HospitalLanding initialTab="specialties" />}
          />
          <Route
            path="/facilities"
            element={<HospitalLanding initialTab="facilities" />}
          />
          <Route
            path="/our-facilities"
            element={<HospitalLanding initialTab="facilities" />}
          />
          <Route
            path="/our-doctors"
            element={<HospitalLanding initialTab="doctors" />}
          />
          <Route
            path="/contact"
            element={<HospitalLanding initialTab="contact" />}
          />
          <Route
            path="/contact-us"
            element={<HospitalLanding initialTab="contact" />}
          />

          {/* LOGIN & REGISTER */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* APPLICATION LAYOUT (PROTECTED MANAGEMENT PORTAL) */}
          <Route
            element={
              <ProtectedRoute>
                <ApplicationLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/emergency"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <EmergencyServices />
                </RoleRoute>
              }
            />
            <Route
              path="/specialities"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <Specialities />
                </RoleRoute>
              }
            />
            <Route
              path="/health-packages"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <HealthPackages />
                </RoleRoute>
              }
            />
            <Route
              path="/insurance-tpa"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <InsuranceTPA />
                </RoleRoute>
              }
            />
            <Route
              path="/patient-guide"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <PatientGuide />
                </RoleRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <Patients />
                </RoleRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <RoleRoute allowedRoles={["ADMIN", "DOCTOR", "STAFF", "USER"]}>
                  <Doctors />
                </RoleRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <RoleRoute allowedRoles={["ADMIN", "DOCTOR", "STAFF", "USER"]}>
                  <Appointments />
                </RoleRoute>
              }
            />
            <Route
              path="/laboratory"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <Laboratory />
                </RoleRoute>
              }
            />
            <Route
              path="/pharmacy"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <Pharmacy />
                </RoleRoute>
              }
            />
            <Route
              path="/beds"
              element={
                <RoleRoute allowedRoles={["ADMIN", "CHIEF_WARDEN", "WARDEN", "STAFF", "USER"]}>
                  <Beds />
                </RoleRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <Billing />
                </RoleRoute>
              }
            />
            <Route
              path="/ai-prediction"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <AIPrediction />
                </RoleRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <Reports />
                </RoleRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF", "USER"]}>
                  <Settings />
                </RoleRoute>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;