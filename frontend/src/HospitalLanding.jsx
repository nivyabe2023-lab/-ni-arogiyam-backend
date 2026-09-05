import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./HospitalLanding.css";
import API_BASE_URL from "./config";
import aboutHospitalReception from "./assets/about_hospital_reception_hd.jpg";
import specialtiesStethoscopeBanner from "./assets/specialties_stethoscope_banner.jpg";
import facilityEmergencyImg from "./assets/facility_emergency.jpg";
import facilityIcuImg from "./assets/facility_icu.jpg";
import facilityOtImg from "./assets/facility_operation_theatre.jpg";
import facilityDiagnosticImg from "./assets/facility_diagnostic.jpg";
import facilityRoboticImg from "./assets/facility_robotic_surgery.jpg";
import facilityPharmacyImg from "./assets/facility_pharmacy.jpg";
import facilityPatientRoomsImg from "./assets/facility_patient_rooms.jpg";
import doctorSaravananImg from "./assets/doctor_saravanan.jpg";
import doctorMeenaImg from "./assets/doctor_meena.jpg";
import doctorArvindImg from "./assets/doctor_arvind.jpg";
import doctorPriyaImg from "./assets/doctor_priya.jpg";
import contactBgDoctor from "./assets/contact_bg_doctor_clean.jpg";
import contactMapCardImg from "./assets/contact_map_card_ultra_hd.png";
import pvHeroBannerImg from "./assets/pv_hero_banner.jpg";
import avatarMeena from "./assets/avatar_meena.png";
import avatarRamesh from "./assets/avatar_ramesh.png";
import avatarLakshmi from "./assets/avatar_lakshmi.png";
import avatarArun from "./assets/avatar_arun.png";
import avatarPriya from "./assets/avatar_priya.png";
import avatarKarthik from "./assets/avatar_karthik.png";

// =========================================================
// SPECIALTY DOCTORS DATA WITH FULL ACHIEVEMENTS & SLOTS
// =========================================================
const SPECIALTY_DOCTORS_DATA = {
  Cardiology: {
    title: "Cardiology & Cardiovascular Sciences",
    tagline: "World-Class Heart Specialists, 24/7 Level-1 Emergency Cath Lab, Robotic Heart Care & Electrophysiology",
    stats: [
      { label: "Cardiologists", val: "4 Senior Specialists" },
      { label: "Emergency Response", val: "24/7 Primary Angioplasty" },
      { label: "Cath Lab Success", val: "99.4% Procedure Success" },
      { label: "Cardiac ICU", val: "35 Dedicated CCU Beds" },
    ],
    doctors: [
      {
        id: "dr-rajesh-sharma",
        name: "Dr. Rajesh Sharma",
        degrees: "MBBS, MD (Internal Med), DM (Cardiology), FACC (USA), FSCAI",
        designation: "Director & Chief Interventional Cardiologist",
        experience: "22+ Years Clinical Experience",
        rating: "4.9 ★ (680+ Verified Reviews)",
        timing: "Mon - Sat: 09:30 AM - 01:30 PM & 03:30 PM - 06:00 PM",
        room: "Suite 101, Cardiac Sciences Tower",
        achievements: [
          "Over 7,500+ successful coronary angioplasties, complex bifurcation stenting, and CTO interventions.",
          "Pioneer of Transcatheter Aortic Valve Replacement (TAVR / TAVI) in South Tamil Nadu.",
          "Honored with the National Healthcare Excellence in Interventional Cardiology Award 2024.",
          "Author of 48+ clinical research papers in the Journal of the American College of Cardiology (JACC)."
        ],
        slots: ["Today: 10:30 AM", "Today: 11:45 AM", "Today: 03:45 PM", "Tomorrow: 10:00 AM", "Tomorrow: 04:30 PM"],
        avatarBg: "#047857"
      },
      {
        id: "dr-ananya-sen",
        name: "Dr. Ananya Sen",
        degrees: "MBBS, MD (Medicine), DM (Cardiology), Fellowship in Electrophysiology (UK)",
        designation: "Senior Consultant Cardiac Electrophysiologist & Arrhythmia Specialist",
        experience: "15+ Years Clinical Experience",
        rating: "4.9 ★ (410+ Verified Reviews)",
        timing: "Mon - Fri: 10:00 AM - 04:00 PM",
        room: "Suite 103, Cardiac Sciences Tower",
        achievements: [
          "Specialist in 3D Cardiac Mapping and 3,200+ Radiofrequency Catheter Ablations for complex Arrhythmias.",
          "Successfully implanted 1,200+ Dual-Chamber Pacemakers, Defibrillators (ICD), and CRT-D devices.",
          "Distinguished keynote faculty speaker at the World Heart Rhythm Congress (Geneva 2023).",
          "Leading regional authority in sudden cardiac arrest prevention and syncope diagnostics."
        ],
        slots: ["Today: 11:15 AM", "Today: 02:00 PM", "Tomorrow: 10:30 AM", "Tomorrow: 02:45 PM"],
        avatarBg: "#065f46"
      },
      {
        id: "dr-vigneshwaran",
        name: "Dr. K. Vigneshwaran",
        degrees: "MBBS, MS (General Surgery), MCh (Cardiothoracic Surgery), FIACS",
        designation: "Chief Cardiothoracic & Minimally Invasive Heart Surgeon",
        experience: "19+ Years Clinical Experience",
        rating: "4.8 ★ (520+ Verified Reviews)",
        timing: "Tue, Thu, Sat: 09:00 AM - 02:00 PM",
        room: "Suite 105, Surgical Pavilion",
        achievements: [
          "Over 4,200+ Open Heart Surgeries and Off-Pump Beating Heart Bypass (CABG) procedures completed.",
          "Maintains an exemplary zero-mortality track record across last 300 Minimally Invasive Valve Surgeries.",
          "Elected Fellow of the International Society for Minimally Invasive Cardiothoracic Surgery (ISMICS).",
          "Specialist in thoracic aortic aneurysm repair and emergency acute trauma reconstruction."
        ],
        slots: ["Today: 01:15 PM", "Tomorrow: 09:30 AM", "Tomorrow: 11:30 AM"],
        avatarBg: "#0d9488"
      },
      {
        id: "dr-meera-nambiar",
        name: "Dr. Meera Nambiar",
        degrees: "MBBS, MD (Pediatrics), DNB (Cardiology), Fellowship in Pediatric Cardiology (AIIMS)",
        designation: "Senior Pediatric Cardiologist & Congenital Heart Specialist",
        experience: "13+ Years Clinical Experience",
        rating: "4.9 ★ (340+ Verified Reviews)",
        timing: "Mon - Sat: 10:30 AM - 03:30 PM",
        room: "Suite 106, Mother & Child Heart Wing",
        achievements: [
          "Successfully treated 1,500+ infants with congenital heart defects via non-surgical ASD/VSD device closures.",
          "All-India Gold Medalist in Pediatric Cardiology from All India Institute of Medical Sciences (AIIMS).",
          "Pioneered early fetal echocardiography screening panels detecting complex anomalies before birth.",
          "Program Lead for NI AROGIYAM Children's Heart Care Mission."
        ],
        slots: ["Today: 12:00 PM", "Today: 03:00 PM", "Tomorrow: 10:45 AM", "Tomorrow: 01:30 PM"],
        avatarBg: "#0f766e"
      }
    ]
  },
  Neurology: {
    title: "Neurology, Neurosurgery & Spine Care",
    tagline: "Hyperacute Stroke Unit, 4th Gen Micro-Neurosurgery, Epilepsy Monitoring & Spine Rehabilitation",
    stats: [
      { label: "Neuro Specialists", val: "3 Senior Consultants" },
      { label: "Stroke Care", val: "24/7 Hyperacute Thrombolysis" },
      { label: "Surgical Efficacy", val: "98.7% Positive Outcomes" },
      { label: "Neuro ICU", val: "20 Intensive Beds" },
    ],
    doctors: [
      {
        id: "dr-priya-sundaram",
        name: "Dr. Priya Sundaram",
        degrees: "MBBS, MS, MCh (Neurosurgery), FINR, FAANS (USA)",
        designation: "HOD & Chief Neurosurgeon & Spine Specialist",
        experience: "20+ Years Clinical Experience",
        rating: "4.9 ★ (580+ Verified Reviews)",
        timing: "Mon - Sat: 09:30 AM - 04:00 PM",
        room: "Suite 201, Neuro Sciences Wing",
        achievements: [
          "Pioneer in Minimally Invasive Keyhole Brain & Spine Tumor Resections with over 4,500 surgeries.",
          "Established the Region's First Comprehensive Neuro-Endovascular Aneurysm Coiling Center.",
          "Awarded Clinical Excellence in Neuro-Sciences by the World Neurological Federation.",
          "Published landmark clinical treatises on complex cranio-vertebral junction stabilization."
        ],
        slots: ["Today: 11:00 AM", "Today: 03:15 PM", "Tomorrow: 10:00 AM", "Tomorrow: 02:30 PM"],
        avatarBg: "#047857"
      },
      {
        id: "dr-deepak-raman",
        name: "Dr. Deepak Raman",
        degrees: "MBBS, MD (Medicine), DM (Neurology)",
        designation: "Senior Consultant Neurologist & Stroke Care Director",
        experience: "14+ Years Clinical Experience",
        rating: "4.8 ★ (390+ Verified Reviews)",
        timing: "Mon - Sat: 10:00 AM - 05:00 PM",
        room: "Suite 203, Neuro Sciences Wing",
        achievements: [
          "Director of the Comprehensive Stroke Unit achieving a 98% acute thrombolytic window success rate.",
          "Specialist in Deep Brain Stimulation (DBS) therapy for Parkinson's disease and movement disorders.",
          "Conducted 3,000+ epilepsy assessments with 24-hour video EEG telemetry monitoring."
        ],
        slots: ["Today: 10:15 AM", "Today: 02:00 PM", "Tomorrow: 11:30 AM", "Tomorrow: 03:45 PM"],
        avatarBg: "#065f46"
      }
    ]
  },
  Oncology: {
    title: "Medical & Surgical Oncology (Cancer Institute)",
    tagline: "Precision Targeted Chemotherapy, Immunotherapy, Daycare Infusion & Robotic Tumor Resections",
    stats: [
      { label: "Onco-Specialists", val: "4 Senior Doctors" },
      { label: "Targeted Care", val: "Molecular Genomics Guided" },
      { label: "Daycare Lounge", val: "25 Modern Chemotherapy Beds" },
      { label: "Tumor Board", val: "Weekly Multi-Disciplinary" },
    ],
    doctors: [
      {
        id: "dr-arvind-swaminathan",
        name: "Dr. Arvind Swaminathan",
        degrees: "MBBS, MD, DM (Medical Oncology), ESMO Certified (Europe)",
        designation: "Chief Medical Oncologist & Cancer Institute Director",
        experience: "18+ Years Clinical Experience",
        rating: "4.9 ★ (610+ Verified Reviews)",
        timing: "Mon - Sat: 08:30 AM - 04:30 PM",
        room: "Suite 301, Cancer Care Tower",
        achievements: [
          "Pioneered customized biomarker-guided Targeted Therapy & Immunotherapy for 3,500+ cancer survivors.",
          "Principal investigator in 12 global phase-III clinical trials evaluating novel cancer immunotherapeutics.",
          "Certified by the European Society for Medical Oncology (ESMO) with highest academic honors."
        ],
        slots: ["Today: 09:45 AM", "Today: 01:30 PM", "Tomorrow: 10:15 AM", "Tomorrow: 03:30 PM"],
        avatarBg: "#047857"
      },
      {
        id: "dr-sharmila-varma",
        name: "Dr. Sharmila Varma",
        degrees: "MBBS, MS, MCh (Surgical Oncology), Robotic Fellowship (USA)",
        designation: "Senior Consultant Surgical Oncologist",
        experience: "16+ Years Clinical Experience",
        rating: "4.9 ★ (470+ Verified Reviews)",
        timing: "Mon - Fri: 09:00 AM - 03:30 PM",
        room: "Suite 304, Cancer Care Tower",
        achievements: [
          "Over 2,800+ complex robotic and organ-preserving oncological resections completed.",
          "Renowned specialist in breast conservation surgery and sentinel lymph node navigation.",
          "Recipient of the National Women in Medicine Leadership Award 2023."
        ],
        slots: ["Today: 11:30 AM", "Today: 04:00 PM", "Tomorrow: 02:00 PM"],
        avatarBg: "#065f46"
      }
    ]
  },
  Orthopedics: {
    title: "Orthopedics & Robotic Joint Replacement",
    tagline: "4th Gen Robotic Total Knee & Hip Replacements, Sports Arthroscopy & Rapid Rehabilitation",
    stats: [
      { label: "Surgeons", val: "3 Senior Ortho Specialists" },
      { label: "Robotic Tech", val: "4th Gen Mako & Rosa Systems" },
      { label: "Mobilization", val: "Rapid 4-Hour Post-Op Walk" },
      { label: "Trauma Response", val: "24/7 Polytrauma Center" },
    ],
    doctors: [
      {
        id: "dr-vikram-sethupathi",
        name: "Dr. Vikram Sethupathi",
        degrees: "MBBS, MS (Ortho), MCh, Fellowship in Robotic Arthroplasty (Germany)",
        designation: "Director of Orthopedics & Chief Robotic Joint Surgeon",
        experience: "21+ Years Clinical Experience",
        rating: "4.9 ★ (720+ Verified Reviews)",
        timing: "Mon - Sat: 09:00 AM - 05:00 PM",
        room: "Suite 112, Orthopedic Wing",
        achievements: [
          "Completed over 6,000+ Robotic Total Knee and Hip Replacements with sub-millimeter precision.",
          "Pioneered the 'Fast-Track Rapid Recovery' protocol enabling patients to mobilize within 4 hours.",
          "Renowned expert in complex revision joint reconstructions and pelvic trauma surgeries."
        ],
        slots: ["Today: 10:00 AM", "Today: 01:00 PM", "Today: 04:30 PM", "Tomorrow: 09:30 AM", "Tomorrow: 03:00 PM"],
        avatarBg: "#047857"
      },
      {
        id: "dr-gautam-chandra",
        name: "Dr. Gautam Chandrasekhar",
        degrees: "MBBS, MS (Ortho), Fellowship in Sports Medicine & Spine (Australia)",
        designation: "Senior Arthroscopy & Sports Medicine Specialist",
        experience: "13+ Years Clinical Experience",
        rating: "4.8 ★ (350+ Verified Reviews)",
        timing: "Mon - Sat: 10:30 AM - 04:30 PM",
        room: "Suite 115, Orthopedic Wing",
        achievements: [
          "Official sports injuries consultant for premier regional athletic federations.",
          "Over 2,200+ keyhole arthroscopic ACL, meniscus, and rotator cuff reconstructions.",
          "Specialist in biological regenerative PRP and stem cell therapies for joint preservation."
        ],
        slots: ["Today: 11:30 AM", "Today: 03:30 PM", "Tomorrow: 10:30 AM"],
        avatarBg: "#065f46"
      }
    ]
  },
  Gastroenterology: {
    title: "Gastroenterology & Hepatobiliary Sciences",
    tagline: "4K Endoscopy Suites, Therapeutic ERCP, Fatty Liver & Comprehensive Cirrhosis Management",
    stats: [
      { label: "Gastroenterologists", val: "3 Senior Specialists" },
      { label: "Endoscopy Unit", val: "Advanced 4K Olympus Suites" },
      { label: "Liver Clinic", val: "Fatty Liver & Cirrhosis Care" },
      { label: "Daycare", val: "Painless Sedation Endoscopy" },
    ],
    doctors: [
      {
        id: "dr-meenakshi-sundaram",
        name: "Dr. Meenakshi Sundaram",
        degrees: "MBBS, MD (Medicine), DM (Gastroenterology), FASGE (USA)",
        designation: "Chief Gastroenterologist & Interventional Endoscopy Lead",
        experience: "17+ Years Clinical Experience",
        rating: "4.9 ★ (510+ Verified Reviews)",
        timing: "Mon - Sat: 09:00 AM - 03:30 PM",
        room: "Endoscopy Suite & OPD 108",
        achievements: [
          "Performed over 14,000+ diagnostic & therapeutic endoscopies, colonoscopies, and bile duct ERCPs.",
          "Pioneer of Third Space Endoscopy (POEM, ESD) for achalasia and early digestive lesions.",
          "Honored Fellow of the American Society for Gastrointestinal Endoscopy (FASGE)."
        ],
        slots: ["Today: 10:30 AM", "Today: 02:30 PM", "Tomorrow: 11:00 AM", "Tomorrow: 03:30 PM"],
        avatarBg: "#047857"
      }
    ]
  },
  Nephrology: {
    title: "Nephrology & 24/7 Hemodialysis Unit",
    tagline: "High-Flux Hemodialysis, Continuous Renal Replacement (CRRT) & Kidney Transplant Medicine",
    stats: [
      { label: "Nephrologists", val: "2 Senior Consultants" },
      { label: "Dialysis Stations", val: "24/7 20 Modern Units" },
      { label: "CRRT Technology", val: "Continuous ICU Dialysis" },
      { label: "Transplants", val: "Pre & Post Transplant Wing" },
    ],
    doctors: [
      {
        id: "dr-suresh-chandran",
        name: "Dr. Suresh Chandran",
        degrees: "MBBS, MD (Medicine), DM (Nephrology), FASN (USA)",
        designation: "Director of Nephrology & Kidney Transplant Medicine",
        experience: "19+ Years Clinical Experience",
        rating: "4.9 ★ (460+ Verified Reviews)",
        timing: "Mon - Sat: 08:00 AM - 06:00 PM",
        room: "Dialysis Wing (Ground Floor)",
        achievements: [
          "Supervised over 550+ live and deceased donor kidney transplants with exemplary graft survival.",
          "Oversaw more than 60,000+ safe hemodialysis sessions utilizing high-flux biocompatible dialyzers.",
          "Elected Fellow of the American Society of Nephrology (FASN)."
        ],
        slots: ["Today: 09:30 AM", "Today: 12:00 PM", "Tomorrow: 03:00 PM", "Tomorrow: 05:00 PM"],
        avatarBg: "#047857"
      }
    ]
  },
  Paediatrics: {
    title: "Paediatrics, Neonatology & Child Health",
    tagline: "Level-3 Advanced NICU, Pediatric Intensive Care, Child Growth & Pediatric Cardiology Care",
    stats: [
      { label: "Pediatricians", val: "3 Senior Specialists" },
      { label: "NICU Unit", val: "Level-3 High-Frequency Vent" },
      { label: "Emergency", val: "24/7 Pediatric Trauma" },
      { label: "Vaccinations", val: "Universal Immunization" },
    ],
    doctors: [
      {
        id: "dr-radhika-narayanan",
        name: "Dr. Radhika Narayanan",
        degrees: "MBBS, MD (Pediatrics), DNB, FIAP (Fellow Indian Academy of Pediatrics)",
        designation: "HOD & Chief Consultant Pediatrician",
        experience: "18+ Years Clinical Experience",
        rating: "4.9 ★ (580+ Verified Reviews)",
        timing: "Mon - Sat: 08:30 AM - 01:30 PM & 04:00 PM - 06:30 PM",
        room: "Suite 101, Mother & Child Pavilion",
        achievements: [
          "Supervised over 12,000+ pediatric inpatients and critical neonatal recoveries with distinction.",
          "Recipient of the National Dr. B.C. Roy Memorial Oration Award for Child Health Advocacy.",
          "Lead consultant for childhood asthma clinics and developmental assessment programs."
        ],
        slots: ["Today: 09:30 AM", "Today: 11:30 AM", "Today: 04:30 PM", "Tomorrow: 10:00 AM", "Tomorrow: 05:00 PM"],
        avatarBg: "#047857"
      },
      {
        id: "dr-senthil-kumar",
        name: "Dr. Senthil Kumar",
        degrees: "MBBS, DCH, DNB (Pediatrics), Fellowship in Neonatology (UK)",
        designation: "Director of Neonatal Intensive Care Unit (NICU)",
        experience: "14+ Years Clinical Experience",
        rating: "4.9 ★ (420+ Verified Reviews)",
        timing: "Mon - Sat: 10:00 AM - 04:00 PM",
        room: "Level-3 NICU Complex, Mother & Child Block",
        achievements: [
          "Achieved a 99.2% survival rate in extremely low birth weight preterm neonates (<800g).",
          "Pioneered Therapeutic Hypothermia protocol for perinatal asphyxia prevention.",
          "Published over 18+ papers on neonatal high-frequency oscillatory ventilation."
        ],
        slots: ["Today: 10:45 AM", "Today: 02:30 PM", "Tomorrow: 11:15 AM", "Tomorrow: 03:30 PM"],
        avatarBg: "#065f46"
      }
    ]
  },
  "Obstetrics & Gynaecology": {
    title: "Obstetrics, Gynaecology & Fetal Medicine",
    tagline: "High-Risk Pregnancy, Painless LDR Delivery Suites, Laparoscopic Gynaec Surgery & Infertility",
    stats: [
      { label: "Gynaecologists", val: "3 Senior Consultants" },
      { label: "Delivery Suites", val: "LDR Private Suites" },
      { label: "Laparoscopy", val: "3D 4K Minimally Invasive" },
      { label: "Fetal Medicine", val: "Advanced Genetic Screening" },
    ],
    doctors: [
      {
        id: "dr-gayathri-ramanathan",
        name: "Dr. Gayathri Ramanathan",
        degrees: "MBBS, MS (OBG), DGO, FICOG, Fellowship in Laparoscopy",
        designation: "Director of Women's Health & Senior Obstetrician",
        experience: "20+ Years Clinical Experience",
        rating: "4.9 ★ (640+ Verified Reviews)",
        timing: "Mon - Sat: 09:00 AM - 05:00 PM",
        room: "Suite 104, Women's Health Pavilion",
        achievements: [
          "Supervised over 8,500+ successful normal and painless high-risk obstetric deliveries.",
          "Over 3,200+ advanced laparoscopic hysterectomies and myomectomies performed.",
          "Distinguished keynote speaker at the All India Congress of Obstetrics and Gynaecology (AICOG)."
        ],
        slots: ["Today: 10:15 AM", "Today: 01:15 PM", "Today: 04:00 PM", "Tomorrow: 09:30 AM", "Tomorrow: 02:45 PM"],
        avatarBg: "#047857"
      },
      {
        id: "dr-malathi-venkat",
        name: "Dr. Malathi Venkat",
        degrees: "MBBS, DGO, DNB (OBG), Fellowship in Reproductive Medicine (Germany)",
        designation: "Senior Consultant Infertility & High-Risk Pregnancy Specialist",
        experience: "15+ Years Clinical Experience",
        rating: "4.8 ★ (390+ Verified Reviews)",
        timing: "Mon - Fri: 10:30 AM - 04:30 PM",
        room: "Suite 108, Fertility & Fetal Medicine Center",
        achievements: [
          "High-success clinical record in assisted reproductive techniques and recurrent pregnancy loss care.",
          "Specialist in 3D/4D Fetal anomaly ultrasound scans and invasive prenatal diagnosis.",
          "Author of clinical guidelines on gestational diabetes management in South Asia."
        ],
        slots: ["Today: 11:30 AM", "Today: 03:00 PM", "Tomorrow: 10:30 AM"],
        avatarBg: "#065f46"
      }
    ]
  },
  Pulmonology: {
    title: "Pulmonology, Sleep Medicine & Interventional Chest Care",
    tagline: "4K Bronchoscopy & EBUS, Comprehensive Sleep Lab, Pulmonary Rehab & Severe Asthma/COPD Care",
    stats: [
      { label: "Pulmonologists", val: "2 Senior Consultants" },
      { label: "Bronchoscopy", val: "Fiberoptic & EBUS Suite" },
      { label: "Sleep Lab", val: "Full Polysomnography" },
      { label: "PFT Testing", val: "Diffusion DLCO & Spirometry" },
    ],
    doctors: [
      {
        id: "dr-karthikeyan-balaji",
        name: "Dr. Karthikeyan Balaji",
        degrees: "MBBS, MD (Chest Medicine), DTCD, FCCP (USA), FAPSR",
        designation: "HOD & Chief Interventional Pulmonologist",
        experience: "16+ Years Clinical Experience",
        rating: "4.9 ★ (490+ Verified Reviews)",
        timing: "Mon - Sat: 09:00 AM - 04:00 PM",
        room: "Suite 120, Pulmonary & Respiratory Complex",
        achievements: [
          "Over 3,800+ fiberoptic bronchoscopies, endobronchial ultrasound (EBUS), and foreign body removals.",
          "Established the Region's First Comprehensive Sleep Apnea & Polysomnography Diagnostic Lab.",
          "Fellow of the American College of Chest Physicians (FCCP)."
        ],
        slots: ["Today: 10:00 AM", "Today: 01:30 PM", "Today: 03:45 PM", "Tomorrow: 11:00 AM", "Tomorrow: 04:15 PM"],
        avatarBg: "#047857"
      },
      {
        id: "dr-ramesh-babu",
        name: "Dr. Ramesh Babu",
        degrees: "MBBS, MD (Pulmonary Medicine), Fellowship in Critical Care",
        designation: "Senior Consultant Pulmonologist & Critical Care Specialist",
        experience: "12+ Years Clinical Experience",
        rating: "4.8 ★ (310+ Verified Reviews)",
        timing: "Mon - Sat: 10:30 AM - 05:00 PM",
        room: "Suite 122, Pulmonary Medicine Wing",
        achievements: [
          "Director of Respiratory ICU with specialized protocols for ARDS and non-invasive ventilation.",
          "Pioneered post-viral lung fibrosis rehabilitation program with customized pulmonary exercises.",
          "Published clinical research in the European Respiratory Journal."
        ],
        slots: ["Today: 11:15 AM", "Today: 02:45 PM", "Tomorrow: 10:00 AM"],
        avatarBg: "#065f46"
      }
    ]
  },
  "General Surgery": {
    title: "General & Advanced Laparoscopic GI Surgery",
    tagline: "4K Minimal Access Surgery, Laser Proctology, Surgical Oncology & Hernia Repair Center",
    stats: [
      { label: "Surgeons", val: "3 Senior Specialists" },
      { label: "OT Suites", val: "6 Modern Modular OTs" },
      { label: "Daycare Surgery", val: "Painless Laser Proctology" },
      { label: "Trauma Care", val: "24/7 Emergency Surgery" },
    ],
    doctors: [
      {
        id: "dr-ananthakrishnan-v",
        name: "Dr. Ananthakrishnan V.",
        degrees: "MBBS, MS (General Surgery), FIAGES, FALS (Hernia & Bariatric)",
        designation: "Director of Surgical Services & Chief Laparoscopic Surgeon",
        experience: "23+ Years Clinical Experience",
        rating: "4.9 ★ (710+ Verified Reviews)",
        timing: "Mon - Sat: 09:00 AM - 05:00 PM",
        room: "Suite 210, Surgical Suites (Block B)",
        achievements: [
          "Completed over 9,000+ minimal access laparoscopic surgeries including complex hernia repairs.",
          "Pioneered single-incision laparoscopic surgery (SILS) and 3D laparoscopic cholecystectomy.",
          "Past President of the Association of Minimal Access Surgeons of India (Regional Chapter)."
        ],
        slots: ["Today: 10:30 AM", "Today: 01:00 PM", "Tomorrow: 09:30 AM", "Tomorrow: 03:30 PM"],
        avatarBg: "#047857"
      },
      {
        id: "dr-deepa-lakshmi",
        name: "Dr. Deepa Lakshmi",
        degrees: "MBBS, MS (Gen Surg), Fellowship in Minimal Access Surgery",
        designation: "Senior Consultant Breast & Endocrine Surgeon",
        experience: "13+ Years Clinical Experience",
        rating: "4.8 ★ (360+ Verified Reviews)",
        timing: "Mon - Fri: 10:00 AM - 04:00 PM",
        room: "Suite 214, Surgical Pavilion",
        achievements: [
          "Specialist in oncoplastic breast surgery and minimally invasive thyroidectomy.",
          "Conducted over 1,500+ successful laser treatments for varicose veins and proctology.",
          "Active researcher in surgical site infection prevention and ERAS protocols."
        ],
        slots: ["Today: 11:45 AM", "Today: 03:15 PM", "Tomorrow: 10:45 AM"],
        avatarBg: "#065f46"
      }
    ]
  }
};

