import { useState } from "react";
import "./HealthPackages.css";
import { useNavigate } from "react-router-dom";

export default function HealthPackages() {
  const navigate = useNavigate();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState("");

  const [bookForm, setBookForm] = useState({
    patientName: "",
    phoneNumber: "",
    preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    preferredTime: "Morning (08:00 AM - 11:00 AM Fasting)",
    notes: "",
  });

  const packages = [
    {
      id: "cardiac",
      title: "Comprehensive Cardiac Health Package",
      tagline: "Total Cardiovascular Risk Assessment & Prevention",
      icon: "🫀",
      price: 3500,
      originalPrice: 6200,
      discount: "43% Off",
      recommendedFor: "Men & Women above 30, individuals with hypertension, smoking, or family history of heart disease",
      fastingHours: "10-12 Hours Over-Night Fasting Required",
      inclusions: [
        "12-Lead Electrocardiogram (ECG)",
        "2D Echocardiography with Colour Doppler (ECHO)",
        "Treadmill Stress Test (TMT / Stress ECG)",
        "Comprehensive Lipid Profile (Cholesterol, HDL, LDL, VLDL, Triglycerides)",
        "Fasting Blood Sugar (FBS) & Post Prandial (PPBS)",
        "Glycosylated Haemoglobin (HbA1c - 3 Months Average)",
        "Serum Creatinine & Blood Urea Nitrogen (Renal Profile)",
        "Complete Blood Count (CBC) with ESR & Platelet Count",
        "Urine Routine & Microscopic Examination",
        "Clinical Consultation with Senior Consultant Cardiologist",
        "Dietary & Lifestyle Risk Assessment Session",
      ],
    },
    {
      id: "executive",
      title: "Executive Master Health Checkup",
      tagline: "Complete Whole-Body Health Evaluation for Working Professionals",
      icon: "🔬",
      price: 4999,
      originalPrice: 9500,
      discount: "47% Off",
      recommendedFor: "Corporate executives, professionals aged 35+, annual preventive health checkup",
      fastingHours: "10-12 Hours Fasting Required",
      inclusions: [
        "Complete Hemogram (24 Parameters CBC with ESR)",
        "Comprehensive Liver Function Test (LFT - SGOT, SGPT, Bilirubin, Protein)",
        "Comprehensive Renal / Kidney Profile (Urea, Creatinine, Uric Acid, Electrolytes)",
        "Complete Lipid Profile (Heart & Arterial Lipid Risk)",
        "Fasting Blood Glucose & HbA1c (Diabetes Screen)",
        "Thyroid Profile (Free T3, Free T4, Ultrasensitive TSH)",
        "Digital Chest X-Ray (PA View)",
        "Ultrasound Whole Abdomen & Pelvis (USG Abdomen)",
        "12-Lead Resting ECG & Pulmonary Function Spirometry",
        "Urine Complete Routine & Microscopy",
        "Stool Occult Blood (Colorectal Screen)",
        "Comprehensive Physician & General Medicine Review",
        "Nutritional & Cardiac Wellness Counseling",
      ],
    },
    {
      id: "womens",
      title: "Women's Wellness & Master Health Package",
      tagline: "Dedicated Female Health, Breast & Cervical Cancer Screening",
      icon: "👩",
      price: 2999,
      originalPrice: 5800,
      discount: "48% Off",
      recommendedFor: "Women of all ages (21+), annual gynaecological wellness and cancer screening",
      fastingHours: "8-10 Hours Fasting Recommended",
      inclusions: [
        "Pap Smear Cytology (Liquid Based Cervical Cancer Screen)",
        "High-Resolution Bilateral Breast Ultrasound / Mammography (as per age)",
        "Ultrasound Pelvis & Uterus (Trans-Abdominal / TVS)",
        "Complete Blood Count (CBC) & Iron Deficiency Screen (Serum Ferritin)",
        "Thyroid Stimulating Hormone (TSH)",
        "Fasting Blood Sugar & Lipid Profile",
        "Serum Calcium, Vitamin D3 & Vitamin B12 Levels",
        "Urine Routine & Culture Screening",
        "Detailed Consultation with Senior Consultant Gynaecologist",
        "Breast Self-Examination Guidance & Reproductive Health Counseling",
      ],
    },
    {
      id: "senior",
      title: "Senior Citizen Comprehensive Health Package",
      tagline: "Geriatric Wellness, Bone Health & Vital Organ Screening",
      icon: "🩺",
      price: 3200,
      originalPrice: 6000,
      discount: "46% Off",
      recommendedFor: "Senior citizens (Aged 55+), pensioners and elderly family members",
      fastingHours: "10-12 Hours Fasting Required",
      inclusions: [
        "Bone Mineral Density (BMD / DEXA Bone Health Assessment)",
        "Serum Calcium, Phosphorus & Alkaline Phosphatase",
        "Comprehensive Renal Function Test with eGFR",
        "Liver Function & Lipid Panel",
        "HbA1c & Fasting / PP Glucose",
        "Serum Prostate Specific Antigen (PSA for Men) / Pap Smear (Women)",
        "12-Lead ECG & Chest X-Ray",
        "Serum Vitamin B12 & Vitamin D3 (Nerve & Muscle Health)",
        "Geriatric Vision & Hearing Screening Test",
        "Consultation with Senior Geriatric Specialist / Physician",
        "Physiotherapy Mobility & Fall-Risk Evaluation",
      ],
    },
    {
      id: "diabetic",
      title: "Diabetic Care & Renal Wellness Package",
      tagline: "Advanced Glycemic Control, Kidney & Retinal Microvascular Assessment",
      icon: "🩸",
      price: 1800,
      originalPrice: 3400,
      discount: "47% Off",
      recommendedFor: "Known diabetics, pre-diabetics, and metabolic syndrome screening",
      fastingHours: "12 Hours Fasting + 2 Hours Post Breakfast",
      inclusions: [
        "Fasting Blood Sugar (FBS)",
        "Post-Prandial Blood Sugar (PPBS)",
        "Glycosylated Haemoglobin (HbA1c)",
        "Urinary Microalbumin / Creatinine Ratio (Early Kidney Damage Screen)",
        "Serum Creatinine, Blood Urea & eGFR",
        "Complete Lipid Profile",
        "Diabetic Neuropathy Foot Biothesiometry Screen",
        "Dilated Fundus Examination (Diabetic Retinopathy Eye Screen)",
        "Consultation with Diabetologist / Endocrine Specialist",
        "Certified Diabetes Educator & Diet Plan",
      ],
    },
    {
      id: "child",
      title: "Child Health & Immunization Package",
      tagline: "Pediatric Growth, Immunity & Nutritional Wellness",
      icon: "👶",
      price: 1500,
      originalPrice: 2800,
      discount: "46% Off",
      recommendedFor: "Infants, toddlers and children aged 0 to 16 years",
      fastingHours: "No Fasting Needed",
      inclusions: [
        "Complete Blood Count (CBC) with Anemia Panel",
        "Serum Ferritin & Iron Studies",
        "Blood Grouping & Rh Typing",
        "Urine Routine & Microscopy",
        "Stool Routine (Intestinal Parasite Screen)",
        "Comprehensive Growth & Developmental Milestones Check",
        "Pediatric Vision & Dental Screening",
        "National Immunization Chart Review & Vaccine Catch-up",
        "Consultation with Senior Pediatrician",
        "Child Nutrition & Immunity Counseling",
      ],
    },
  ];

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!bookForm.patientName || !bookForm.phoneNumber) {
      alert("Please enter patient name and contact number.");
      return;
    }
    setBookingSuccess(
      `✅ Health Package "${selectedPkg.title}" confirmed for ${bookForm.patientName} on ${bookForm.preferredDate} (${bookForm.preferredTime})! Token: #PKG-${Math.floor(
        10000 + Math.random() * 90000
      )}. A confirmation SMS with fasting instructions has been sent to ${bookForm.phoneNumber}.`
    );
    setSelectedPkg(null);
  };

  return (
    <div className="health-packages-page">
      {/* HERO SECTION */}
      <div className="packages-hero">
        <div className="packages-hero-badge">ST. JOHN'S PREVENTIVE MEDICINE</div>
        <h1>Preventive & Executive Health Packages</h1>
        <p>
          Early detection saves lives. Choose from comprehensive, evidence-based health checkup packages
          designed by senior clinicians with same-day reports and expert specialist consultations.
        </p>
      </div>

      {bookingSuccess && (
        <div className="package-alert-success">
          <span className="alert-icon">🎉</span>
          <div className="alert-text">
            <strong>Package Appointment Confirmed!</strong>
            <p>{bookingSuccess}</p>
          </div>
          <button className="alert-close" onClick={() => setBookingSuccess("")}>
            ✕
          </button>
        </div>
      )}

      {/* PACKAGES GRID */}
      <div className="packages-grid">
        {packages.map((pkg) => (
          <div key={pkg.id} className="package-card">
            <div className="package-card-top">
              <div className="pkg-icon-badge">{pkg.icon}</div>
              <span className="pkg-discount-pill">{pkg.discount}</span>
            </div>

            <h2 className="pkg-title">{pkg.title}</h2>
            <p className="pkg-tagline">{pkg.tagline}</p>

            <div className="pkg-price-row">
              <div className="pkg-price">
                <span className="currency">Rs. </span>
                <span className="amount">{pkg.price.toLocaleString("en-IN")}</span>
              </div>
              <span className="original-price">
                Rs. {pkg.originalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="pkg-info-box">
              <div className="info-line">
                <span className="info-label">🎯 Best For:</span>
                <span className="info-val">{pkg.recommendedFor}</span>
              </div>
              <div className="info-line">
                <span className="info-label">⏱️ Fasting:</span>
                <span className="info-val highlight">{pkg.fastingHours}</span>
              </div>
            </div>

            <div className="pkg-inclusions">
              <span className="inclusions-heading">
                Package Includes ({pkg.inclusions.length} Tests &amp; Consultations):
              </span>
              <ul className="inclusions-list">
                {pkg.inclusions.map((item, idx) => (
                  <li key={idx}>
                    <span className="check-bullet">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pkg-footer">
              <button
                type="button"
                className="btn-book-package"
                onClick={() => setSelectedPkg(pkg)}
              >
                📅 Book Health Package (Rs. {pkg.price})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedPkg && (
        <div className="pkg-modal-overlay">
          <div className="pkg-modal-card">
            <div className="pkg-modal-header">
              <div>
                <h2>Book Health Package</h2>
                <p>{selectedPkg.title} - Rs. {selectedPkg.price.toLocaleString("en-IN")}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedPkg(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="pkg-modal-form">
              <div className="form-group">
                <label>Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter patient's name"
                  value={bookForm.patientName}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, patientName: e.target.value })
                  }
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={bookForm.phoneNumber}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, phoneNumber: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Checkup Date *</label>
                  <input
                    type="date"
                    required
                    value={bookForm.preferredDate}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, preferredDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Time Slot (Fasting Protocol)</label>
                <select
                  value={bookForm.preferredTime}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, preferredTime: e.target.value })
                  }
                >
                  <option>Morning (08:00 AM - 10:00 AM Fasting)</option>
                  <option>Morning (10:00 AM - 12:00 PM Fasting)</option>
                  <option>Afternoon (02:00 PM - 04:00 PM Non-Fasting/PP)</option>
                </select>
              </div>

              <div className="fasting-notice">
                <span>⚠️</span>
                <div>
                  <strong>Fasting Instruction:</strong>
                  <p>{selectedPkg.fastingHours}. Water is permitted.</p>
                </div>
              </div>

              <div className="pkg-modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setSelectedPkg(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-package">
                  ✓ Confirm Checkup Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
