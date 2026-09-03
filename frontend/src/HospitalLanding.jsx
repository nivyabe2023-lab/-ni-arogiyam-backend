import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HospitalLanding.css";
import hospitalHeroImg from "./assets/hospital_building.jpg";

export default function HospitalLanding() {
  const navigate = useNavigate();

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
      setSpecialtiesDropdown(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSelectedSpecialty(name);
      setAppointmentForm((prev) => ({ ...prev, department: name }));
      setBookingModalOpen(true);
    }
  };

  return (
    <div className="exact-hospital-root">
      {/* =======================================================
          1. TOP CONTACT & SOCIAL BAR
          ======================================================= */}
      <div className="topbar-strip">
        <div className="topbar-container">
          <div className="topbar-left-location">
            <svg className="loc-svg-icon" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="location-name">Madurai Bypass Road, Madurai, Tamil Nadu</span>
          </div>

          <div className="topbar-right-info">
            <span className="emergency-care-text">24/7 Emergency Care</span>
            <a href="tel:+914523503500" className="top-phone-anchor">
              <svg className="phone-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>+91 452 350 3500</span>
            </a>

            <div className="social-icons-set">
              <a href="#facebook" aria-label="Facebook" className="soc-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="soc-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="soc-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="soc-link">
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
      <header className="main-navbar-header">
        <div className="navbar-container">
          {/* LOGO */}
          <div className="navbar-brand-block" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="stethoscope-icon-box">
              <svg viewBox="0 0 48 48" fill="none" className="stethoscope-svg">
                <path d="M14 8C14 5.79086 15.7909 4 18 4H30C32.2091 4 34 5.79086 34 8V18C34 23.5228 29.5228 28 24 28C18.4772 28 14 23.5228 14 18V8Z" stroke="#065f46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 28V36C24 40.4183 27.5817 44 32 44C36.4183 44 40 40.4183 40 36V30" stroke="#065f46" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="40" cy="30" r="4" fill="#10b981"/>
                <path d="M24 12C22 10 19 11 19 14C19 18 24 21 24 21C24 21 29 18 29 14C29 11 26 10 24 12Z" fill="#10b981"/>
              </svg>
            </div>
            <div className="brand-titles">
              <span className="brand-main-title">NI AROGIYAM</span>
              <span className="brand-sub-tag">— INTELLIGENT HEALTHCARE SYSTEM —</span>
            </div>
          </div>

          {/* MENU LINKS */}
          <nav className="nav-menu-list">
            <div className="nav-link-wrapper active-wrapper">
              <a href="#home" className="nav-link-item active-link">Home</a>
              <div className="green-active-bar"></div>
            </div>

            <div className="nav-link-wrapper">
              <a href="#about" className="nav-link-item">About Us</a>
            </div>

            <div
              className="nav-link-wrapper dropdown-wrapper"
              onMouseEnter={() => setSpecialtiesDropdown(true)}
              onMouseLeave={() => setSpecialtiesDropdown(false)}
            >
              <a href="#specialties" className="nav-link-item">
                Specialties <span className="caret-arrow">⌄</span>
              </a>
              {specialtiesDropdown && (
                <div className="dropdown-flyout">
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Cardiology</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Neurology</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Oncology</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Orthopedics</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Gastroenterology</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Nephrology</a>
                </div>
              )}
            </div>

            <div className="nav-link-wrapper">
              <a href="#facilities" className="nav-link-item">Facilities</a>
            </div>

            <div
              className="nav-link-wrapper dropdown-wrapper"
              onMouseEnter={() => setVisitorDropdown(true)}
              onMouseLeave={() => setVisitorDropdown(false)}
            >
              <a href="#patients-visitors" className="nav-link-item">
                Patients &amp; Visitors <span className="caret-arrow">⌄</span>
              </a>
              {visitorDropdown && (
                <div className="dropdown-flyout">
                  <a href="#facilities" onClick={() => setVisitorDropdown(false)}>Patient Guidelines</a>
                  <a href="#facilities" onClick={() => setVisitorDropdown(false)}>Room Categories</a>
                  <a href="#facilities" onClick={() => setVisitorDropdown(false)}>Cashless Insurance</a>
                </div>
              )}
            </div>

            <div className="nav-link-wrapper">
              <a href="#doctors" className="nav-link-item">Our Doctors</a>
            </div>

            <div className="nav-link-wrapper">
              <a href="#contact" className="nav-link-item">Contact Us</a>
            </div>
          </nav>

          {/* CTA */}
          <div className="nav-cta-box">
            <button
              type="button"
              className="btn-pill-appointment"
              onClick={() => setBookingModalOpen(true)}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </header>

      {/* =======================================================
          3. HERO SECTION (EXACT MATCHING 2-COLUMN & BUILDING)
          ======================================================= */}
      <section id="home" className="hero-showcase-section">
        <div className="hero-background-art">
          <img
            src={hospitalHeroImg}
            alt="NI AROGIYAM Hospital Grand Multi-Story Building"
            className="hospital-building-cover"
          />
          <div className="hero-left-smooth-fade"></div>
        </div>

        <div className="hero-layout-grid">
          {/* LEFT COLUMN: TEXT CONTENT */}
          <div className="hero-text-content-col">
            <h1 className="hero-stacked-headline">
              <span className="headline-dark">Advanced Medicine.</span>
              <span className="headline-green">Compassionate Healing.</span>
              <span className="headline-dark">World-Class Care.</span>
            </h1>

            <p className="hero-summary-paragraph">
              <strong>NI AROGIYAM</strong> is a state-of-the-art 500-bed tertiary care hospital equipped with 4th Gen Robotic Surgery, 24/7 Level-1 Trauma &amp; Emergency, Comprehensive Cancer Institute, and Cashless Insurance support for over 40+ TPAs.
            </p>

            {/* 4 CIRCULAR STATS (EXACT MATCH) */}
            <div className="hero-stats-4-row">
              {/* Stat 1: Bed Capacity */}
              <div className="stat-circle-block">
                <div className="stat-icon-ring">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"></path>
                    <circle cx="6" cy="12" r="2"></circle>
                  </svg>
                </div>
                <strong className="stat-value-text">500+</strong>
                <span className="stat-sub-text">Bed Capacity</span>
              </div>

              {/* Stat 2: Specialties */}
              <div className="stat-circle-block">
                <div className="stat-icon-ring">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <strong className="stat-value-text">40+</strong>
                <span className="stat-sub-text">Specialties</span>
              </div>

              {/* Stat 3: Patients Treated */}
              <div className="stat-circle-block">
                <div className="stat-icon-ring">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <strong className="stat-value-text">1L+</strong>
                <span className="stat-sub-text">Patients Treated</span>
              </div>

              {/* Stat 4: Robotic Surgery */}
              <div className="stat-circle-block">
                <div className="stat-icon-ring">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4"></path>
                    <line x1="8" y1="16" x2="8" y2="16"></line>
                    <line x1="16" y1="16" x2="16" y2="16"></line>
                  </svg>
                </div>
                <strong className="stat-value-text">4th Gen</strong>
                <span className="stat-sub-text">Robotic Surgery</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: EMPTY SPACER TO ALLOW FULL CRISP VIEW OF HOSPITAL BUILDING */}
          <div className="hero-building-visual-col"></div>
        </div>
      </section>

      {/* =======================================================
          4. DARK GREEN FEATURE RIBBON
          ======================================================= */}
      <section className="forest-green-ribbon">
        <div className="ribbon-items-container">
          {/* 1. 24/7 Emergency Care */}
          <div className="ribbon-card-item">
            <div className="ribbon-svg-box">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="ribbon-texts">
              <h3 className="ribbon-main-heading">24/7</h3>
              <p className="ribbon-sub-caption">Emergency Care</p>
            </div>
          </div>

          <div className="ribbon-line-separator"></div>

          {/* 2. Cashless Insurance */}
          <div className="ribbon-card-item">
            <div className="ribbon-svg-box">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <line x1="12" y1="8" x2="12" y2="14"></line>
                <line x1="9" y1="11" x2="15" y2="11"></line>
              </svg>
            </div>
            <div className="ribbon-texts">
              <h3 className="ribbon-main-heading">Cashless</h3>
              <p className="ribbon-sub-caption">Insurance</p>
            </div>
          </div>

          <div className="ribbon-line-separator"></div>

          {/* 3. 40+ TPA Partners */}
          <div className="ribbon-card-item">
            <div className="ribbon-svg-box">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <div className="ribbon-texts">
              <h3 className="ribbon-main-heading">40+</h3>
              <p className="ribbon-sub-caption">TPA Partners</p>
            </div>
          </div>

          <div className="ribbon-line-separator"></div>

          {/* 4. Advanced Technology */}
          <div className="ribbon-card-item">
            <div className="ribbon-svg-box">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <div className="ribbon-texts">
              <h3 className="ribbon-main-heading">Advanced</h3>
              <p className="ribbon-sub-caption">Technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          5. OUR SPECIALTIES (7 CARDS)
          ======================================================= */}
      <section id="specialties" className="our-specialties-section">
        <h2 className="specialties-title-centered">Our Specialties</h2>

        <div className="specialties-cards-grid-7">
          {/* 1. Cardiology */}
          <div className="spec-item-box" onClick={() => handleSpecialtyClick("Cardiology")}>
            <div className="spec-svg-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#0d9488">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="spec-label-title">Cardiology</span>
          </div>

          {/* 2. Neurology */}
          <div className="spec-item-box" onClick={() => handleSpecialtyClick("Neurology")}>
            <div className="spec-svg-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"></path>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"></path>
              </svg>
            </div>
            <span className="spec-label-title">Neurology</span>
          </div>

          {/* 3. Oncology */}
          <div className="spec-item-box" onClick={() => handleSpecialtyClick("Oncology")}>
            <div className="spec-svg-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c-2.76 0-5 2.24-5 5 0 2.23 1.3 4.14 3.16 4.73L6 22h3l3-7 3 7h3l-4.16-10.27C15.7 11.14 17 9.23 17 7c0-2.76-2.24-5-5-5z"></path>
              </svg>
            </div>
            <span className="spec-label-title">Oncology</span>
          </div>

          {/* 4. Orthopedics */}
          <div className="spec-item-box" onClick={() => handleSpecialtyClick("Orthopedics")}>
            <div className="spec-svg-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3"></circle>
                <path d="M12 8v8"></path>
                <path d="M9 21h6"></path>
                <path d="M9 12h6"></path>
                <circle cx="12" cy="19" r="2"></circle>
              </svg>
            </div>
            <span className="spec-label-title">Orthopedics</span>
          </div>

          {/* 5. Gastroenterology */}
          <div className="spec-item-box" onClick={() => handleSpecialtyClick("Gastroenterology")}>
            <div className="spec-svg-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 3a3 3 0 0 0-3 3v2a3 3 0 0 1-3 3H9a5 5 0 0 0-5 5v1a5 5 0 0 0 5 5h3a6 6 0 0 0 6-6V6a3 3 0 0 0-3-3z"></path>
              </svg>
            </div>
            <span className="spec-label-title">Gastroenterology</span>
          </div>

          {/* 6. Nephrology */}
          <div className="spec-item-box" onClick={() => handleSpecialtyClick("Nephrology")}>
            <div className="spec-svg-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 6c-3 0-5 2.5-5 5.5s2.5 6.5 6 6.5c3 0 4-2 4-4V6H7z"></path>
                <path d="M17 6c3 0 5 2.5 5 5.5s-2.5 6.5-6 6.5c-3 0-4-2-4-4V6h5z"></path>
              </svg>
            </div>
            <span className="spec-label-title">Nephrology</span>
          </div>

          {/* 7. View All */}
          <div className="spec-item-box spec-view-all-box" onClick={() => handleSpecialtyClick("View All")}>
            <div className="spec-svg-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <span className="spec-label-title text-forest-green">View All</span>
          </div>
        </div>
      </section>

      {/* =======================================================
          6. WHY CHOOSE SECTION HEADER
          ======================================================= */}
      <section className="why-choose-header-only-strip">
        <h2 className="why-choose-heading-text">
          Why Choose <span className="green-accent-text">NI AROGIYAM?</span>
        </h2>
      </section>

      {/* =======================================================
          APPOINTMENT MODAL
          ======================================================= */}
      {bookingModalOpen && (
        <div className="modal-dark-overlay" onClick={() => setBookingModalOpen(false)}>
          <div className="modal-container-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card-top">
              <div>
                <h2>Book Doctor Appointment</h2>
                <p>Specialty: <strong>{selectedSpecialty}</strong></p>
              </div>
              <button
                type="button"
                className="btn-modal-close-icon"
                onClick={() => setBookingModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="modal-success-content">
                <div className="green-tick-badge">✓</div>
                <h3>Appointment Requested!</h3>
                <p>
                  Thank you, <strong>{appointmentForm.fullName || "Patient"}</strong>. Your consultation request for <strong>{appointmentForm.department}</strong> has been registered.
                </p>
                <p className="sms-sent-line">
                  📱 Confirmation SMS sent to <strong>{appointmentForm.phoneNumber}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="modal-form-grid">
                <div className="modal-input-field">
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

                <div className="modal-input-field">
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

                <div className="modal-input-field">
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

                <div className="modal-input-field">
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

                <div className="modal-action-buttons">
                  <button
                    type="button"
                    className="btn-cancel-modal"
                    onClick={() => setBookingModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-confirm-modal">
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