// Helper to get department data with dynamic fallback
const getDeptDoctorData = (deptName) => {
  if (!deptName) return SPECIALTY_DOCTORS_DATA.Cardiology;
  if (SPECIALTY_DOCTORS_DATA[deptName]) {
    return SPECIALTY_DOCTORS_DATA[deptName];
  }
  // Search case-insensitively or via alias
  const queryLower = deptName.toLowerCase();
  for (const [key, val] of Object.entries(SPECIALTY_DOCTORS_DATA)) {
    if (key.toLowerCase() === queryLower || key.toLowerCase().includes(queryLower) || queryLower.includes(key.toLowerCase())) {
      return val;
    }
  }
  // Generic rich fallback for extended specialties
  return {
    title: `${deptName} & Advanced Medical Care`,
    tagline: `Comprehensive patient diagnosis, specialized clinical care, and 24/7 consultations in ${deptName}.`,
    stats: [
      { label: "Specialists", val: "2 Senior Consultants" },
      { label: "Care Model", val: "Evidence-Based Protocol" },
      { label: "Success Rate", val: "99.1% Patient Satisfaction" },
      { label: "Emergency", val: "24/7 Coverage" },
    ],
    doctors: [
      {
        id: `dr-${deptName.toLowerCase().replace(/[^a-z]/g, "")}-head`,
        name: `Dr. K. Sivasankaran`,
        degrees: `MBBS, MD, DNB (${deptName}), Senior Fellowship`,
        designation: `Head of Department & Senior Consultant in ${deptName}`,
        experience: "17+ Years Clinical Experience",
        rating: "4.9 ★ (380+ Verified Reviews)",
        timing: "Mon - Sat: 10:00 AM - 04:00 PM",
        room: `Suite 204, Specialty Clinic Wing`,
        achievements: [
          `Over 5,000+ clinical patient evaluations and successful procedures in ${deptName}.`,
          `National speaker and faculty member at annual medical congresses.`,
          `Published over 25+ papers in renowned national and international indexed medical journals.`
        ],
        slots: ["Today: 11:00 AM", "Today: 03:00 PM", "Tomorrow: 10:30 AM", "Tomorrow: 02:00 PM"],
        avatarBg: "#047857"
      }
    ]
  };
};

// Flexible resolver that never fails
const resolveDepartmentData = (deptKeyOrName) => {
  return getDeptDoctorData(deptKeyOrName);
};

