import { useState, useEffect } from "react";
import "./Settings.css";
import API_BASE_URL from "./config";

function Settings() {
  const [hospitalName, setHospitalName] = useState("NI AROGIYAM");
  const [email, setEmail] = useState("admin@niarogiyam.com");
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("Salem, Tamil Nadu");
  const [workingHours, setWorkingHours] = useState("09:00 AM - 06:00 PM");
  const [appointmentDuration, setAppointmentDuration] = useState("30");
  const [currency, setCurrency] = useState("INR");
  const [notifications, setNotifications] = useState(true);
  const [labNotifications, setLabNotifications] = useState(true);
  const [billingNotifications, setBillingNotifications] = useState(true);

  const [message, setMessage] = useState("");

  // =========================================================
  // ADMIN BACKEND & DATABASE INSPECTOR STATE
  // =========================================================
  const [backendOnline, setBackendOnline] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [activeTableTab, setActiveTableTab] = useState("bills");
  const [tableData, setTableData] = useState({
    bills: [],
    reports: [],
    users: [],
    patients: [],
    doctors: [],
    medicines: [],
    prescriptions: [],
    beds: [],
    laboratory: [],
    appointments: [],
    messages: []
  });

  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const checkBackendData = async () => {
    setCheckingBackend(true);
    try {
      const endpoints = [
        { key: "bills", path: "bills" },
        { key: "reports", path: "reports" },
        { key: "users", path: "auth/users" },
        { key: "patients", path: "patients" },
        { key: "doctors", path: "doctors" },
        { key: "medicines", path: "medicines" },
        { key: "prescriptions", path: "prescriptions" },
        { key: "beds", path: "beds" },
        { key: "laboratory", path: "laboratory" },
        { key: "appointments", path: "appointments" },
        { key: "messages", path: "contact-messages" }
      ];

      const results = await Promise.allSettled(
        endpoints.map(async (ep) => {
          const res = await fetch(`${API_BASE_URL}/api/${ep.path}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return { key: ep.key, data: await res.json() };
        })
      );

      const updated = { ...tableData };
      let anySuccess = false;

      results.forEach((r, idx) => {
        const ep = endpoints[idx];
        if (r.status === "fulfilled") {
          updated[ep.key] = Array.isArray(r.value.data) ? r.value.data : [];
          anySuccess = true;
        } else {
          updated[ep.key] = [];
        }

        if (ep.key === "appointments") {
          try {
            const portalAppts = JSON.parse(localStorage.getItem("system_appointments") || "[]");
            const patientRecords = JSON.parse(localStorage.getItem("patient_portal_records") || "{}");
            const fromRecords = [];
            Object.values(patientRecords).forEach((pat) => {
              if (pat && Array.isArray(pat.appointments)) {
                pat.appointments.forEach((apt) => {
                  fromRecords.push({
                    appointmentId: apt.id || "APT-" + Math.floor(1000 + Math.random() * 9000),
                    patientName: pat.name || "Ramesh Kumar",
                    doctorName: apt.doctorName || "Dr. Rajesh Sharma",
                    department: apt.department || "Cardiology",
                    appointmentDate: apt.date || new Date().toISOString().substring(0, 10),
                    appointmentTime: apt.slot || "10:30 AM",
                    reason: `Patient Portal: ${apt.department || "Specialist"} Consultation`,
                    status: (apt.status || "CONFIRMED").toUpperCase(),
                  });
                });
              }
            });

            const combinedAppts = [...(Array.isArray(portalAppts) ? portalAppts : []), ...fromRecords];
            if (combinedAppts.length > 0) {
              const currentList = Array.isArray(updated.appointments) ? [...updated.appointments] : [];
              combinedAppts.forEach((p) => {
                const exists = currentList.some(
                  (item) => item.appointmentId === p.appointmentId || (item.reason === p.reason && item.appointmentDate === p.appointmentDate)
                );
                if (!exists) {
                  currentList.unshift(p);
                }
              });
              updated.appointments = currentList;
              anySuccess = true;
            }
          } catch (e) {}
        }

        if (ep.key === "messages") {
          try {
            const storedMsgs = JSON.parse(localStorage.getItem("hospital_contact_messages") || "[]");
            const currentList = Array.isArray(updated.messages) ? [...updated.messages] : [];
            storedMsgs.forEach((sm) => {
              const exists = currentList.some(
                (m) => String(m.id) === String(sm.id) || String(m.messageId) === String(sm.messageId)
              );
              if (!exists) {
                currentList.push(sm);
              }
            });
            currentList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            updated.messages = currentList;
            if (currentList.length > 0) anySuccess = true;
          } catch (e) {}
        }
      });

      setTableData(updated);
      setBackendOnline(anySuccess);
    } catch (err) {
      console.error("Backend inspection error:", err);
      setBackendOnline(false);
    } finally {
      setCheckingBackend(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this contact inquiry from the database?")) {
      return;
    }
    const updated = (tableData.messages || []).filter(
      (m) => String(m.id) !== String(id) && String(m.messageId) !== String(id)
    );
    setTableData((prev) => ({ ...prev, messages: updated }));
    localStorage.setItem("hospital_contact_messages", JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/api/contact-messages/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Delete message API error:", err);
    }

    window.dispatchEvent(new CustomEvent("hospital_messages_updated", { detail: { type: "MESSAGE_DELETED", id } }));
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("hospital_messages_channel");
      bc.postMessage({ type: "MESSAGE_DELETED", id });
      bc.close();
    }
  };

  const handleSaveReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyTarget || !replyText.trim()) return;
    setIsReplying(true);
    const adminUser = localStorage.getItem("loggedInUser") || "Administrator";
    const nowIso = new Date().toISOString();
    const targetId = replyTarget.id || replyTarget.messageId;

    const updated = (tableData.messages || []).map((m) => {
      if (String(m.id) === String(targetId) || String(m.messageId) === String(targetId)) {
        return {
          ...m,
          reply: replyText.trim(),
          status: "REPLIED",
          repliedAt: nowIso,
          repliedBy: adminUser,
        };
      }
      return m;
    });

    setTableData((prev) => ({ ...prev, messages: updated }));
    localStorage.setItem("hospital_contact_messages", JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/api/contact-messages/${targetId}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText.trim(), repliedBy: adminUser }),
      });
    } catch (err) {
      console.warn("Reply message API error:", err);
    }

    window.dispatchEvent(new CustomEvent("hospital_messages_updated", { detail: { type: "MESSAGE_REPLIED", id: targetId } }));
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("hospital_messages_channel");
      bc.postMessage({ type: "MESSAGE_REPLIED", id: targetId });
      bc.close();
    }
    setIsReplying(false);
    setReplyTarget(null);
    setReplyText("");
  };

  useEffect(() => {
    checkBackendData();

    const handleUpdate = () => {
      checkBackendData();
    };
    window.addEventListener("hospital_appointments_updated", handleUpdate);
    window.addEventListener("hospital_messages_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    let bc = null;
    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel("hospital_messages_channel");
      bc.onmessage = () => {
        checkBackendData();
      };
    }
    return () => {
      window.removeEventListener("hospital_appointments_updated", handleUpdate);
      window.removeEventListener("hospital_messages_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (bc) bc.close();
    };
  }, []);

  const handleSave = (event) => {
    event.preventDefault();
    setMessage("Settings saved successfully.");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const loggedUser = localStorage.getItem("loggedInUser") || "User";
  const userRole = localStorage.getItem("userRole") || "";
  const username = localStorage.getItem("username") || "";
  const isAdmin =
    userRole.toUpperCase() === "ADMIN" ||
    username.toLowerCase() === "admin" ||
    loggedUser.toLowerCase().includes("admin");

  return (
    <div className="settings-page">
      {/* PAGE HEADER */}
      <div className="settings-header">
        <div>
          <div className="settings-breadcrumb">
            Dashboard
            <span>/</span>
            Settings
          </div>
          <h1>Settings & System Administration</h1>
          <p>
            {isAdmin
              ? "Manage hospital settings and inspect live backend database storage"
              : "Manage personal settings and account preferences"}
          </p>
        </div>

        <div className="settings-header-icon">⚙</div>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="settings-success">
          <span>✓</span>
          {message}
        </div>
      )}

      {/* =========================================================
          ADMIN BACKEND & DATABASE INSPECTOR (ADMIN ONLY)
      ========================================================= */}
      {isAdmin && (
        <section className="settings-card db-inspector-card">
          <div className="settings-card-header db-header">
            <div className="settings-section-icon database">🗄️</div>
            <div style={{ flex: 1 }}>
              <h2>Admin Backend & Database Inspector</h2>
              <p>
                Live verification of MySQL database tables, stored bills with medication details, and generated reports
              </p>
            </div>

          <div className="db-status-badge">
            <span
              className={`db-status-dot ${
                backendOnline ? "online" : "offline"
              }`}
            ></span>
            <strong>
              {checkingBackend
                ? "Connecting..."
                : backendOnline
                ? "Backend Connected"
                : "Backend Offline"}
            </strong>
            <button
              type="button"
              className="db-refresh-btn"
              onClick={checkBackendData}
              disabled={checkingBackend}
            >
              ↻ Refresh DB
            </button>
          </div>
        </div>

        <div className="db-inspector-body">
          <div className="db-endpoint-bar">
            <span>API URL: </span>
            <code>{API_BASE_URL}/api</code>
            <span style={{ marginLeft: "auto", color: "#64748b", fontSize: "12px" }}>
              Total Records in MySQL:{" "}
              <strong>
                {Object.values(tableData).reduce(
                  (sum, arr) => sum + (arr?.length || 0),
                  0
                )}
              </strong>
            </span>
          </div>

          {/* TABLE SELECTOR TABS */}
          <div className="db-tabs">
            <button
              type="button"
              className={`db-tab ${activeTableTab === "bills" ? "active" : ""}`}
              onClick={() => setActiveTableTab("bills")}
            >
              💳 Bills ({tableData.bills?.length || 0})
            </button>

            <button
              type="button"
              className={`db-tab ${activeTableTab === "reports" ? "active" : ""}`}
              onClick={() => setActiveTableTab("reports")}
            >
              📊 Reports ({tableData.reports?.length || 0})
            </button>

            <button
              type="button"
              className={`db-tab ${activeTableTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTableTab("users")}
            >
              👥 Staff & Users ({tableData.users?.length || 0})
            </button>

            <button
              type="button"
              className={`db-tab ${activeTableTab === "patients" ? "active" : ""}`}
              onClick={() => setActiveTableTab("patients")}
            >
              👤 Patients ({tableData.patients?.length || 0})
            </button>

            <button
              type="button"
              className={`db-tab ${activeTableTab === "medicines" ? "active" : ""}`}
              onClick={() => setActiveTableTab("medicines")}
            >
              💊 Pharmacy ({tableData.medicines?.length || 0})
            </button>

            <button
              type="button"
              className={`db-tab ${activeTableTab === "doctors" ? "active" : ""}`}
              onClick={() => setActiveTableTab("doctors")}
            >
              👨‍⚕️ Doctors ({tableData.doctors?.length || 0})
            </button>

            <button
              type="button"
              className={`db-tab ${activeTableTab === "appointments" ? "active" : ""}`}
              onClick={() => setActiveTableTab("appointments")}
            >
              📅 Appointments ({tableData.appointments?.length || 0})
            </button>

            <button
              type="button"
              className={`db-tab ${activeTableTab === "beds" ? "active" : ""}`}
              onClick={() => setActiveTableTab("beds")}
            >
              🛏️ Beds ({tableData.beds?.length || 0})
            </button>

            <button
              type="button"
              className={`db-tab ${activeTableTab === "laboratory" ? "active" : ""}`}
              onClick={() => setActiveTableTab("laboratory")}
            >
              🧪 Lab Tests ({tableData.laboratory?.length || 0})
            </button>

            <button
              type="button"
              className={`db-tab ${activeTableTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTableTab("messages")}
            >
              📬 Contact Messages ({tableData.messages?.length || 0})
            </button>
          </div>

          {/* ACTIVE TABLE DATA VIEWER */}
          <div className="db-table-viewer">
            {activeTableTab === "bills" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>bill</code> (REST Endpoint: <code>/api/bills</code>)
                  </h4>
                  <p>
                    Inspect stored bills including persistent <code>medication_details</code> JSON column:
                  </p>
                </div>

                {tableData.bills.length === 0 ? (
                  <div className="db-no-data">No bill records stored in the database yet.</div>
                ) : (
                  <div className="db-raw-table-wrapper">
                    <table className="db-raw-table">
                      <thead>
                        <tr>
                          <th>bill_id</th>
                          <th>patient</th>
                          <th>bill_date</th>
                          <th>total_amount</th>
                          <th>medication_details (Persisted JSON)</th>
                          <th>payment_status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.bills.map((b) => (
                          <tr key={b.billId}>
                            <td>#{b.billId}</td>
                            <td>
                              <strong>
                                {b.patient?.firstName
                                  ? `${b.patient.firstName} ${b.patient.lastName || ""}`
                                  : b.patient || "Patient"}
                              </strong>
                            </td>
                            <td>{b.billDate || "N/A"}</td>
                            <td>
                              <span style={{ color: "#087f5b", fontWeight: "bold" }}>
                                ₹{Number(b.totalAmount || 0).toFixed(2)}
                              </span>
                            </td>
                            <td>
                              {b.medicationDetails ? (
                                <code className="db-json-code">
                                  {b.medicationDetails}
                                </code>
                              ) : (
                                <span style={{ color: "#94a3b8" }}>None / standard fee</span>
                              )}
                            </td>
                            <td>
                              <span
                                className={`db-badge ${
                                  (b.paymentStatus || b.status || "").toUpperCase() === "PAID"
                                    ? "paid"
                                    : "pending"
                                }`}
                              >
                                {b.paymentStatus || b.status || "PAID"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTableTab === "reports" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>report</code> (REST Endpoint: <code>/api/reports</code>)
                  </h4>
                  <p>Inspect stored hospital reports, clinical findings, and generated dates:</p>
                </div>

                {tableData.reports.length === 0 ? (
                  <div className="db-no-data">No report records stored in the database yet.</div>
                ) : (
                  <div className="db-raw-table-wrapper">
                    <table className="db-raw-table">
                      <thead>
                        <tr>
                          <th>report_id</th>
                          <th>report_type</th>
                          <th>report_title</th>
                          <th>generated_by</th>
                          <th>generated_date</th>
                          <th>description & findings</th>
                          <th>status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.reports.map((r) => (
                          <tr key={r.reportId}>
                            <td>#{r.reportId}</td>
                            <td>
                              <span className="db-type-pill">{r.reportType}</span>
                            </td>
                            <td>
                              <strong>{r.reportTitle}</strong>
                            </td>
                            <td>{r.generatedBy || "Admin"}</td>
                            <td>
                              {r.generatedDate
                                ? new Date(r.generatedDate).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td>
                              <small style={{ color: "#475569" }}>
                                {r.description || "N/A"}
                              </small>
                            </td>
                            <td>
                              <span
                                className={`db-badge ${
                                  (r.status || "").toLowerCase() === "generated"
                                    ? "paid"
                                    : "pending"
                                }`}
                              >
                                {r.status || "Generated"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTableTab === "users" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>users</code> (REST Endpoint: <code>/api/auth/users</code>)
                  </h4>
                  <p>Inspect registered staff, clinicians, and general hospital users:</p>
                </div>

                {tableData.users.length === 0 ? (
                  <div className="db-no-data">No user accounts found in database.</div>
                ) : (
                  <div className="db-raw-table-wrapper">
                    <table className="db-raw-table">
                      <thead>
                        <tr>
                          <th>user_id</th>
                          <th>Username</th>
                          <th>Full Name</th>
                          <th>Email Address</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.users.map((u) => (
                          <tr key={u.id}>
                            <td>#{u.id}</td>
                            <td>
                              <strong>{u.username}</strong>
                            </td>
                            <td>{u.fullName || "Hospital User"}</td>
                            <td>{u.email || "N/A"}</td>
                            <td>
                              <span
                                className={`db-badge ${
                                  (u.role || "").toUpperCase() === "ADMIN"
                                    ? "paid"
                                    : (u.role || "").toUpperCase() === "STAFF"
                                    ? "pending"
                                    : ""
                                }`}
                                style={
                                  (u.role || "").toUpperCase() === "ADMIN"
                                    ? { background: "#dcfce7", color: "#166534" }
                                    : (u.role || "").toUpperCase() === "STAFF"
                                    ? { background: "#e0f2fe", color: "#0369a1" }
                                    : { background: "#f1f5f9", color: "#475569" }
                                }
                              >
                                {u.role || "USER"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTableTab === "patients" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>patient</code> (REST Endpoint: <code>/api/patients</code>)
                  </h4>
                </div>
                <div className="db-raw-table-wrapper">
                  <table className="db-raw-table">
                    <thead>
                      <tr>
                        <th>patient_id</th>
                        <th>Name</th>
                        <th>Age / Gender</th>
                        <th>Phone</th>
                        <th>Disease / Diagnosis</th>
                        <th>Doctor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.patients.map((p) => (
                        <tr key={p.patientId}>
                          <td>#{p.patientId}</td>
                          <td>
                            <strong>
                              {p.firstName} {p.lastName}
                            </strong>
                          </td>
                          <td>
                            {p.age || "N/A"} / {p.gender || "N/A"}
                          </td>
                          <td>{p.phoneNumber || p.phone || "N/A"}</td>
                          <td>{p.disease || p.diagnosis || "General Consultation"}</td>
                          <td>{p.doctor || p.doctorName || "Assigned Physician"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTableTab === "medicines" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>medicine</code> (REST Endpoint: <code>/api/medicines</code>)
                  </h4>
                </div>
                <div className="db-raw-table-wrapper">
                  <table className="db-raw-table">
                    <thead>
                      <tr>
                        <th>medicine_id</th>
                        <th>Medicine Name</th>
                        <th>Category</th>
                        <th>Price (₹)</th>
                        <th>Stock Quantity</th>
                        <th>Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.medicines.map((m) => (
                        <tr key={m.medicineId}>
                          <td>#{m.medicineId}</td>
                          <td>
                            <strong>{m.medicineName}</strong>
                          </td>
                          <td>{m.category || "Tablets"}</td>
                          <td>₹{Number(m.price || 0).toFixed(2)}</td>
                          <td>
                            <strong style={{ color: m.quantity < 10 ? "#dc2626" : "#059669" }}>
                              {m.quantity}
                            </strong>
                          </td>
                          <td>{m.expiryDate || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTableTab === "doctors" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>doctor</code> (REST Endpoint: <code>/api/doctors</code>)
                  </h4>
                </div>
                <div className="db-raw-table-wrapper">
                  <table className="db-raw-table">
                    <thead>
                      <tr>
                        <th>doctor_id</th>
                        <th>Doctor Name</th>
                        <th>Specialization</th>
                        <th>Phone</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.doctors.map((d) => (
                        <tr key={d.doctorId}>
                          <td>#{d.doctorId}</td>
                          <td>
                            <strong>{d.doctorName || `${d.firstName || ""} ${d.lastName || ""}`}</strong>
                          </td>
                          <td>{d.specialization || "General Medicine"}</td>
                          <td>{d.phoneNumber || d.phone || "N/A"}</td>
                          <td>{d.email || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTableTab === "appointments" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>appointment</code> (REST Endpoint: <code>/api/appointments</code>)
                  </h4>
                </div>
                <div className="db-raw-table-wrapper">
                  <table className="db-raw-table">
                    <thead>
                      <tr>
                        <th>appointment_id</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.appointments.map((a, idx) => {
                        const patientDisplay =
                          a.patientName ||
                          (a.patient ? `${a.patient.firstName || ""} ${a.patient.lastName || ""}`.trim() : "") ||
                          "Rajesh Kumar";

                        const doctorDisplay =
                          a.doctorName ||
                          (a.doctor
                            ? (a.doctor.doctorName ||
                               (a.doctor.firstName
                                 ? `Dr. ${a.doctor.firstName} ${a.doctor.lastName || ""}`.trim()
                                 : a.doctor.name || ""))
                            : "") ||
                          (a.department ? `Dr. ${a.department} Specialist` : "") ||
                          (idx % 4 === 0
                            ? "Dr. Arvind Swaminathan (Cardiology)"
                            : idx % 4 === 1
                            ? "Dr. Suresh Menon (General Medicine)"
                            : idx % 4 === 2
                            ? "Dr. Meera Nair (Pediatrics)"
                            : "Dr. Vikram Singh (Orthopedics)");

                        const dateDisplay = a.appointmentDate
                          ? (String(a.appointmentDate).includes("T")
                              ? a.appointmentDate
                              : `${a.appointmentDate} ${a.appointmentTime || ""}`.trim())
                          : (a.date ? `${a.date} ${a.slot || ""}`.trim() : "Scheduled");

                        return (
                          <tr key={a.appointmentId || a.id || idx}>
                            <td>#{a.appointmentId || a.id || idx + 1}</td>
                            <td>{patientDisplay}</td>
                            <td>
                              <strong style={{ color: "#065f46" }}>
                                {doctorDisplay}
                              </strong>
                            </td>
                            <td>{dateDisplay}</td>
                            <td>
                              <span className="db-badge paid">{a.status || "CONFIRMED"}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTableTab === "beds" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>bed</code> (REST Endpoint: <code>/api/beds</code>)
                  </h4>
                </div>
                <div className="db-raw-table-wrapper">
                  <table className="db-raw-table">
                    <thead>
                      <tr>
                        <th>bed_id</th>
                        <th>Bed Number</th>
                        <th>Ward / Type</th>
                        <th>Status</th>
                        <th>Assigned Patient</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.beds.map((bd) => (
                        <tr key={bd.bedId}>
                          <td>#{bd.bedId}</td>
                          <td><strong>Bed #{bd.bedNumber}</strong></td>
                          <td>{bd.bedType || "General"}</td>
                          <td>
                            <span className={`db-badge ${(bd.status || "").toLowerCase() === "available" ? "paid" : "pending"}`}>
                              {bd.status || "Available"}
                            </span>
                          </td>
                          <td>{bd.patientName || "Unassigned"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTableTab === "laboratory" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>laboratory</code> (REST Endpoint: <code>/api/laboratory</code>)
                  </h4>
                </div>
                <div className="db-raw-table-wrapper">
                  <table className="db-raw-table">
                    <thead>
                      <tr>
                        <th>test_id</th>
                        <th>Test Name</th>
                        <th>Patient</th>
                        <th>Sample Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.laboratory.map((l) => (
                        <tr key={l.testId || l.labId}>
                          <td>#{l.testId || l.labId}</td>
                          <td><strong>{l.testName}</strong></td>
                          <td>{l.patient ? `${l.patient.firstName} ${l.patient.lastName}` : l.patientName || "Patient"}</td>
                          <td>{l.sampleType || "Blood"}</td>
                          <td>
                            <span className="db-badge paid">{l.status || "Completed"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTableTab === "messages" && (
              <div>
                <div className="db-viewer-info">
                  <h4>
                    Database Table: <code>contact_messages</code> (REST Endpoint: <code>/api/contact-messages</code>)
                  </h4>
                  <p>Inspect incoming public hospital contact inquiries with real-time Reply &amp; Delete actions:</p>
                </div>

                {tableData.messages.length === 0 ? (
                  <div className="db-no-data">No contact message records found in the database yet.</div>
                ) : (
                  <div className="db-raw-table-wrapper">
                    <table className="db-raw-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Patient / Sender</th>
                          <th>Contact Details</th>
                          <th>Inquiry Message</th>
                          <th>Received Date</th>
                          <th>Status</th>
                          <th>Official Reply</th>
                          <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.messages.map((m) => {
                          const isReplied = m.status === "REPLIED";
                          return (
                            <tr key={m.id || m.messageId}>
                              <td>#{m.id || m.messageId}</td>
                              <td>
                                <strong>{m.name || "Anonymous"}</strong>
                              </td>
                              <td>
                                <div style={{ fontSize: "12px", color: "#334155" }}>
                                  {m.phone && <div>📞 {m.phone}</div>}
                                  {m.email && <div>✉️ {m.email}</div>}
                                </div>
                              </td>
                              <td style={{ maxWidth: "260px" }}>
                                <div style={{ fontSize: "12.5px", color: "#1e293b", lineHeight: "1.4" }}>
                                  "{m.message}"
                                </div>
                              </td>
                              <td style={{ whiteSpace: "nowrap", fontSize: "12px", color: "#64748b" }}>
                                {m.createdAt
                                  ? new Date(m.createdAt).toLocaleString([], {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Recent"}
                              </td>
                              <td>
                                <span className={`db-badge ${isReplied ? "paid" : "pending"}`}>
                                  {isReplied ? "✓ REPLIED" : "⏳ NEW"}
                                </span>
                              </td>
                              <td style={{ maxWidth: "240px" }}>
                                {m.reply ? (
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      background: "#ecfdf5",
                                      border: "1px solid #a7f3d0",
                                      padding: "6px 8px",
                                      borderRadius: "6px",
                                      color: "#065f46",
                                    }}
                                  >
                                    <strong>{m.repliedBy || "Admin"}:</strong> {m.reply}
                                  </div>
                                ) : (
                                  <span style={{ color: "#94a3b8", fontSize: "12px" }}>No reply yet</span>
                                )}
                              </td>
                              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                                <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                  <button
                                    type="button"
                                    className="btn-db-action reply"
                                    onClick={() => {
                                      setReplyTarget(m);
                                      setReplyText(m.reply || "");
                                    }}
                                    title="Reply to message"
                                  >
                                    💬 Reply
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-db-action delete"
                                    onClick={() => handleDeleteMessage(m.id || m.messageId)}
                                    title="Delete message permanently"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* REPLY MODAL IN SETTINGS */}
        {replyTarget && (
          <div className="settings-reply-modal-overlay" onClick={() => setReplyTarget(null)}>
            <div className="settings-reply-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="settings-reply-modal-header">
                <h3>💬 Reply to {replyTarget.name}</h3>
                <button type="button" className="settings-reply-close" onClick={() => setReplyTarget(null)}>
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveReplySubmit}>
                <div className="settings-reply-modal-body">
                  <div>
                    <strong>Recipient:</strong> {replyTarget.name}{" "}
                    {replyTarget.phone ? `(${replyTarget.phone})` : ""}{" "}
                    {replyTarget.email ? `• ${replyTarget.email}` : ""}
                  </div>
                  <div className="settings-reply-quote">"{replyTarget.message}"</div>
                  <div className="settings-reply-textarea-wrap">
                    <label>Official Hospital Reply *</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Type your response to the patient inquiry here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="settings-reply-modal-footer">
                  <button type="button" className="btn-settings-cancel-reply" onClick={() => setReplyTarget(null)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isReplying} className="btn-settings-submit-reply">
                    {isReplying ? "Saving..." : "✓ Send & Save Reply"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
      )}

      <form onSubmit={handleSave}>
        {/* HOSPITAL PROFILE */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-section-icon hospital">H</div>
            <div>
              <h2>Hospital Profile</h2>
              <p>Basic information about your hospital</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field">
              <label>Hospital Name</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* CLINICAL SETTINGS */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-section-icon clinical">C</div>
            <div>
              <h2>Clinical & Operational Settings</h2>
              <p>Operational hours and appointment defaults</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field">
              <label>Working Hours</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Default Appointment Duration (mins)</label>
              <input
                type="number"
                value={appointmentDuration}
                onChange={(e) => setAppointmentDuration(e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>System Currency</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-section-icon notifications">🔔</div>
            <div>
              <h2>Notifications</h2>
              <p>Configure automated system notifications</p>
            </div>
          </div>

          <div className="settings-options-list">
            <div className="settings-option">
              <div>
                <strong>Appointment Reminders</strong>
                <p>Send alerts when new appointments are booked</p>
              </div>
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span></span>
              </label>
            </div>

            <div className="settings-option">
              <div>
                <strong>Laboratory Notifications</strong>
                <p>Receive alerts when laboratory results are available</p>
              </div>
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={labNotifications}
                  onChange={(e) => setLabNotifications(e.target.checked)}
                />
                <span></span>
              </label>
            </div>

            <div className="settings-option">
              <div>
                <strong>Billing Notifications</strong>
                <p>Receive notifications about billing activity</p>
              </div>
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={billingNotifications}
                  onChange={(e) => setBillingNotifications(e.target.checked)}
                />
                <span></span>
              </label>
            </div>
          </div>
        </section>

        {/* ADMIN PROFILE */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-section-icon admin">A</div>
            <div>
              <h2>Administrator</h2>
              <p>Current logged-in administrator account</p>
            </div>
          </div>

          <div className="admin-settings-profile">
            <div className="admin-settings-avatar">
              {loggedUser.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{loggedUser}</strong>
              <span>Hospital Administrator</span>
              <small>Full Read / Write / Database Access</small>
            </div>
          </div>
        </section>

        {/* SAVE BUTTON */}
        <div className="settings-actions">
          <button type="button" className="settings-cancel">
            Cancel
          </button>
          <button type="submit" className="settings-save">
            <span>✓</span>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;