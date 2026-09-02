import { useState } from "react";
import "./Specialities.css";
import { useNavigate } from "react-router-dom";

export default function Specialities() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const handleBookAppointment = (dept) => {
    navigate("/appointments", { state: { preferredDepartment: dept.name, preferredDoctor: dept.hod } });
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
    </div>
  );
}
