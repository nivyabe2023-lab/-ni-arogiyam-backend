import { useState } from "react";
import "./EmergencyServices.css";
import { useNavigate } from "react-router-dom";

export default function EmergencyServices() {
  const navigate = useNavigate();

  // Blood Bank Inventory State
  const [bloodUnits, setBloodUnits] = useState([
    { group: "A+", units: 18, status: "Available", color: "#16a34a" },
    { group: "A-", units: 4, status: "Critical", color: "#dc2626" },
    { group: "B+", units: 24, status: "Available", color: "#16a34a" },
    { group: "B-", units: 6, status: "Low", color: "#ea580c" },
    { group: "O+", units: 32, status: "Available", color: "#16a34a" },
    { group: "O-", units: 3, status: "Critical (Universal)", color: "#dc2626" },
    { group: "AB+", units: 12, status: "Available", color: "#16a34a" },
    { group: "AB-", units: 5, status: "Low", color: "#ea580c" },
  ]);

  // Ambulance Fleet State
  const [ambulances, setAmbulances] = useState([
    {
      id: "AMB-101",
      type: "Advanced Life Support (ALS) - ICU On Wheels",
      location: "Hospital Main Porch (Bay 1)",
      driver: "Murugan S. (98401-11223)",
      equipment: "Ventilator, Defibrillator, Syringe Pump, Multi-para Monitor",
      status: "Available (Ready for Dispatch)",
      eta: "Immediate",
    },
    {
      id: "AMB-102",
      type: "Basic Life Support (BLS)",
      location: "North Wing Bay 2",
      driver: "Ramesh K. (98401-44556)",
      equipment: "Oxygen Cylinder, Stretcher, First Aid, Vital Monitor",
      status: "Available",
      eta: "Immediate",
    },
    {
      id: "AMB-103",
      type: "Neonatal / Pediatric ICU Ambulance (NICU)",
      location: "Children & Maternity Block",
      driver: "Saravanan V. (98401-77889)",
      equipment: "Transport Incubator, Baby Warmer, Micro-ventilator",
      status: "Available",
      eta: "Immediate",
    },
    {
      id: "AMB-104",
      type: "Cardiac Emergency Response Mobile Unit",
      location: "On Route (Returning from Salem Bypass)",
      driver: "Dinesh P. (98401-99001)",
      equipment: "12-Lead ECG Telemetry, Defibrillator, Pacing unit",
      status: "On Call",
      eta: "12 Mins",
    },
  ]);

  // Modal / Dispatch Form State
  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [dispatchAlert, setDispatchAlert] = useState("");
  const [donorSuccess, setDonorSuccess] = useState("");

  const [ambulanceForm, setAmbulanceForm] = useState({
    patientName: "",
    contactNumber: "",
    pickupAddress: "",
    emergencyType: "Cardiac / Chest Pain",
    ambulanceType: "Advanced Life Support (ALS) - ICU On Wheels",
  });

  const [donorForm, setDonorForm] = useState({
    donorName: "",
    age: "",
    gender: "Male",
    bloodGroup: "O+",
    contactNumber: "",
    lastDonationMonths: "6+ Months ago (Eligible)",
  });

  const handleAmbulanceDispatch = (e) => {
    e.preventDefault();
    if (!ambulanceForm.patientName || !ambulanceForm.contactNumber || !ambulanceForm.pickupAddress) {
      alert("Please fill in all mandatory pickup details.");
      return;
    }
    setDispatchAlert(
      `🚨 AMBULANCE DISPATCHED! Unit AMB-101 (ALS ICU) assigned for ${ambulanceForm.patientName}. Driver contact: Murugan S. (98401-11223). Expected arrival at pickup location within 8-10 minutes.`
    );
    setShowAmbulanceModal(false);
  };

  const handleDonorRegister = (e) => {
    e.preventDefault();
    if (!donorForm.donorName || !donorForm.contactNumber) {
      alert("Please fill in Donor Name and Contact Number.");
      return;
    }
    // Increment local unit counter
    setBloodUnits((prev) =>
      prev.map((b) =>
        b.group === donorForm.bloodGroup ? { ...b, units: b.units + 1 } : b
      )
    );
    setDonorSuccess(
      `❤️ Thank you, ${donorForm.donorName}! You are registered as an emergency donor for Blood Group ${donorForm.bloodGroup}. Hospital Blood Bank Token: #DONOR-${Math.floor(
        1000 + Math.random() * 9000
      )}.`
    );
    setShowDonorModal(false);
  };

  return (
    <div className="emergency-page">
      {/* 24x7 EMERGENCY BANNER HEADER */}
      <div className="emergency-hero-banner">
        <div className="emergency-hero-content">
          <div className="emergency-pill">
            <span className="pulsing-dot"></span>
            <span>24/7 LEVEL-1 TRAUMA & EMERGENCY CARE</span>
          </div>
          <h1>Emergency & Critical Care Services</h1>
          <p>
            NABH Accredited Comprehensive Trauma Centre, Cardiac Arrest Response,
            Stroke Protocol, 24x7 Emergency OT, and Blood Bank Services.
          </p>

          <div className="emergency-cta-row">
            <a href="tel:08022065000" className="emergency-call-btn primary">
              <span className="call-icon">📞</span>
              <div>
                <span className="btn-label">Emergency Helpline</span>
                <strong className="btn-number">080-22065000 / 108</strong>
              </div>
            </a>

            <button
              type="button"
              className="emergency-call-btn secondary"
              onClick={() => setShowAmbulanceModal(true)}
            >
              <span className="call-icon">🚑</span>
              <div>
                <span className="btn-label">Request Immediate</span>
                <strong className="btn-number">Ambulance Dispatch</strong>
              </div>
            </button>

            <button
              type="button"
              className="emergency-call-btn tertiary"
              onClick={() => setShowDonorModal(true)}
            >
              <span className="call-icon">🩸</span>
              <div>
                <span className="btn-label">Donate / Request</span>
                <strong className="btn-number">Blood Bank Services</strong>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* DISPATCH / NOTIFICATION ALERTS */}
      {dispatchAlert && (
        <div className="emergency-alert-bar success">
          <span className="alert-icon">🚨</span>
          <div className="alert-body">
            <strong>Active Emergency Response</strong>
            <p>{dispatchAlert}</p>
          </div>
          <button
            type="button"
            className="alert-close"
            onClick={() => setDispatchAlert("")}
          >
            ✕
          </button>
        </div>
      )}

      {donorSuccess && (
        <div className="emergency-alert-bar info">
          <span className="alert-icon">🩸</span>
          <div className="alert-body">
            <strong>Blood Bank Registration</strong>
            <p>{donorSuccess}</p>
          </div>
          <button
            type="button"
            className="alert-close"
            onClick={() => setDonorSuccess("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* SECTION: TRIAGE PROTOCOLS & BED OCCUPANCY */}
      <div className="emergency-grid-2">
        {/* TRIAGE CODE SYSTEM */}
        <div className="emergency-card">
          <div className="emergency-card-header">
            <h3>🏥 Emergency Triage Protocols</h3>
            <span className="badge-live">Live Response</span>
          </div>
          <p className="card-desc">
            Immediate patient categorization ensures zero waiting time for life-threatening emergencies.
          </p>

          <div className="triage-list">
            <div className="triage-item red">
              <div className="triage-code">CODE RED (Resuscitation)</div>
              <div className="triage-details">
                <strong>0 Minutes Waiting</strong>
                <p>Cardiac arrest, severe polytrauma, massive haemorrhage, acute stroke &lt; 4.5 hrs, respiratory failure.</p>
              </div>
            </div>

            <div className="triage-item yellow">
              <div className="triage-code">CODE YELLOW (Emergent)</div>
              <div className="triage-details">
                <strong>&lt; 15 Minutes Waiting</strong>
                <p>Severe abdominal pain, compound fractures, acute asthma, high grade pediatric fever with lethargy.</p>
              </div>
            </div>

            <div className="triage-item green">
              <div className="triage-code">CODE GREEN (Non-Urgent / Urgent OPD)</div>
              <div className="triage-details">
                <strong>&lt; 45 Minutes Waiting</strong>
                <p>Minor lacerations, sprains, chronic pain exacerbation, mild viral illness with stable vitals.</p>
              </div>
            </div>
          </div>
        </div>

        {/* LIVE CRITICAL CARE BEDS */}
        <div className="emergency-card">
          <div className="emergency-card-header">
            <h3>🛏️ Live Critical Care & ICU Beds</h3>
            <button
              className="view-all-beds-btn"
              onClick={() => navigate("/beds")}
            >
              Manage Beds →
            </button>
          </div>
          <p className="card-desc">
            Current bed occupancy in Intensive Care & Emergency units.
          </p>

          <div className="icu-beds-grid">
            <div className="icu-bed-stat">
              <span className="icu-title">Emergency Trauma Bay</span>
              <span className="icu-count available">4 / 6 Available</span>
              <div className="icu-bar"><div className="fill" style={{ width: "33%" }}></div></div>
            </div>

            <div className="icu-bed-stat">
              <span className="icu-title">Medical ICU (MICU)</span>
              <span className="icu-count low">2 / 12 Available</span>
              <div className="icu-bar"><div className="fill alert" style={{ width: "83%" }}></div></div>
            </div>

            <div className="icu-bed-stat">
              <span className="icu-title">Coronary Care Unit (CCU)</span>
              <span className="icu-count available">3 / 8 Available</span>
              <div className="icu-bar"><div className="fill" style={{ width: "62%" }}></div></div>
            </div>

            <div className="icu-bed-stat">
              <span className="icu-title">Neonatal ICU (NICU)</span>
              <span className="icu-count available">5 / 10 Available</span>
              <div className="icu-bar"><div className="fill" style={{ width: "50%" }}></div></div>
            </div>
          </div>

          <div className="emergency-action-banner">
            <div>
              <strong>Need emergency bed reservation?</strong>
              <p>Direct admission hotline for external hospital transfers.</p>
            </div>
            <a href="tel:08022065000" className="quick-transfer-btn">
              Call Transfer Desk
            </a>
          </div>
        </div>
      </div>

      {/* SECTION: LIVE BLOOD BANK INVENTORY */}
      <div className="emergency-card mt-24">
        <div className="emergency-card-header">
          <div>
            <h3>🩸 24/7 Blood Bank & Component Separation Unit</h3>
            <p className="card-desc">
              NABH-accredited regional transfusion centre. Whole Blood, Packed Red Blood Cells (PRBC), Platelets & Fresh Frozen Plasma (FFP).
            </p>
          </div>
          <button
            type="button"
            className="register-donor-btn"
            onClick={() => setShowDonorModal(true)}
          >
            + Register as Volunteer Donor
          </button>
        </div>

        <div className="blood-inventory-grid">
          {bloodUnits.map((item) => (
            <div key={item.group} className="blood-unit-card">
              <div className="blood-group-badge">{item.group}</div>
              <div className="blood-units-count">{item.units} Units</div>
              <span
                className="blood-status-badge"
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  borderColor: item.color,
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: AMBULANCE FLEET DISPATCH */}
      <div className="emergency-card mt-24">
        <div className="emergency-card-header">
          <div>
            <h3>🚑 24/7 Mobile Intensive Care & Ambulance Fleet</h3>
            <p className="card-desc">
              Equipped with GPS tracking, onboard mobile telemetry, and emergency medical technicians.
            </p>
          </div>
          <button
            type="button"
            className="dispatch-now-btn"
            onClick={() => setShowAmbulanceModal(true)}
          >
            🚨 Dispatch Ambulance Now
          </button>
        </div>

        <div className="ambulance-table-wrapper">
          <table className="ambulance-table">
            <thead>
              <tr>
                <th>Ambulance ID</th>
                <th>Vehicle & Care Type</th>
                <th>Location / Base</th>
                <th>Assigned Driver & Contact</th>
                <th>Critical Equipment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ambulances.map((amb) => (
                <tr key={amb.id}>
                  <td><strong>{amb.id}</strong></td>
                  <td>
                    <span className="amb-type-badge">{amb.type}</span>
                  </td>
                  <td>{amb.location}</td>
                  <td>
                    <a href={`tel:${amb.driver.replace(/\D/g, "")}`} className="driver-phone">
                      {amb.driver}
                    </a>
                  </td>
                  <td className="equipment-text">{amb.equipment}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        amb.status.includes("Available") ? "active" : "busy"
                      }`}
                    >
                      {amb.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AMBULANCE DISPATCH MODAL */}
      {showAmbulanceModal && (
        <div className="emergency-modal-overlay">
          <div className="emergency-modal-card">
            <div className="modal-header">
              <h2>🚑 Request Immediate Ambulance Dispatch</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAmbulanceModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAmbulanceDispatch} className="modal-form">
              <div className="form-group">
                <label>Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter patient's name"
                  value={ambulanceForm.patientName}
                  onChange={(e) =>
                    setAmbulanceForm({ ...ambulanceForm, patientName: e.target.value })
                  }
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Caller Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={ambulanceForm.contactNumber}
                    onChange={(e) =>
                      setAmbulanceForm({ ...ambulanceForm, contactNumber: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Category *</label>
                  <select
                    value={ambulanceForm.emergencyType}
                    onChange={(e) =>
                      setAmbulanceForm({ ...ambulanceForm, emergencyType: e.target.value })
                    }
                  >
                    <option>Cardiac / Chest Pain / Heart Attack</option>
                    <option>Acute Stroke / Paralysis</option>
                    <option>Road Accident / Trauma</option>
                    <option>Severe Respiratory Distress</option>
                    <option>Obstetric / Labour Emergency</option>
                    <option>Unconscious / General Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Exact Pickup Location & Landmarks *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Enter street, house number, area, landmark in Salem / Chennai..."
                  value={ambulanceForm.pickupAddress}
                  onChange={(e) =>
                    setAmbulanceForm({ ...ambulanceForm, pickupAddress: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="form-group">
                <label>Ambulance Care Level</label>
                <select
                  value={ambulanceForm.ambulanceType}
                  onChange={(e) =>
                    setAmbulanceForm({ ...ambulanceForm, ambulanceType: e.target.value })
                  }
                >
                  <option>Advanced Life Support (ALS) - ICU On Wheels</option>
                  <option>Basic Life Support (BLS) - Stretcher & Oxygen</option>
                  <option>Neonatal / Pediatric ICU Ambulance</option>
                  <option>Cardiac Emergency Response Mobile Unit</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAmbulanceModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit-emergency">
                  🚨 Confirm & Dispatch Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOOD DONOR REGISTER MODAL */}
      {showDonorModal && (
        <div className="emergency-modal-overlay">
          <div className="emergency-modal-card">
            <div className="modal-header">
              <h2>🩸 Register as Volunteer Blood Donor</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowDonorModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleDonorRegister} className="modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={donorForm.donorName}
                    onChange={(e) =>
                      setDonorForm({ ...donorForm, donorName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={donorForm.contactNumber}
                    onChange={(e) =>
                      setDonorForm({ ...donorForm, contactNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    placeholder="18-65"
                    value={donorForm.age}
                    onChange={(e) =>
                      setDonorForm({ ...donorForm, age: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={donorForm.gender}
                    onChange={(e) =>
                      setDonorForm({ ...donorForm, gender: e.target.value })
                    }
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group *</label>
                  <select
                    value={donorForm.bloodGroup}
                    onChange={(e) =>
                      setDonorForm({ ...donorForm, bloodGroup: e.target.value })
                    }
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowDonorModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit-donor">
                  ❤️ Save Donor Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
