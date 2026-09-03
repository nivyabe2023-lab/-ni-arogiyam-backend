import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./HospitalLanding.css";
import aboutHospitalReception from "./assets/about_hospital_reception_hd.jpg";
import specialtiesStethoscopeBanner from "./assets/specialties_stethoscope_banner.jpg";

export default function HospitalLanding({ initialTab = "home" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Active page tab: 'home' | 'about' | 'specialties'
  const [activeTab, setActiveTab] = useState(() => {
    if (initialTab === "about") return "about";
    if (initialTab === "specialties") return "specialties";
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === "#about" || hash === "#about-us" || path.includes("/about")) {
        return "about";
      }
      if (hash === "#specialties" || hash === "#specialists" || path.includes("/specialties") || path.includes("/specialists") || path.includes("/our-specialties")) {
        return "specialties";
      }
    }
    return "home";
  });

  // State to toggle additional specialties when clicking "View All Specialties"
  const [expandedSpecialties, setExpandedSpecialties] = useState(false);

  // Sync tab with URL hash or pathname changes
  useEffect(() => {
    const handleHashOrPath = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === "#about" || hash === "#about-us" || path.includes("/about")) {
        setActiveTab("about");
      } else if (hash === "#specialties" || hash === "#specialists" || path.includes("/specialties") || path.includes("/specialists") || path.includes("/our-specialties")) {
        setActiveTab("specialties");
      } else if (hash === "#home" || hash === "" || path === "/" || path === "/home") {
        setActiveTab("home");
      }
    };

    handleHashOrPath();
    window.addEventListener("hashchange", handleHashOrPath);
    return () => window.removeEventListener("hashchange", handleHashOrPath);
  }, [location.pathname]);

  // Dropdown states
  const [specialtiesDropdown, setSpecialtiesDropdown] = useState(false);
  const [visitorDropdown, setVisitorDropdown] = useState(false);

  // Appointment Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Cardiology");

  const [appointmentForm, setAppointmentForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    department: "Cardiology",
    preferredDate: "",
    notes: "",
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalOpen(false);
      setAppointmentForm({
        fullName: "",
        phoneNumber: "",
        email: "",
        department: "Cardiology",
        preferredDate: "",
        notes: "",
      });
    }, 2400);
  };

  const handleSpecialtyClick = (name) => {
    if (name === "View All") {
      setActiveTab("specialties");
      setExpandedSpecialties(true);
      window.history.pushState(null, "", "#specialties");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSelectedSpecialty(name);
      setAppointmentForm((prev) => ({ ...prev, department: name }));
      setBookingModalOpen(true);
    }
  };

  const handleNavHome = (e) => {
    if (e) e.preventDefault();
    setActiveTab("home");
    window.history.pushState(null, "", "#home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavAbout = (e) => {
    if (e) e.preventDefault();
    setActiveTab("about");
    window.history.pushState(null, "", "#about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavSpecialties = (e) => {
    if (e) e.preventDefault();
    setActiveTab("specialties");
    window.history.pushState(null, "", "#specialties");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFacilitiesNavClick = (e) => {
    if (activeTab !== "home") {
      setActiveTab("home");
      window.history.pushState(null, "", "#home");
      setTimeout(() => {
        const el = document.getElementById("facilities");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById("facilities");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="exact-hospital-root">
      {/* =======================================================
          1. TOP CONTACT & SOCIAL BAR
          ======================================================= */}
      <div className="exact-top-bar">
        <div className="exact-top-bar-inner">
          <div className="top-bar-left">
            <svg className="pin-icon" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="location-text">Madurai Bypass Road, Madurai, Tamil Nadu</span>
          </div>

          <div className="top-bar-right">
            <span className="emergency-label">24/7 Emergency Care</span>
            <a href="tel:+914523005300" className="phone-link">
              <svg className="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>+91 452 300 5300</span>
            </a>

            <div className="social-links-group">
              <a href="#facebook" aria-label="Facebook" className="social-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="social-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="social-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="social-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================
          2. MAIN NAVBAR
          ======================================================= */}
      <header className="exact-header">
        <div className="exact-header-inner">
          {/* LOGO */}
          <div className="logo-brand-container" onClick={handleNavHome}>
            <div className="logo-graphic-wrap">
              <svg viewBox="0 0 48 48" fill="none" className="stethoscope-logo-svg">
                <path d="M14 8C14 5.79086 15.7909 4 18 4H30C32.2091 4 34 5.79086 34 8V18C34 23.5228 29.5228 28 24 28C18.4772 28 14 23.5228 14 18V8Z" stroke="#065f46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 28V36C24 40.4183 27.5817 44 32 44C36.4183 44 40 40.4183 40 36V30" stroke="#065f46" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="40" cy="30" r="4" fill="#10b981"/>
                <path d="M24 12C22 10 19 11 19 14C19 18 24 21 24 21C24 21 29 18 29 14C29 11 26 10 24 12Z" fill="#10b981"/>
              </svg>
            </div>
            <div className="logo-text-wrap">
              <span className="logo-title">NI AROGIYAM</span>
              <span className="logo-subtitle">HOSPITAL</span>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="header-nav-menu">
            <div className={`menu-item-wrap ${activeTab === "home" ? "active-wrap" : ""}`}>
              <a
                href="#home"
                className={`menu-link ${activeTab === "home" ? "active" : ""}`}
                onClick={handleNavHome}
              >
                Home
              </a>
              {activeTab === "home" && <div className="green-indicator-bar"></div>}
            </div>

            <div className={`menu-item-wrap ${activeTab === "about" ? "active-wrap" : ""}`}>
              <a
                href="#about"
                className={`menu-link ${activeTab === "about" ? "active" : ""}`}
                onClick={handleNavAbout}
              >
                About Us
              </a>
              {activeTab === "about" && <div className="green-indicator-bar"></div>}
            </div>

            <div
              className={`menu-item-wrap ${activeTab === "specialties" ? "active-wrap" : ""}`}
              onMouseEnter={() => setSpecialtiesDropdown(true)}
              onMouseLeave={() => setSpecialtiesDropdown(false)}
            >
              <a
                href="#specialties"
                className={`menu-link ${activeTab === "specialties" ? "active" : ""}`}
                onClick={handleNavSpecialties}
              >
                Specialties <span className="caret-icon">⌄</span>
              </a>
              {activeTab === "specialties" && <div className="green-indicator-bar"></div>}
              {specialtiesDropdown && (
                <div className="popover-dropdown">
                  <a href="#specialties" onClick={(e) => { setSpecialtiesDropdown(false); handleNavSpecialties(e); }}>Cardiology</a>
                  <a href="#specialties" onClick={(e) => { setSpecialtiesDropdown(false); handleNavSpecialties(e); }}>Neurology</a>
                  <a href="#specialties" onClick={(e) => { setSpecialtiesDropdown(false); handleNavSpecialties(e); }}>Oncology</a>
                  <a href="#specialties" onClick={(e) => { setSpecialtiesDropdown(false); handleNavSpecialties(e); }}>Orthopedics</a>
                  <a href="#specialties" onClick={(e) => { setSpecialtiesDropdown(false); handleNavSpecialties(e); }}>Gastroenterology</a>
                  <a href="#specialties" onClick={(e) => { setSpecialtiesDropdown(false); handleNavSpecialties(e); }}>Nephrology</a>
                </div>
              )}
            </div>

            <div className="menu-item-wrap">
              <a href="#facilities" className="menu-link" onClick={handleFacilitiesNavClick}>
                Facilities
              </a>
            </div>

            <div
              className="menu-item-wrap"
              onMouseEnter={() => setVisitorDropdown(true)}
              onMouseLeave={() => setVisitorDropdown(false)}
            >
              <a href="#patients-visitors" className="menu-link">
                Patient &amp; Visitors <span className="caret-icon">⌄</span>
              </a>
              {visitorDropdown && (
                <div className="popover-dropdown">
                  <a href="#facilities" onClick={() => setVisitorDropdown(false)}>Visitor Guidelines</a>
                  <a href="#facilities" onClick={() => setVisitorDropdown(false)}>Room Categories</a>
                  <a href="#facilities" onClick={() => setVisitorDropdown(false)}>Cashless Insurance</a>
                </div>
              )}
            </div>

            <div className="menu-item-wrap">
              <Link to="/doctors" className="menu-link">
                Our Doctors
              </Link>
            </div>

            <div className="menu-item-wrap">
              <a href="#contact" className="menu-link" onClick={() => setBookingModalOpen(true)}>
                Contact Us
              </a>
            </div>
          </nav>

          {/* CTA BUTTON */}
          <div className="header-cta-block">
            <button
              type="button"
              className="btn-book-appointment-pill"
              onClick={() => setBookingModalOpen(true)}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </header>

      {/* =======================================================
          RENDER: ABOUT US PAGE VIEW (EXACT MATCH TO DESIGN)
          ======================================================= */}
      {activeTab === "about" ? (
        <main className="exact-about-page-view">
          <div className="about-page-container">
            {/* 1. Header & Breadcrumb */}
            <div className="about-header-section">
              <h1 className="about-page-title">About Us</h1>
              <nav className="about-breadcrumb" aria-label="Breadcrumb">
                <a
                  href="#home"
                  className="breadcrumb-link"
                  onClick={handleNavHome}
                >
                  Home
                </a>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">About Us</span>
              </nav>
            </div>

            {/* 2. Main Two Column Grid */}
            <section className="about-hero-grid">
              {/* Left Column */}
              <div className="about-text-column">
                <h2 className="about-headline">
                  Healing with Compassion.<br />
                  Caring with Excellence.
                </h2>

                <p className="about-paragraph">
                  NI AROGIYAM is a leading multi-speciality hospital dedicated to providing high-quality medical care with compassion and integrity.
                </p>

                <p className="about-paragraph">
                  With state-of-the-art technology, experienced specialists, and a patient-first approach, we ensure the best possible outcomes for our patients.
                </p>

                <div className="about-checklist">
                  <div className="about-check-item">
                    <div className="check-circle-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>500+ Bed Tertiary Care Hospital</span>
                  </div>

                  <div className="about-check-item">
                    <div className="check-circle-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>45+ ICUs &amp; Robotic Surgery</span>
                  </div>

                  <div className="about-check-item">
                    <div className="check-circle-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>24/7 Emergency &amp; Trauma Care</span>
                  </div>

                  <div className="about-check-item">
                    <div className="check-circle-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Cashless Insurance &amp; 40+ TPAs</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Reception Photo Card */}
              <div className="about-image-column">
                <div className="about-image-card">
                  <img
                    src={aboutHospitalReception}
                    alt="NI AROGIYAM Hospital Reception Lobby"
                    loading="eager"
                  />
                </div>
              </div>
            </section>

            {/* 3. Our Mission & Our Vision Cards */}
            <section className="about-cards-row">
              {/* Mission Card */}
              <div className="mission-vision-card">
                <div className="mv-icon-wrap">
                  <svg viewBox="0 0 32 32" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="16" cy="16" r="13" />
                    <circle cx="16" cy="16" r="9" />
                    <circle cx="16" cy="16" r="5" />
                    <circle cx="16" cy="16" r="1.5" fill="#047857" />
                    <path d="M26 6L16 16" />
                    <path d="M23 6H26V9" />
                  </svg>
                </div>
                <div className="mv-content">
                  <h3>Our Mission</h3>
                  <p>
                    To deliver exceptional healthcare services through advanced technology, clinical excellence, and compassionate care.
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="mission-vision-card">
                <div className="mv-icon-wrap">
                  <svg viewBox="0 0 32 32" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 16C3 16 8 7 16 7C24 7 29 16 29 16C29 16 24 25 16 25C8 25 3 16 3 16Z" />
                    <circle cx="16" cy="16" r="5" />
                    <circle cx="16" cy="16" r="2" fill="#047857" />
                  </svg>
                </div>
                <div className="mv-content">
                  <h3>Our Vision</h3>
                  <p>
                    To be a trusted healthcare leader recognised for innovation, patient safety, and community wellness.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Bottom Horizontal Stats Row */}
            <section className="about-bottom-stats">
              {/* Stat 1 */}
              <div className="bottom-stat-item">
                <div className="bottom-stat-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div className="bottom-stat-text">
                  <strong className="bottom-stat-value">11+</strong>
                  <span className="bottom-stat-desc">Specialized Treatment</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bottom-stat-item">
                <div className="bottom-stat-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="bottom-stat-text">
                  <strong className="bottom-stat-value">40+</strong>
                  <span className="bottom-stat-desc">Specialists</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bottom-stat-item">
                <div className="bottom-stat-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div className="bottom-stat-text">
                  <strong className="bottom-stat-value">40+</strong>
                  <span className="bottom-stat-desc">TPA Partners</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="bottom-stat-item">
                <div className="bottom-stat-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
                    <circle cx="6" cy="12" r="2" />
                  </svg>
                </div>
                <div className="bottom-stat-text">
                  <strong className="bottom-stat-value">500+</strong>
                  <span className="bottom-stat-desc">Bed Capacity</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      ) : activeTab === "specialties" ? (
        /* =======================================================
            RENDER: OUR SPECIALTIES PAGE VIEW (EXACT MATCH TO DESIGN)
            ======================================================= */
        <main className="exact-specialties-page-view">
          {/* 1. Header Banner with Stethoscope Graphic */}
          <div className="specialties-header-banner">
            <div className="specialties-header-container">
              <div className="specialties-header-text">
                <h1 className="specialties-page-title">Our Specialties</h1>
                <nav className="specialties-breadcrumb" aria-label="Breadcrumb">
                  <a
                    href="#home"
                    className="breadcrumb-link"
                    onClick={handleNavHome}
                  >
                    Home
                  </a>
                  <span className="breadcrumb-separator">›</span>
                  <span className="breadcrumb-current">Specialties</span>
                </nav>
                <p className="specialties-intro-desc">
                  Comprehensive care across a wide range of specialties to
                  <br />
                  to meet your healthcare needs.
                </p>
              </div>

              <div className="specialties-banner-image-wrap">
                <img
                  src={specialtiesStethoscopeBanner}
                  alt="Stethoscope Healthcare Background"
                  className="specialties-banner-img"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* 2. Specialties Grid Container */}
          <div className="specialties-page-container">
            <div className="specialties-cards-grid">
              {/* Card 1: Cardiology */}
              <div
                className="exact-specialty-card"
                onClick={() => handleSpecialtyClick("Cardiology")}
              >
                <div className="exact-specialty-icon-box">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="#047857">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    <polyline points="4,11 8,11 10,7 13,16 15,10 17,13 20,13" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="exact-specialty-name">Cardiology</h3>
                <p className="exact-specialty-desc">
                  Advanced care for heart conditions and vascular diseases.
                </p>
              </div>

              {/* Card 2: Neurology */}
              <div
                className="exact-specialty-card"
                onClick={() => handleSpecialtyClick("Neurology")}
              >
                <div className="exact-specialty-icon-box">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
                  </svg>
                </div>
                <h3 className="exact-specialty-name">Neurology</h3>
                <p className="exact-specialty-desc">
                  Expert treatment for brain, spine, and nervous system disorders.
                </p>
              </div>

              {/* Card 3: Oncology */}
              <div
                className="exact-specialty-card"
                onClick={() => handleSpecialtyClick("Oncology")}
              >
                <div className="exact-specialty-icon-box">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 9a2.5 2.5 0 1 0-5 0c0 1.5 1.5 3.5 2.5 5.5 1-2 2.5-4 2.5-5.5z"/>
                    <path d="M8.5 14L4 21"/>
                    <path d="M15.5 14L20 21"/>
                  </svg>
                </div>
                <h3 className="exact-specialty-name">Oncology</h3>
                <p className="exact-specialty-desc">
                  Comprehensive cancer care and advanced treatment.
                </p>
              </div>

              {/* Card 4: Orthopedics */}
              <div
                className="exact-specialty-card"
                onClick={() => handleSpecialtyClick("Orthopedics")}
              >
                <div className="exact-specialty-icon-box">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="4" r="2.2"/>
                    <path d="M12 6.5v13.5"/>
                    <path d="M7.5 10.5h9"/>
                    <path d="M8 15h8"/>
                    <path d="M9 19.5h6"/>
                  </svg>
                </div>
                <h3 className="exact-specialty-name">Orthopedics</h3>
                <p className="exact-specialty-desc">
                  Bone, joint, and spine care for mobility and pain relief.
                </p>
              </div>

              {/* Card 5: Gastroenterology */}
              <div
                className="exact-specialty-card"
                onClick={() => handleSpecialtyClick("Gastroenterology")}
              >
                <div className="exact-specialty-icon-box">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 3a3 3 0 0 0-3 3v2a3 3 0 0 1-3 3H9a5 5 0 0 0-5 5v1a5 5 0 0 0 5 5h3a6 6 0 0 0 6-6V6a3 3 0 0 0-3-3z"/>
                  </svg>
                </div>
                <h3 className="exact-specialty-name">Gastroenterology</h3>
                <p className="exact-specialty-desc">
                  Treatment for digestive disorders and liver diseases.
                </p>
              </div>

              {/* Card 6: Nephrology */}
              <div
                className="exact-specialty-card"
                onClick={() => handleSpecialtyClick("Nephrology")}
              >
                <div className="exact-specialty-icon-box">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 6c-3 0-5 2.5-5 5.5s2.5 6.5 6 6.5c3 0 4-2 4-4V6H7z"/>
                    <path d="M17 6c3 0 5 2.5 5 5.5s-2.5 6.5-6 6.5c-3 0-4-2-4-4V6h5z"/>
                  </svg>
                </div>
                <h3 className="exact-specialty-name">Nephrology</h3>
                <p className="exact-specialty-desc">
                  Kidney care, dialysis, and related kidney disorders.
                </p>
              </div>

              {/* Extended Cards (Displayed when expandedSpecialties is true) */}
              {expandedSpecialties && (
                <>
                  {/* Card 7: Paediatrics */}
                  <div
                    className="exact-specialty-card expanded-card"
                    onClick={() => handleSpecialtyClick("Paediatrics")}
                  >
                    <div className="exact-specialty-icon-box">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                        <circle cx="12" cy="7" r="1.5" fill="#047857" />
                      </svg>
                    </div>
                    <h3 className="exact-specialty-name">Paediatrics &amp; Child Health</h3>
                    <p className="exact-specialty-desc">
                      Level-3 NICU, newborn screening, pediatric intensive care, and child wellness.
                    </p>
                  </div>

                  {/* Card 8: Obstetrics & Gynaecology */}
                  <div
                    className="exact-specialty-card expanded-card"
                    onClick={() => handleSpecialtyClick("Obstetrics & Gynaecology")}
                  >
                    <div className="exact-specialty-icon-box">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="9" r="6" />
                        <line x1="12" y1="15" x2="12" y2="22" />
                        <line x1="9" y1="18" x2="15" y2="18" />
                      </svg>
                    </div>
                    <h3 className="exact-specialty-name">Obstetrics &amp; Gynaecology</h3>
                    <p className="exact-specialty-desc">
                      High-risk pregnancy care, painless deliveries, and advanced gynecological surgeries.
                    </p>
                  </div>

                  {/* Card 9: Pulmonology */}
                  <div
                    className="exact-specialty-card expanded-card"
                    onClick={() => handleSpecialtyClick("Pulmonology")}
                  >
                    <div className="exact-specialty-icon-box">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 4v8M9 7l3 3 3-3" />
                        <path d="M6 10a4 4 0 0 0-4 4c0 4 3 7 7 7h1V12H7a1 1 0 0 0-1 1" />
                        <path d="M18 10a4 4 0 0 1 4 4c0 4-3 7-7 7h-1V12h3a1 1 0 0 1 1 1" />
                      </svg>
                    </div>
                    <h3 className="exact-specialty-name">Pulmonology &amp; Chest Medicine</h3>
                    <p className="exact-specialty-desc">
                      Advanced diagnostics for asthma, COPD, interstitial lung diseases, and sleep apnea.
                    </p>
                  </div>

                  {/* Card 10: Dermatology */}
                  <div
                    className="exact-specialty-card expanded-card"
                    onClick={() => handleSpecialtyClick("Dermatology")}
                  >
                    <div className="exact-specialty-icon-box">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l2.4 5.6L20 10l-4.2 3.8 1.2 5.8L12 16.8 7 19.6l1.2-5.8L4 10l5.6-2.4z"/>
                      </svg>
                    </div>
                    <h3 className="exact-specialty-name">Dermatology &amp; Cosmetology</h3>
                    <p className="exact-specialty-desc">
                      Clinical skincare, laser therapies, eczema, psoriasis, and aesthetic rejuvenation.
                    </p>
                  </div>

                  {/* Card 11: Ophthalmology */}
                  <div
                    className="exact-specialty-card expanded-card"
                    onClick={() => handleSpecialtyClick("Ophthalmology")}
                  >
                    <div className="exact-specialty-icon-box">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <h3 className="exact-specialty-name">Ophthalmology (Eye Care)</h3>
                    <p className="exact-specialty-desc">
                      Robotic cataract surgery, laser vision correction, retina, and glaucoma management.
                    </p>
                  </div>

                  {/* Card 12: ENT */}
                  <div
                    className="exact-specialty-card expanded-card"
                    onClick={() => handleSpecialtyClick("ENT")}
                  >
                    <div className="exact-specialty-icon-box">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                    </div>
                    <h3 className="exact-specialty-name">ENT (Ear, Nose &amp; Throat)</h3>
                    <p className="exact-specialty-desc">
                      Microscopic ear surgery, endoscopic sinus surgery, and voice disorder clinics.
                    </p>
                  </div>

                  {/* Card 13: Urology */}
                  <div
                    className="exact-specialty-card expanded-card"
                    onClick={() => handleSpecialtyClick("Urology")}
                  >
                    <div className="exact-specialty-icon-box">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <h3 className="exact-specialty-name">Urology &amp; Andrology</h3>
                    <p className="exact-specialty-desc">
                      Laser treatment for kidney stones, prostate health, and male reproductive care.
                    </p>
                  </div>

                  {/* Card 14: Endocrinology */}
                  <div
                    className="exact-specialty-card expanded-card"
                    onClick={() => handleSpecialtyClick("Endocrinology")}
                  >
                    <div className="exact-specialty-icon-box">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <h3 className="exact-specialty-name">Endocrinology &amp; Diabetology</h3>
                    <p className="exact-specialty-desc">
                      Specialized diabetes care, thyroid disorder management, and hormonal therapy.
                    </p>
                  </div>

                  {/* Card 15: General Surgery */}
                  <div
                    className="exact-specialty-card expanded-card"
                    onClick={() => handleSpecialtyClick("General Surgery")}
                  >
                    <div className="exact-specialty-icon-box">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                    </div>
                    <h3 className="exact-specialty-name">General &amp; Laparoscopic Surgery</h3>
                    <p className="exact-specialty-desc">
                      Advanced keyhole abdominal surgeries, hernia repair, and surgical trauma care.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* 3. View All Specialties Toggle Bar */}
            <div
              className="view-all-specialties-card"
              onClick={() => setExpandedSpecialties(!expandedSpecialties)}
            >
              <div className="vas-left">
                <div className="vas-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </div>
                <div className="vas-text">
                  <h3 className="vas-title">
                    {expandedSpecialties ? "View All Specialties (Showing All Specialties)" : "View All Specialties"}
                  </h3>
                  <p className="vas-subtitle">
                    {expandedSpecialties ? "Click to collapse to primary specialties" : "Explore all our specialties and services."}
                  </p>
                </div>
              </div>

              <div className="vas-action-toggle">
                <span>{expandedSpecialties ? "Show Less ▴" : "View All ▾"}</span>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* =======================================================
            RENDER: HOME PAGE VIEW
            ======================================================= */
        <>
          {/* =======================================================
              3. HERO SECTION (PHOTO AS CRISP BACKGROUND, NO WHITE BLUR)
              ======================================================= */}
          <section id="home" className="exact-hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text-block">
            <h1 className="hero-main-heading">
              <span className="heading-line-dark">Advanced Medicine.</span>
              <span className="heading-line-green">Compassionate Healing.</span>
              <span className="heading-line-dark">World-Class Care.</span>
            </h1>

            <p className="hero-intro-text">
              <strong>NI AROGIYAM</strong> is a state-of-the-art 500-bed tertiary care hospital equipped with 4th Gen Robotic Surgery, 24/7 Level-1 Trauma &amp; Emergency, Comprehensive Cancer Institute, and Cashless Insurance support for over 40+ TPAs.
            </p>

            {/* 4 CIRCULAR STATS (EXACT MATCH) */}
            <div className="hero-stats-row">
              {/* Stat 1: Bed Capacity */}
              <div className="stat-circle-card">
                <div className="stat-icon-circle">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"></path>
                    <circle cx="6" cy="12" r="2"></circle>
                  </svg>
                </div>
                <strong className="stat-number">500+</strong>
                <span className="stat-label">Bed Capacity</span>
              </div>

              {/* Stat 2: Specialties */}
              <div className="stat-circle-card">
                <div className="stat-icon-circle">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <strong className="stat-number">40+</strong>
                <span className="stat-label">Specialties</span>
              </div>

              {/* Stat 3: Patients Treated */}
              <div className="stat-circle-card">
                <div className="stat-icon-circle">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <strong className="stat-number">1L+</strong>
                <span className="stat-label">Patients Treated</span>
              </div>

              {/* Stat 4: Robotic Surgery */}
              <div className="stat-circle-card">
                <div className="stat-icon-circle">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4"></path>
                    <line x1="8" y1="16" x2="8" y2="16"></line>
                    <line x1="16" y1="16" x2="16" y2="16"></line>
                  </svg>
                </div>
                <strong className="stat-number">4th Gen</strong>
                <span className="stat-label">Robotic Surgery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          4. DARK GREEN FEATURE RIBBON
          ======================================================= */}
      <section className="dark-green-ribbon">
        <div className="ribbon-content-grid">
          {/* 1. 24/7 Emergency Care */}
          <div className="ribbon-item">
            <div className="ribbon-icon-wrap">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="ribbon-text-wrap">
              <h3 className="ribbon-title">24/7</h3>
              <p className="ribbon-sub">Emergency Care</p>
            </div>
          </div>

          <div className="ribbon-divider-line"></div>

          {/* 2. Cashless Insurance */}
          <div className="ribbon-item">
            <div className="ribbon-icon-wrap">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <line x1="12" y1="8" x2="12" y2="14"></line>
                <line x1="9" y1="11" x2="15" y2="11"></line>
              </svg>
            </div>
            <div className="ribbon-text-wrap">
              <h3 className="ribbon-title">Cashless</h3>
              <p className="ribbon-sub">Insurance</p>
            </div>
          </div>

          <div className="ribbon-divider-line"></div>

          {/* 3. 40+ TPA Partners */}
          <div className="ribbon-item">
            <div className="ribbon-icon-wrap">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <div className="ribbon-text-wrap">
              <h3 className="ribbon-title">40+</h3>
              <p className="ribbon-sub">TPA Partners</p>
            </div>
          </div>

          <div className="ribbon-divider-line"></div>

          {/* 4. Advanced Technology */}
          <div className="ribbon-item">
            <div className="ribbon-icon-wrap">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <div className="ribbon-text-wrap">
              <h3 className="ribbon-title">Advanced</h3>
              <p className="ribbon-sub">Technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          5. OUR SPECIALTIES (7 CARDS)
          ======================================================= */}
      <section id="specialties" className="exact-specialties-section">
        <h2 className="specialties-section-title">Our Specialties</h2>

        <div className="specialties-cards-row">
          {/* 1. Cardiology */}
          <div className="specialty-card" onClick={() => handleSpecialtyClick("Cardiology")}>
            <div className="specialty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#0d9488">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="specialty-name">Cardiology</span>
          </div>

          {/* 2. Neurology */}
          <div className="specialty-card" onClick={() => handleSpecialtyClick("Neurology")}>
            <div className="specialty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"></path>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"></path>
              </svg>
            </div>
            <span className="specialty-name">Neurology</span>
          </div>

          {/* 3. Oncology */}
          <div className="specialty-card" onClick={() => handleSpecialtyClick("Oncology")}>
            <div className="specialty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c-2.76 0-5 2.24-5 5 0 2.23 1.3 4.14 3.16 4.73L6 22h3l3-7 3 7h3l-4.16-10.27C15.7 11.14 17 9.23 17 7c0-2.76-2.24-5-5-5z"></path>
              </svg>
            </div>
            <span className="specialty-name">Oncology</span>
          </div>

          {/* 4. Orthopedics */}
          <div className="specialty-card" onClick={() => handleSpecialtyClick("Orthopedics")}>
            <div className="specialty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3"></circle>
                <path d="M12 8v8"></path>
                <path d="M9 21h6"></path>
                <path d="M9 12h6"></path>
                <circle cx="12" cy="19" r="2"></circle>
              </svg>
            </div>
            <span className="specialty-name">Orthopedics</span>
          </div>

          {/* 5. Gastroenterology */}
          <div className="specialty-card" onClick={() => handleSpecialtyClick("Gastroenterology")}>
            <div className="specialty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 3a3 3 0 0 0-3 3v2a3 3 0 0 1-3 3H9a5 5 0 0 0-5 5v1a5 5 0 0 0 5 5h3a6 6 0 0 0 6-6V6a3 3 0 0 0-3-3z"></path>
              </svg>
            </div>
            <span className="specialty-name">Gastroenterology</span>
          </div>

          {/* 6. Nephrology */}
          <div className="specialty-card" onClick={() => handleSpecialtyClick("Nephrology")}>
            <div className="specialty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 6c-3 0-5 2.5-5 5.5s2.5 6.5 6 6.5c3 0 4-2 4-4V6H7z"></path>
                <path d="M17 6c3 0 5 2.5 5 5.5s-2.5 6.5-6 6.5c-3 0-4-2-4-4V6h5z"></path>
              </svg>
            </div>
            <span className="specialty-name">Nephrology</span>
          </div>

          {/* 7. View All */}
          <div className="specialty-card view-all-card" onClick={() => handleSpecialtyClick("View All")}>
            <div className="specialty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <span className="specialty-name text-dark-green">View All</span>
          </div>
        </div>
      </section>

      {/* =======================================================
          6. WHY CHOOSE SECTION HEADER ONLY
          ======================================================= */}
      <section className="exact-why-choose-header">
        <h2 className="why-choose-title">
          Why Choose <span className="green-text">NI AROGIYAM?</span>
        </h2>
      </section>
        </>
      )}

      {/* =======================================================
          APPOINTMENT MODAL
          ======================================================= */}
      {bookingModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setBookingModalOpen(false)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div>
                <h2>Book Doctor Appointment</h2>
                <p>Specialty: <strong>{selectedSpecialty}</strong></p>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setBookingModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="modal-success-state">
                <div className="success-badge">✓</div>
                <h3>Appointment Requested!</h3>
                <p>
                  Thank you, <strong>{appointmentForm.fullName || "Patient"}</strong>. Your consultation request for <strong>{appointmentForm.department}</strong> has been registered.
                </p>
                <p className="sms-notice">
                  📱 Confirmation SMS sent to <strong>{appointmentForm.phoneNumber}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="modal-booking-form">
                <div className="modal-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Patient Full Name"
                    value={appointmentForm.fullName}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={appointmentForm.phoneNumber}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, phoneNumber: e.target.value })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label>Department / Specialty *</label>
                  <select
                    value={appointmentForm.department}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, department: e.target.value })
                    }
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Nephrology">Nephrology</option>
                  </select>
                </div>

                <div className="modal-form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={appointmentForm.preferredDate}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, preferredDate: e.target.value })
                    }
                  />
                </div>

                <div className="modal-buttons-row">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setBookingModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-confirm">
                    Confirm Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
