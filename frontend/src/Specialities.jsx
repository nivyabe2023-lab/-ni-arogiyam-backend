import { useState } from "react";
import "./Specialities.css";
import { useNavigate } from "react-router-dom";

export default function Specialities() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDeptForModal, setSelectedDeptForModal] = useState(null);

  const categories = ["All", "Medical Specialities", "Surgical Specialities", "Super Specialities", "Critical & Diagnostic"];

  const departments = [
    {
      id: "cardiology",
      name: "Cardiology & Interventional Cardiac Care",
      category: "Super Specialities",
      icon: "🫀",
      hod: "Dr. Rajesh Sharma, MD, DM (Cardio), FACC",
      timing: "Mon - Sat: 9:00 AM - 4:00 PM",
      room: "OPD Suite 101-104 (Block A)",
      description: "Comprehensive cardiac services including 24x7 Primary Angioplasty (PAMI), Coronary Angiography, Pacemaker Implantation, 3D Echocardiography, and Heart Failure Clinic.",
      treatments: ["Coronary Angiography & Angioplasty", "Electrophysiology & Pacemaker", "Heart Failure Clinic", "Pediatric Cardiology", "TMT & Holter Monitoring"],
      bedCount: "35 Cardiac Beds + 8 CCU",
    },
    {
      id: "neurology",
      name: "Neurology & Neurosurgery",
      category: "Super Specialities",
      icon: "🧠",
      hod: "Dr. Priya Sundaram, MCh (Neurosurgery), FINR",
      timing: "Mon - Sat: 9:30 AM - 5:00 PM",
      room: "OPD Suite 201-205 (Neuro Block)",
      description: "Center of Excellence for Stroke Management (Thrombolysis & Thrombectomy), Brain & Spine Tumour Surgeries, Epilepsy Monitoring, Parkinson's & Movement Disorders.",
      treatments: ["Acute Stroke Care & Thrombolysis", "Micro-Neurosurgery & Spine Fixation", "Video EEG & Epilepsy Clinic", "Parkinson's & Dementia Care", "Neuro-Rehabilitation"],
      bedCount: "28 Neuro Beds + 6 Neuro-ICU",
    },
    {
      id: "oncology",
      name: "Medical & Surgical Oncology (Cancer Center)",
      category: "Super Specialities",
      icon: "🎗️",
      hod: "Dr. Arvind Swaminathan, MD, DM (Medical Oncology)",
      timing: "Mon - Sat: 8:30 AM - 4:30 PM",
      room: "Comprehensive Cancer Block (Level 1)",
      description: "State-of-the-art oncology care: Precision Chemotherapy, Immunotherapy, Advanced Minimally Invasive Onco-Surgery, Tumour Board Review, and Palliative Care.",
      treatments: ["Chemotherapy Daycare Infusion", "Targeted Therapy & Immunotherapy", "Surgical Tumor Resection", "Pain & Palliative Care", "Cancer Screening Panels"],
      bedCount: "30 Oncology Beds + 10 Daycare Infusion",
    },
    {
      id: "orthopaedics",
      name: "Orthopaedics & Robotic Joint Replacement",
      category: "Surgical Specialities",
      icon: "🦴",
      hod: "Dr. Vikram Sethupathi, MS (Ortho), MCh, Fellowship in Arthroplasty",
      timing: "Mon - Sat: 9:00 AM - 5:00 PM",
      room: "Orthopaedic Wing (Room 112-116)",
      description: "High-volume joint replacement unit: Robotic Total Knee & Hip Replacement, Complex Trauma & Polytrauma Care, Arthroscopic Sports Medicine, and Pediatric Orthopaedics.",
      treatments: ["Robotic Knee & Hip Replacement", "Arthroscopy (ACL / Meniscus Repair)", "Complex Fracture & Pelvic Trauma", "Spine Decompression & Fusion", "Physiotherapy & Sports Rehab"],
      bedCount: "40 Ortho Beds",
    },
    {
      id: "gastroenterology",
      name: "Gastroenterology & Hepato-Pancreato-Biliary",
      category: "Medical Specialities",
      icon: "🩺",
      hod: "Dr. Meenakshi Sundaram, MD, DM (Gastro)",
      timing: "Mon - Sat: 9:00 AM - 3:30 PM",
      room: "Endoscopy Suite & OPD 108",
      description: "Advanced Diagnostic & Therapeutic Endoscopy, Colonoscopy, ERCP, Liver Cirrhosis Management, Fatty Liver Clinic, and IBD (Crohn's/Colitis) Comprehensive Care.",
      treatments: ["Diagnostic & Therapeutic Endoscopy", "ERCP & Bile Duct Stenting", "Liver Disease & Hepatitis Care", "Capsule Endoscopy", "Gastrointestinal Bleed Management"],
      bedCount: "25 Beds + 4 Endoscopy Recovery",
    },
    {
      id: "nephrology",
      name: "Nephrology & 24/7 Hemodialysis Unit",
      category: "Medical Specialities",
      icon: "🧪",
      hod: "Dr. Suresh Chandran, MD, DM (Nephro)",
      timing: "Mon - Sat: 8:00 AM - 6:00 PM",
      room: "Dialysis Wing (Ground Floor)",
      description: "24x7 High-Flux Hemodialysis, Peritoneal Dialysis, Kidney Biopsy, Glomerular Disease Management, and Pre & Post Renal Transplant Care.",
      treatments: ["24x7 Hemodialysis & SLED", "Continuous Renal Replacement (CRRT)", "Kidney Biopsy & Nephrotic Care", "Hypertension & Diabetic Kidney Clinic", "Vascular Access (AV Fistula)"],
      bedCount: "20 Dialysis Stations + 15 Renal Beds",
    },
    {
      id: "paediatrics",
      name: "Paediatrics & Neonatal Intensive Care (NICU)",
      category: "Medical Specialities",
      icon: "👶",
      hod: "Dr. Radhika Narayanan, MD (Paed), DNB, FIAP",
      timing: "Mon - Sat: 8:30 AM - 6:00 PM",
      room: "Maternal & Child Block (Room 101)",
      description: "Comprehensive child healthcare: Level-3 NICU with HFOV, Pediatric Intensive Care (PICU), Growth & Development Assessment, and Vaccination Clinic.",
      treatments: ["Level-3 NICU & Transport Incubator", "Pediatric Pulmonology & Allergy", "Universal Newborn Hearing/Metabolic Screen", "Immunization & Developmental Clinic", "Pediatric Emergency Resuscitation"],
      bedCount: "10 NICU + 6 PICU + 25 Pediatric Beds",
    },
    {
      id: "obgyn",
      name: "Obstetrics, Gynaecology & Fetal Medicine",
      category: "Surgical Specialities",
      icon: "🤰",
      hod: "Dr. Gayathri Ramanathan, MS (OBG), DGO, FICOG",
      timing: "Mon - Sat: 9:00 AM - 5:00 PM",
      room: "Women's Health Center (Block C)",
      description: "High-Risk Pregnancy Care, 24x7 Labor Delivery Rooms (LDR), Laparoscopic Gynaecologic Surgery, Infertility Workup, and Fetal Ultrasound Screening.",
      treatments: ["Painless Labour & High-Risk Delivery", "Laparoscopic Hysterectomy & Myomectomy", "Fetal Anomaly & Genetic Scans", "Menopause & Adolescent Gynaecology", "Infertility & Colposcopy Clinic"],
      bedCount: "35 Maternity & Gynaec Beds + 4 LDR Suites",
    },
    {
      id: "pulmonology",
      name: "Pulmonology & Sleep Medicine",
      category: "Medical Specialities",
      icon: "🫁",
      hod: "Dr. Karthikeyan Balaji, MD (Chest), DTCD",
      timing: "Mon - Sat: 9:00 AM - 4:00 PM",
      room: "Pulmonary Lab (OPD 120)",
      description: "Interventional Pulmonology, Fiberoptic Bronchoscopy, Pulmonary Function Testing (PFT), Sleep Apnea Studies (Polysomnography), and Severe Asthma/COPD Care.",
      treatments: ["Fiberoptic Bronchoscopy & EBUS", "PFT (Spirometry & DLCO)", "Sleep Apnea Study & CPAP Titration", "Asthma & Allergy Immunotherapy", "Post-COVID Lung Rehabilitation"],
      bedCount: "20 Respiratory Care Beds",
    },
    {
      id: "generalsurgery",
      name: "General & Laparoscopic GI Surgery",
      category: "Surgical Specialities",
      icon: "🔪",
      hod: "Dr. Ananthakrishnan V., MS (Gen Surg), FIAGES",
      timing: "Mon - Sat: 9:00 AM - 5:00 PM",
      room: "Surgical Suites (Block B)",
      description: "Advanced 4K Minimal Access / Laparoscopic Surgeries: Gallbladder, Hernia, Appendix, Thyroid, Breast Surgery, and Emergency Abdominal Operations.",
      treatments: ["Laparoscopic Cholecystectomy & Hernia", "Laser Proctology (Piles, Fistula, Fissure)", "Thyroid & Parathyroid Surgery", "Emergency Abdominal Trauma Surgeries", "Diabetic Foot & Wound Care Unit"],
      bedCount: "40 Surgical Beds + 6 Major OTs",
    },
    {
      id: "emergency",
      name: "Emergency Medicine & Trauma Center",
      category: "Critical & Diagnostic",
      icon: "🚨",
      hod: "Dr. Samuel Jayaraj, MD (Emergency Medicine), MRCEM",
      timing: "24 Hours / 7 Days a Week",
      room: "Ground Floor Emergency Entrance",
      description: "Level-1 Trauma Center with dedicated Resuscitation Bays, Mobile Telemetry, Fast-Track Stroke/Cardiac Care, and Emergency OT.",
      treatments: ["Cardiopulmonary Resuscitation (ACLS)", "Polytrauma Resuscitation", "Acute Poisoning & Toxin Management", "Mass Casualty Triage", "Disaster Emergency Preparedness"],
      bedCount: "16 Emergency Beds + 4 Resus Bays",
    },
    {
      id: "radiology",
      name: "Radiology, CT / MRI & Interventional Imaging",
      category: "Critical & Diagnostic",
      icon: "📷",
      hod: "Dr. Lakshmi Narayanan, MD (Radio-Diagnosis)",
      timing: "24 Hours / 7 Days a Week",
      room: "Diagnostic Imaging Complex",
      description: "128-Slice Cardiac CT Scanner, 3.0 Tesla Silent MRI, Digital Mammography, 4D Colour Doppler Ultrasound, and Image-Guided Biopsy Services.",
      treatments: ["3.0 Tesla Whole-Body MRI", "128-Slice Low-Dose CT Angiography", "High-Resolution 4D Ultrasound & Doppler", "Digital X-Ray & OPG", "Image-Guided Interventional Biopsies"],
      bedCount: "Diagnostic Outpatient & Inpatient",
    },
  ];

  const filteredDepartments = departments.filter((dept) => {
    const matchesCategory = selectedCategory === "All" || dept.category === selectedCategory;
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.hod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const DEPARTMENT_SPECIALISTS = {
    cardiology: [
      {
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
          "Distinguished keynote faculty speaker at the World Heart Rhythm Congress (Geneva 2023)."
        ],
        slots: ["Today: 11:15 AM", "Today: 02:00 PM", "Tomorrow: 10:30 AM", "Tomorrow: 02:45 PM"],
        avatarBg: "#065f46"
      },
      {
        name: "Dr. K. Vigneshwaran",
        degrees: "MBBS, MS (General Surgery), MCh (Cardiothoracic Surgery), FIACS",
        designation: "Chief Cardiothoracic & Minimally Invasive Heart Surgeon",
        experience: "19+ Years Clinical Experience",
        rating: "4.8 ★ (520+ Verified Reviews)",
        timing: "Tue, Thu, Sat: 09:00 AM - 02:00 PM",
        room: "Suite 105, Surgical Pavilion",
        achievements: [
          "Over 4,200+ Open Heart Surgeries and Off-Pump Beating Heart Bypass (CABG) procedures completed.",
          "Maintains an exemplary zero-mortality track record across last 300 Minimally Invasive Valve Surgeries."
        ],
        slots: ["Today: 01:15 PM", "Tomorrow: 09:30 AM", "Tomorrow: 11:30 AM"],
        avatarBg: "#0d9488"
      },
      {
        name: "Dr. Meera Nambiar",
        degrees: "MBBS, MD (Pediatrics), DNB (Cardiology), Fellowship in Pediatric Cardiology (AIIMS)",
        designation: "Senior Pediatric Cardiologist & Congenital Heart Specialist",
        experience: "13+ Years Clinical Experience",
        rating: "4.9 ★ (340+ Verified Reviews)",
        timing: "Mon - Sat: 10:30 AM - 03:30 PM",
        room: "Suite 106, Mother & Child Heart Wing",
        achievements: [
          "Successfully treated 1,500+ infants with congenital heart defects via non-surgical ASD/VSD device closures.",
          "All-India Gold Medalist in Pediatric Cardiology from All India Institute of Medical Sciences (AIIMS)."
        ],
        slots: ["Today: 12:00 PM", "Today: 03:00 PM", "Tomorrow: 10:45 AM"],
        avatarBg: "#0f766e"
      }
    ],
    neurology: [
      {
        name: "Dr. Priya Sundaram",
        degrees: "MBBS, MS, MCh (Neurosurgery), FINR, FAANS (USA)",
        designation: "HOD & Chief Neurosurgeon & Spine Specialist",
        experience: "20+ Years Clinical Experience",
        rating: "4.9 ★ (580+ Verified Reviews)",
        timing: "Mon - Sat: 09:30 AM - 04:00 PM",
        room: "Suite 201, Neuro Sciences Wing",
        achievements: [
          "Pioneer in Minimally Invasive Keyhole Brain & Spine Tumor Resections with over 4,500 surgeries.",
          "Established the Region's First Comprehensive Neuro-Endovascular Aneurysm Coiling Center."
        ],
        slots: ["Today: 11:00 AM", "Today: 03:15 PM", "Tomorrow: 10:00 AM"],
        avatarBg: "#047857"
      }
    ]
  };

  const getSpecialistsForDept = (dept) => {
    if (DEPARTMENT_SPECIALISTS[dept.id]) {
      return DEPARTMENT_SPECIALISTS[dept.id];
    }
    return [
      {
        name: dept.hod.split(",")[0],
        degrees: dept.hod.split(",").slice(1).join(",").trim(),
        designation: `Head of Department - ${dept.name.split("&")[0]}`,
        experience: "18+ Years Clinical Experience",
        rating: "4.9 ★ (450+ Verified Reviews)",
        timing: dept.timing,
        room: dept.room,
        achievements: [
          `Supervised over 8,000+ patient procedures and clinical cases in ${dept.name.split("&")[0]}.`,
          "Distinguished keynote speaker and fellow at regional & national medical congresses.",
          "Published over 25+ research papers in indexed medical journals."
        ],
        slots: ["Today: 10:30 AM", "Today: 02:30 PM", "Tomorrow: 11:00 AM", "Tomorrow: 04:00 PM"],
        avatarBg: "#047857"
      }
    ];
  };

  const handleBookAppointment = (dept, doctor = null, slot = "") => {
    navigate("/appointments", {
      state: {
        preferredDepartment: dept.name,
        preferredDoctor: doctor ? doctor.name : dept.hod,
        preferredSlot: slot
      }
    });
  };

  return (
    <div className="specialities-page">
      {/* HEADER SECTION */}
      <div className="specialities-hero">
        <div className="specialities-hero-badge">ST. JOHN'S CLINICAL EXCELLENCE</div>
        <h1>Clinical Departments & Specialities</h1>
        <p>
          World-class multidisciplinary clinical care delivered by renowned professors, senior consultants,
          and fellowship-trained super-specialists across 25+ medical disciplines.
        </p>

        {/* SEARCH & CATEGORY BAR */}
        <div className="specialities-filter-row">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search department, doctor specialist, or clinical procedure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>

          <div className="category-pill-group">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DEPARTMENT CARDS GRID */}
      <div className="departments-grid">
        {filteredDepartments.map((dept) => (
          <div key={dept.id} className="department-card">
            <div className="dept-header">
              <span className="dept-icon">{dept.icon}</span>
              <span className="dept-category-tag">{dept.category}</span>
            </div>

            <h2 className="dept-title">{dept.name}</h2>
            <p className="dept-desc">{dept.description}</p>

            <div className="dept-meta-box">
              <div className="meta-row">
                <span className="meta-label">👨‍⚕️ Head of Department:</span>
                <strong className="meta-val">{dept.hod}</strong>
              </div>

              <div className="meta-row">
                <span className="meta-label">⏰ OPD Consultation Timings:</span>
                <span className="meta-val">{dept.timing}</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">📍 Location:</span>
                <span className="meta-val">{dept.room}</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">🛏️ Bed Capacity:</span>
                <span className="meta-val highlight">{dept.bedCount}</span>
              </div>
            </div>

            <div className="dept-treatments">
              <span className="treatments-heading">Key Specialised Procedures:</span>
              <div className="treatment-chips">
                {dept.treatments.map((t, idx) => (
                  <span key={idx} className="treatment-chip">
                    • {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="dept-actions">
              <button
                type="button"
                className="btn-view-specialists"
                onClick={() => setSelectedDeptForModal(dept)}
              >
                👨‍⚕️ View Specialists &amp; Available Slots
              </button>
              <button
                type="button"
                className="btn-book-dept"
                onClick={() => handleBookAppointment(dept)}
              >
                📅 Book Appointment in {dept.name.split(" ")[0]}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="no-departments-found">
          <span>🔍</span>
          <h3>No matching clinical departments found</h3>
          <p>Try searching for another specialty or select "All" categories.</p>
        </div>
      )}

      {/* DEPARTMENT SPECIALISTS & SLOTS MODAL */}
      {selectedDeptForModal && (
        <div className="dept-modal-backdrop" onClick={() => setSelectedDeptForModal(null)}>
          <div className="dept-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dept-modal-header">
              <div className="dmh-info">
                <span className="dmh-icon">{selectedDeptForModal.icon}</span>
                <div>
                  <h2>{selectedDeptForModal.name}</h2>
                  <p className="dmh-sub">
                    📍 {selectedDeptForModal.room} &nbsp;•&nbsp; ⏰ {selectedDeptForModal.timing}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-close-dept-modal"
                onClick={() => setSelectedDeptForModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="dept-modal-body">
              <div className="dm-intro-banner">
                <p>
                  <strong>{selectedDeptForModal.name}</strong> specialists at NI AROGIYAM Hospital. Review verified clinical achievements, years of experience, and directly book an OPD consultation slot.
                </p>
              </div>

              <div className="specialists-list-container">
                {getSpecialistsForDept(selectedDeptForModal).map((doc, dIdx) => (
                  <div key={dIdx} className="specialist-modal-card">
                    <div className="smc-header">
                      <div
                        className="smc-avatar"
                        style={{ backgroundColor: doc.avatarBg || "#047857" }}
                      >
                        {doc.name.replace("Dr. ", "").split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>

                      <div className="smc-info">
                        <div className="smc-name-row">
                          <h3 className="smc-name">{doc.name}</h3>
                          <span className="smc-badge">✓ Verified Specialist</span>
                        </div>
                        <div className="smc-degrees">{doc.degrees}</div>
                        <div className="smc-desig">{doc.designation}</div>

                        <div className="smc-meta-row">
                          <span className="smc-exp-pill">⏱️ {doc.experience}</span>
                          <span className="smc-rating-pill">⭐ {doc.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="smc-achievements-box">
                      <strong className="ach-title">🏆 Key Achievements &amp; Clinical Milestones:</strong>
                      <ul className="ach-list">
                        {doc.achievements.map((ach, aIdx) => (
                          <li key={aIdx}>
                            <span className="ach-bullet">✓</span> {ach}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="smc-slots-box">
                      <strong className="slots-label">🕒 Available Consultation Slots:</strong>
                      <div className="smc-slots-row">
                        {doc.slots.map((slot, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            className="btn-modal-slot-chip"
                            onClick={() => {
                              setSelectedDeptForModal(null);
                              handleBookAppointment(selectedDeptForModal, doc, slot);
                            }}
                            title={`Book with ${doc.name} for ${slot}`}
                          >
                            ● {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="smc-footer">
                      <button
                        type="button"
                        className="btn-book-specialist-direct"
                        onClick={() => {
                          setSelectedDeptForModal(null);
                          handleBookAppointment(selectedDeptForModal, doc, doc.slots[0] || "");
                        }}
                      >
                        📅 Book Appointment with {doc.name.split(" ")[1] || doc.name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
