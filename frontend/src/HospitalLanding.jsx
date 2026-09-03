import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HospitalLanding.css";
import hospitalHeroImg from "./assets/hospital_building.jpg";

export default function HospitalLanding() {
  const navigate = useNavigate();

  // Dropdown menus state
  const [specialtiesDropdown, setSpecialtiesDropdown] = useState(false);
  const [visitorDropdown, setVisitorDropdown] = useState(false);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [ambulanceSuccess, setAmbulanceSuccess] = useState(false);

  // Form State
  const [appointmentForm, setAppointmentForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    department: "Cardiology",
    doctor: "Dr. Rajesh Sharma (Senior Cardiologist)",
    preferredDate: "",
    preferredTime: "Morning (09:00 AM - 12:00 PM)",
    notes: "",
  });

  const [ambulanceForm, setAmbulanceForm] = useState({
    callerName: "",
    contactNumber: "",
    pickupLocation: "",
    patientCondition: "Cardiac / Chest Pain Emergency",
    notes: "",
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalOpen(false);
      setPackageModalOpen(false);
      setAppointmentForm({
        fullName: "",
        phoneNumber: "",
        email: "",
        department: "Cardiology",
        doctor: "Dr. Rajesh Sharma (Senior Cardiologist)",
        preferredDate: "",
        preferredTime: "Morning (09:00 AM - 12:00 PM)",
        notes: "",
      });
    }, 2800);
  };

  const handleAmbulanceSubmit = (e) => {
    e.preventDefault();
    setAmbulanceSuccess(true);
    setTimeout(() => {
      setAmbulanceSuccess(false);
      setSosModalOpen(false);
      setAmbulanceForm({
        callerName: "",
        contactNumber: "",
        pickupLocation: "",
        patientCondition: "Cardiac / Chest Pain Emergency",
        notes: "",
      });
    }, 3000);
  };

  // Specialties data matching mockup
  const quickSpecialties = [
    { id: "cardio", name: "Cardiology", icon: "🫀", desc: "Heart & Vascular Care" },
    { id: "neuro", name: "Neurology", icon: "🧠", desc: "Brain & Spine Institute" },
    { id: "onco", name: "Oncology", icon: "🎗️", desc: "Comprehensive Cancer Care" },
    { id: "ortho", name: "Orthopedics", icon: "🦴", desc: "Robotic Joint Replacement" },
    { id: "gastro", name: "Gastroenterology", icon: "🔬", desc: "Digestive & Liver Sciences" },
    { id: "nephro", name: "Nephrology", icon: "🫘", desc: "Dialysis & Renal Care" },
    { id: "all", name: "View All", icon: "▦", desc: "40+ Super Specialties", isViewAll: true },
  ];

  // Full Specialties Data
  const fullSpecialities = [
    {
      id: "cardio",
      category: "cardiac",
      icon: "🫀",
      title: "Cardiology & Cardiac Surgery",
      badge: "Centre of Excellence",
      desc: "Advanced 24/7 Cath Lab, Primary Angioplasty in <60 mins, Minimally Invasive Bypass (CABG), Valve Replacement & Pediatric Cardiology.",
      doctorsCount: 14,
      tag: "24/7 Heart Attack Center",
    },
    {
      id: "neuro",
      category: "neuro",
      icon: "🧠",
      title: "Neurology & Neurosurgery",
      badge: "Comprehensive Stroke Unit",
      desc: "Dedicated Acute Stroke Unit, Brain & Spine Micro-surgery, Neuro-Navigation, Epilepsy Clinic & Neuro-Rehabilitation.",
      doctorsCount: 10,
      tag: "Robotic Spine Surgery",
    },
    {
      id: "ortho",
      category: "surgical",
      icon: "🦴",
      title: "Orthopedics & Joint Replacement",
      badge: "Robotic Joint Care",
      desc: "Robotic Total Knee & Hip Replacements, Arthroscopic Sports Medicine, Complex Trauma & Spine Deformity Correction.",
      doctorsCount: 12,
      tag: "Day-Care Arthroscopy",
    },
    {
      id: "onco",
      category: "medical",
      icon: "🎗️",
      title: "Medical & Surgical Oncology",
      badge: "Integrated Cancer Care",
      desc: "Comprehensive Cancer Centre with High-Precision TrueBeam Radiotherapy, Immunotherapy, Day-Care Chemotherapy & Tumor Board.",
      doctorsCount: 11,
      tag: "NABL Molecular Lab",
    },
    {
      id: "nephro",
      category: "medical",
      icon: "🫘",
      title: "Nephrology & Renal Dialysis",
      badge: "24/7 Dialysis Unit",
      desc: "40-Bed Hemodialysis Centre, CRRT for ICU Patients, Kidney Transplant Programme & Pediatric Nephrology.",
      doctorsCount: 8,
      tag: "Zero-Infection Protocol",
    },
    {
      id: "paed",
      category: "paediatric",
      icon: "👶",
      title: "Paediatrics & Neonatal Care",
      badge: "Level-III Tertiary NICU",
      desc: "24/7 Level-III Neonatal Intensive Care (NICU), Pediatric Surgery, Developmental Clinic & Specialized Child Vaccination.",
      doctorsCount: 9,
      tag: "24/7 Pediatric Emergency",
    },
    {
      id: "gynae",
      category: "surgical",
      icon: "🤰",
      title: "Obstetrics & Gynaecology",
      badge: "Mother & Baby Care",
      desc: "High-Risk Pregnancy Care, Painless Labour Suites, 4D Fetal Medicine, Laparoscopic Gynae Surgery & Fertility Clinic.",
      doctorsCount: 10,
      tag: "Painless Delivery",
    },
    {
      id: "gastro",
      category: "surgical",
      icon: "🔬",
      title: "Gastroenterology & Hepatology",
      badge: "GI & Liver Institute",
      desc: "Advanced Endoscopy, ERCP, Capsule Endoscopy, Liver Cirrhosis & Fatty Liver Clinic, Bariatric Metabolic Surgery.",
      doctorsCount: 8,
      tag: "High-Definition Endoscopy",
    },
  ];

  // Health Packages
  const healthPackages = [
    {
      id: "pkg-1",
      name: "Master Executive Health Checkup",
      originalPrice: "₹ 6,500",
      offerPrice: "₹ 2,999",
      discount: "54% OFF",
      popular: true,
      testsCount: "75+ Comprehensive Tests",
      idealFor: "Men & Women aged 30+",
      highlights: [
        "Complete Hemogram & ESR (24 parameters)",
        "Comprehensive Lipid & Cardiac Risk Profile",
        "Kidney & Liver Functional Screen (KFT & LFT)",
        "HbA1c & Fasting Blood Glucose",
        "Resting 12-Lead ECG & Chest X-Ray",
        "Ultrasound Abdomen & Pelvis Screening",
        "Detailed Physician & Dietician Consultation",
      ],
    },
    {
      id: "pkg-2",
      name: "Comprehensive Cardiac Wellness",
      originalPrice: "₹ 7,200",
      offerPrice: "₹ 3,499",
      discount: "51% OFF",
      popular: false,
      testsCount: "35+ Heart-Specific Tests",
      idealFor: "Cardiac risk, hypertension, smokers",
      highlights: [
        "2D Echocardiogram with Color Doppler",
        "TMT (Treadmill Stress Test)",
        "High-Sensitivity Troponin-I & hs-CRP",
        "Advanced Lipid Fractionation Profile",
        "Electrolytes (Serum Sodium, Potassium)",
        "Serum Creatinine & Urine Microalbumin",
        "Direct Senior Cardiologist Review",
      ],
    },
    {
      id: "pkg-3",
      name: "Senior Citizen Total Care (60+)",
      originalPrice: "₹ 5,800",
      offerPrice: "₹ 2,499",
      discount: "57% OFF",
      popular: false,
      testsCount: "50+ Geriatric Health Tests",
      idealFor: "Seniors & Elderly Patients",
      highlights: [
        "DEXA Bone Mineral Density Scan",
        "Vitamin D3 & Vitamin B12 Levels",
        "Prostate Specific Antigen (PSA) / Pap Smear",
        "Renal & Hepatic Function Profiles",
        "Comprehensive Ophthalmic & Hearing Check",
        "Joint & Arthritis Assessment",
        "Geriatric Specialist Consultation",
      ],
    },
  ];

  // Doctors
  const featuredDoctors = [
    {
      name: "Dr. Rajesh Sharma",
      dept: "Cardiology & Interventional Care",
      qualification: "MBBS, MD (Med), DM (Cardiology), FACC",
      experience: "22+ Years Exp",
      schedule: "Mon - Sat: 09:00 AM - 04:00 PM",
      rating: "4.9 ★★★★★",
      avatar: "👨‍⚕️",
    },
    {
      name: "Dr. Ananya Sundaram",
      dept: "Neurology & Stroke Specialist",
      qualification: "MBBS, MD, DM (Neurology), FINR",
      experience: "18+ Years Exp",
      schedule: "Mon - Fri: 10:00 AM - 05:00 PM",
      rating: "4.9 ★★★★★",
      avatar: "👩‍⚕️",
    },
    {
      name: "Dr. Vikramaditya Reddy",
      dept: "Robotic Joint Replacement & Ortho",
      qualification: "MBBS, MS (Ortho), M.Ch (UK), FIJR",
      experience: "20+ Years Exp",
      schedule: "Mon - Sat: 11:00 AM - 06:00 PM",
      rating: "5.0 ★★★★★",
      avatar: "👨‍⚕️",
    },
  ];

  // Blood Stock
  const bloodBankStock = [
    { group: "A+", units: 18, status: "Available", bg: "#16a34a" },
    { group: "A-", units: 4, status: "Critical", bg: "#dc2626" },
    { group: "B+", units: 24, status: "Available", bg: "#16a34a" },
    { group: "B-", units: 6, status: "Low", bg: "#ea580c" },
    { group: "O+", units: 32, status: "Available", bg: "#16a34a" },
    { group: "O-", units: 3, status: "Critical", bg: "#dc2626" },
    { group: "AB+", units: 12, status: "Available", bg: "#16a34a" },
    { group: "AB-", units: 5, status: "Low", bg: "#ea580c" },
  ];

  return (
    <div className="exact-hospital-homepage">
      {/* =======================================================
          1. TOP CONTACT & SOCIAL BAR (EXACT MOCKUP)
          ======================================================= */}
      <div className="exact-top-bar">
        <div className="exact-top-bar-inner">
          <div className="top-location">
            <span className="loc-pin">📍</span>
            <span>Madurai Bypass Road, Madurai, Tamil Nadu</span>
          </div>

          <div className="top-right-group">
            <span className="top-emergency-text">24/7 Emergency Care</span>
            <a href="tel:+914523503500" className="top-phone-link">
              <span>📞</span>
              <strong>+91 452 350 3500</strong>
            </a>

            <div className="top-social-icons">
              <a href="#facebook" aria-label="Facebook" className="social-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="social-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="social-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="social-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>

            <button
              type="button"
              className="top-staff-login-btn"
              onClick={() => navigate("/login")}
            >
              🔐 Staff Login
            </button>
          </div>
        </div>
      </div>

      {/* =======================================================
          2. MAIN NAVBAR (EXACT MOCKUP)
          ======================================================= */}
      <header className="exact-navbar">
        <div className="exact-navbar-inner">
          {/* LOGO */}
          <div className="brand-logo-area" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="logo-svg-wrap">
              <svg viewBox="0 0 48 48" fill="none" className="stethoscope-brand-icon">
                <path d="M14 8C14 5.79086 15.7909 4 18 4H30C32.2091 4 34 5.79086 34 8V18C34 23.5228 29.5228 28 24 28C18.4772 28 14 23.5228 14 18V8Z" stroke="#065f46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 28V36C24 40.4183 27.5817 44 32 44C36.4183 44 40 40.4183 40 36V30" stroke="#065f46" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="40" cy="30" r="4" fill="#10b981"/>
                <path d="M24 12C22 10 19 11 19 14C19 18 24 21 24 21C24 21 29 18 29 14C29 11 26 10 24 12Z" fill="#10b981"/>
              </svg>
            </div>
            <div className="brand-text-block">
              <span className="brand-name-main">NI AROGIYAM</span>
              <span className="brand-sub-main">— INTELLIGENT HEALTHCARE SYSTEM —</span>
            </div>
          </div>

          {/* MENU LINKS */}
          <nav className="exact-nav-links">
            <a href="#home" className="nav-item active">Home</a>
            <a href="#about" className="nav-item">About Us</a>

            <div
              className="nav-dropdown"
              onMouseEnter={() => setSpecialtiesDropdown(true)}
              onMouseLeave={() => setSpecialtiesDropdown(false)}
            >
              <a href="#specialties" className="nav-item dropdown-trigger">
                Specialties <span className="caret">⌄</span>
              </a>
              {specialtiesDropdown && (
                <div className="dropdown-menu">
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Cardiology & Heart Surgery</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Neurology & Stroke Center</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Oncology & Cancer Care</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Orthopedics & Joint Replacement</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Gastroenterology & GI Surgery</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Nephrology & Renal Dialysis</a>
                  <a href="#specialties" onClick={() => setSpecialtiesDropdown(false)}>Paediatrics & Level-3 NICU</a>
                </div>
              )}
            </div>

            <a href="#facilities" className="nav-item">Facilities</a>

            <div
              className="nav-dropdown"
              onMouseEnter={() => setVisitorDropdown(true)}
              onMouseLeave={() => setVisitorDropdown(false)}
            >
              <a href="#guide" className="nav-item dropdown-trigger">
                Patients &amp; Visitors <span className="caret">⌄</span>
              </a>
              {visitorDropdown && (
                <div className="dropdown-menu">
                  <a href="#guide" onClick={() => setVisitorDropdown(false)}>Visiting Hours &amp; Guidelines</a>
                  <a href="#guide" onClick={() => setVisitorDropdown(false)}>Room Categories &amp; Tariffs</a>
                  <a href="#insurance" onClick={() => setVisitorDropdown(false)}>Insurance &amp; Cashless TPA</a>
                  <a href="#emergency" onClick={() => setVisitorDropdown(false)}>24/7 Pharmacy &amp; Blood Bank</a>
                </div>
              )}
            </div>

            <a href="#doctors" className="nav-item">Our Doctors</a>
            <a href="#contact" className="nav-item">Contact Us</a>
          </nav>

          {/* CTA */}
          <div className="nav-right-actions">
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
          3. HERO SECTION (EXACT MOCKUP)
          ======================================================= */}
      <section id="home" className="exact-hero-section">
        <div className="hero-background-art">
          <img
            src={hospitalHeroImg}
            alt="NI AROGIYAM Hospital Grand Building"
            className="hero-hospital-building-img"
          />
          <div className="hero-gradient-overlay"></div>
        </div>

        <div className="exact-hero-inner">
          <div className="hero-left-col">
            <h1 className="hero-title-stack">
              <span className="title-row-1">Advanced Medicine.</span>
              <span className="title-row-2">Compassionate Healing.</span>
              <span className="title-row-3">World-Class Care.</span>
            </h1>

            <p className="hero-description-text">
              <strong>NI AROGIYAM</strong> is a state-of-the-art 500-bed tertiary care hospital equipped with 4th Gen Robotic Surgery, 24/7 Level-1 Trauma &amp; Emergency, Comprehensive Cancer Institute, and Cashless Insurance support for over 40+ TPAs.
            </p>

            {/* 4 CIRCULAR FLOATING STATS (EXACT MOCKUP) */}
            <div className="hero-circle-stats-row">
              <div className="circle-stat-item">
                <div className="circle-icon-badge">
                  <span>🛏️</span>
                </div>
                <div className="circle-stat-text">
                  <strong>500+</strong>
                  <span>Bed Capacity</span>
                </div>
              </div>

              <div className="circle-stat-item">
                <div className="circle-icon-badge">
                  <span>🩺</span>
                </div>
                <div className="circle-stat-text">
                  <strong>40+</strong>
                  <span>Specialties</span>
                </div>
              </div>

              <div className="circle-stat-item">
                <div className="circle-icon-badge">
                  <span>👤</span>
                </div>
                <div className="circle-stat-text">
                  <strong>1L+</strong>
                  <span>Patients Treated</span>
                </div>
              </div>

              <div className="circle-stat-item">
                <div className="circle-icon-badge">
                  <span>🤖</span>
                </div>
                <div className="circle-stat-text">
                  <strong>4th Gen</strong>
                  <span>Robotic Surgery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          4. DARK GREEN FEATURE RIBBON (EXACT MOCKUP)
          ======================================================= */}
      <section className="dark-green-feature-ribbon">
        <div className="ribbon-inner">
          <div className="ribbon-col">
            <div className="ribbon-icon">⏱️</div>
            <div className="ribbon-text">
              <h3>24/7</h3>
              <p>Emergency Care</p>
            </div>
          </div>

          <div className="ribbon-divider"></div>

          <div className="ribbon-col">
            <div className="ribbon-icon">🛡️</div>
            <div className="ribbon-text">
              <h3>Cashless</h3>
              <p>Insurance</p>
            </div>
          </div>

          <div className="ribbon-divider"></div>

          <div className="ribbon-col">
            <div className="ribbon-icon">📑</div>
            <div className="ribbon-text">
              <h3>40+</h3>
              <p>TPA Partners</p>
            </div>
          </div>

          <div className="ribbon-divider"></div>

          <div className="ribbon-col">
            <div className="ribbon-icon">🔬</div>
            <div className="ribbon-text">
              <h3>Advanced</h3>
              <p>Technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          5. OUR SPECIALTIES (EXACT MOCKUP CARDS)
          ======================================================= */}
      <section id="specialties" className="exact-specialties-section">
        <div className="section-title-wrap">
          <h2>Our Specialties</h2>
        </div>

        <div className="specialties-cards-row">
          {quickSpecialties.map((item) => (
            <div
              key={item.id}
              className={`exact-spec-card ${item.isViewAll ? "card-view-all" : ""}`}
              onClick={() => {
                if (item.isViewAll) {
                  document.getElementById("facilities")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  setAppointmentForm((prev) => ({
                    ...prev,
                    department: item.name,
                  }));
                  setBookingModalOpen(true);
                }
              }}
            >
              <div className="spec-card-icon-wrap">
                <span className="spec-emoji-icon">{item.icon}</span>
              </div>
              <h4 className="spec-card-name">{item.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* =======================================================
          6. WHY CHOOSE NI AROGIYAM? & COMPREHENSIVE SECTIONS
          ======================================================= */}
      <section id="facilities" className="exact-why-choose-section">
        <div className="section-title-wrap">
          <h2>Why Choose <span className="highlight-brand">NI AROGIYAM?</span></h2>
          <p className="section-sub-desc">
            South India's premier multi-super-speciality hospital and research institute delivering compassionate clinical care with cutting-edge medical technology.
          </p>
        </div>

        <div className="why-choose-grid-4">
          <div className="facility-box">
            <div className="fac-icon-wrap">🤖</div>
            <h3>4th Gen Robotic Surgery</h3>
            <p>Minimally invasive precision surgeries with da Vinci robotic surgical systems ensuring reduced blood loss and rapid patient recovery.</p>
          </div>

          <div className="facility-box">
            <div className="fac-icon-wrap">🏥</div>
            <h3>Zero-Infection Modular OTs</h3>
            <p>12 state-of-the-art modular operation theatres with Laminar Airflow & Class-100 positive pressure HEPA filtration.</p>
          </div>

          <div className="facility-box">
            <div className="fac-icon-wrap">🧠</div>
            <h3>3.0 Tesla MRI & 128-Slice CT</h3>
            <p>Ultra-low dose high-speed diagnostic neuro & cardiac imaging with artificial intelligence assisted scans.</p>
          </div>

          <div className="facility-box">
            <div className="fac-icon-wrap">❤️</div>
            <h3>Patient-Centric Compassion</h3>
            <p>1:1 dedicated nursing care in all intensive care units with round-the-clock senior consultant supervision.</p>
          </div>
        </div>
      </section>

      {/* =======================================================
          7. 24/7 EMERGENCY & BLOOD BANK READY
          ======================================================= */}
      <section id="emergency" className="emergency-blood-section">
        <div className="emergency-blood-inner">
          <div className="em-block-left">
            <div className="em-red-pill">🚨 24/7 LEVEL-1 TRAUMA &amp; EMERGENCY</div>
            <h2>Round-the-Clock Critical Care &amp; Ambulance</h2>
            <p>
              Dedicated Chest Pain Unit with &lt;60 min door-to-balloon primary angioplasty, Comprehensive Stroke Thrombolysis, and GPS-enabled ICU On Wheels.
            </p>

            <div className="em-quick-contacts-row">
              <a href="tel:+914523503500" className="btn-call-hotline">
                📞 Emergency: +91 452 350 3500
              </a>
              <button
                type="button"
                className="btn-sos-ambulance"
                onClick={() => setSosModalOpen(true)}
              >
                🚑 Request Ambulance SOS
              </button>
            </div>
          </div>

          <div className="em-block-right">
            <div className="blood-stock-banner">
              <div className="bb-top">
                <h3>Live Blood Bank Stock (24/7)</h3>
                <span className="bb-live-tag">● READY</span>
              </div>
              <div className="blood-pills-row">
                {bloodBankStock.map((b) => (
                  <div key={b.group} className="bb-unit-pill">
                    <strong>{b.group}</strong>
                    <span>{b.units} Units</span>
                  </div>
                ))}
              </div>
              <p className="bb-footer-note">🩸 PRBC, Platelets, FFP &amp; Cryoprecipitate Available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          8. PREVENTIVE HEALTH CHECKUP PACKAGES
          ======================================================= */}
      <section id="packages" className="health-packages-section">
        <div className="section-title-wrap">
          <h2>Executive Health Checkup Packages</h2>
          <p className="section-sub-desc">
            Invest in your long-term wellness with comprehensive diagnostic screening packages at special discounted tariffs.
          </p>
        </div>

        <div className="packages-cards-grid">
          {healthPackages.map((pkg) => (
            <div key={pkg.id} className={`package-item-card ${pkg.popular ? "popular-card" : ""}`}>
              {pkg.popular && <div className="pkg-ribbon-tag">MOST POPULAR</div>}
              <h3>{pkg.name}</h3>
              <span className="pkg-target">{pkg.idealFor}</span>

              <div className="pkg-price-row">
                <span className="pkg-offer-rate">{pkg.offerPrice}</span>
                <span className="pkg-orig-rate">{pkg.originalPrice}</span>
                <span className="pkg-discount-pill">{pkg.discount}</span>
              </div>

              <div className="pkg-test-badge">🔬 {pkg.testsCount}</div>

              <ul className="pkg-list">
                {pkg.highlights.map((h, i) => (
                  <li key={i}>✓ {h}</li>
                ))}
              </ul>

              <button
                type="button"
                className="btn-book-pkg-action"
                onClick={() => {
                  setSelectedPackage(pkg);
                  setPackageModalOpen(true);
                }}
              >
                Book Package Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =======================================================
          9. OUR SENIOR DOCTORS
          ======================================================= */}
      <section id="doctors" className="doctors-directory-section">
        <div className="section-title-wrap">
          <h2>Meet Our Distinguished Medical Specialists</h2>
        </div>

        <div className="doctors-cards-grid">
          {featuredDoctors.map((doc, idx) => (
            <div key={idx} className="doc-card">
              <div className="doc-avatar-circle">{doc.avatar}</div>
              <h3>{doc.name}</h3>
              <span className="doc-spec-title">{doc.dept}</span>
              <p className="doc-qual-text">{doc.qualification}</p>
              <span className="doc-exp-tag">⭐ {doc.experience}</span>
              <button
                type="button"
                className="btn-doc-book-appt"
                onClick={() => {
                  setAppointmentForm((prev) => ({
                    ...prev,
                    doctor: doc.name,
                    department: doc.dept.split("&")[0].trim(),
                  }));
                  setBookingModalOpen(true);
                }}
              >
                Book Consultation
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =======================================================
          10. FOOTER
          ======================================================= */}
      <footer id="contact" className="exact-hospital-footer">
        <div className="footer-top-grid">
          <div className="footer-brand-column">
            <div className="brand-logo-area">
              <div className="logo-svg-wrap footer-logo-wrap">
                <svg viewBox="0 0 48 48" fill="none" className="stethoscope-brand-icon">
                  <path d="M14 8C14 5.79086 15.7909 4 18 4H30C32.2091 4 34 5.79086 34 8V18C34 23.5228 29.5228 28 24 28C18.4772 28 14 23.5228 14 18V8Z" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24 28V36C24 40.4183 27.5817 44 32 44C36.4183 44 40 40.4183 40 36V30" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="40" cy="30" r="4" fill="#34d399"/>
                  <path d="M24 12C22 10 19 11 19 14C19 18 24 21 24 21C24 21 29 18 29 14C29 11 26 10 24 12Z" fill="#34d399"/>
                </svg>
              </div>
              <div className="brand-text-block">
                <span className="brand-name-main text-white">NI AROGIYAM</span>
                <span className="brand-sub-main text-emerald">— INTELLIGENT HEALTHCARE SYSTEM —</span>
              </div>
            </div>
            <p className="footer-about-text">
              Premier 500-Bed Multi-Super-Speciality Hospital &amp; Research Centre. Committed to affordable excellence in patient care.
            </p>
            <p className="footer-addr">
              📍 <strong>Hospital Campus:</strong> Madurai Bypass Road, Madurai, Tamil Nadu - 625016
            </p>
          </div>

          <div className="footer-nav-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#specialties">Specialties</a></li>
              <li><a href="#facilities">Facilities</a></li>
              <li><a href="#packages">Health Packages</a></li>
              <li><a href="#doctors">Our Doctors</a></li>
            </ul>
          </div>

          <div className="footer-contact-column">
            <h4>24/7 Helplines</h4>
            <ul>
              <li>🚨 <strong>Emergency / Trauma:</strong> +91 452 350 3500</li>
              <li>🚑 <strong>Ambulance Dispatch:</strong> 080-22065001</li>
              <li>🩸 <strong>Blood Bank Desk:</strong> 080-22065002</li>
              <li>📅 <strong>Appointments:</strong> 080-22065003</li>
              <li>✉️ <strong>Email:</strong> contact@niarogiyam.org</li>
            </ul>
          </div>

          <div className="footer-portal-column">
            <h4>Hospital Staff Access</h4>
            <p>Access for Doctors, Wardens &amp; Management.</p>
            <Link to="/login" className="btn-footer-staff-login">
              🔐 Staff / Doctor Portal Login
            </Link>
          </div>
        </div>

        <div className="footer-bottom-copyright">
          <p>© {new Date().getFullYear()} NI AROGIYAM Hospital Management System. All Rights Reserved.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Patient Rights</a>
            <Link to="/login">Admin Login</Link>
          </div>
        </div>
      </footer>

      {/* =======================================================
          MODAL: BOOK APPOINTMENT
          ======================================================= */}
      {bookingModalOpen && (
        <div className="landing-modal-overlay" onClick={() => setBookingModalOpen(false)}>
          <div className="landing-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>📅 Book Doctor Appointment</h2>
                <p>Instant confirmation with NI AROGIYAM Specialist</p>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setBookingModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="modal-success-box">
                <div className="success-icon">✓</div>
                <h3>Appointment Requested Successfully!</h3>
                <p>
                  Thank you, <strong>{appointmentForm.fullName || "Patient"}</strong>. Your consultation request for <strong>{appointmentForm.department}</strong> has been received.
                </p>
                <p className="confirmation-sms-notice">
                  📱 A confirmation SMS &amp; WhatsApp reminder with token number has been sent to <strong>{appointmentForm.phoneNumber}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="modal-form">
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={appointmentForm.fullName}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={appointmentForm.phoneNumber}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Department / Specialty *</label>
                    <select
                      value={appointmentForm.department}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, department: e.target.value })
                      }
                    >
                      <option value="Cardiology">Cardiology &amp; Heart Care</option>
                      <option value="Neurology">Neurology &amp; Stroke Care</option>
                      <option value="Orthopedics">Orthopedics &amp; Joint Replacement</option>
                      <option value="Oncology">Medical &amp; Surgical Oncology</option>
                      <option value="Nephrology">Nephrology &amp; Renal Care</option>
                      <option value="Gastroenterology">Gastroenterology &amp; GI Surgery</option>
                      <option value="Paediatrics">Paediatrics &amp; Child Care</option>
                      <option value="Obstetrics & Gynaecology">Obstetrics &amp; Gynaecology</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Preferred Doctor</label>
                    <input
                      type="text"
                      placeholder="Doctor Name (Optional)"
                      value={appointmentForm.doctor}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, doctor: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Preferred Consultation Date *</label>
                    <input
                      type="date"
                      required
                      value={appointmentForm.preferredDate}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, preferredDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>Preferred Time Slot *</label>
                    <select
                      value={appointmentForm.preferredTime}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, preferredTime: e.target.value })
                      }
                    >
                      <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                      <option value="Evening (03:00 PM - 07:00 PM)">Evening (03:00 PM - 07:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setBookingModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-submit">
                    Confirm Appointment ➔
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL: BOOK HEALTH PACKAGE
          ======================================================= */}
      {packageModalOpen && (
        <div className="landing-modal-overlay" onClick={() => setPackageModalOpen(false)}>
          <div className="landing-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>📦 Book Health Package</h2>
                <p>{selectedPackage?.name} ({selectedPackage?.offerPrice})</p>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setPackageModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="modal-success-box">
                <div className="success-icon">✓</div>
                <h3>Health Package Reserved!</h3>
                <p>Your package booking has been confirmed. Details sent to your mobile.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="modal-form">
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={appointmentForm.fullName}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Mobile Number *</label>
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
                </div>

                <div className="form-field">
                  <label>Preferred Checkup Date *</label>
                  <input
                    type="date"
                    required
                    value={appointmentForm.preferredDate}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, preferredDate: e.target.value })
                    }
                  />
                </div>

                <div className="modal-footer-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setPackageModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-submit">
                    Confirm Health Package
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL: EMERGENCY AMBULANCE SOS DISPATCH
          ======================================================= */}
      {sosModalOpen && (
        <div className="landing-modal-overlay" onClick={() => setSosModalOpen(false)}>
          <div className="landing-modal-card emergency-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header emergency-modal-header">
              <div>
                <h2>🚨 24/7 Emergency Ambulance Request</h2>
                <p>Priority GPS-Enabled Advanced Life Support Dispatch</p>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSosModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {ambulanceSuccess ? (
              <div className="modal-success-box emergency-success">
                <div className="success-icon-red">🚑</div>
                <h3>Ambulance Dispatched!</h3>
                <p>Emergency Unit AMB-101 is en route to <strong>{ambulanceForm.pickupLocation}</strong>.</p>
                <div className="emergency-contact-highlight">
                  <span>Emergency Coordinator Helpline:</span>
                  <strong>+91 452 350 3500</strong>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAmbulanceSubmit} className="modal-form">
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Caller / Patient Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={ambulanceForm.callerName}
                      onChange={(e) =>
                        setAmbulanceForm({ ...ambulanceForm, callerName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Contact Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Active Phone Number"
                      value={ambulanceForm.contactNumber}
                      onChange={(e) =>
                        setAmbulanceForm({ ...ambulanceForm, contactNumber: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Exact Pickup Address / Landmark *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Street name, landmark, city area..."
                    value={ambulanceForm.pickupLocation}
                    onChange={(e) =>
                      setAmbulanceForm({ ...ambulanceForm, pickupLocation: e.target.value })
                    }
                  />
                </div>

                <div className="modal-footer-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setSosModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-submit btn-emergency-submit">
                    🚨 Dispatch Ambulance Now
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
