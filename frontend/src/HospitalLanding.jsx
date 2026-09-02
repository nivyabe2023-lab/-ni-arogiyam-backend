import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HospitalLanding.css";

export default function HospitalLanding() {
  const navigate = useNavigate();

  // Accessibility state
  const [fontScale, setFontScale] = useState(1);
  const [isGreyscale, setIsGreyscale] = useState(false);

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

  // Font Scaling handlers
  const handleIncreaseFont = () => {
    if (fontScale < 1.25) setFontScale((prev) => Math.min(prev + 0.1, 1.25));
  };
  const handleDecreaseFont = () => {
    if (fontScale > 0.85) setFontScale((prev) => Math.max(prev - 0.1, 0.85));
  };
  const handleResetFont = () => {
    setFontScale(1);
  };

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

  // Specialities Data
  const specialities = [
    {
      id: "cardio",
      category: "cardiac",
      icon: "🫀",
      title: "Cardiology & Cardiac Surgery",
      badge: "Centre of Excellence",
      desc: "Advanced 24/7 Cath Lab, Primary Angioplasty, Minimally Invasive Bypass (CABG), Valve Replacement & Pediatric Cardiology.",
      doctorsCount: 14,
      tag: "24/7 Heart Attack Center",
    },
    {
      id: "neuro",
      category: "neuro",
      icon: "🧠",
      title: "Neurology & Neurosurgery",
      badge: "Comprehensive Stroke Unit",
      desc: "Dedicated Comprehensive Stroke Unit, Brain & Spine Micro-surgery, Neuro-Navigation, Epilepsy Clinic & Neuro-Rehabilitation.",
      doctorsCount: 10,
      tag: "Robotic Spine Surgery",
    },
    {
      id: "ortho",
      category: "surgical",
      icon: "🦴",
      title: "Orthopaedics & Joint Replacement",
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
      id: "pulmo",
      category: "medical",
      icon: "🫁",
      title: "Pulmonology & Critical Care",
      badge: "Advanced Respiratory Care",
      desc: "Advanced Bronchoscopy Unit, Sleep Disorder Clinic, Severe Asthma & COPD Clinic, ECMO & Respiratory ICU.",
      doctorsCount: 7,
      tag: "ECMO Certified",
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

  const filteredSpecialities =
    activeTab === "all"
      ? specialities
      : specialities.filter((item) => item.category === activeTab);

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
    {
      id: "pkg-4",
      name: "Well-Woman Complete Health",
      originalPrice: "₹ 6,000",
      offerPrice: "₹ 2,799",
      discount: "53% OFF",
      popular: false,
      testsCount: "45+ Tests Designed for Women",
      idealFor: "Women of all age groups",
      highlights: [
        "Digital Bilateral Mammography / Breast USG",
        "Liquid-Based Pap Smear Cytology",
        "Thyroid Profile (Total T3, T4, Ultra TSH)",
        "Serum Ferritin, Iron & Calcium Studies",
        "Pelvic Ultrasound (Uterus & Ovaries)",
        "Fasting & Post-Prandial Blood Sugar",
        "Senior Gynecologist Consultation",
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
      rating: "4.9 ★★★../../",
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
    {
      name: "Dr. Meenakshi Iyer",
      dept: "Obstetrics & High-Risk Pregnancy",
      qualification: "MBBS, DGO, MD (OBG), MRCOG (London)",
      experience: "16+ Years Exp",
      schedule: "Mon - Sat: 09:30 AM - 03:30 PM",
      rating: "4.9 ★★★../../",
      avatar: "👩‍⚕️",
    },
  ];

  // Live Blood Stock
  const bloodBankStock = [
    { group: "A+", units: 18, status: "Available", bg: "#16a34a" },
    { group: "A-", units: 4, status: "Critical", bg: "#dc2626" },
    { group: "B+", units: 24, status: "Available", bg: "#16a34a" },
    { group: "B-", units: 6, status: "Low", bg: "#ea580c" },
    { group: "O+", units: 32, status: "Available", bg: "#16a34a" },
    { group: "O-", units: 3, status: "Critical (Universal)", bg: "#dc2626" },
    { group: "AB+", units: 12, status: "Available", bg: "#16a34a" },
    { group: "AB-", units: 5, status: "Low", bg: "#ea580c" },
  ];

  return (
    <div
      className={`hospital-landing-page ${isGreyscale ? "mode-greyscale" : ""}`}
      style={{ "--landing-font-scale": fontScale }}
    >
      {/* =======================================================
          TOP BAR (ACCREDITATION & 24/7 EMERGENCY & ACCESSIBILITY)
          ======================================================= */}
      <div className="landing-topbar">
        <div className="landing-topbar-inner">
          <div className="landing-topbar-left">
            <span className="nabh-badge">
              ★ NABH & NABL ACCREDITED TERTIARY CARE HOSPITAL
            </span>
            <a href="tel:08022065000" className="emergency-hotline-link">
              <span className="live-pulse"></span>
              <span>24/7 Emergency & Trauma: <strong>080-22065000 / 108</strong></span>
            </a>
          </div>

          <div className="landing-topbar-right">
            {/* ACCESSIBILITY CONTROLS */}
            <div className="landing-accessibility">
              <span className="acc-label">Accessibility:</span>
              <div className="acc-font-group">
                <button
                  type="button"
                  onClick={handleDecreaseFont}
                  title="Decrease Font Size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={handleResetFont}
                  title="Normal Font Size"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={handleIncreaseFont}
                  title="Increase Font Size"
                >
                  A+
                </button>
              </div>
              <button
                type="button"
                className={`acc-contrast-toggle ${isGreyscale ? "active" : ""}`}
                onClick={() => setIsGreyscale(!isGreyscale)}
              >
                🌗 {isGreyscale ? "Normal" : "High Contrast"}
              </button>
            </div>

            {/* QUICK ACTIONS */}
            <button
              type="button"
              className="quick-btn-ambulance"
              onClick={() => setSosModalOpen(true)}
            >
              🚑 24/7 Ambulance
            </button>
            <button
              type="button"
              className="quick-btn-login"
              onClick={() => navigate("/login")}
            >
              🔐 Staff / Doctor Login
            </button>
          </div>
        </div>
      </div>

      {/* =======================================================
          MAIN NAVBAR
          ======================================================= */}
      <header className="landing-navbar">
        <div className="navbar-container">
          <div className="brand-container" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="brand-icon">N</div>
            <div className="brand-text">
              <span className="brand-title">NI AROGIYAM</span>
              <span className="brand-tagline">Multispeciality Hospital & Research Centre</span>
            </div>
          </div>

          <nav className="nav-menu">
            <a href="#specialities">Specialities</a>
            <a href="#emergency">Emergency & Blood Bank</a>
            <a href="#packages">Health Packages</a>
            <a href="#insurance">Insurance & TPA</a>
            <a href="#guide">Patient Guide</a>
            <a href="#doctors">Our Doctors</a>
            <a href="#contact">Contact & Location</a>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="btn-book-nav"
              onClick={() => setBookingModalOpen(true)}
            >
              📅 Book Appointment
            </button>
            <Link to="/login" className="btn-portal-login">
              Hospital Portal ➔
            </Link>
          </div>
        </div>
      </header>

      {/* =======================================================
          HERO SECTION (ADVERTISEMENT & SHOWCASE)
          ======================================================= */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text-block">
            <div className="hero-pill">
              <span className="pulse-dot"></span>
              <span>⭐ South India's Most Trusted Super-Speciality Healthcare Destination</span>
            </div>

            <h1 className="hero-heading">
              Advanced Medicine.<br />
              <span className="hero-highlight">Compassionate Healing.</span><br />
              World-Class Care.
            </h1>

            <p className="hero-description">
              <strong>NI AROGIYAM</strong> is a state-of-the-art 500-bed tertiary care hospital equipped with 4th Gen Robotic Surgery, 24/7 Level-1 Trauma & Emergency, Comprehensive Cancer Institute, and Cashless Insurance support for over 40+ TPAs.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={() => setBookingModalOpen(true)}
              >
                📅 Book Doctor Consultation
              </button>
              <button
                type="button"
                className="btn-hero-emergency"
                onClick={() => setSosModalOpen(true)}
              >
                🚨 Emergency & Ambulance (080-22065000)
              </button>
              <a href="#packages" className="btn-hero-secondary">
                📦 Executive Health Packages
              </a>
            </div>

            <div className="hero-key-stats">
              <div className="stat-pill">
                <strong>500+</strong>
                <span>Advanced Beds</span>
              </div>
              <div className="stat-pill">
                <strong>120+</strong>
                <span>Senior Doctors</span>
              </div>
              <div className="stat-pill">
                <strong>50,000+</strong>
                <span>Happy Patients</span>
              </div>
              <div className="stat-pill">
                <strong>99.8%</strong>
                <span>Success Rate</span>
              </div>
            </div>
          </div>

          <div className="hero-card-block">
            <div className="hero-featured-card">
              <div className="card-top-alert">
                <span className="emergency-blink">🔴 LIVE 24/7 EMERGENCY READY</span>
                <span className="avg-eta">Ambulance ETA: &lt; 10 Mins</span>
              </div>

              <h3>24/7 Rapid Emergency Response</h3>
              <p className="card-sub">Level-1 Trauma, Cardiac Chest Pain Unit & Advanced Stroke Thrombolysis Care.</p>

              <div className="emergency-quick-grid">
                <div className="em-item">
                  <span className="em-icon">🚑</span>
                  <div>
                    <strong>ICU On Wheels Fleet</strong>
                    <small>Ventilators & Defibrillators</small>
                  </div>
                </div>
                <div className="em-item">
                  <span className="em-icon">🩸</span>
                  <div>
                    <strong>24/7 Blood Bank</strong>
                    <small>All Blood Groups Available</small>
                  </div>
                </div>
                <div className="em-item">
                  <span className="em-icon">💳</span>
                  <div>
                    <strong>100% Cashless TPA</strong>
                    <small>Instant 0-Min Pre-Auth</small>
                  </div>
                </div>
                <div className="em-item">
                  <span className="em-icon">🤖</span>
                  <div>
                    <strong>Robotic & Modular OTs</strong>
                    <small>Ultra-clean HEPA Laminar</small>
                  </div>
                </div>
              </div>

              <div className="hero-card-cta">
                <a href="tel:08022065000" className="hero-phone-cta">
                  📞 Call Hotline: 080-22065000
                </a>
                <button
                  type="button"
                  className="hero-sos-btn"
                  onClick={() => setSosModalOpen(true)}
                >
                  Request Ambulance SOS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          HOSPITAL METRICS BANNER
          ======================================================= */}
      <section className="metrics-ribbon">
        <div className="metric-box">
          <div className="metric-icon">🏥</div>
          <div>
            <h3>500+</h3>
            <p>Inpatient & ICU Beds</p>
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-icon">👨‍⚕️</div>
          <div>
            <h3>120+</h3>
            <p>Distinguished Super-Specialists</p>
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-icon">⏱️</div>
          <div>
            <h3>24/7/365</h3>
            <p>Trauma, Stroke & Cardiac ICUs</p>
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-icon">🏆</div>
          <div>
            <h3>NABH & NABL</h3>
            <p>Highest National Accreditation</p>
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-icon">💳</div>
          <div>
            <h3>40+ TPAs</h3>
            <p>Hassle-Free Cashless Hospitalization</p>
          </div>
        </div>
      </section>

      {/* =======================================================
          24/7 EMERGENCY & BLOOD BANK SHOWCASE
          ======================================================= */}
      <section id="emergency" className="emergency-showcase-section">
        <div className="section-header">
          <div className="section-pill-red">🚨 24/7 CRITICAL CARE & TRAUMA</div>
          <h2>Level-1 Emergency & Trauma Care Centre</h2>
          <p>
            Equipped with round-the-clock emergency physicians, interventional cardiologists, neuro-trauma surgeons, and dedicated life-support ambulances.
          </p>
        </div>

        <div className="emergency-content-grid">
          <div className="emergency-features-card">
            <h3>Emergency Infrastructure & Highlights</h3>
            <ul className="em-features-list">
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Chest Pain & Heart Attack Emergency:</strong>
                  <p>Door-to-Balloon primary angioplasty in &lt; 60 minutes with 24/7 active Cath Lab.</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Comprehensive Acute Stroke Center:</strong>
                  <p>Immediate CT/MRI neuro-imaging & IV Thrombolytic therapy for ischemic stroke.</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Level-III Neonatal & Pediatric ICU (NICU/PICU):</strong>
                  <p>Advanced incubators, micro-ventilators, and round-the-clock pediatric intensivists.</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Advanced Life Support (ALS) Ambulance Fleet:</strong>
                  <p>Equipped with transport ventilators, defibrillators, telemetry, and emergency medical technicians.</p>
                </div>
              </li>
            </ul>

            <div className="emergency-actions-row">
              <a href="tel:08022065000" className="btn-call-emergency">
                🚨 Dial 080-22065000
              </a>
              <button
                type="button"
                className="btn-req-ambulance"
                onClick={() => setSosModalOpen(true)}
              >
                🚑 Dispatch Ambulance
              </button>
            </div>
          </div>

          <div className="blood-bank-card">
            <div className="bb-header">
              <div>
                <h3>24/7 Live Blood Bank Status</h3>
                <p>NABL Accredited Component Separation Unit</p>
              </div>
              <span className="live-status-pill">● LIVE INVENTORY</span>
            </div>

            <div className="blood-units-grid">
              {bloodBankStock.map((b) => (
                <div key={b.group} className="blood-unit-box">
                  <div className="blood-group-badge">{b.group}</div>
                  <div className="blood-count">{b.units} Units</div>
                  <span className="blood-status-tag" style={{ color: b.bg }}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="blood-bank-footer">
              <span>🩸 Platelets, FFP, Packed Red Blood Cells (PRBC) & Cryoprecipitate Available 24/7</span>
              <a href="tel:08022065002" className="bb-phone-link">Blood Helpline: 080-22065002</a>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          CENTERS OF EXCELLENCE & SPECIALITIES
          ======================================================= */}
      <section id="specialities" className="specialities-section">
        <div className="section-header">
          <div className="section-pill">🩺 CLINICAL SPECIALITIES</div>
          <h2>Centers of Excellence & Super-Specialities</h2>
          <p>
            World-class medical expertise supported by state-of-the-art diagnostic and surgical technology.
          </p>

          <div className="speciality-filter-tabs">
            <button
              type="button"
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All Specialities
            </button>
            <button
              type="button"
              className={activeTab === "cardiac" ? "active" : ""}
              onClick={() => setActiveTab("cardiac")}
            >
              Cardiac Sciences
            </button>
            <button
              type="button"
              className={activeTab === "neuro" ? "active" : ""}
              onClick={() => setActiveTab("neuro")}
            >
              Neurosciences
            </button>
            <button
              type="button"
              className={activeTab === "surgical" ? "active" : ""}
              onClick={() => setActiveTab("surgical")}
            >
              Surgical & Ortho
            </button>
            <button
              type="button"
              className={activeTab === "medical" ? "active" : ""}
              onClick={() => setActiveTab("medical")}
            >
              Medical & Oncology
            </button>
            <button
              type="button"
              className={activeTab === "paediatric" ? "active" : ""}
              onClick={() => setActiveTab("paediatric")}
            >
              Mother & Child
            </button>
          </div>
        </div>

        <div className="specialities-grid">
          {filteredSpecialities.map((item) => (
            <div key={item.id} className="speciality-card">
              <div className="spec-card-top">
                <span className="spec-icon">{item.icon}</span>
                <span className="spec-badge">{item.badge}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="spec-meta">
                <span className="doc-count">👨‍⚕️ {item.doctorsCount} Specialists</span>
                <span className="spec-tag">{item.tag}</span>
              </div>
              <button
                type="button"
                className="btn-spec-book"
                onClick={() => {
                  setAppointmentForm((prev) => ({
                    ...prev,
                    department: item.title.split("&")[0].trim(),
                  }));
                  setBookingModalOpen(true);
                }}
              >
                Book Specialist ➔
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =======================================================
          HEALTH CHECKUP PACKAGES ADVERTISEMENT
          ======================================================= */}
      <section id="packages" className="packages-section">
        <div className="section-header">
          <div className="section-pill-gold">⭐ PREVENTIVE HEALTHCARE OFFERS</div>
          <h2>Executive Health Checkup Packages</h2>
          <p>
            Invest in your wellness with comprehensive diagnostic health packages tailored for every life stage.
          </p>
        </div>

        <div className="packages-grid">
          {healthPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`package-card ${pkg.popular ? "featured-package" : ""}`}
            >
              {pkg.popular && <div className="popular-ribbon">MOST POPULAR</div>}

              <div className="pkg-header">
                <h3>{pkg.name}</h3>
                <span className="pkg-ideal">{pkg.idealFor}</span>
              </div>

              <div className="pkg-pricing">
                <div className="price-box">
                  <span className="current-price">{pkg.offerPrice}</span>
                  <span className="original-price">{pkg.originalPrice}</span>
                </div>
                <span className="discount-tag">{pkg.discount}</span>
              </div>

              <div className="pkg-tests-badge">
                🔬 {pkg.testsCount}
              </div>

              <ul className="pkg-highlights">
                {pkg.highlights.map((h, idx) => (
                  <li key={idx}>
                    <span className="pkg-check">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="btn-book-pkg"
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
          INSURANCE & TPA CASHLESS TIE-UPS
          ======================================================= */}
      <section id="insurance" className="insurance-showcase-section">
        <div className="insurance-inner">
          <div className="insurance-text-col">
            <div className="section-pill">💳 CASHLESS HOSPITALIZATION</div>
            <h2>40+ Empanelled TPA & Insurance Tie-Ups</h2>
            <p>
              Experience seamless, stress-free admissions and discharge with our 24/7 dedicated Insurance & Cashless TPA Helpdesk.
            </p>

            <div className="tpa-points">
              <div className="tpa-point">
                <span className="tpa-icon">⚡</span>
                <div>
                  <strong>0-Minute Pre-Authorization Assistance</strong>
                  <p>Dedicated insurance coordinators process claims on arrival.</p>
                </div>
              </div>
              <div className="tpa-point">
                <span className="tpa-icon">🏛️</span>
                <div>
                  <strong>Government Health Schemes Supported</strong>
                  <p>Ayushman Bharat (PM-JAY), Chief Minister Comprehensive Health Scheme, ECHS, CGHS & ESIC.</p>
                </div>
              </div>
              <div className="tpa-point">
                <span className="tpa-icon">🛡️</span>
                <div>
                  <strong>Corporate & PSU Tie-Ups</strong>
                  <p>Cashless coverage for all major multinational corporations, banks, and public sectors.</p>
                </div>
              </div>
            </div>

            <div className="tpa-cta-box">
              <span>Have an insurance query? Call our 24/7 TPA Desk:</span>
              <strong>📞 080-22065005 / tpa@niarogiyam.org</strong>
            </div>
          </div>

          <div className="insurance-partners-col">
            <h3>Our Empanelled TPA & Insurance Partners</h3>
            <div className="tpa-logos-grid">
              <div className="tpa-badge">Star Health</div>
              <div className="tpa-badge">HDFC ERGO</div>
              <div className="tpa-badge">ICICI Lombard</div>
              <div className="tpa-badge">Care Health</div>
              <div className="tpa-badge">Medi Assist</div>
              <div className="tpa-badge">Paramount TPA</div>
              <div className="tpa-badge">Vidal Health</div>
              <div className="tpa-badge">MDIndia TPA</div>
              <div className="tpa-badge">Bajaj Allianz</div>
              <div className="tpa-badge">Niva Bupa</div>
              <div className="tpa-badge">Tata AIG</div>
              <div className="tpa-badge">Ayushman Bharat</div>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          PATIENT & VISITOR GUIDE / AMENITIES
          ======================================================= */}
      <section id="guide" className="guide-section">
        <div className="section-header">
          <div className="section-pill">ℹ️ VISITOR AMENITIES & TARIFFS</div>
          <h2>Patient & Visitor Experience</h2>
          <p>
            Designed with compassion and comfort to ensure every patient and family member feels cared for.
          </p>
        </div>

        <div className="guide-grid">
          <div className="guide-card">
            <span className="guide-icon">🕒</span>
            <h3>Visiting Hours & Guidelines</h3>
            <p><strong>General Wards:</strong> 04:30 PM - 07:00 PM</p>
            <p><strong>ICU / Critical Care:</strong> 11:00 AM - 12:00 PM & 05:00 PM - 06:00 PM</p>
            <small>One visitor pass per patient to maintain hygiene and infection control.</small>
          </div>

          <div className="guide-card">
            <span className="guide-icon">🛏️</span>
            <h3>Room Types & Accommodation</h3>
            <p><strong>General Ward:</strong> Multi-bed with nurse station</p>
            <p><strong>Twin Sharing:</strong> Semi-private with AC</p>
            <p><strong>Single Deluxe:</strong> Private room with attendant sofa</p>
            <p><strong>VIP Presidential Suite:</strong> Luxurious 2-room suite</p>
          </div>

          <div className="guide-card">
            <span className="guide-icon">💊</span>
            <h3>24/7 Pharmacy & NABL Lab</h3>
            <p><strong>In-House Pharmacy:</strong> 100% genuine medicines round-the-clock</p>
            <p><strong>Diagnostic Lab:</strong> Fully automated pathology, biochemistry & molecular testing with online report delivery.</p>
          </div>

          <div className="guide-card">
            <span className="guide-icon">🍽️</span>
            <h3>Hospital Amenities</h3>
            <p>• Hygienic multi-cuisine Cafeteria & Nutrition Bar</p>
            <p>• Free high-speed Wi-Fi across campus</p>
            <p>• Multi-level parking & 24/7 Wheelchair Assistance</p>
            <p>• Multi-faith prayer room & ATM facilities</p>
          </div>
        </div>
      </section>

      {/* =======================================================
          DISTINGUISHED DOCTORS DIRECTORY
          ======================================================= */}
      <section id="doctors" className="doctors-section">
        <div className="section-header">
          <div className="section-pill">👨‍⚕️ EXPERT MEDICAL FACULTY</div>
          <h2>Meet Our Senior Medical Specialists</h2>
          <p>
            Renowned clinicians and surgeons with decades of global experience and patient dedication.
          </p>
        </div>

        <div className="doctors-grid">
          {featuredDoctors.map((doc, idx) => (
            <div key={idx} className="doctor-profile-card">
              <div className="doc-avatar-box">
                <span className="doc-emoji-avatar">{doc.avatar}</span>
                <span className="doc-exp-badge">{doc.experience}</span>
              </div>

              <h3>{doc.name}</h3>
              <span className="doc-department">{doc.dept}</span>
              <p className="doc-degrees">{doc.qualification}</p>

              <div className="doc-schedule-box">
                <span>🕒 {doc.schedule}</span>
                <span className="doc-rating">{doc.rating}</span>
              </div>

              <button
                type="button"
                className="btn-doc-appointment"
                onClick={() => {
                  setAppointmentForm((prev) => ({
                    ...prev,
                    doctor: doc.name,
                    department: doc.dept.split("&")[0].trim(),
                  }));
                  setBookingModalOpen(true);
                }}
              >
                Book Appointment With Doctor
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =======================================================
          WHY CHOOSE NI AROGIYAM
          ======================================================= */}
      <section className="why-choose-section">
        <div className="section-header">
          <div className="section-pill">⭐ THE NI AROGIYAM ADVANTAGE</div>
          <h2>Why Thousands Trust NI AROGIYAM Hospital</h2>
        </div>

        <div className="advantage-grid">
          <div className="adv-item">
            <div className="adv-num">01</div>
            <h4>4th Gen Robotic Surgery</h4>
            <p>Minimally invasive precision surgeries ensuring minimal blood loss, minimal scarring, and rapid recovery.</p>
          </div>
          <div className="adv-item">
            <div className="adv-num">02</div>
            <h4>Zero-Infection Modular OTs</h4>
            <p>12 ultra-modern modular operation theatres with Laminar Airflow & positive pressure HEPA filtration.</p>
          </div>
          <div className="adv-item">
            <div className="adv-num">03</div>
            <h4>Advanced 3.0 Tesla MRI & CT</h4>
            <p>Ultra-fast, ultra-low radiation diagnostic imaging with artificial intelligence assisted scans.</p>
          </div>
          <div className="adv-item">
            <div className="adv-num">04</div>
            <h4>Compassionate Patient Care</h4>
            <p>Patient-first philosophy with 1:1 dedicated nursing care in all intensive care units.</p>
          </div>
        </div>
      </section>

      {/* =======================================================
          APPOINTMENT CTA BANNER
          ======================================================= */}
      <section className="appointment-cta-banner">
        <div className="cta-banner-content">
          <div className="cta-text">
            <h2>Need Immediate Medical Consultation?</h2>
            <p>Our senior specialists and emergency doctors are available 24/7. Book your appointment online or call our helpline.</p>
          </div>
          <div className="cta-buttons">
            <button
              type="button"
              className="btn-banner-book"
              onClick={() => setBookingModalOpen(true)}
            >
              📅 Schedule Appointment Online
            </button>
            <a href="tel:08022065000" className="btn-banner-call">
              📞 Call 080-22065000
            </a>
          </div>
        </div>
      </section>

      {/* =======================================================
          CONTACT & LOCATION FOOTER
          ======================================================= */}
      <footer id="contact" className="landing-footer">
        <div className="footer-main-grid">
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <span className="brand-logo-small">N</span>
              <span className="brand-name-footer">NI AROGIYAM</span>
            </div>
            <p className="footer-desc">
              Premier 500-Bed Multi-Super-Speciality Hospital and Research Centre. Committed to affordable, world-class healthcare.
            </p>
            <div className="footer-accreditation">
              <span>★ NABH Accredited Hospital</span>
              <span>★ NABL Accredited Diagnostics</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#specialities">Clinical Specialities</a></li>
              <li><a href="#emergency">Emergency & Blood Bank</a></li>
              <li><a href="#packages">Health Packages</a></li>
              <li><a href="#insurance">Insurance & TPA</a></li>
              <li><a href="#guide">Patient Guide & Tariffs</a></li>
              <li><a href="#doctors">Find a Doctor</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>24/7 Helplines</h4>
            <ul className="footer-contacts">
              <li>🚨 <strong>Emergency / Trauma:</strong> 080-22065000</li>
              <li>🚑 <strong>Ambulance Dispatch:</strong> 080-22065001</li>
              <li>🩸 <strong>Blood Bank Desk:</strong> 080-22065002</li>
              <li>📅 <strong>Appointments:</strong> 080-22065003</li>
              <li>💳 <strong>Insurance & TPA:</strong> 080-22065005</li>
              <li>✉️ <strong>Email:</strong> contact@niarogiyam.org</li>
            </ul>
          </div>

          <div className="footer-col staff-portal-col">
            <h4>Hospital Staff & Management</h4>
            <p>Restricted access for Doctors, Nurses, Wardens & System Administrators.</p>
            <Link to="/login" className="btn-footer-portal-login">
              🔐 Staff & Doctor Portal Login
            </Link>
            <p className="footer-address">
              📍 <strong>Hospital Address:</strong><br />
              NI AROGIYAM Healthcare Complex, Sarjapur-Koramangala Ring Road, Bengaluru, Karnataka - 560034
            </p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} NI AROGIYAM Hospital Management System. All Rights Reserved.</p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Patient Rights & Charter</a>
            <a href="#nabh">Quality Standards</a>
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
                  📱 A confirmation SMS & WhatsApp reminder with appointment token has been sent to <strong>{appointmentForm.phoneNumber}</strong>.
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
                    <label>Mobile Number (For SMS OTP & Token) *</label>
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
                    <label>Department / Speciality *</label>
                    <select
                      value={appointmentForm.department}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, department: e.target.value })
                      }
                    >
                      <option value="Cardiology">Cardiology & Heart Care</option>
                      <option value="Neurology">Neurology & Stroke Care</option>
                      <option value="Orthopaedics">Orthopaedics & Joint Replacement</option>
                      <option value="Oncology">Medical & Surgical Oncology</option>
                      <option value="Nephrology">Nephrology & Renal Care</option>
                      <option value="Paediatrics">Paediatrics & Child Care</option>
                      <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                      <option value="Pulmonology">Pulmonology & Chest Medicine</option>
                      <option value="Gastroenterology">Gastroenterology & GI Surgery</option>
                      <option value="General Medicine">General Internal Medicine</option>
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

                <div className="form-field">
                  <label>Symptoms / Medical Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe symptoms or past medical condition..."
                    value={appointmentForm.notes}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, notes: e.target.value })
                    }
                  />
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
                    Confirm & Book Appointment ➔
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
                <p>
                  Your booking for <strong>{selectedPackage?.name}</strong> at discounted price <strong>{selectedPackage?.offerPrice}</strong> is confirmed.
                </p>
                <p className="confirmation-sms-notice">
                  📱 Instructions for 10-12 hours fasting and lab preparation have been dispatched to your phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="modal-form">
                <div className="pkg-summary-banner">
                  <div>
                    <strong>{selectedPackage?.name}</strong>
                    <span>{selectedPackage?.testsCount}</span>
                  </div>
                  <div className="pkg-rate-highlight">
                    <span className="rate-num">{selectedPackage?.offerPrice}</span>
                    <span className="rate-orig">{selectedPackage?.originalPrice}</span>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meera S."
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
                      placeholder="e.g. 9840123456"
                      value={appointmentForm.phoneNumber}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-2">
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
                  <div className="form-field">
                    <label>Fasting Blood Sample Preference *</label>
                    <select
                      value={appointmentForm.preferredTime}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, preferredTime: e.target.value })
                      }
                    >
                      <option value="Early Morning (07:00 AM - 09:00 AM)">Early Morning (07:00 AM - 09:00 AM - Recommended)</option>
                      <option value="Morning (09:00 AM - 11:00 AM)">Morning (09:00 AM - 11:00 AM)</option>
                    </select>
                  </div>
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
                    Confirm Health Package Booking
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
                <p>
                  Emergency Unit <strong>AMB-101 (ICU On Wheels)</strong> has been dispatched to <strong>{ambulanceForm.pickupLocation}</strong>.
                </p>
                <div className="emergency-contact-highlight">
                  <span>Emergency Coordinator:</span>
                  <strong>Dr. Murugan / Paramedic Team: 98401-11223</strong>
                  <small>ETA: Under 8 Minutes. Please keep phone reachable.</small>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAmbulanceSubmit} className="modal-form">
                <div className="emergency-alert-callout">
                  <span>⚠️ For extreme life-threatening emergencies, call directly:</span>
                  <a href="tel:08022065000" className="alert-direct-phone">080-22065000 / 108</a>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Caller / Patient Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suresh Kumar"
                      value={ambulanceForm.callerName}
                      onChange={(e) =>
                        setAmbulanceForm({ ...ambulanceForm, callerName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Contact Phone (Active Number) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9840112233"
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
                    placeholder="Building name, street, nearby landmark, city area..."
                    value={ambulanceForm.pickupLocation}
                    onChange={(e) =>
                      setAmbulanceForm({ ...ambulanceForm, pickupLocation: e.target.value })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Patient Emergency Condition *</label>
                  <select
                    value={ambulanceForm.patientCondition}
                    onChange={(e) =>
                      setAmbulanceForm({ ...ambulanceForm, patientCondition: e.target.value })
                    }
                  >
                    <option value="Cardiac / Chest Pain Emergency">Cardiac / Severe Chest Pain Emergency</option>
                    <option value="Acute Stroke / Paralysis / Slurred Speech">Acute Stroke / Paralysis / Slurred Speech</option>
                    <option value="Road Accident / Severe Trauma / Fracture">Road Accident / Severe Trauma / Fracture</option>
                    <option value="Severe Breathing Difficulty / Asthma Attack">Severe Breathing Difficulty / Asthma Attack</option>
                    <option value="Maternity / Emergency Labor">Maternity / Emergency Labor</option>
                    <option value="Unconscious / Diabetic Coma / Poisoning">Unconscious / Diabetic Coma / Poisoning</option>
                    <option value="General Critical Patient Transfer">General Critical Patient Transfer</option>
                  </select>
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
                    🚨 Dispatch Ambulance Now (Immediate)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          FLOATING QUICK ACTION BUTTON (BOTTOM-RIGHT)
          ======================================================= */}
      <div className="landing-floating-actions">
        <button
          type="button"
          className="float-btn float-sos"
          onClick={() => setSosModalOpen(true)}
          title="24/7 Emergency Ambulance"
        >
          🚨 SOS
        </button>
        <button
          type="button"
          className="float-btn float-book"
          onClick={() => setBookingModalOpen(true)}
          title="Book Appointment"
        >
          📅 Book
        </button>
      </div>
    </div>
  );
}