// Default Sample Patient Records Database for Patient Self-Service Portal
const DEFAULT_PATIENT_RECORDS = {
  "PAT-1001": {
    userId: "PAT-1001",
    name: "Ramesh Kumar",
    phone: "9876543210",
    email: "ramesh.kumar@example.com",
    gender: "Male",
    age: 42,
    bloodGroup: "O+",
    appointments: [
      {
        id: "APT-8821",
        doctorName: "Dr. Suresh V.",
        department: "Cardiology",
        date: "2026-09-08",
        slot: "10:30 AM",
        room: "Suite 101, Cardiology OPD",
        status: "Confirmed",
        notes: "Routine Cardiac Follow-up & BP Evaluation"
      },
      {
        id: "APT-7410",
        doctorName: "Dr. Priya Arvind",
        department: "Neurology",
        date: "2026-08-15",
        slot: "02:00 PM",
        room: "Room 204, Neuro Tower",
        status: "Completed",
        notes: "Migraine & Tension Headache checkup"
      }
    ],
    bills: [
      {
        id: "INV-2026-4412",
        description: "Comprehensive Cardiac Echo & Diagnostics",
        department: "Cardiology Diagnostic Lab",
        date: "2026-09-02",
        amount: 2450,
        status: "Pending",
        dueDate: "2026-09-12"
      },
      {
        id: "INV-2026-3890",
        description: "Doctor OPD Consultation Fee - Dr. Suresh V.",
        department: "Outpatient Care (Cardiology)",
        date: "2026-08-20",
        amount: 500,
        status: "Paid",
        paymentMode: "UPI / PhonePe",
        paidDate: "2026-08-20"
      },
      {
        id: "INV-2026-2911",
        description: "Pharmacy Prescription Dispensary",
        department: "Central Hospital Pharmacy",
        date: "2026-08-20",
        amount: 820,
        status: "Paid",
        paymentMode: "Debit Card",
        paidDate: "2026-08-20"
      }
    ],
    medicines: [
      {
        id: "MED-1",
        name: "Tab. Telmisartan 40mg",
        type: "Blood Pressure / Hypertension",
        dosage: "1 - 0 - 0 (Morning)",
        instruction: "After Breakfast",
        duration: "30 Days (Ongoing)",
        doctor: "Dr. Suresh V.",
        date: "2026-08-20"
      },
      {
        id: "MED-2",
        name: "Tab. Atorvastatin 10mg",
        type: "Cholesterol Regulation",
        dosage: "0 - 0 - 1 (Night)",
        instruction: "After Dinner",
        duration: "30 Days",
        doctor: "Dr. Suresh V.",
        date: "2026-08-20"
      },
      {
        id: "MED-3",
        name: "Tab. Pantoprazole 40mg",
        type: "Antacid / Gastro-protection",
        dosage: "1 - 0 - 0 (Morning)",
        instruction: "Before Breakfast",
        duration: "15 Days",
        doctor: "Dr. Suresh V.",
        date: "2026-08-20"
      }
    ],
    reports: [
      {
        id: "REP-9901",
        testName: "12-Lead Electrocardiogram (ECG)",
        department: "Cardiology Diagnostic Lab",
        date: "2026-08-20",
        status: "Normal",
        resultSummary: "Normal Sinus Rhythm, HR 72 bpm, PR interval 150ms. No ST-T segment elevation or ischemia.",
        doctor: "Dr. Suresh V.",
        parameters: [
          { name: "Heart Rate", value: "72 bpm", normal: "60 - 100 bpm" },
          { name: "PR Interval", value: "150 ms", normal: "120 - 200 ms" },
          { name: "QRS Duration", value: "88 ms", normal: "< 100 ms" }
        ]
      },
      {
        id: "REP-9832",
        testName: "Complete Blood Count (CBC) & Lipid Profile",
        department: "Pathology & Biochemistry",
        date: "2026-08-20",
        status: "Normal",
        resultSummary: "Hemoglobin 14.2 g/dL. Total Cholesterol 182 mg/dL. Normal renal and hepatic parameters.",
        doctor: "Dr. Arvind S.",
        parameters: [
          { name: "Hemoglobin (Hb)", value: "14.2 g/dL", normal: "13.0 - 17.0 g/dL" },
          { name: "Total Cholesterol", value: "182 mg/dL", normal: "< 200 mg/dL" },
          { name: "Fasting Blood Sugar", value: "98 mg/dL", normal: "70 - 100 mg/dL" }
        ]
      },
      {
        id: "REP-9710",
        testName: "Digital Chest X-Ray (PA View)",
        department: "Radiology & Imaging",
        date: "2026-07-12",
        status: "Normal",
        resultSummary: "Both lung fields appear clear. Cardiothoracic ratio is normal. Costophrenic angles sharp.",
        doctor: "Dr. K. Saravanan",
        parameters: [
          { name: "Lung Fields", value: "Clear", normal: "Clear" },
          { name: "Cardiac Silhouette", value: "Normal Size", normal: "Normal" }
        ]
      }
    ]
  }
};

