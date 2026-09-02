import { useState } from "react";
import "./PatientGuide.css";

export default function PatientGuide() {
  const [selectedWard, setSelectedWard] = useState("semi-private");
  const [stayDays, setStayDays] = useState(3);
  const [includeNursing, setIncludeNursing] = useState(true);
  const [includeDiet, setIncludeDiet] = useState(true);

  const wardTariffs = [
    {
      id: "general",
      name: "General Multi-Bed Ward",
      roomRent: 600,
      nursingCharge: 300,
      dietCharge: 250,
      features: [
        "Curtain-partitioned hospital bed with central oxygen",
        "Nurse call buzzer system & 24/7 on-duty nursing care",
        "Shared sanitized washrooms & patient locker",
        "1 Attendant pass permitted",
      ],
      icon: "🛏️",
    },
    {
      id: "semi-private",
      name: "Semi-Private Room (Twin Sharing)",
      roomRent: 1800,
      nursingCharge: 500,
      dietCharge: 350,
      features: [
        "Twin sharing air-conditioned room with television",
        "Attached bathroom with 24/7 hot water",
        "Comfortable attendant couch & personal storage",
        "Dedicated bedside nursing assistance",
      ],
      icon: "👥",
    },
    {
      id: "deluxe",
      name: "Private Single Deluxe Room",
      roomRent: 3500,
      nursingCharge: 800,
      dietCharge: 450,
      features: [
        "Exclusive private air-conditioned patient room",
        "Recliner sofa bed for attendant & smart LED TV",
        "Private attached ensuite bathroom & mini refrigerator",
        "Personalized clinical dietary meal service",
      ],
      icon: "⭐",
    },
    {
      id: "suite",
      name: "Executive Super Deluxe Suite",
      roomRent: 6500,
      nursingCharge: 1200,
      dietCharge: 600,
      features: [
        "Two-room luxury suite (Patient room + Visitor lounge)",
        "Motorized multi-function hospital bed",
        "Sofa seating, dining area, microwave & refrigerator",
        "Dedicated VIP relationship manager & prioritized services",
      ],
      icon: "👑",
    },
    {
      id: "icu",
      name: "Intensive Care Unit (ICU / CCU / MICU)",
      roomRent: 5000,
      nursingCharge: 2000,
      dietCharge: 400,
      features: [
        "1:1 Dedicated Critical Care Certified Nurse",
        "Advanced Dräger Ventilator & Philips Multi-para Telemetry",
        "24/7 In-House Intensivist & Cardiologist supervision",
        "Strict sterile barrier nursing & HEPA positive air flow",
      ],
      icon: "🚨",
    },
  ];

  const currentWardObj = wardTariffs.find((w) => w.id === selectedWard) || wardTariffs[0];

  const dailyTotal =
    currentWardObj.roomRent +
    (includeNursing ? currentWardObj.nursingCharge : 0) +
    (includeDiet ? currentWardObj.dietCharge : 0);

  const estimatedTotal = dailyTotal * Math.max(1, parseInt(stayDays) || 1);

  return (
    <div className="guide-page">
      {/* HERO BANNER */}
      <div className="guide-hero">
        <div className="guide-hero-badge">ST. JOHN'S PATIENT &amp; VISITOR INFORMATION</div>
        <h1>Patient &amp; Visitor Hospital Guide</h1>
        <p>
          Everything you need to know about Inpatient Admissions, Room Tariffs, Visiting Hours,
          Discharge Formalities, and Campus Amenities.
        </p>
      </div>

      {/* SECTION 1: INPATIENT TARIFF CALCULATOR */}
      <div className="guide-card">
        <div className="guide-card-header">
          <div>
            <h2>🛏️ Inpatient Ward &amp; Room Tariff Estimate Calculator</h2>
            <p className="card-desc">
              Transparent, standardized room tariff structure with no hidden fees.
            </p>
          </div>
        </div>

        <div className="calculator-grid">
          {/* SELECTION CONTROLS */}
          <div className="calc-controls">
            <label className="calc-label">1. Select Ward / Room Category:</label>
            <div className="ward-select-grid">
              {wardTariffs.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`ward-option-btn ${selectedWard === w.id ? "active" : ""}`}
                  onClick={() => setSelectedWard(w.id)}
                >
                  <span className="ward-opt-icon">{w.icon}</span>
                  <div className="ward-opt-text">
                    <strong>{w.name}</strong>
                    <small>Rs. {w.roomRent.toLocaleString("en-IN")} / Day</small>
                  </div>
                </button>
              ))}
            </div>

            <div className="calc-row-2 mt-16">
              <div>
                <label className="calc-label">2. Estimated Length of Stay (Days):</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={stayDays}
                  onChange={(e) => setStayDays(e.target.value)}
                  className="calc-input"
                />
              </div>

              <div className="addon-checks">
                <label className="calc-label">3. Included Daily Services:</label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={includeNursing}
                    onChange={(e) => setIncludeNursing(e.target.checked)}
                  />
                  <span>Bedside Nursing Care (Rs. {currentWardObj.nursingCharge}/day)</span>
                </label>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={includeDiet}
                    onChange={(e) => setIncludeDiet(e.target.checked)}
                  />
                  <span>Therapeutic Nutrition / Meal Plan (Rs. {currentWardObj.dietCharge}/day)</span>
                </label>
              </div>
            </div>
          </div>

          {/* ESTIMATE RESULT BOX */}
          <div className="calc-summary-card">
            <h3>Estimated Room &amp; Care Charges</h3>
            <div className="ward-badge-selected">
              <span>{currentWardObj.icon}</span>
              <strong>{currentWardObj.name}</strong>
            </div>

            <div className="summary-breakdown">
              <div className="summary-line">
                <span>Room Rent ({stayDays} Days @ Rs. {currentWardObj.roomRent}):</span>
                <strong>Rs. {(currentWardObj.roomRent * stayDays).toLocaleString("en-IN")}</strong>
              </div>

              {includeNursing && (
                <div className="summary-line">
                  <span>Nursing Charges ({stayDays} Days @ Rs. {currentWardObj.nursingCharge}):</span>
                  <strong>Rs. {(currentWardObj.nursingCharge * stayDays).toLocaleString("en-IN")}</strong>
                </div>
              )}

              {includeDiet && (
                <div className="summary-line">
                  <span>Therapeutic Meals ({stayDays} Days @ Rs. {currentWardObj.dietCharge}):</span>
                  <strong>Rs. {(currentWardObj.dietCharge * stayDays).toLocaleString("en-IN")}</strong>
                </div>
              )}

              <div className="summary-total-line">
                <span>Estimated Tariff Total:</span>
                <strong className="total-amount">Rs. {estimatedTotal.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="ward-features-box">
              <small>Room Inclusions:</small>
              <ul>
                {currentWardObj.features.map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: VISITING HOURS & GUIDELINES */}
      <div className="guide-grid-2 mt-24">
        <div className="guide-card">
          <div className="guide-card-header">
            <h2>⏰ Hospital Visiting Hours Policy</h2>
          </div>
          <p className="card-desc">
            To ensure patient recovery and infection control, visiting hours are strictly monitored.
          </p>

          <div className="visiting-schedule-list">
            <div className="schedule-item">
              <span className="sched-badge green">General &amp; Private Wards</span>
              <div className="sched-times">
                <strong>Evening Visiting: 04:00 PM – 07:00 PM (Daily)</strong>
                <p>Maximum 1 visitor permitted at bedside with a valid Hospital Attendant Pass.</p>
              </div>
            </div>

            <div className="schedule-item">
              <span className="sched-badge red">Intensive Care Units (ICU / CCU / MICU)</span>
              <div className="sched-times">
                <strong>Morning: 11:00 AM – 12:00 PM | Evening: 05:00 PM – 06:00 PM</strong>
                <p>Only 1 immediate family member allowed in sterile ICU attire. Hand sanitization mandatory.</p>
              </div>
            </div>

            <div className="schedule-item">
              <span className="sched-badge blue">Neonatal &amp; Pediatric ICU (NICU / PICU)</span>
              <div className="sched-times">
                <strong>Parents Only (24/7 Guided Mother-Infant Care)</strong>
                <p>Mother permitted for breastfeeding and Kangaroo Mother Care as advised by neonatologist.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: ADMISSION & DISCHARGE PROCESS */}
        <div className="guide-card">
          <div className="guide-card-header">
            <h2>📋 Admission &amp; Discharge Steps</h2>
          </div>
          <p className="card-desc">
            Standard operating procedure for smooth inpatient admission and billing discharge.
          </p>

          <div className="process-steps-list">
            <div className="process-step">
              <div className="step-num">1</div>
              <div>
                <strong>Admission Desk (Ground Floor)</strong>
                <p>Present doctor's admission slip and Aadhaar card. Complete registration and select ward category.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-num">2</div>
              <div>
                <strong>Initial Deposit &amp; Bed Allotment</strong>
                <p>Pay initial admission deposit (or submit TPA cashless approval card). Escort to allotted room.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-num">3</div>
              <div>
                <strong>Doctor Discharge Order (Morning 09:00 AM - 11:00 AM)</strong>
                <p>Treating consultant signs discharge summary with prescribed home medications and diet advice.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-num">4</div>
              <div>
                <strong>Billing Settlement &amp; Medication Handover</strong>
                <p>Clear final pharmacy and hospital bill at Billing Counter. Receive take-home medicines and seal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: CAMPUS AMENITIES */}
      <div className="guide-card mt-24">
        <div className="guide-card-header">
          <h2>🏥 Campus Amenities &amp; Support Services</h2>
        </div>
        <p className="card-desc">
          Conveniences provided within the hospital campus for patients, attendants, and visitors.
        </p>

        <div className="amenities-grid">
          <div className="amenity-item">
            <span className="amenity-icon">💊</span>
            <strong>24/7 In-House Pharmacy</strong>
            <p>Ground floor Main Porch &amp; Emergency wing. Genuine pharmaceuticals and surgical consumables.</p>
          </div>

          <div className="amenity-item">
            <span className="amenity-icon">🧪</span>
            <strong>24/7 Diagnostic &amp; Blood Bank</strong>
            <p>NABL accredited pathology labs, 128-slice CT, 3.0T MRI, and regional blood transfusion center.</p>
          </div>

          <div className="amenity-item">
            <span className="amenity-icon">☕</span>
            <strong>Dietary &amp; Multi-Cuisine Cafeteria</strong>
            <p>Hygienic vegetarian and non-vegetarian meals, fresh juices, and specialized patient dietary services.</p>
          </div>

          <div className="amenity-item">
            <span className="amenity-icon">🏧</span>
            <strong>24/7 Bank ATMs (SBI &amp; HDFC)</strong>
            <p>Located near the main entrance lobby and inpatient billing lounge for cash withdrawals.</p>
          </div>

          <div className="amenity-item">
            <span className="amenity-icon">🅿️</span>
            <strong>Multi-Level Parking &amp; Valet</strong>
            <p>Spacious multi-level parking for 400+ cars with 24/7 security surveillance and EV charging bays.</p>
          </div>

          <div className="amenity-item">
            <span className="amenity-icon">♿</span>
            <strong>Wheelchair &amp; Stretcher Assistance</strong>
            <p>Complimentary porter assistance and wheelchairs available at all hospital entrance gates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
