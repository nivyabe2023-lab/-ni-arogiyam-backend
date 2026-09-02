import { useState } from "react";
import "./InsuranceTPA.css";

export default function InsuranceTPA() {
  const [activeTab, setActiveTab] = useState("schemes");
  const [claimStatusId, setClaimStatusId] = useState("");
  const [searchedClaim, setSearchedClaim] = useState(null);
  const [claimSubmitSuccess, setClaimSubmitSuccess] = useState("");

  const [preAuthForm, setPreAuthForm] = useState({
    patientName: "",
    policyNumber: "",
    tpaName: "Star Health & Allied Insurance",
    schemeType: "Private TPA Cashless",
    admissionDate: new Date().toISOString().split("T")[0],
    diagnosis: "Coronary Artery Disease / Angioplasty",
    estimatedCost: "120000",
    treatingDoctor: "Dr. Rajesh Sharma (Cardiology)",
    patientAadhar: "",
  });

  const [claimsList, setClaimsList] = useState([
    {
      claimId: "CLM-8821",
      patientName: "Rajesh Kumar",
      insurer: "Star Health Insurance",
      policyNumber: "SH-99201948",
      scheme: "Private TPA Cashless",
      requestedAmount: 185000,
      approvedAmount: 175000,
      status: "Pre-Auth Approved (Cashless Ready)",
      date: "2026-08-20",
      statusClass: "approved",
    },
    {
      claimId: "CLM-8822",
      patientName: "Meera Krishnan",
      insurer: "Ayushman Bharat (PM-JAY)",
      policyNumber: "AB-PMJAY-4412984",
      scheme: "Government Health Scheme",
      requestedAmount: 82000,
      approvedAmount: 82000,
      status: "Settled (100% Cashless Covered)",
      date: "2026-08-19",
      statusClass: "settled",
    },
    {
      claimId: "CLM-8823",
      patientName: "Arunachalam Pillai",
      insurer: "Medi Assist TPA / HDFC ERGO",
      policyNumber: "MA-7718293",
      scheme: "Corporate Group Insurance",
      requestedAmount: 64000,
      approvedAmount: 0,
      status: "Query Raised (Awaiting Discharge Summary)",
      date: "2026-08-20",
      statusClass: "query",
    },
    {
      claimId: "CLM-8824",
      patientName: "Suresh Raman",
      insurer: "TN CMCHIS Scheme",
      policyNumber: "TN-CMC-88219",
      scheme: "Government Health Scheme",
      requestedAmount: 45000,
      approvedAmount: 45000,
      status: "Pre-Auth Approved",
      date: "2026-08-18",
      statusClass: "approved",
    },
  ]);

  const govtSchemes = [
    {
      id: "pmjay",
      name: "Ayushman Bharat (PM-JAY)",
      badge: "Govt. of India",
      coverage: "Up to Rs. 5,00,000 per family per year",
      eligible: "SECC Beneficiary Card Holders / Golden Card",
      procedures: "Cardiology, Oncology, Polytrauma, Orthopaedic Surgeries, Dialysis",
      icon: "🇮🇳",
    },
    {
      id: "cmchis",
      name: "Chief Minister Comprehensive Health Insurance (CMCHIS)",
      badge: "Govt. of Tamil Nadu",
      coverage: "Up to Rs. 5,00,000 per family per year",
      eligible: "Ration Card / UTR ID with annual income < Rs. 1,20,000",
      procedures: "1027 Medical & Surgical Procedures including Kidney Transplant, NICU Care",
      icon: "🏛️",
    },
    {
      id: "cghs",
      name: "Central Government Health Scheme (CGHS)",
      badge: "Govt. of India",
      coverage: "100% Cashless as per CGHS Tariff",
      eligible: "Central Govt. Employees, Pensioners & Dependents",
      procedures: "Full Inpatient, Daycare & Outpatient Investigations",
      icon: "🎖️",
    },
    {
      id: "echs",
      name: "Ex-Servicemen Contributory Health Scheme (ECHS)",
      badge: "Armed Forces Veteran",
      coverage: "100% Comprehensive Cashless Care",
      eligible: "Defence Veterans, War Widows & Dependents",
      procedures: "All Super-Speciality Medical and Surgical Treatments",
      icon: "⭐",
    },
  ];

  const privateInsurers = [
    { name: "Star Health & Allied Insurance", type: "Stand-Alone Health", turnaround: "2 Hours" },
    { name: "HDFC ERGO General Insurance", type: "General Insurer", turnaround: "1.5 Hours" },
    { name: "Medi Assist India TPA", type: "Corporate / Retail TPA", turnaround: "2 Hours" },
    { name: "ICICI Lombard Health Care", type: "General Insurer", turnaround: "1 Hour" },
    { name: "Bajaj Allianz General Insurance", type: "General Insurer", turnaround: "2 Hours" },
    { name: "Care Health Insurance (Religare)", type: "Health Insurer", turnaround: "2 Hours" },
    { name: "Vidal Health TPA", type: "Third Party Administrator", turnaround: "3 Hours" },
    { name: "Paramount Health Services TPA", type: "Third Party Administrator", turnaround: "2.5 Hours" },
  ];

  const handlePreAuthSubmit = (e) => {
    e.preventDefault();
    if (!preAuthForm.patientName || !preAuthForm.policyNumber) {
      alert("Please fill in patient name and policy number.");
      return;
    }
    const newClaimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClaim = {
      claimId: newClaimId,
      patientName: preAuthForm.patientName,
      insurer: preAuthForm.tpaName,
      policyNumber: preAuthForm.policyNumber,
      scheme: preAuthForm.schemeType,
      requestedAmount: parseFloat(preAuthForm.estimatedCost) || 50000,
      approvedAmount: 0,
      status: "Pre-Auth Submitted (Under TPA Medical Review)",
      date: new Date().toISOString().split("T")[0],
      statusClass: "pending",
    };
    setClaimsList([newClaim, ...claimsList]);
    setClaimSubmitSuccess(
      `✅ Pre-Authorization Claim Request #${newClaimId} submitted successfully for ${preAuthForm.patientName} (${preAuthForm.tpaName}). TPA Pre-Auth desk will process approval within 2 hours.`
    );
    setActiveTab("tracker");
  };

  const handleSearchClaim = (e) => {
    e.preventDefault();
    const found = claimsList.find(
      (c) =>
        c.claimId.toLowerCase() === claimStatusId.trim().toLowerCase() ||
        c.patientName.toLowerCase().includes(claimStatusId.trim().toLowerCase()) ||
        c.policyNumber.toLowerCase().includes(claimStatusId.trim().toLowerCase())
    );
    setSearchedClaim(found || "NOT_FOUND");
  };

  return (
    <div className="insurance-page">
      {/* HERO SECTION */}
      <div className="insurance-hero">
        <div className="insurance-hero-badge">ST. JOHN'S TPA & CASHLESS DESK</div>
        <h1>Cashless Insurance & Government Schemes</h1>
        <p>
          24/7 dedicated TPA Helpdesk providing seamless cashless hospitalization across 30+ leading
          health insurance companies, TPAs, and Government Welfare Schemes (PM-JAY &amp; CMCHIS).
        </p>

        <div className="insurance-nav-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === "schemes" ? "active" : ""}`}
            onClick={() => setActiveTab("schemes")}
          >
            🏛️ Government &amp; Private Schemes
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === "preauth" ? "active" : ""}`}
            onClick={() => setActiveTab("preauth")}
          >
            📝 Submit Pre-Auth Request
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === "tracker" ? "active" : ""}`}
            onClick={() => setActiveTab("tracker")}
          >
            🔍 Live Claim Status Tracker
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            📄 Required Documents Checklist
          </button>
        </div>
      </div>

      {claimSubmitSuccess && (
        <div className="claim-alert-bar">
          <span>🎉</span>
          <div>
            <strong>Pre-Authorization Initiated</strong>
            <p>{claimSubmitSuccess}</p>
          </div>
          <button className="close-alert" onClick={() => setClaimSubmitSuccess("")}>
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: SCHEMES & INSURERS */}
      {activeTab === "schemes" && (
        <div className="schemes-content">
          <h2 className="section-title">Government Empanelled Schemes</h2>
          <div className="govt-schemes-grid">
            {govtSchemes.map((s) => (
              <div key={s.id} className="scheme-card">
                <div className="scheme-header">
                  <span className="scheme-icon">{s.icon}</span>
                  <span className="scheme-badge">{s.badge}</span>
                </div>
                <h3>{s.name}</h3>
                <div className="scheme-details">
                  <p><strong>Coverage Limit:</strong> {s.coverage}</p>
                  <p><strong>Eligibility:</strong> {s.eligible}</p>
                  <p><strong>Covered Specialties:</strong> {s.procedures}</p>
                </div>
                <div className="scheme-footer">
                  <span className="cashless-tag">✓ 100% Cashless Treatment</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="section-title mt-32">Empanelled TPAs &amp; Private Insurers</h2>
          <div className="tpa-grid">
            {privateInsurers.map((ins, idx) => (
              <div key={idx} className="tpa-card">
                <div className="tpa-icon">🛡️</div>
                <div className="tpa-info">
                  <strong>{ins.name}</strong>
                  <span className="tpa-type">{ins.type}</span>
                  <span className="tpa-sla">Average Pre-Auth: {ins.turnaround}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRE-AUTH FORM */}
      {activeTab === "preauth" && (
        <div className="preauth-form-card">
          <div className="card-header">
            <h2>📝 Cashless Hospitalization Pre-Authorization Request</h2>
            <p>Submit patient and insurance details for immediate TPA desk processing.</p>
          </div>

          <form onSubmit={handlePreAuthSubmit} className="preauth-form">
            <div className="form-row-2">
              <div className="form-group">
                <label>Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter patient's name as on card"
                  value={preAuthForm.patientName}
                  onChange={(e) =>
                    setPreAuthForm({ ...preAuthForm, patientName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Insurance / TPA Provider *</label>
                <select
                  value={preAuthForm.tpaName}
                  onChange={(e) =>
                    setPreAuthForm({ ...preAuthForm, tpaName: e.target.value })
                  }
                >
                  <option>Star Health & Allied Insurance</option>
                  <option>Ayushman Bharat (PM-JAY)</option>
                  <option>TN CMCHIS Scheme</option>
                  <option>HDFC ERGO General Insurance</option>
                  <option>Medi Assist India TPA</option>
                  <option>ICICI Lombard Health Care</option>
                  <option>Bajaj Allianz General Insurance</option>
                  <option>Care Health Insurance</option>
                  <option>CGHS / ECHS Defence Scheme</option>
                </select>
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Policy / Member Card ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SH-99201948 or PMJAY-12345"
                  value={preAuthForm.policyNumber}
                  onChange={(e) =>
                    setPreAuthForm({ ...preAuthForm, policyNumber: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Patient Aadhaar Card Number</label>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar Number"
                  value={preAuthForm.patientAadhar}
                  onChange={(e) =>
                    setPreAuthForm({ ...preAuthForm, patientAadhar: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Estimated Inpatient Cost (Rs.) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 120000"
                  value={preAuthForm.estimatedCost}
                  onChange={(e) =>
                    setPreAuthForm({ ...preAuthForm, estimatedCost: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Clinical Diagnosis / Proposed Procedure *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coronary Artery Disease / Robotic Knee Replacement"
                  value={preAuthForm.diagnosis}
                  onChange={(e) =>
                    setPreAuthForm({ ...preAuthForm, diagnosis: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Treating Consultant Doctor *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma (Cardiology)"
                  value={preAuthForm.treatingDoctor}
                  onChange={(e) =>
                    setPreAuthForm({ ...preAuthForm, treatingDoctor: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit-preauth">
                🚀 Submit Pre-Authorization to TPA Desk
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: LIVE CLAIM TRACKER */}
      {activeTab === "tracker" && (
        <div className="tracker-content">
          <div className="search-claim-card">
            <h3>🔍 Search Claim Pre-Authorization Status</h3>
            <form onSubmit={handleSearchClaim} className="search-claim-form">
              <input
                type="text"
                placeholder="Enter Claim ID (e.g. CLM-8821) or Patient Name..."
                value={claimStatusId}
                onChange={(e) => setClaimStatusId(e.target.value)}
              />
              <button type="submit" className="btn-search-claim">
                Track Claim
              </button>
            </form>

            {searchedClaim && searchedClaim !== "NOT_FOUND" && (
              <div className="claim-search-result">
                <h4>Claim Found: {searchedClaim.claimId}</h4>
                <div className="claim-details-grid">
                  <div><strong>Patient:</strong> {searchedClaim.patientName}</div>
                  <div><strong>Insurer:</strong> {searchedClaim.insurer}</div>
                  <div><strong>Requested:</strong> Rs. {searchedClaim.requestedAmount.toLocaleString("en-IN")}</div>
                  <div><strong>Approved:</strong> Rs. {searchedClaim.approvedAmount.toLocaleString("en-IN")}</div>
                  <div><strong>Status:</strong> <span className={`status-badge ${searchedClaim.statusClass}`}>{searchedClaim.status}</span></div>
                </div>
              </div>
            )}

            {searchedClaim === "NOT_FOUND" && (
              <div className="claim-not-found">
                ⚠️ No claim found matching "{claimStatusId}". Please check the ID or policy number.
              </div>
            )}
          </div>

          <h3 className="section-title mt-24">Active Inpatient Cashless Claims</h3>
          <div className="claims-table-wrapper">
            <table className="claims-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Patient Name</th>
                  <th>Insurer / TPA</th>
                  <th>Policy ID</th>
                  <th>Requested (Rs.)</th>
                  <th>Approved (Rs.)</th>
                  <th>Live TPA Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {claimsList.map((c) => (
                  <tr key={c.claimId}>
                    <td><strong>{c.claimId}</strong></td>
                    <td>{c.patientName}</td>
                    <td>{c.insurer}</td>
                    <td><code>{c.policyNumber}</code></td>
                    <td>Rs. {c.requestedAmount.toLocaleString("en-IN")}</td>
                    <td>
                      {c.approvedAmount > 0 ? (
                        <strong className="text-green">Rs. {c.approvedAmount.toLocaleString("en-IN")}</strong>
                      ) : (
                        <span className="text-muted">Pending Review</span>
                      )}
                    </td>
                    <td>
                      <span className={`claim-status-pill ${c.statusClass}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REQUIRED DOCUMENTS */}
      {activeTab === "documents" && (
        <div className="documents-guide-grid">
          <div className="doc-card">
            <span className="doc-icon">🪪</span>
            <h3>1. Identity &amp; Insurance Cards</h3>
            <ul>
              <li>Original Health Insurance Card or TPA E-Card</li>
              <li>Patient Aadhaar Card / Voter ID / Passport (Original + 2 Photocopies)</li>
              <li>Policy Schedule copy showing current renewal dates</li>
            </ul>
          </div>

          <div className="doc-card">
            <span className="doc-icon">📋</span>
            <h3>2. Medical Prescriptions &amp; Reports</h3>
            <ul>
              <li>Doctor's Admission Advice / Referral Letter</li>
              <li>Past consultation papers, prescription slips &amp; first diagnosis notes</li>
              <li>All diagnostic lab reports, ECG, ECHO, CT/MRI films</li>
            </ul>
          </div>

          <div className="doc-card">
            <span className="doc-icon">🏛️</span>
            <h3>3. Govt. Scheme Documents (PM-JAY / CMCHIS)</h3>
            <ul>
              <li>Ayushman Bharat PM-JAY Golden Card / ABHA ID</li>
              <li>Tamil Nadu Smart Ration Card (Original for biometric scan)</li>
              <li>Income certificate from Tahsildar (if required for special coverage)</li>
            </ul>
          </div>

          <div className="doc-card">
            <span className="doc-icon">⏰</span>
            <h3>4. Timelines &amp; Hospital Admission</h3>
            <ul>
              <li><strong>Planned Admission:</strong> Submit documents 48 hours prior for instant pre-auth</li>
              <li><strong>Emergency Admission:</strong> Pre-Auth initiated within 2 to 4 hours of admission</li>
              <li>TPA Helpdesk is functional <strong>24 Hours / 7 Days a Week</strong> (Ground Floor)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