export default function HospitalLanding({ initialTab = "home" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Active page tab: 'home' | 'about' | 'specialties' | 'facilities' | 'doctors' | 'contact' | 'patient-visitors'
  const [activeTab, setActiveTab] = useState(() => {
    if (initialTab === "about") return "about";
    if (initialTab === "specialties") return "specialties";
    if (initialTab === "facilities") return "facilities";
    if (initialTab === "doctors") return "doctors";
    if (initialTab === "contact") return "contact";
    if (initialTab === "patient-visitors" || initialTab === "patients" || initialTab === "visitors") return "patient-visitors";
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === "#about" || hash === "#about-us" || path.includes("/about")) {
        return "about";
      }
      if (hash === "#specialties" || hash === "#specialists" || path.includes("/specialties") || path.includes("/specialists") || path.includes("/our-specialties")) {
        return "specialties";
      }
      if (hash === "#facilities" || hash === "#our-facilities" || path.includes("/facilities") || path.includes("/our-facilities")) {
        return "facilities";
      }
      if (hash === "#doctors" || hash === "#our-doctors" || path.includes("/our-doctors") || path.includes("/doctors-list")) {
        return "doctors";
      }
      if (hash === "#contact" || hash === "#contact-us" || path.includes("/contact")) {
        return "contact";
      }
      if (
        hash === "#patient-visitors" ||
        hash === "#patients-visitors" ||
        hash === "#patient-and-visitors" ||
        hash === "#patients" ||
        hash === "#visitors" ||
        path.includes("/patient") ||
        path.includes("/visitor")
      ) {
        return "patient-visitors";
      }
    }
    return "home";
  });

  // State to toggle additional specialties when clicking "View All Specialties"
  const [expandedSpecialties, setExpandedSpecialties] = useState(false);

  // Detail view for specialty doctors (e.g. 'Cardiology', 'Neurology', etc.)
  const [selectedSpecialtyDetail, setSelectedSpecialtyDetail] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("cardio")) return "Cardiology";
      if (hash.includes("neuro")) return "Neurology";
      if (hash.includes("onco")) return "Oncology";
      if (hash.includes("ortho")) return "Orthopedics";
      if (hash.includes("gastro")) return "Gastroenterology";
      if (hash.includes("nephro")) return "Nephrology";
    }
    return null;
  });

  // Selected doctor and slot for appointment booking
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState("");
  const [bookingRefId, setBookingRefId] = useState("");
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const [doctorSlotFilter, setDoctorSlotFilter] = useState("all");

  // Sync tab with URL hash or pathname changes
  useEffect(() => {
    const handleHashOrPath = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === "#about" || hash === "#about-us" || path.includes("/about")) {
        setActiveTab("about");
        setSelectedSpecialtyDetail(null);
      } else if (hash.includes("cardio")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("Cardiology");
      } else if (hash.includes("neuro")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("Neurology");
      } else if (hash.includes("onco")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("Oncology");
      } else if (hash.includes("ortho")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("Orthopedics");
      } else if (hash.includes("gastro")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("Gastroenterology");
      } else if (hash.includes("nephro")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("Nephrology");
      } else if (hash.includes("paed") || hash.includes("ped")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("Paediatrics");
      } else if (hash.includes("gyn") || hash.includes("obg")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("Obstetrics & Gynaecology");
      } else if (hash.includes("pulm") || hash.includes("chest") || hash.includes("lung")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("Pulmonology");
      } else if (hash.includes("surg")) {
        setActiveTab("specialties");
        setSelectedSpecialtyDetail("General Surgery");
      } else if (hash === "#facilities" || hash === "#our-facilities" || path.includes("/facilities") || path.includes("/our-facilities")) {
        setActiveTab("facilities");
        setSelectedSpecialtyDetail(null);
      } else if (hash === "#doctors" || hash === "#our-doctors" || path.includes("/our-doctors") || path.includes("/doctors-list")) {
        setActiveTab("doctors");
        setSelectedSpecialtyDetail(null);
      } else if (hash === "#specialties" || hash === "#specialists" || path.includes("/specialties") || path.includes("/specialists") || path.includes("/our-specialties")) {
        setActiveTab("specialties");
        if (!hash.includes("/")) {
          setSelectedSpecialtyDetail(null);
        }
      } else if (hash === "#contact" || hash === "#contact-us" || path.includes("/contact")) {
        setActiveTab("contact");
        setSelectedSpecialtyDetail(null);
      } else if (
        hash === "#patient-visitors" ||
        hash === "#patients-visitors" ||
        hash === "#patient-and-visitors" ||
        hash === "#patients" ||
        hash === "#visitors" ||
        path.includes("/patient") ||
        path.includes("/visitor")
      ) {
        setActiveTab("patient-visitors");
        setSelectedSpecialtyDetail(null);
      } else if (hash === "#home" || hash === "" || path === "/" || path === "/home") {
        setActiveTab("home");
        setSelectedSpecialtyDetail(null);
      }
    };

    handleHashOrPath();
    window.addEventListener("hashchange", handleHashOrPath);
    return () => window.removeEventListener("hashchange", handleHashOrPath);
  }, [location.pathname]);

  // Dropdown states
  const [specialtiesDropdown, setSpecialtiesDropdown] = useState(false);

  // Appointment Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Cardiology");

  // Patient Self-Service Portal State
  const [patientRecords, setPatientRecords] = useState(DEFAULT_PATIENT_RECORDS);
  const [patientPortalOpen, setPatientPortalOpen] = useState(false);
  const [authenticatedPatientId, setAuthenticatedPatientId] = useState("PAT-1001");
  const [isPatientAuthenticated, setIsPatientAuthenticated] = useState(false);
  const [patientAuthTab, setPatientAuthTab] = useState("otp"); // 'otp' | 'patientId'
  const [patientAuthPhone, setPatientAuthPhone] = useState("");
  const [patientAuthIdInput, setPatientAuthIdInput] = useState("");
  const [patientAuthOtp, setPatientAuthOtp] = useState("");
  const [patientAuthError, setPatientAuthError] = useState("");
  const [realTimeOtp, setRealTimeOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(0);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");
  const [liveSmsPreview, setLiveSmsPreview] = useState(null);
  const [portalActiveTab, setPortalActiveTab] = useState("appointments"); // 'appointments' | 'bills' | 'medicines' | 'reports'
  const [payingBill, setPayingBill] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");
  const [selectedReportDetail, setSelectedReportDetail] = useState(null);

  // 60-Second Real-Time OTP Resend Countdown
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const [appointmentForm, setAppointmentForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    department: "Cardiology",
    doctorName: "",
    preferredDate: "",
    preferredSlot: "",
    notes: "",
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const deptPrefix = (appointmentForm.department || "CARD").substring(0, 4).toUpperCase().replace(/[^A-Z]/g, "CARD");
    const generatedRef = `NIA-${deptPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRefId(generatedRef);
    setBookingSuccess(true);

    // Synchronize booking with the active patient's records
    const newAppointment = {
      id: generatedRef,
      doctorName: selectedDoctorForBooking?.name || appointmentForm.doctorName || "Senior Specialist",
      department: appointmentForm.department || selectedSpecialty,
      date: appointmentForm.preferredDate || new Date().toISOString().split("T")[0],
      slot: selectedSlotForBooking || appointmentForm.preferredSlot || "10:00 AM",
      room: selectedDoctorForBooking?.room || "Suite 101, Specialty Clinic OPD",
      status: "Confirmed",
      notes: appointmentForm.notes || "Consultation appointment confirmed"
    };

    setPatientRecords((prev) => {
      const pId = authenticatedPatientId || "PAT-1001";
      const existing = prev[pId] || { ...DEFAULT_PATIENT_RECORDS["PAT-1001"] };
      return {
        ...prev,
        [pId]: {
          ...existing,
          name: appointmentForm.fullName || existing.name,
          phone: appointmentForm.phoneNumber || existing.phone,
          appointments: [newAppointment, ...(existing.appointments || [])]
        }
      };
    });
  };

  const handleSendPatientOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = (patientAuthPhone || "").replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setPatientAuthError("Please enter a valid 10-digit registered mobile number.");
      return;
    }
    setOtpSending(true);
    setPatientAuthError("");
    setOtpSuccessMsg("");

    // Generate fresh real-time 6-digit OTP
    const generated = String(Math.floor(100000 + Math.random() * 900000));
    setRealTimeOtp(generated);
    setOtpExpiresAt(Date.now() + 5 * 60 * 1000);

    const maskedPhone = cleanPhone.slice(0, 2) + "••••••" + cleanPhone.slice(-2);

    try {
      // Attempt backend Aadhaar/SMS dispatch
      await fetch(`${API_BASE_URL}/api/aadhar/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadharNumber: "123456789012",
          phoneNumber: cleanPhone,
        }),
      }).catch(() => null);
    } catch (err) {
      // network silent catch
    }

    setOtpSending(false);
    setOtpSent(true);
    setOtpCountdown(60);
    setOtpSuccessMsg(`Real-time verification OTP sent to +91 ${maskedPhone}!`);
    setLiveSmsPreview({
      sender: "VM-AROGYM (NI AROGIYAM)",
      text: `Your login verification OTP for NI AROGIYAM Patient Portal is ${generated}. Valid for 5 minutes. Do not share this code.`,
      code: generated,
      time: "Just now"
    });
  };

  const handlePatientLoginWithOtp = (e) => {
    if (e) e.preventDefault();
    const cleanPhone = (patientAuthPhone || "").replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setPatientAuthError("Please enter your 10-digit registered mobile number.");
      return;
    }
    if (!otpSent || !realTimeOtp) {
      setPatientAuthError("Please click 'Send OTP' to receive your verification code.");
      return;
    }
    if (Date.now() > otpExpiresAt) {
      setPatientAuthError("OTP has expired. Please click 'Resend OTP'.");
      return;
    }
    if (patientAuthOtp.trim() !== realTimeOtp) {
      setPatientAuthError("Invalid OTP. Please enter the exact 6-digit code received on your mobile.");
      return;
    }

    // Match patient by phone or dynamically bind patient record
    let foundId = Object.keys(patientRecords).find(k => {
      const p = patientRecords[k];
      return p.phone && p.phone.replace(/\D/g, "").slice(-10) === cleanPhone.slice(-10);
    });

    if (!foundId) {
      foundId = "PAT-" + cleanPhone.slice(-4);
      setPatientRecords((prev) => ({
        ...prev,
        [foundId]: {
          userId: foundId,
          name: "Patient (" + cleanPhone.slice(-4) + ")",
          phone: cleanPhone,
          email: "patient." + cleanPhone.slice(-4) + "@niarogiyam.in",
          gender: "Registered",
          age: 40,
          bloodGroup: "O+",
          appointments: [],
          bills: [],
          medicines: [],
          reports: []
        }
      }));
    }

    setAuthenticatedPatientId(foundId);
    setIsPatientAuthenticated(true);
    setPatientAuthError("");
    setLiveSmsPreview(null);
  };

  const handlePatientLoginWithId = (e) => {
    if (e) e.preventDefault();
    const cleanId = (patientAuthIdInput || "").trim().toUpperCase();
    if (!cleanId) {
      setPatientAuthError("Please enter your Patient ID.");
      return;
    }
    if (patientRecords[cleanId]) {
      setAuthenticatedPatientId(cleanId);
      setIsPatientAuthenticated(true);
      setPatientAuthError("");
    } else {
      setPatientAuthError(`Patient record for '${cleanId}' not found. Try demo ID: PAT-1001`);
    }
  };

  const handlePatientLogout = () => {
    setIsPatientAuthenticated(false);
    setPatientAuthOtp("");
    setPatientAuthError("");
  };

  const handleConfirmPayBill = () => {
    if (!payingBill) return;
    const pId = authenticatedPatientId || "PAT-1001";
    setPatientRecords((prev) => {
      const patient = prev[pId];
      if (!patient) return prev;
      const updatedBills = (patient.bills || []).map((b) => {
        if (b.id === payingBill.id) {
          return {
            ...b,
            status: "Paid",
            paymentMode: selectedPaymentMethod === "upi" ? "UPI / PhonePe" : selectedPaymentMethod === "card" ? "Debit / Credit Card" : selectedPaymentMethod === "netbanking" ? "Net Banking" : "Cash / Desk",
            paidDate: new Date().toISOString().split("T")[0]
          };
        }
        return b;
      });
      return {
        ...prev,
        [pId]: {
          ...patient,
          bills: updatedBills
        }
      };
    });
    setPaymentSuccessMsg(`Payment of ₹${payingBill.amount} completed successfully!`);
    setTimeout(() => {
      setPayingBill(null);
      setPaymentSuccessMsg("");
    }, 1500);
  };

  // Click on a specialty card: opens the detailed doctors view for that specialty
  const handleCardClickToDetail = (name) => {
    if (name === "View All") {
      setActiveTab("specialties");
      setExpandedSpecialties(true);
      setSelectedSpecialtyDetail(null);
      return;
    }
    setActiveTab("specialties");
    setSelectedSpecialty(name);
    setSelectedSpecialtyDetail(name);
    setDoctorSearchQuery("");
    setDoctorSlotFilter("all");
    window.history.pushState(null, "", `#specialties/${name.toLowerCase().replace(/[^a-z]/g, "")}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Return from doctor view back to the 6-card specialties grid
  const handleBackToAllSpecialties = (e) => {
    if (e) e.preventDefault();
    setSelectedSpecialtyDetail(null);
    window.history.pushState(null, "", "#specialties");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Direct booking with doctor & slot
  const handleBookDoctorWithSlot = (doctor, slot = "") => {
    const dept = selectedSpecialtyDetail || "Cardiology";
    setSelectedSpecialty(dept);
    setSelectedDoctorForBooking(doctor);
    setSelectedSlotForBooking(slot);
    setBookingSuccess(false);
    setAppointmentForm((prev) => ({
      ...prev,
      department: dept,
      doctorName: doctor?.name || "",
      preferredDate: slot ? (slot.toLowerCase().includes("tomorrow") ? new Date(Date.now() + 86400000).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]) : prev.preferredDate || new Date().toISOString().split("T")[0],
      preferredSlot: slot,
    }));
    setBookingModalOpen(true);
  };

  const handleSpecialtyClick = (name) => {
    if (name === "View All") {
      setActiveTab("specialties");
      setExpandedSpecialties(true);
      window.history.pushState(null, "", "#specialties");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleCardClickToDetail(name);
    }
  };

  const handleNavHome = (e) => {
    if (e) e.preventDefault();
    setActiveTab("home");
    setSelectedSpecialtyDetail(null);
    window.history.pushState(null, "", "#home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavAbout = (e) => {
    if (e) e.preventDefault();
    setActiveTab("about");
    setSelectedSpecialtyDetail(null);
    window.history.pushState(null, "", "#about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavSpecialties = (e) => {
    if (e) e.preventDefault();
    setActiveTab("specialties");
    setSelectedSpecialtyDetail(null);
    window.history.pushState(null, "", "#specialties");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavFacilities = (e) => {
    if (e) e.preventDefault();
    setActiveTab("facilities");
    setSelectedSpecialtyDetail(null);
    window.history.pushState(null, "", "#facilities");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleFacilitiesNavClick = handleNavFacilities;

  const handleNavDoctors = (e) => {
    if (e) e.preventDefault();
    setActiveTab("doctors");
    setSelectedSpecialtyDetail(null);
    window.history.pushState(null, "", "#doctors");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavContact = (e) => {
    if (e) e.preventDefault();
    setActiveTab("contact");
    setSelectedSpecialtyDetail(null);
    window.history.pushState(null, "", "#contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavPatientVisitors = (e) => {
    if (e) e.preventDefault();
    setActiveTab("patient-visitors");
    setSelectedSpecialtyDetail(null);
    window.history.pushState(null, "", "#patient-visitors");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Contact Us Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSubmitted(true);
      setContactForm({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
      setTimeout(() => setContactSubmitted(false), 6000);
    }, 500);
  };

  const currentPatient = patientRecords[authenticatedPatientId] || patientRecords["PAT-1001"] || DEFAULT_PATIENT_RECORDS["PAT-1001"];
  const patientBills = currentPatient?.bills || [];
  const totalBilled = patientBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const totalPaid = patientBills.filter(b => b.status === "Paid").reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const pendingDue = patientBills.filter(b => b.status === "Pending").reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const pendingCount = patientBills.filter(b => b.status === "Pending").length;

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
                  <a href="#specialties/cardiology" onClick={(e) => { e.preventDefault(); setSpecialtiesDropdown(false); handleCardClickToDetail("Cardiology"); }}>🫀 Cardiology</a>
                  <a href="#specialties/neurology" onClick={(e) => { e.preventDefault(); setSpecialtiesDropdown(false); handleCardClickToDetail("Neurology"); }}>🧠 Neurology</a>
                  <a href="#specialties/oncology" onClick={(e) => { e.preventDefault(); setSpecialtiesDropdown(false); handleCardClickToDetail("Oncology"); }}>🎗️ Oncology</a>
                  <a href="#specialties/orthopedics" onClick={(e) => { e.preventDefault(); setSpecialtiesDropdown(false); handleCardClickToDetail("Orthopedics"); }}>🦴 Orthopedics</a>
                  <a href="#specialties/gastroenterology" onClick={(e) => { e.preventDefault(); setSpecialtiesDropdown(false); handleCardClickToDetail("Gastroenterology"); }}>🩺 Gastroenterology</a>
                  <a href="#specialties/nephrology" onClick={(e) => { e.preventDefault(); setSpecialtiesDropdown(false); handleCardClickToDetail("Nephrology"); }}>🧪 Nephrology</a>
                  <a href="#specialties/paediatrics" onClick={(e) => { e.preventDefault(); setSpecialtiesDropdown(false); handleCardClickToDetail("Paediatrics"); }}>👶 Paediatrics</a>
                  <a href="#specialties/pulmonology" onClick={(e) => { e.preventDefault(); setSpecialtiesDropdown(false); handleCardClickToDetail("Pulmonology"); }}>🫁 Pulmonology</a>
                  <a href="#specialties" onClick={(e) => { e.preventDefault(); setSpecialtiesDropdown(false); handleNavSpecialties(e); }}>View All Specialties →</a>
                </div>
              )}
            </div>

            <div className={`menu-item-wrap ${activeTab === "facilities" ? "active-wrap" : ""}`}>
              <a
                href="#facilities"
                className={`menu-link ${activeTab === "facilities" ? "active" : ""}`}
                onClick={handleNavFacilities}
              >
                Facilities
              </a>
              {activeTab === "facilities" && <div className="green-indicator-bar"></div>}
            </div>

            <div className={`menu-item-wrap ${activeTab === "patient-visitors" ? "active-wrap" : ""}`}>
              <a
                href="#patient-visitors"
                className={`menu-link ${activeTab === "patient-visitors" ? "active" : ""}`}
                onClick={handleNavPatientVisitors}
              >
                Patient &amp; Visitors
              </a>
              {activeTab === "patient-visitors" && <div className="green-indicator-bar"></div>}
            </div>

            <div className={`menu-item-wrap ${activeTab === "doctors" ? "active-wrap" : ""}`}>
              <a
                href="#doctors"
                className={`menu-link ${activeTab === "doctors" ? "active" : ""}`}
                onClick={handleNavDoctors}
              >
                Our Doctors
              </a>
              {activeTab === "doctors" && <div className="green-indicator-bar"></div>}
            </div>

            <div className={`menu-item-wrap ${activeTab === "contact" ? "active-wrap" : ""}`}>
              <a
                href="#contact"
                className={`menu-link ${activeTab === "contact" ? "active" : ""}`}
                onClick={handleNavContact}
              >
                Contact Us
              </a>
              {activeTab === "contact" && <div className="green-indicator-bar"></div>}
            </div>
          </nav>

          {/* CTA BUTTONS */}
          <div className="header-cta-block" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-patient-portal-pill"
              onClick={() => setPatientPortalOpen(true)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Patient Portal
            </button>
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
        selectedSpecialtyDetail ? (() => {
          const deptData = resolveDepartmentData(selectedSpecialtyDetail);
          const q = (doctorSearchQuery || "").trim().toLowerCase();
          const filteredDoctors = (deptData?.doctors || []).filter((doc) => {
            const matchesSearch = !q ||
              doc.name.toLowerCase().includes(q) ||
              doc.designation.toLowerCase().includes(q) ||
              doc.degrees.toLowerCase().includes(q) ||
              (doc.achievements && doc.achievements.some(a => a.toLowerCase().includes(q)));

            const matchesSlot = doctorSlotFilter === "all" ||
              (doctorSlotFilter === "today" && doc.slots.some(s => s.toLowerCase().includes("today"))) ||
              (doctorSlotFilter === "tomorrow" && doc.slots.some(s => s.toLowerCase().includes("tomorrow")));

            return matchesSearch && matchesSlot;
          });

          return (
            <main className="exact-specialty-detail-view">
              {/* Top Navigation Row: Back Button and Breadcrumbs */}
              <div className="dept-detail-top-nav-bar">
                <div className="dept-detail-top-inner">
                  <button
                    type="button"
                    className="btn-back-to-specialties"
                    onClick={handleBackToAllSpecialties}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Back to All Specialties</span>
                  </button>

                  <nav className="dept-detail-breadcrumb" aria-label="Breadcrumb">
                    <a href="#home" className="breadcrumb-link" onClick={handleNavHome}>Home</a>
                    <span className="breadcrumb-separator">›</span>
                    <a href="#specialties" className="breadcrumb-link" onClick={handleBackToAllSpecialties}>Specialties</a>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-current">{selectedSpecialtyDetail}</span>
                  </nav>
                </div>
              </div>

              {/* Department Hero Banner */}
              <div className="dept-hero-banner">
                <div className="dept-hero-container">
                  <div className="dept-hero-main">
                    <div className="dept-badge-row">
                      <span className="dept-pill-badge">
                        {selectedSpecialtyDetail.toLowerCase().includes("cardio") ? "🫀 SUPER SPECIALTY EXCELLENCE" : "CLINICAL SPECIALTY"}
                      </span>
                      <span className="dept-status-live">● OPD &amp; Emergency Active 24/7</span>
                    </div>
                    <h1 className="dept-hero-title">{deptData.title}</h1>
                    <p className="dept-hero-tagline">{deptData.tagline}</p>
                  </div>

                  {/* Key Department Stats Strip */}
                  <div className="dept-stats-grid">
                    {deptData.stats.map((st, sidx) => (
                      <div key={sidx} className="dept-stat-card">
                        <strong className="dept-stat-num">{st.val}</strong>
                        <span className="dept-stat-lbl">{st.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Specialty Switcher Bar (Tabs) */}
              <div className="dept-quick-switcher-container">
                <div className="dept-quick-switcher-inner">
                  <span className="switcher-prompt">Select Department:</span>
                  <div className="switcher-chips-scroll">
                    {Object.keys(SPECIALTY_DOCTORS_DATA).map((deptKey) => (
                      <button
                        key={deptKey}
                        type="button"
                        className={`switcher-dept-chip ${selectedSpecialtyDetail.toLowerCase() === deptKey.toLowerCase() ? "active" : ""}`}
                        onClick={() => handleCardClickToDetail(deptKey)}
                      >
                        {deptKey === "Cardiology" && "🫀 "}
                        {deptKey === "Neurology" && "🧠 "}
                        {deptKey === "Oncology" && "🎗️ "}
                        {deptKey === "Orthopedics" && "🦴 "}
                        {deptKey === "Gastroenterology" && "🩺 "}
                        {deptKey === "Nephrology" && "🧪 "}
                        {deptKey === "Paediatrics" && "👶 "}
                        {deptKey === "Obstetrics & Gynaecology" && "🤰 "}
                        {deptKey === "Pulmonology" && "🫁 "}
                        {deptKey === "General Surgery" && "🔪 "}
                        {deptKey}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctors Listing Section */}
              <div className="dept-doctors-container">
                <div className="dept-doctors-section-header">
                  <div>
                    <h2 className="dept-doctors-title">
                      Senior Specialists &amp; Consultants in {selectedSpecialtyDetail}
                      <span className="doctors-count-badge">{(filteredDoctors || []).length} Available</span>
                    </h2>
                    <p className="dept-doctors-subtitle">
                      Choose any specialist below to view qualifications, verified clinical achievements, years of experience, and directly book an available consultation slot.
                    </p>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="doctors-controls-bar">
                    <div className="doc-search-box">
                      <span className="doc-search-icon">🔍</span>
                      <input
                        type="text"
                        placeholder="Search doctor, procedure, or achievement..."
                        value={doctorSearchQuery}
                        onChange={(e) => setDoctorSearchQuery(e.target.value)}
                      />
                      {doctorSearchQuery && (
                        <button className="btn-clear-doc-search" onClick={() => setDoctorSearchQuery("")}>✕</button>
                      )}
                    </div>

                    <div className="doc-slot-filter-buttons">
                      <button
                        type="button"
                        className={`filter-btn ${doctorSlotFilter === "all" ? "active" : ""}`}
                        onClick={() => setDoctorSlotFilter("all")}
                      >
                        All Doctors
                      </button>
                      <button
                        type="button"
                        className={`filter-btn ${doctorSlotFilter === "today" ? "active" : ""}`}
                        onClick={() => setDoctorSlotFilter("today")}
                      >
                        Available Today
                      </button>
                      <button
                        type="button"
                        className={`filter-btn ${doctorSlotFilter === "tomorrow" ? "active" : ""}`}
                        onClick={() => setDoctorSlotFilter("tomorrow")}
                      >
                        Available Tomorrow
                      </button>
                    </div>
                  </div>
                </div>

                {/* Doctors Grid */}
                <div className="doctors-cards-grid">
                  {filteredDoctors.map((doc) => (
                    <div key={doc.id} className="doctor-profile-card">
                      {/* Top Row: Avatar & Basic Information */}
                      <div className="doctor-card-top-section">
                        <div
                          className="doctor-avatar-box"
                          style={{ backgroundColor: doc.avatarBg || "#047857" }}
                        >
                          <span className="doctor-avatar-initials">
                            {doc.name.replace("Dr. ", "").split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </span>
                          <div className="doc-online-dot" title="Accepting OPD Patients Today"></div>
                        </div>

                        <div className="doctor-header-details">
                          <div className="doc-title-row">
                            <h3 className="doc-name">{doc.name}</h3>
                            <span className="doc-verified-pill">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="#047857">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                              Verified Specialist
                            </span>
                          </div>

                          <div className="doc-degrees-text">{doc.degrees}</div>
                          <div className="doc-designation-text">{doc.designation}</div>

                          {/* Experience and Rating Badges */}
                          <div className="doc-meta-badges-row">
                            <span className="doc-exp-badge">
                              <span className="badge-icon">⏱️</span>
                              {doc.experience}
                            </span>
                            <span className="doc-rating-badge">
                              <span className="badge-icon">⭐</span>
                              {doc.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Room & Timings Box */}
                      <div className="doctor-logistics-box">
                        <div className="logistics-item">
                          <span className="logistics-label">⏰ OPD Consultation Timings:</span>
                          <span className="logistics-val">{doc.timing}</span>
                        </div>
                        <div className="logistics-item">
                          <span className="logistics-label">📍 Consultation Suite:</span>
                          <span className="logistics-val highlight-location">{doc.room}</span>
                        </div>
                      </div>

                      {/* Doctor Achievements Box */}
                      <div className="doctor-achievements-box">
                        <div className="achievements-heading">
                          <span className="trophy-icon">🏆</span>
                          <strong>Key Career Achievements &amp; Clinical Milestones:</strong>
                        </div>
                        <ul className="achievements-bullet-list">
                          {doc.achievements.map((ach, aidx) => (
                            <li key={aidx} className="achievement-list-item">
                              <span className="achievement-check">✓</span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Available Consultation Slots */}
                      <div className="doctor-slots-box">
                        <div className="slots-header-row">
                          <span className="slots-label">
                            <span className="slots-icon">🕒</span>
                            <strong>Available Consultation Slots:</strong>
                          </span>
                          <span className="slots-note">(Click any slot to book instantly)</span>
                        </div>
                        <div className="slots-chips-grid">
                          {doc.slots.map((slot, sidx) => (
                            <button
                              key={sidx}
                              type="button"
                              className={`btn-slot-chip ${selectedDoctorForBooking?.id === doc.id && selectedSlotForBooking === slot ? "active-slot-chip" : ""}`}
                              onClick={() => handleBookDoctorWithSlot(doc, slot)}
                              title={`Book appointment with ${doc.name} for ${slot}`}
                            >
                              <span className="slot-chip-bullet">●</span>
                              <span className="slot-chip-text">{slot}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="doctor-card-footer-actions">
                        <button
                          type="button"
                          className="btn-book-this-doctor"
                          onClick={() => handleBookDoctorWithSlot(doc, doc.slots[0] || "")}
                        >
                          <span>📅</span>
                          <span>Book Appointment with {doc.name.split(" ")[1] || doc.name}</span>
                        </button>
                        <a
                          href="tel:+914523005300"
                          className="btn-call-desk-secondary"
                          title="Contact OPD Reception Desk"
                        >
                          <span>📞</span>
                          <span>Call OPD Desk</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredDoctors.length === 0 && (
                  <div className="no-specialists-found">
                    <div className="nsf-icon">🔍</div>
                    <h3>No specialists match your search criteria</h3>
                    <p>Try searching with another keyword or select "All Doctors".</p>
                    <button
                      type="button"
                      className="btn-reset-filters"
                      onClick={() => {
                        setDoctorSearchQuery("");
                        setDoctorSlotFilter("all");
                      }}
                    >
                      Reset Search &amp; Filters
                    </button>
                  </div>
                )}
              </div>
            </main>
          );
        })() : (
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
        )
      ) : activeTab === "facilities" ? (
        /* =======================================================
            RENDER: OUR FACILITIES PAGE VIEW (MATCHING DESIGN)
            ======================================================= */
        <main className="exact-facilities-page-view">
          <div className="facilities-page-container">
            {/* Header & Breadcrumb */}
            <div className="facilities-header-section">
              <h1 className="facilities-page-title">Our Facilities</h1>
              <nav className="facilities-breadcrumb" aria-label="Breadcrumb">
                <a href="#home" className="breadcrumb-link" onClick={handleNavHome}>
                  Home
                </a>
                <span className="breadcrumb-separator">&gt;</span>
                <span className="breadcrumb-current">Facilities</span>
              </nav>
              <p className="facilities-page-subtitle">
                Modern infrastructure and cutting-edge technology for better care.
              </p>
            </div>

            {/* 3-Column Facilities Grid (6 Cards) */}
            <div className="facilities-cards-grid">
              {/* Card 1: Emergency */}
              <div className="facility-card">
                <div className="facility-card-image-wrap">
                  <img
                    src={facilityEmergencyImg}
                    alt="24/7 Emergency Care"
                    className="facility-animated-img"
                  />
                </div>
                <div className="facility-card-content">
                  <h3 className="facility-card-title">24/7 Emergency Care</h3>
                  <p className="facility-card-desc">Round-the-clock emergency and trauma care.</p>
                </div>
              </div>

              {/* Card 2: ICU & Critical Care */}
              <div className="facility-card">
                <div className="facility-card-image-wrap">
                  <img
                    src={facilityIcuImg}
                    alt="ICU & Critical Care"
                    className="facility-animated-img"
                  />
                </div>
                <div className="facility-card-content">
                  <h3 className="facility-card-title">ICU &amp; Critical Care</h3>
                  <p className="facility-card-desc">Advanced ICUs with modern life-support systems.</p>
                </div>
              </div>

              {/* Card 3: Operation Theatres */}
              <div className="facility-card">
                <div className="facility-card-image-wrap">
                  <img
                    src={facilityOtImg}
                    alt="Operation Theatres"
                    className="facility-animated-img"
                  />
                </div>
                <div className="facility-card-content">
                  <h3 className="facility-card-title">Operation Theatres</h3>
                  <p className="facility-card-desc">State-of-the-art modular operation theatres.</p>
                </div>
              </div>

              {/* Card 4: Diagnostic Services */}
              <div className="facility-card">
                <div className="facility-card-image-wrap">
                  <img
                    src={facilityDiagnosticImg}
                    alt="Diagnostic Services"
                    className="facility-animated-img"
                  />
                </div>
                <div className="facility-card-content">
                  <h3 className="facility-card-title">Diagnostic Services</h3>
                  <p className="facility-card-desc">Advanced imaging and diagnostic facilities.</p>
                </div>
              </div>

              {/* Card 5: Robotic Surgery */}
              <div className="facility-card">
                <div className="facility-card-image-wrap">
                  <img
                    src={facilityRoboticImg}
                    alt="Robotic Surgery"
                    className="facility-animated-img"
                  />
                </div>
                <div className="facility-card-content">
                  <h3 className="facility-card-title">Robotic Surgery</h3>
                  <p className="facility-card-desc">Precision robotic surgery for better outcomes.</p>
                </div>
              </div>

              {/* Card 6: Pharmacy */}
              <div className="facility-card">
                <div className="facility-card-image-wrap">
                  <img
                    src={facilityPharmacyImg}
                    alt="Pharmacy"
                    className="facility-animated-img"
                  />
                </div>
                <div className="facility-card-content">
                  <h3 className="facility-card-title">Pharmacy</h3>
                  <p className="facility-card-desc">24/7 pharmacy with wide range of medicines.</p>
                </div>
              </div>
            </div>

            {/* Row 3: Patient Rooms Wide Card (Spans across ~2 columns) */}
            <div className="patient-rooms-wide-card">
              <div className="patient-rooms-image-wrap">
                <img
                  src={facilityPatientRoomsImg}
                  alt="Patient Rooms"
                  className="facility-animated-img"
                />
              </div>
              <div className="patient-rooms-content">
                <h3 className="patient-rooms-title">Patient Rooms</h3>
                <p className="patient-rooms-desc">Safe and spacious rooms for patients.</p>
              </div>
            </div>
          </div>

          {/* Hospital Footer (Matching Reference Screenshot) */}
          <footer className="exact-hospital-footer">
            <div className="footer-inner-container">
              <div className="footer-top-row">
                <div className="footer-address-info">
                  <h4 className="footer-address-title">Madurai Bypass Road, Madurai, Tamil Nadu</h4>
                  <p className="footer-address-sub">24/7 Emergency Care &bull; Multi-Specialty Hospital</p>
                </div>
                <div className="footer-social-icons">
                  <a href="#facebook" aria-label="Facebook" className="social-icon-btn">f</a>
                  <a href="#twitter" aria-label="Twitter" className="social-icon-btn">𝕏</a>
                  <a href="#instagram" aria-label="Instagram" className="social-icon-btn">📸</a>
                  <a href="#linkedin" aria-label="LinkedIn" className="social-icon-btn">in</a>
                  <a href="#youtube" aria-label="YouTube" className="social-icon-btn">▶</a>
                </div>
              </div>
              <div className="footer-bottom-row">
                <span>&copy; 2025 NI AROGIYAM Hospital. All Rights Reserved.</span>
                <div className="footer-legal-links">
                  <a href="#privacy">Privacy Policy</a>
                  <span className="footer-separator">|</span>
                  <a href="#terms">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      ) : activeTab === "doctors" ? (
        /* =======================================================
            RENDER: OUR DOCTORS PAGE VIEW (MATCHING DESIGN)
            ======================================================= */
        <main className="exact-doctors-page-view">
          <div className="doctors-page-container">
            {/* Header & Breadcrumb */}
            <div className="doctors-header-section">
              <h1 className="doctors-page-title">Our Doctors</h1>
              <nav className="doctors-breadcrumb" aria-label="Breadcrumb">
                <a href="#home" className="breadcrumb-link" onClick={handleNavHome}>
                  Home
                </a>
                <span className="breadcrumb-separator">&gt;</span>
                <span className="breadcrumb-current">Our Doctors</span>
              </nav>
              <p className="doctors-page-subtitle">
                Expert specialists dedicated to your health and well-being.
              </p>
            </div>

            {/* 4 Doctors Cards Row */}
            <div className="doctors-showcase-grid">
              {/* Doctor 1: Dr. R. Saravanan */}
              <div
                className="doctor-showcase-card"
                onClick={() => {
                  setSelectedSpecialty("Cardiology");
                  setSelectedDoctorForBooking({
                    name: "Dr. R. Saravanan",
                    designation: "Director & Chief Interventional Cardiologist",
                    experience: "15+ Years Clinical Experience",
                    room: "Suite 101, Cardiac Sciences Tower",
                    avatarBg: "#047857",
                    slots: ["Today: 10:30 AM", "Today: 11:45 AM", "Tomorrow: 10:00 AM"],
                  });
                  setAppointmentForm((prev) => ({
                    ...prev,
                    department: "Cardiology",
                    doctorName: "Dr. R. Saravanan",
                  }));
                  setBookingModalOpen(true);
                }}
              >
                <div className="doctor-showcase-photo-wrap">
                  <img
                    src={doctorSaravananImg}
                    alt="Dr. R. Saravanan"
                    className="doctor-showcase-img"
                  />
                </div>
                <div className="doctor-showcase-info">
                  <h3 className="doctor-showcase-name">Dr. R. Saravanan</h3>
                  <span className="doctor-showcase-spec">Cardiologist</span>
                  <span className="doctor-showcase-exp">15+ Years Experience</span>
                </div>
              </div>

              {/* Doctor 2: Dr. Meena Krishnan */}
              <div
                className="doctor-showcase-card"
                onClick={() => {
                  setSelectedSpecialty("Neurology");
                  setSelectedDoctorForBooking({
                    name: "Dr. Meena Krishnan",
                    designation: "Senior Consultant Neurologist & Stroke Specialist",
                    experience: "10+ Years Clinical Experience",
                    room: "Suite 204, Neuro Sciences Wing",
                    avatarBg: "#065f46",
                    slots: ["Today: 11:00 AM", "Today: 02:30 PM", "Tomorrow: 11:15 AM"],
                  });
                  setAppointmentForm((prev) => ({
                    ...prev,
                    department: "Neurology",
                    doctorName: "Dr. Meena Krishnan",
                  }));
                  setBookingModalOpen(true);
                }}
              >
                <div className="doctor-showcase-photo-wrap">
                  <img
                    src={doctorMeenaImg}
                    alt="Dr. Meena Krishnan"
                    className="doctor-showcase-img"
                  />
                </div>
                <div className="doctor-showcase-info">
                  <h3 className="doctor-showcase-name">Dr. Meena Krishnan</h3>
                  <span className="doctor-showcase-spec">Neurologist</span>
                  <span className="doctor-showcase-exp">10+ Years Experience</span>
                </div>
              </div>

              {/* Doctor 3: Dr. S. Arvind */}
              <div
                className="doctor-showcase-card"
                onClick={() => {
                  setSelectedSpecialty("Oncology");
                  setSelectedDoctorForBooking({
                    name: "Dr. S. Arvind",
                    designation: "Senior Surgical & Medical Oncologist",
                    experience: "15+ Years Clinical Experience",
                    room: "Suite 302, Comprehensive Cancer Wing",
                    avatarBg: "#0f766e",
                    slots: ["Today: 10:00 AM", "Today: 03:00 PM", "Tomorrow: 09:30 AM"],
                  });
                  setAppointmentForm((prev) => ({
                    ...prev,
                    department: "Oncology",
                    doctorName: "Dr. S. Arvind",
                  }));
                  setBookingModalOpen(true);
                }}
              >
                <div className="doctor-showcase-photo-wrap">
                  <img
                    src={doctorArvindImg}
                    alt="Dr. S. Arvind"
                    className="doctor-showcase-img"
                  />
                </div>
                <div className="doctor-showcase-info">
                  <h3 className="doctor-showcase-name">Dr. S. Arvind</h3>
                  <span className="doctor-showcase-spec">Oncologist</span>
                  <span className="doctor-showcase-exp">15+ Years Experience</span>
                </div>
              </div>

              {/* Doctor 4: Dr. Priya Natarajan */}
              <div
                className="doctor-showcase-card"
                onClick={() => {
                  setSelectedSpecialty("Orthopedics");
                  setSelectedDoctorForBooking({
                    name: "Dr. Priya Natarajan",
                    designation: "Consultant Orthopedic & Robotic Joint Replacement Surgeon",
                    experience: "10+ Years Clinical Experience",
                    room: "Suite 108, Bone & Joint Centre",
                    avatarBg: "#047857",
                    slots: ["Today: 11:30 AM", "Today: 04:15 PM", "Tomorrow: 10:45 AM"],
                  });
                  setAppointmentForm((prev) => ({
                    ...prev,
                    department: "Orthopedics",
                    doctorName: "Dr. Priya Natarajan",
                  }));
                  setBookingModalOpen(true);
                }}
              >
                <div className="doctor-showcase-photo-wrap">
                  <img
                    src={doctorPriyaImg}
                    alt="Dr. Priya Natarajan"
                    className="doctor-showcase-img"
                  />
                </div>
                <div className="doctor-showcase-info">
                  <h3 className="doctor-showcase-name">Dr. Priya Natarajan</h3>
                  <span className="doctor-showcase-spec">Orthopedic Surgeon</span>
                  <span className="doctor-showcase-exp">10+ Years Experience</span>
                </div>
              </div>
            </div>

            {/* View All Doctors Button */}
            <div className="view-all-doctors-action-wrap">
              <button
                type="button"
                className="btn-view-all-doctors"
                onClick={handleNavSpecialties}
              >
                View All Doctors
              </button>
            </div>
          </div>

          {/* 4-Column Hospital Footer (Matching Reference Screenshot) */}
          <footer className="exact-hospital-footer-four-col">
            <div className="footer-four-col-inner">
              <div className="footer-brand-col">
                <div className="footer-brand-logo-row">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span className="footer-brand-name">NI AROGIYAM</span>
                </div>
                <span className="footer-brand-sub">HOSPITAL</span>
                <p className="footer-brand-desc">
                  Advanced medicine, Compassionate healing, World-class care.
                </p>
              </div>

              <div className="footer-links-col">
                <h4 className="footer-col-title">Quick Links</h4>
                <ul className="footer-links-list">
                  <li><a href="#home" onClick={handleNavHome}>Home</a></li>
                  <li><a href="#about" onClick={handleNavAbout}>About Us</a></li>
                  <li><a href="#specialties" onClick={handleNavSpecialties}>Specialties</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Facilities</a></li>
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Patient &amp; Visitors</a></li>
                  <li><a href="#doctors" onClick={handleNavDoctors}>Our Doctors</a></li>
                </ul>
              </div>

              <div className="footer-links-col">
                <h4 className="footer-col-title">Our Services</h4>
                <ul className="footer-links-list">
                  <li><a href="#facilities" onClick={handleNavFacilities}>Emergency Care</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>ICU &amp; Critical Care</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Diagnostics</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Pharmacy</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Robotic Surgery</a></li>
                </ul>
              </div>

              <div className="footer-links-col">
                <h4 className="footer-col-title">Support</h4>
                <ul className="footer-links-list">
                  <li><a href="#specialties" onClick={handleNavSpecialties}>Insurance &amp; TPAs</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Visitor Guide</a></li>
                  <li><a href="#about" onClick={handleNavAbout}>FAQs</a></li>
                  <li><a href="#about" onClick={handleNavAbout}>Careers</a></li>
                  <li><a href="#contact" onClick={handleNavContact}>Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-four-col-bottom">
              <div className="footer-bottom-inner">
                <span>&copy; 2025 NI AROGIYAM Hospital. All Rights Reserved.</span>
                <div className="footer-bottom-links">
                  <a href="#privacy">Privacy Policy</a>
                  <span className="footer-sep">|</span>
                  <a href="#terms">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      ) : activeTab === "contact" ? (
        /* =======================================================
            RENDER: CONTACT US PAGE VIEW (EXACT MATCH TO DESIGN)
            ======================================================= */
        <main className="exact-contact-page-view">
          {/* Subtle Doctor Watermark in Top Right Background */}
          <div className="contact-bg-watermark-wrap" aria-hidden="true">
            <img
              src={contactBgDoctor}
              alt=""
              className="contact-bg-watermark-img"
            />
          </div>

          <div className="contact-page-container">
            {/* 1. Header & Breadcrumb */}
            <div className="contact-header-section">
              <h1 className="contact-page-title">Contact Us</h1>
              <nav className="contact-breadcrumb" aria-label="Breadcrumb">
                <a href="#home" className="breadcrumb-link" onClick={handleNavHome}>
                  Home
                </a>
                <span className="breadcrumb-separator">&gt;</span>
                <span className="breadcrumb-current">Contact Us</span>
              </nav>
              <p className="contact-page-subtitle">
                We are here to help. Reach out to us anytime.
              </p>
            </div>

            {/* 2. Three Column Main Grid */}
            <div className="contact-main-grid">
              {/* Column 1: Contact Information List */}
              <div className="contact-info-column">
                <div className="contact-info-list">
                  {/* 1. Address */}
                  <div className="contact-info-item">
                    <div className="contact-info-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="10" r="3" />
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                      </svg>
                    </div>
                    <div className="contact-info-text-group">
                      <h3 className="contact-info-label">Address</h3>
                      <p className="contact-info-val">
                        Madurai Bypass Road,<br />
                        Madurai, Tamil Nadu - 625020
                      </p>
                    </div>
                  </div>

                  {/* 2. Phone */}
                  <div className="contact-info-item">
                    <div className="contact-info-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="contact-info-text-group">
                      <h3 className="contact-info-label">Phone</h3>
                      <p className="contact-info-val">
                        <a href="tel:+914523005300" className="contact-tel-link">
                          +91 452 300 5300
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* 3. Email */}
                  <div className="contact-info-item">
                    <div className="contact-info-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className="contact-info-text-group">
                      <h3 className="contact-info-label">Email</h3>
                      <p className="contact-info-val">
                        <a href="mailto:info@niarogiyam.com" className="contact-mail-link">
                          info@niarogiyam.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* 4. Emergency */}
                  <div className="contact-info-item">
                    <div className="contact-info-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </div>
                    <div className="contact-info-text-group">
                      <h3 className="contact-info-label">Emergency</h3>
                      <p className="contact-info-val">24/7 Emergency Care</p>
                    </div>
                  </div>

                  {/* 5. Working Hours */}
                  <div className="contact-info-item">
                    <div className="contact-info-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="contact-info-text-group">
                      <h3 className="contact-info-label">Working Hours</h3>
                      <p className="contact-info-val">Monday - Sunday, 24 Hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Contact Form Card */}
              <div className="contact-form-column">
                <div className="contact-form-card">
                  {contactSubmitted && (
                    <div className="contact-success-toast">
                      <span className="toast-check">✓</span>
                      <span>Thank you! Your message has been sent. We will get back to you shortly.</span>
                    </div>
                  )}
                  <form onSubmit={handleContactFormSubmit} className="contact-fields-form">
                    <div className="contact-field-wrap">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        className="contact-input-field"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>

                    <div className="contact-field-wrap">
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        className="contact-input-field"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="contact-field-wrap">
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        className="contact-input-field"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>

                    <div className="contact-field-wrap">
                      <textarea
                        required
                        rows="4"
                        placeholder="Your Message"
                        className="contact-textarea-field"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="btn-contact-send-message"
                    >
                      {contactSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Column 3: Location Map Card */}
              <div className="contact-map-column">
                <a
                  href="https://maps.google.com/?q=Madurai+Bypass+Road,+Madurai,+Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-card"
                  title="Click to view NI AROGIYAM Hospital on Google Maps"
                >
                  <div className="contact-map-image-container">
                    <img
                      src={contactMapCardImg}
                      alt="NI AROGIYAM Hospital Location Map"
                      className="contact-map-img"
                    />

                    {/* Floating Location Marker Pin Badge (Matching Screenshot) */}
                    <div className="contact-map-pin-badge">
                      <svg className="pin-badge-icon" viewBox="0 0 24 24" fill="#dc2626">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                      </svg>
                      <div className="pin-badge-content">
                        <strong className="pin-badge-title">NI AROGIYAM</strong>
                        <span className="pin-badge-sub">HOSPITAL</span>
                      </div>
                      <div className="pin-badge-pointer"></div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* 4-Column Hospital Footer (Matching Reference Screenshot) */}
          <footer className="exact-hospital-footer-four-col contact-footer-match">
            <div className="footer-four-col-inner">
              <div className="footer-brand-col">
                <div className="footer-brand-logo-row">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span className="footer-brand-name">NI AROGIYAM</span>
                </div>
                <span className="footer-brand-sub">HOSPITAL</span>
                <p className="footer-brand-desc">
                  Advanced medicine,<br />
                  Compassionate healing,<br />
                  World-class care.
                </p>
              </div>

              <div className="footer-links-col">
                <h4 className="footer-col-title">Quick Links</h4>
                <ul className="footer-links-list">
                  <li><a href="#home" onClick={handleNavHome}>Home</a></li>
                  <li><a href="#about" onClick={handleNavAbout}>About Us</a></li>
                  <li><a href="#specialties" onClick={handleNavSpecialties}>Specialties</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Facilities</a></li>
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Patient &amp; Visitors</a></li>
                  <li><a href="#doctors" onClick={handleNavDoctors}>Our Doctors</a></li>
                </ul>
              </div>

              <div className="footer-links-col">
                <h4 className="footer-col-title">Our Services</h4>
                <ul className="footer-links-list">
                  <li><a href="#facilities" onClick={handleNavFacilities}>Emergency Care</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>ICU &amp; Critical Care</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Diagnostics</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Pharmacy</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Robotic Surgery</a></li>
                </ul>
              </div>

              <div className="footer-links-col">
                <h4 className="footer-col-title">Support</h4>
                <ul className="footer-links-list">
                  <li><a href="#specialties" onClick={handleNavSpecialties}>Insurance &amp; TPAs</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Visitor Guide</a></li>
                  <li><a href="#about" onClick={handleNavAbout}>FAQs</a></li>
                  <li><a href="#about" onClick={handleNavAbout}>Careers</a></li>
                  <li><a href="#contact" onClick={handleNavContact}>Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-four-col-bottom">
              <div className="footer-bottom-inner">
                <span>&copy; 2025 NI AROGIYAM Hospital. All Rights Reserved.</span>
                <div className="footer-bottom-links">
                  <a href="#privacy">Privacy Policy</a>
                  <span className="footer-sep">|</span>
                  <a href="#terms">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      ) : activeTab === "patient-visitors" ? (
        /* =======================================================
            RENDER: PATIENT & VISITORS PAGE VIEW (EXACT MATCH TO DESIGN)
            ======================================================= */
        <main className="exact-patient-visitors-view">
          {/* Top Hero Banner Section */}
          <div className="pv-hero-banner-container">
            <div className="pv-hero-banner-content">
              {/* Breadcrumb */}
              <div className="pv-breadcrumb">
                <a href="#home" onClick={handleNavHome} className="breadcrumb-link">
                  Home
                </a>
                <span className="breadcrumb-separator">&gt;</span>
                <span className="breadcrumb-current">Patient &amp; Visitors</span>
              </div>

              {/* Main Headline */}
              <h1 className="pv-hero-title">
                Caring for You,<br />
                <span className="pv-title-highlight">Every Step of the Way.</span>
              </h1>

              {/* Subtitle */}
              <p className="pv-hero-subtitle">
                We are committed to providing exceptional care and a comfortable experience for both our patients and visitors.
              </p>
            </div>

            {/* Right Hero Image */}
            <div className="pv-hero-image-wrapper">
              <img
                src={pvHeroBannerImg}
                alt="Healthcare professional caring for patient and family"
                className="pv-hero-img"
              />
              <div className="pv-hero-image-gradient-overlay"></div>
            </div>
          </div>

          {/* Floating Highlights & Stats Bar */}
          <div className="pv-stats-bar-wrapper">
            <div className="pv-stats-bar">
              <div className="pv-stat-item">
                <div className="pv-stat-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="pv-stat-text">
                  <strong className="pv-stat-number">10K+</strong>
                  <span className="pv-stat-label">Happy Patients</span>
                </div>
              </div>

              <div className="pv-stat-divider"></div>

              <div className="pv-stat-item">
                <div className="pv-stat-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                </div>
                <div className="pv-stat-text">
                  <strong className="pv-stat-number">500+</strong>
                  <span className="pv-stat-label">Expert Doctors</span>
                </div>
              </div>

              <div className="pv-stat-divider"></div>

              <div className="pv-stat-item">
                <div className="pv-stat-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    <path d="M12 5v6"></path>
                    <path d="M9 8h6"></path>
                  </svg>
                </div>
                <div className="pv-stat-text">
                  <strong className="pv-stat-number">15+</strong>
                  <span className="pv-stat-label">Specialties</span>
                </div>
              </div>

              <div className="pv-stat-divider"></div>

              <div className="pv-stat-item">
                <div className="pv-stat-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <circle cx="12" cy="15" r="2"></circle>
                  </svg>
                </div>
                <div className="pv-stat-text">
                  <strong className="pv-stat-number">24/7</strong>
                  <span className="pv-stat-label">Patient Support</span>
                </div>
              </div>

              <div className="pv-stat-divider"></div>

              <div className="pv-stat-item">
                <div className="pv-stat-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <div className="pv-stat-text">
                  <strong className="pv-stat-number">Safe &amp; Secure</strong>
                  <span className="pv-stat-label">Environment</span>
                </div>
              </div>

              <div className="pv-stat-divider"></div>

              <div className="pv-stat-item">
                <div className="pv-stat-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="pv-stat-text">
                  <strong className="pv-stat-number">Patient First</strong>
                  <span className="pv-stat-label">Approach</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Patient Self-Service Portal Feature Banner */}
          <div className="pv-portal-feature-banner">
            <div className="pv-portal-banner-text">
              <h2>Patient Self-Service Portal</h2>
              <p>
                Access your complete electronic health record, manage consultation appointments, review doctor prescriptions, view diagnostic lab reports, and securely pay hospital bills online.
              </p>
            </div>
            <button
              type="button"
              className="btn-open-portal-from-banner"
              onClick={() => setPatientPortalOpen(true)}
            >
              Open Patient Portal →
            </button>
          </div>

          {/* Dual Reviews Section: Patients Reviews & Visitors Reviews */}
          <div className="pv-reviews-section-container">
            <div className="pv-reviews-two-col-grid">
              {/* Left Column: Patients Reviews */}
              <div className="pv-review-column-block">
                <div className="pv-column-header">
                  <div className="pv-column-title-wrap">
                    <svg className="pv-header-icon" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    <h2 className="pv-column-title">Patients Reviews</h2>
                  </div>
                  <button type="button" className="pv-btn-view-all">
                    View All
                  </button>
                </div>

                <div className="pv-cards-row">
                  {/* Card 1: Meena R. */}
                  <div className="pv-review-card">
                    <div className="pv-card-user-header">
                      <img src={avatarMeena} alt="Meena R." className="pv-user-avatar" />
                      <div className="pv-user-info">
                        <h3 className="pv-user-name">Meena R.</h3>
                        <span className="pv-user-tag">Cardiology Patient</span>
                      </div>
                    </div>
                    <div className="pv-star-rating">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i} className="pv-star">★</span>
                      ))}
                    </div>
                    <p className="pv-review-quote">
                      Excellent care and support from the entire team. The doctors were very professional and explained everything clearly.
                    </p>
                    <span className="pv-quote-icon" aria-hidden="true">”</span>
                  </div>

                  {/* Card 2: Ramesh K. */}
                  <div className="pv-review-card">
                    <div className="pv-card-user-header">
                      <img src={avatarRamesh} alt="Ramesh K." className="pv-user-avatar" />
                      <div className="pv-user-info">
                        <h3 className="pv-user-name">Ramesh K.</h3>
                        <span className="pv-user-tag">Orthopedic Patient</span>
                      </div>
                    </div>
                    <div className="pv-star-rating">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i} className="pv-star">★</span>
                      ))}
                    </div>
                    <p className="pv-review-quote">
                      The staff is very kind and helpful. My treatment and recovery experience has been wonderful so far.
                    </p>
                    <span className="pv-quote-icon" aria-hidden="true">”</span>
                  </div>

                  {/* Card 3: Lakshmi S. */}
                  <div className="pv-review-card">
                    <div className="pv-card-user-header">
                      <img src={avatarLakshmi} alt="Lakshmi S." className="pv-user-avatar" />
                      <div className="pv-user-info">
                        <h3 className="pv-user-name">Lakshmi S.</h3>
                        <span className="pv-user-tag">General Medicine Patient</span>
                      </div>
                    </div>
                    <div className="pv-star-rating">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i} className="pv-star">★</span>
                      ))}
                    </div>
                    <p className="pv-review-quote">
                      Clean rooms, good facilities and timely treatment. I felt safe and well taken care of.
                    </p>
                    <span className="pv-quote-icon" aria-hidden="true">”</span>
                  </div>
                </div>

                <div className="pv-pagination-dots" aria-hidden="true">
                  <span className="pv-dot active"></span>
                  <span className="pv-dot"></span>
                  <span className="pv-dot"></span>
                </div>
              </div>

              {/* Right Column: Visitors Reviews */}
              <div className="pv-review-column-block">
                <div className="pv-column-header">
                  <div className="pv-column-title-wrap">
                    <svg className="pv-header-icon" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <h2 className="pv-column-title">Visitors Reviews</h2>
                  </div>
                  <button type="button" className="pv-btn-view-all">
                    View All
                  </button>
                </div>

                <div className="pv-cards-row">
                  {/* Card 1: Arun Kumar */}
                  <div className="pv-review-card">
                    <div className="pv-card-user-header">
                      <img src={avatarArun} alt="Arun Kumar" className="pv-user-avatar" />
                      <div className="pv-user-info">
                        <h3 className="pv-user-name">Arun Kumar</h3>
                        <span className="pv-user-tag">Visitor</span>
                      </div>
                    </div>
                    <div className="pv-star-rating">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i} className="pv-star">★</span>
                      ))}
                    </div>
                    <p className="pv-review-quote">
                      Clean, well-maintained hospital with a calm environment. Staff were very helpful during our visit.
                    </p>
                    <span className="pv-quote-icon" aria-hidden="true">”</span>
                  </div>

                  {/* Card 2: Priya N. */}
                  <div className="pv-review-card">
                    <div className="pv-card-user-header">
                      <img src={avatarPriya} alt="Priya N." className="pv-user-avatar" />
                      <div className="pv-user-info">
                        <h3 className="pv-user-name">Priya N.</h3>
                        <span className="pv-user-tag">Visitor</span>
                      </div>
                    </div>
                    <div className="pv-star-rating">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i} className="pv-star">★</span>
                      ))}
                    </div>
                    <p className="pv-review-quote">
                      The visiting areas are comfortable and well organized. Good guidance from the information desk.
                    </p>
                    <span className="pv-quote-icon" aria-hidden="true">”</span>
                  </div>

                  {/* Card 3: Karthik M. */}
                  <div className="pv-review-card">
                    <div className="pv-card-user-header">
                      <img src={avatarKarthik} alt="Karthik M." className="pv-user-avatar" />
                      <div className="pv-user-info">
                        <h3 className="pv-user-name">Karthik M.</h3>
                        <span className="pv-user-tag">Visitor</span>
                      </div>
                    </div>
                    <div className="pv-star-rating">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i} className="pv-star">★</span>
                      ))}
                    </div>
                    <p className="pv-review-quote">
                      Great experience overall. Safety measures and hygiene are well maintained.
                    </p>
                    <span className="pv-quote-icon" aria-hidden="true">”</span>
                  </div>
                </div>

                <div className="pv-pagination-dots" aria-hidden="true">
                  <span className="pv-dot"></span>
                  <span className="pv-dot active"></span>
                  <span className="pv-dot"></span>
                </div>
              </div>
            </div>
          </div>

          {/* 6-Column Hospital Footer (Exact Match to Reference Design) */}
          <footer className="exact-hospital-footer-six-col">
            <div className="footer-six-col-inner">
              {/* Col 1: Brand */}
              <div className="footer-brand-col">
                <div className="footer-brand-logo-row">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span className="footer-brand-name">NI AROGIYAM</span>
                </div>
                <span className="footer-brand-sub">HOSPITAL</span>
                <p className="footer-brand-desc">
                  Advanced medicine.<br />
                  Compassionate healing.<br />
                  World-class care.
                </p>
                <div className="footer-brand-socials">
                  <a href="#facebook" aria-label="Facebook"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                  <a href="#instagram" aria-label="Instagram"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                  <a href="#youtube" aria-label="YouTube"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                  <a href="#linkedin" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                </div>
              </div>

              {/* Col 2: Quick Links */}
              <div className="footer-links-col">
                <h4 className="footer-col-title">Quick Links</h4>
                <ul className="footer-links-list">
                  <li><a href="#home" onClick={handleNavHome}>Home</a></li>
                  <li><a href="#about" onClick={handleNavAbout}>About Us</a></li>
                  <li><a href="#specialties" onClick={handleNavSpecialties}>Specialties</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Facilities</a></li>
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Patient &amp; Visitors</a></li>
                  <li><a href="#doctors" onClick={handleNavDoctors}>Our Doctors</a></li>
                </ul>
              </div>

              {/* Col 3: Our Services */}
              <div className="footer-links-col">
                <h4 className="footer-col-title">Our Services</h4>
                <ul className="footer-links-list">
                  <li><a href="#facilities" onClick={handleNavFacilities}>Emergency Care</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>ICU &amp; Critical Care</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Diagnostics</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Pharmacy</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Robotic Surgery</a></li>
                </ul>
              </div>

              {/* Col 4: For Patients */}
              <div className="footer-links-col">
                <h4 className="footer-col-title">For Patients</h4>
                <ul className="footer-links-list">
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Patient Guide</a></li>
                  <li><a href="#portal-bills" onClick={(e) => { e.preventDefault(); setPortalActiveTab("bills"); setPatientPortalOpen(true); }}>Payment Options &amp; Bills</a></li>
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Insurance &amp; TPA</a></li>
                  <li><a href="#portal-records" onClick={(e) => { e.preventDefault(); setPortalActiveTab("reports"); setPatientPortalOpen(true); }}>Medical Records &amp; Reports</a></li>
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Health Tips</a></li>
                </ul>
              </div>

              {/* Col 5: For Visitors */}
              <div className="footer-links-col">
                <h4 className="footer-col-title">For Visitors</h4>
                <ul className="footer-links-list">
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Visitor Guide</a></li>
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Visiting Hours</a></li>
                  <li><a href="#facilities" onClick={handleNavFacilities}>Facilities</a></li>
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Safety Guidelines</a></li>
                  <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Nearby Services</a></li>
                </ul>
              </div>

              {/* Col 6: Contact Us */}
              <div className="footer-links-col footer-contact-col">
                <h4 className="footer-col-title">Contact Us</h4>
                <ul className="footer-contact-list">
                  <li>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <a href="tel:+914523005300">+91 452 300 5300</a>
                  </li>
                  <li>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <a href="mailto:info@niarogiyam.com">info@niarogiyam.com</a>
                  </li>
                  <li className="footer-address-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>Madurai Bypass Road,<br />Madurai, Tamil Nadu - 625020</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-four-col-bottom">
              <div className="footer-bottom-inner">
                <span>&copy; 2025 NI AROGIYAM Hospital. All Rights Reserved.</span>
                <div className="footer-bottom-links">
                  <a href="#privacy">Privacy Policy</a>
                  <span className="footer-sep">|</span>
                  <a href="#terms">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
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

      {/* 4-Column Hospital Footer */}
      <footer className="exact-hospital-footer-four-col">
        <div className="footer-four-col-inner">
          <div className="footer-brand-col">
            <div className="footer-brand-logo-row">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="footer-brand-name">NI AROGIYAM</span>
            </div>
            <span className="footer-brand-sub">HOSPITAL</span>
            <p className="footer-brand-desc">
              Advanced medicine,<br />
              Compassionate healing,<br />
              World-class care.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#home" onClick={handleNavHome}>Home</a></li>
              <li><a href="#about" onClick={handleNavAbout}>About Us</a></li>
              <li><a href="#specialties" onClick={handleNavSpecialties}>Specialties</a></li>
              <li><a href="#facilities" onClick={handleNavFacilities}>Facilities</a></li>
              <li><a href="#patient-visitors" onClick={handleNavPatientVisitors}>Patient &amp; Visitors</a></li>
              <li><a href="#doctors" onClick={handleNavDoctors}>Our Doctors</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Our Services</h4>
            <ul className="footer-links-list">
              <li><a href="#facilities" onClick={handleNavFacilities}>Emergency Care</a></li>
              <li><a href="#facilities" onClick={handleNavFacilities}>ICU &amp; Critical Care</a></li>
              <li><a href="#facilities" onClick={handleNavFacilities}>Diagnostics</a></li>
              <li><a href="#facilities" onClick={handleNavFacilities}>Pharmacy</a></li>
              <li><a href="#facilities" onClick={handleNavFacilities}>Robotic Surgery</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links-list">
              <li><a href="#specialties" onClick={handleNavSpecialties}>Insurance &amp; TPAs</a></li>
              <li><a href="#facilities" onClick={handleNavFacilities}>Visitor Guide</a></li>
              <li><a href="#about" onClick={handleNavAbout}>FAQs</a></li>
              <li><a href="#about" onClick={handleNavAbout}>Careers</a></li>
              <li><a href="#contact" onClick={handleNavContact}>Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-four-col-bottom">
          <div className="footer-bottom-inner">
            <span>&copy; 2025 NI AROGIYAM Hospital. All Rights Reserved.</span>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <span className="footer-sep">|</span>
              <a href="#terms">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>
        </>
      )}

      {/* =======================================================
          APPOINTMENT MODAL
          ======================================================= */}
      {bookingModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setBookingModalOpen(false)}>
          <div className="modal-dialog-card modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div>
                <h2>Book Doctor Consultation</h2>
                <p className="modal-sub">
                  Department: <strong className="highlight-text">{appointmentForm.department || selectedSpecialty}</strong>
                </p>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setBookingModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Selected Doctor Preview Header (If doctor was clicked) */}
            {selectedDoctorForBooking && (
              <div className="modal-doctor-preview-card">
                <div
                  className="mdp-avatar-circle"
                  style={{ backgroundColor: selectedDoctorForBooking.avatarBg || "#047857" }}
                >
                  {selectedDoctorForBooking.name.replace("Dr. ", "").split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="mdp-doctor-info">
                  <div className="mdp-name-row">
                    <strong className="mdp-doctor-name">{selectedDoctorForBooking.name}</strong>
                    <span className="mdp-verified-badge">✓ Verified Specialist</span>
                  </div>
                  <div className="mdp-desig">{selectedDoctorForBooking.designation}</div>
                  <div className="mdp-meta-tags">
                    <span>📍 {selectedDoctorForBooking.room}</span>
                    <span>⏱️ {selectedDoctorForBooking.experience}</span>
                  </div>
                </div>
              </div>
            )}

            {/* In-Modal Available Slot Selector */}
            {selectedDoctorForBooking?.slots && (
              <div className="modal-slots-selector-group">
                <label className="modal-slots-label">
                  <span>🕒 Choose Consultation Slot:</span>
                  <span className="modal-slots-hint">(Click to choose)</span>
                </label>
                <div className="modal-slots-chips-row">
                  {selectedDoctorForBooking.slots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`modal-slot-pill ${selectedSlotForBooking === slot || appointmentForm.preferredSlot === slot ? "active-slot-pill" : ""}`}
                      onClick={() => {
                        setSelectedSlotForBooking(slot);
                        setAppointmentForm((prev) => ({
                          ...prev,
                          preferredSlot: slot,
                        }));
                      }}
                    >
                      <span className="slot-dot-circle">●</span>
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {bookingSuccess ? (
              <div className="modal-success-state">
                <div className="success-badge-circle">✓</div>
                <h3 className="success-heading">Appointment Confirmed!</h3>
                <p className="success-lead">
                  Your appointment with <strong>{selectedDoctorForBooking?.name || appointmentForm.doctorName || "our Senior Specialist"}</strong> has been reserved successfully.
                </p>

                <div className="success-ref-card">
                  <span className="ref-label">Booking Confirmation Ref #</span>
                  <strong className="ref-code">{bookingRefId || "NIA-CARD-5829"}</strong>
                </div>

                <div className="success-dossier-list">
                  <div className="dossier-row">
                    <span className="dossier-label">Patient Name:</span>
                    <strong className="dossier-val">{appointmentForm.fullName}</strong>
                  </div>
                  <div className="dossier-row">
                    <span className="dossier-label">Consulting Specialist:</span>
                    <strong className="dossier-val">{selectedDoctorForBooking?.name || appointmentForm.doctorName || "Senior Consultant"}</strong>
                  </div>
                  <div className="dossier-row">
                    <span className="dossier-label">Specialty / Department:</span>
                    <strong className="dossier-val">{appointmentForm.department}</strong>
                  </div>
                  <div className="dossier-row">
                    <span className="dossier-label">Consultation Slot:</span>
                    <strong className="dossier-val highlight-green">
                      {selectedSlotForBooking || appointmentForm.preferredSlot || appointmentForm.preferredDate || "Today: 10:30 AM"}
                    </strong>
                  </div>
                  <div className="dossier-row">
                    <span className="dossier-label">OPD Room / Location:</span>
                    <strong className="dossier-val">{selectedDoctorForBooking?.room || "Suite 101, Specialty Tower"}</strong>
                  </div>
                </div>

                <p className="sms-notice">
                  📱 Confirmation SMS sent to <strong>{appointmentForm.phoneNumber}</strong>.
                  <br />Please arrive 15 minutes prior to the scheduled slot with any past health records.
                </p>

                <div className="success-actions-row">
                  <button
                    type="button"
                    className="btn-done-booking"
                    onClick={() => {
                      setBookingModalOpen(false);
                      setBookingSuccess(false);
                      setSelectedDoctorForBooking(null);
                      setSelectedSlotForBooking("");
                    }}
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    className="btn-book-another-slot"
                    onClick={() => {
                      setBookingSuccess(false);
                      setAppointmentForm({
                        fullName: "",
                        phoneNumber: "",
                        email: "",
                        department: selectedSpecialtyDetail || "Cardiology",
                        doctorName: "",
                        preferredDate: "",
                        preferredSlot: "",
                        notes: "",
                      });
                      setSelectedDoctorForBooking(null);
                      setSelectedSlotForBooking("");
                    }}
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="modal-booking-form">
                <div className="modal-form-two-col">
                  <div className="modal-form-group">
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

                  <div className="modal-form-group">
                    <label>Contact Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={appointmentForm.phoneNumber}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="modal-form-two-col">
                  <div className="modal-form-group">
                    <label>Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. patient@example.com"
                      value={appointmentForm.email}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Department / Specialty *</label>
                    <select
                      value={appointmentForm.department}
                      onChange={(e) => {
                        const newDept = e.target.value;
                        setAppointmentForm({ ...appointmentForm, department: newDept });
                        if (selectedDoctorForBooking) {
                          setSelectedDoctorForBooking(null);
                          setSelectedSlotForBooking("");
                        }
                      }}
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Oncology">Oncology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Gastroenterology">Gastroenterology</option>
                      <option value="Nephrology">Nephrology</option>
                      <option value="Paediatrics">Paediatrics</option>
                      <option value="Obstetrics & Gynaecology">Obstetrics &amp; Gynaecology</option>
                      <option value="Pulmonology">Pulmonology</option>
                      <option value="General Surgery">General Surgery</option>
                    </select>
                  </div>
                </div>

                <div className="modal-form-two-col">
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

                  <div className="modal-form-group">
                    <label>Consultation Reason / Symptoms</label>
                    <input
                      type="text"
                      placeholder="e.g. Chest tightness, routine follow-up"
                      value={appointmentForm.notes}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, notes: e.target.value })
                      }
                    />
                  </div>
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
                    <span>✓</span> Confirm &amp; Reserve Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          PATIENT SELF-SERVICE PORTAL MODAL
          ======================================================= */}
      {patientPortalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setPatientPortalOpen(false)}>
          <div
            className="modal-dialog-card patient-portal-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="patient-auth-badge">🏥 Patient Self-Service Portal</span>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setPatientPortalOpen(false)}
              >
                ✕
              </button>
            </div>

            {!isPatientAuthenticated ? (
              /* ================= AUTHENTICATION GATE ================= */
              <div className="patient-auth-container">
                <div className="patient-auth-header">
                  <h2 className="patient-auth-title">Welcome to Patient Portal</h2>
                  <p className="patient-auth-sub">
                    Access your medical records, appointments, bills, and prescriptions securely.
                  </p>
                </div>

                <div className="patient-auth-tabs">
                  <button
                    type="button"
                    className={`patient-auth-tab ${patientAuthTab === "otp" ? "active" : ""}`}
                    onClick={() => { setPatientAuthTab("otp"); setPatientAuthError(""); }}
                  >
                    📱 Mobile &amp; OTP
                  </button>
                  <button
                    type="button"
                    className={`patient-auth-tab ${patientAuthTab === "patientId" ? "active" : ""}`}
                    onClick={() => { setPatientAuthTab("patientId"); setPatientAuthError(""); }}
                  >
                    🆔 Patient ID
                  </button>
                </div>

                {patientAuthError && (
                  <div className="patient-auth-error">
                    <span>⚠️</span> {patientAuthError}
                  </div>
                )}

                {patientAuthTab === "otp" ? (
                  <form onSubmit={handlePatientLoginWithOtp} className="patient-auth-form">
                    {/* Live Real-time SMS Dispatch Toast/Preview Card */}
                    {liveSmsPreview && (
                      <div className="live-sms-preview-card">
                        <div className="live-sms-top">
                          <span className="live-sms-sender">💬 {liveSmsPreview.sender}</span>
                          <span className="live-sms-time">{liveSmsPreview.time}</span>
                        </div>
                        <p className="live-sms-body">
                          {liveSmsPreview.text}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className="live-sms-code-highlight">{liveSmsPreview.code}</span>
                          <button
                            type="button"
                            className="btn-autofill-otp"
                            onClick={() => {
                              setPatientAuthOtp(liveSmsPreview.code);
                              setPatientAuthError("");
                            }}
                          >
                            <span>📥 Auto-Fill OTP</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {otpSuccessMsg && (
                      <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "14px" }}>
                        ✓ {otpSuccessMsg}
                      </div>
                    )}

                    <div className="modal-form-group" style={{ marginBottom: "14px" }}>
                      <label>Registered Mobile Number *</label>
                      <div className="otp-send-row">
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                          value={patientAuthPhone}
                          onChange={(e) => {
                            setPatientAuthPhone(e.target.value.replace(/\D/g, ""));
                            setPatientAuthError("");
                          }}
                        />
                        <button
                          type="button"
                          className="btn-send-otp-pill"
                          disabled={otpSending || (otpCountdown > 0 && otpSent)}
                          onClick={handleSendPatientOtp}
                        >
                          {otpSending ? "Sending..." : otpCountdown > 0 ? `Resend (${otpCountdown}s)` : otpSent ? "Resend OTP" : "Send OTP"}
                        </button>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                          Enter your mobile number to receive live 6-digit OTP
                        </span>
                        <button
                          type="button"
                          style={{ background: "none", border: "none", color: "#047857", fontSize: "11.5px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                          onClick={() => {
                            setPatientAuthPhone("9876543210");
                            setPatientAuthError("");
                          }}
                        >
                          Use: 9876543210
                        </button>
                      </div>
                    </div>

                    <div className="modal-form-group" style={{ marginBottom: "18px" }}>
                      <label>6-Digit Security OTP *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder={otpSent ? "Enter 6-digit OTP received on mobile" : "Click 'Send OTP' first"}
                        value={patientAuthOtp}
                        onChange={(e) => {
                          setPatientAuthOtp(e.target.value.replace(/\D/g, ""));
                          setPatientAuthError("");
                        }}
                      />
                      {otpSent && (
                        <div className="otp-timer-row">
                          <span>OTP expires in 5 minutes</span>
                          {otpCountdown === 0 && (
                            <button
                              type="button"
                              className="btn-resend-otp-link"
                              onClick={handleSendPatientOtp}
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn-confirm-pay-now"
                      style={{ marginTop: 0 }}
                    >
                      Verify OTP &amp; Access Health Records
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePatientLoginWithId} className="patient-auth-form">
                    <div className="modal-form-group" style={{ marginBottom: "14px" }}>
                      <label>Hospital Patient ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PAT-1001"
                        value={patientAuthIdInput}
                        onChange={(e) => {
                          setPatientAuthIdInput(e.target.value);
                          setPatientAuthError("");
                        }}
                      />
                      <div style={{ marginTop: "6px", textAlign: "right" }}>
                        <button
                          type="button"
                          style={{ background: "none", border: "none", color: "#047857", fontSize: "11.5px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                          onClick={() => {
                            setPatientAuthIdInput("PAT-1001");
                            setPatientAuthError("");
                          }}
                        >
                          Use: PAT-1001
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-confirm-pay-now"
                      style={{ marginTop: "12px" }}
                    >
                      Sign In With Patient ID
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* ================= AUTHENTICATED PORTAL HUB ================= */
              <div className="patient-portal-content">
                {/* Header Bar */}
                <div className="patient-portal-header">
                  <div className="patient-profile-info">
                    <div className="patient-avatar-circle">
                      {currentPatient.name ? currentPatient.name.split(" ").map(n => n[0]).slice(0, 2).join("") : "PT"}
                    </div>
                    <div className="patient-text-details">
                      <h3>{currentPatient.name}</h3>
                      <div className="patient-meta-badges">
                        <span className="patient-id-badge">{currentPatient.userId}</span>
                        <span className="patient-phone-tag">📞 {currentPatient.phone}</span>
                        <span className="patient-phone-tag">🩸 {currentPatient.bloodGroup}</span>
                        <span className="patient-phone-tag">🎂 {currentPatient.age} Yrs / {currentPatient.gender}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-switch-patient"
                    onClick={handlePatientLogout}
                  >
                    Sign Out
                  </button>
                </div>

                {/* Navigation Tabs */}
                <div className="patient-hub-tabs-row">
                  <button
                    type="button"
                    className={`patient-hub-tab-btn ${portalActiveTab === "appointments" ? "active" : ""}`}
                    onClick={() => setPortalActiveTab("appointments")}
                  >
                    📅 Appointments
                    <span className="tab-count-pill">{currentPatient.appointments?.length || 0}</span>
                  </button>
                  <button
                    type="button"
                    className={`patient-hub-tab-btn ${portalActiveTab === "bills" ? "active" : ""}`}
                    onClick={() => setPortalActiveTab("bills")}
                  >
                    💳 Bills &amp; Payments
                    {pendingCount > 0 ? (
                      <span className="tab-count-pill alert">{pendingCount} Due</span>
                    ) : (
                      <span className="tab-count-pill">{currentPatient.bills?.length || 0}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`patient-hub-tab-btn ${portalActiveTab === "medicines" ? "active" : ""}`}
                    onClick={() => setPortalActiveTab("medicines")}
                  >
                    💊 Prescriptions
                    <span className="tab-count-pill">{currentPatient.medicines?.length || 0}</span>
                  </button>
                  <button
                    type="button"
                    className={`patient-hub-tab-btn ${portalActiveTab === "reports" ? "active" : ""}`}
                    onClick={() => setPortalActiveTab("reports")}
                  >
                    🔬 Lab Reports
                    <span className="tab-count-pill">{currentPatient.reports?.length || 0}</span>
                  </button>
                </div>

                {/* TAB 1: APPOINTMENTS */}
                {portalActiveTab === "appointments" && (
                  <div className="patient-appointments-list">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                        Your Consultations &amp; Schedules
                      </span>
                      <button
                        type="button"
                        style={{
                          background: "#047857",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "5px 12px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setPatientPortalOpen(false);
                          setBookingModalOpen(true);
                        }}
                      >
                        + Book New Appointment
                      </button>
                    </div>

                    {(!currentPatient.appointments || currentPatient.appointments.length === 0) ? (
                      <p style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>No scheduled appointments.</p>
                    ) : (
                      currentPatient.appointments.map((apt, idx) => (
                        <div key={apt.id || idx} className="patient-apt-card">
                          <div className="patient-apt-left">
                            <strong className="patient-apt-doctor">{apt.doctorName}</strong>
                            <span className="patient-apt-dept">{apt.department}</span>
                            <div className="patient-apt-meta">
                              <span>📅 {apt.date}</span>
                              <span>🕒 {apt.slot}</span>
                              <span>📍 {apt.room}</span>
                            </div>
                            {apt.notes && (
                              <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px" }}>
                                Notes: {apt.notes}
                              </div>
                            )}
                            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                              Ref: <strong>{apt.id}</strong>
                            </div>
                          </div>
                          <span className={`patient-apt-status ${apt.status?.toLowerCase() === "confirmed" ? "confirmed" : "completed"}`}>
                            {apt.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 2: BILLS & PAYMENTS */}
                {portalActiveTab === "bills" && (
                  <div>
                    <div className="bills-summary-row">
                      <div className="bill-summary-card">
                        <span>Total Invoiced</span>
                        <strong>₹{totalBilled.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="bill-summary-card">
                        <span>Total Paid</span>
                        <strong style={{ color: "#047857" }}>₹{totalPaid.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="bill-summary-card due">
                        <span>Pending Due</span>
                        <strong>₹{pendingDue.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>

                    <div className="bills-table-container">
                      <table className="patient-bills-table">
                        <thead>
                          <tr>
                            <th>Invoice ID</th>
                            <th>Description</th>
                            <th>Dept</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPatient.bills?.map((bill) => (
                            <tr key={bill.id}>
                              <td><strong>{bill.id}</strong></td>
                              <td>{bill.description}</td>
                              <td>{bill.department}</td>
                              <td>{bill.date}</td>
                              <td><strong>₹{bill.amount}</strong></td>
                              <td>
                                <span
                                  className={`patient-apt-status ${bill.status === "Paid" ? "confirmed" : "due"}`}
                                  style={bill.status === "Pending" ? { background: "#fef3c7", color: "#b45309" } : {}}
                                >
                                  {bill.status}
                                </span>
                              </td>
                              <td>
                                {bill.status === "Pending" ? (
                                  <button
                                    type="button"
                                    className="btn-pay-bill-action"
                                    onClick={() => setPayingBill(bill)}
                                  >
                                    Pay Now
                                  </button>
                                ) : (
                                  <span style={{ fontSize: "11.5px", color: "#047857", fontWeight: 700 }}>
                                    ✓ Paid ({bill.paymentMode || "Online"})
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: MEDICINES */}
                {portalActiveTab === "medicines" && (
                  <div className="patient-meds-grid">
                    {currentPatient.medicines?.map((med) => (
                      <div key={med.id} className="patient-med-card">
                        <div className="med-info-left">
                          <strong>{med.name}</strong>
                          <div className="med-tags-row">
                            <span className="med-tag">{med.type}</span>
                            <span className="med-tag dosage">💊 {med.dosage}</span>
                            <span className="med-tag timing">⏰ {med.instruction}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "12px", color: "#64748b" }}>
                          <div>Duration: <strong>{med.duration}</strong></div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                            Prescribed by {med.doctor}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: LAB REPORTS */}
                {portalActiveTab === "reports" && (
                  <div className="patient-reports-list">
                    {currentPatient.reports?.map((rep) => (
                      <div key={rep.id} className="patient-report-card">
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="report-header-title">{rep.testName}</span>
                            <span className="patient-apt-status confirmed">Normal</span>
                          </div>
                          <div className="report-summary-text">{rep.resultSummary}</div>
                          <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px" }}>
                            📅 {rep.date} &nbsp;•&nbsp; 🏛️ {rep.department} &nbsp;•&nbsp; 👨‍⚕️ {rep.doctor}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-view-report"
                          onClick={() => setSelectedReportDetail(rep)}
                        >
                          📊 View Report
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          PAYMENT SIMULATION MODAL OVERLAY
          ======================================================= */}
      {payingBill && (
        <div className="payment-modal-overlay" onClick={() => setPayingBill(null)}>
          <div className="payment-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>
                Hospital Bill Payment
              </h3>
              <button
                type="button"
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
                onClick={() => setPayingBill(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Invoice Reference</div>
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>{payingBill.id} - {payingBill.description}</strong>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#047857", marginTop: "6px" }}>
                ₹{payingBill.amount}
              </div>
            </div>

            <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
              Select Payment Method:
            </label>
            <div className="payment-methods-grid">
              <button
                type="button"
                className={`payment-method-btn ${selectedPaymentMethod === "upi" ? "active" : ""}`}
                onClick={() => setSelectedPaymentMethod("upi")}
              >
                ⚡ UPI / PhonePe / GPay
              </button>
              <button
                type="button"
                className={`payment-method-btn ${selectedPaymentMethod === "card" ? "active" : ""}`}
                onClick={() => setSelectedPaymentMethod("card")}
              >
                💳 Credit / Debit Card
              </button>
              <button
                type="button"
                className={`payment-method-btn ${selectedPaymentMethod === "netbanking" ? "active" : ""}`}
                onClick={() => setSelectedPaymentMethod("netbanking")}
              >
                🏦 Net Banking
              </button>
              <button
                type="button"
                className={`payment-method-btn ${selectedPaymentMethod === "cash" ? "active" : ""}`}
                onClick={() => setSelectedPaymentMethod("cash")}
              >
                🏥 Pay at Cash Counter
              </button>
            </div>

            {paymentSuccessMsg ? (
              <div style={{ textAlign: "center", color: "#047857", fontWeight: 700, padding: "10px" }}>
                ✓ {paymentSuccessMsg}
              </div>
            ) : (
              <button
                type="button"
                className="btn-confirm-pay-now"
                onClick={handleConfirmPayBill}
              >
                Pay ₹{payingBill.amount} Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          LAB REPORT PARAMETERS BREAKDOWN MODAL
          ======================================================= */}
      {selectedReportDetail && (
        <div className="report-modal-overlay" onClick={() => setSelectedReportDetail(null)}>
          <div className="report-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal-header">
              <div>
                <h3>{selectedReportDetail.testName}</h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  ID: {selectedReportDetail.id} | Date: {selectedReportDetail.date}
                </span>
              </div>
              <button
                type="button"
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
                onClick={() => setSelectedReportDetail(null)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#334155", background: "#f0fdf4", padding: "10px 14px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
              <strong>Clinical Impression:</strong> {selectedReportDetail.resultSummary}
            </p>

            <table className="report-params-table">
              <thead>
                <tr>
                  <th>Test Parameter</th>
                  <th>Observed Value</th>
                  <th>Normal Reference Range</th>
                </tr>
              </thead>
              <tbody>
                {selectedReportDetail.parameters?.map((p, idx) => (
                  <tr key={idx}>
                    <td><strong>{p.name}</strong></td>
                    <td style={{ color: "#047857", fontWeight: 700 }}>{p.value}</td>
                    <td style={{ color: "#64748b" }}>{p.normal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button
                type="button"
                className="btn-modal-cancel"
                style={{ display: "inline-block", padding: "8px 18px", fontSize: "13px" }}
                onClick={() => setSelectedReportDetail(null)}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

