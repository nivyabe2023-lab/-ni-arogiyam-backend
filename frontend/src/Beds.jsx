import { useEffect, useState } from "react";
import "./Beds.css";
import API_BASE_URL from "./config";

const API_URL = API_BASE_URL;

function Beds() {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWard, setFilterWard] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [formData, setFormData] = useState({
    bedNumber: "",
    ward: "General Ward A",
    bedType: "GENERAL",
    status: "AVAILABLE",
    patientName: "",
    patientId: "",
    admissionDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Schedule Modal State
  const [selectedBedForSchedule, setSelectedBedForSchedule] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [activeScheduleTab, setActiveScheduleTab] = useState("tablets");
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // New Tablet Form State
  const [showAddTablet, setShowAddTablet] = useState(false);
  const [newTablet, setNewTablet] = useState({
    time: "08:00 AM",
    tabletName: "",
    dosage: "1 Tablet (Oral)",
    foodRelation: "After Breakfast",
    status: "PENDING",
    nurseNotes: "",
  });

  // New Meal Form State
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    time: "08:30 AM",
    mealType: "Breakfast",
    dietType: "Standard Balanced Diet",
    items: "",
    status: "PENDING",
    notes: "",
  });

  const FALLBACK_BEDS = [
    {
      bedId: 1,
      bedNumber: "B-101",
      ward: "General Ward A",
      bedType: "GENERAL",
      patientName: "Rahul Sharma",
      status: "OCCUPIED",
      admissionDate: "2026-08-28",
    },
    {
      bedId: 2,
      bedNumber: "ICU-02",
      ward: "Intensive Care Unit (ICU)",
      bedType: "ICU",
      patientName: "Amit Verma",
      status: "OCCUPIED",
      admissionDate: "2026-08-30",
    },
    {
      bedId: 3,
      bedNumber: "P-204",
      ward: "Private Deluxe Ward",
      bedType: "PRIVATE",
      patientName: "Priya Patel",
      status: "OCCUPIED",
      admissionDate: "2026-09-01",
    },
    {
      bedId: 4,
      bedNumber: "B-102",
      ward: "General Ward A",
      bedType: "GENERAL",
      patientName: "",
      status: "AVAILABLE",
      admissionDate: "",
    },
    {
      bedId: 5,
      bedNumber: "EMG-01",
      ward: "Emergency Trauma Care",
      bedType: "EMERGENCY",
      patientName: "Sneha Reddy",
      status: "OCCUPIED",
      admissionDate: "2026-09-02",
    },
    {
      bedId: 6,
      bedNumber: "B-103",
      ward: "General Ward A",
      bedType: "GENERAL",
      patientName: "",
      status: "MAINTENANCE",
      admissionDate: "",
    },
  ];

  useEffect(() => {
    loadBeds();
    loadPatients();
  }, []);

  const loadBeds = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/beds`);

      if (!response.ok) {
        throw new Error("Failed to load beds");
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setBeds(data);
      } else {
        setBeds(FALLBACK_BEDS);
      }
    } catch (err) {
      console.warn("Using fallback beds data:", err);
      setBeds(FALLBACK_BEDS);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/patients`);
      if (!response.ok) throw new Error("Failed to load patients");
      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Unable to load registered patients:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === "patientId") {
        if (value) {
          const matched = patients.find((p) => String(p.patientId) === String(value));
          if (matched) {
            updated.patientName = `${matched.firstName} ${matched.lastName || ""}`.trim();
            if (updated.status === "AVAILABLE") updated.status = "OCCUPIED";
            if (!updated.admissionDate) {
              updated.admissionDate = new Date().toISOString().substring(0, 10);
            }
          }
        } else {
          updated.patientName = "";
          updated.status = "AVAILABLE";
        }
      }

      if (name === "status" && value === "AVAILABLE") {
        updated.patientName = "";
        updated.patientId = "";
        updated.admissionDate = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const url = editingId ? `${API_URL}/api/beds/${editingId}` : `${API_URL}/api/beds`;
      const method = editingId ? "PUT" : "POST";

      const payload = {
        bedNumber: formData.bedNumber.trim(),
        ward: formData.ward,
        bedType: formData.bedType,
        status: formData.status,
        patientName: formData.patientName ? formData.patientName.trim() : null,
        admissionDate: formData.admissionDate || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save bed details");
      }

      setSuccessMsg(editingId ? "Bed updated successfully!" : "Bed added successfully!");
      await loadBeds();

      setEditingId(null);
      setFormData({
        bedNumber: "",
        ward: "General Ward A",
        bedType: "GENERAL",
        status: "AVAILABLE",
        patientName: "",
        patientId: "",
        admissionDate: "",
      });

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Unable to save bed to database.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bed) => {
    setEditingId(bed.bedId);
    setFormData({
      bedNumber: bed.bedNumber || "",
      ward: bed.ward || "General Ward A",
      bedType: bed.bedType || "GENERAL",
      status: bed.status || "AVAILABLE",
      patientName: bed.patientName || "",
      patientId: "",
      admissionDate: bed.admissionDate ? String(bed.admissionDate).substring(0, 10) : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital bed?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/beds/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bed");
      }

      setSuccessMsg("Bed record deleted.");
      await loadBeds();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Unable to delete bed.");
    }
  };

  const openScheduleModal = async (bed) => {
    setSelectedBedForSchedule(bed);
    setScheduleLoading(true);
    setShowAddTablet(false);
    setShowAddMeal(false);

    try {
      const res = await fetch(`${API_URL}/api/beds/${bed.bedId}/schedule`);
      if (res.ok) {
        const data = await res.json();
        setScheduleData(data);
      } else {
        throw new Error("Failed to fetch schedule");
      }
    } catch (e) {
      console.warn("Using local schedule generator:", e);
      const defaultSched = generateLocalSchedule(bed);
      setScheduleData(defaultSched);
    } finally {
      setScheduleLoading(false);
    }
  };

  const closeScheduleModal = () => {
    setSelectedBedForSchedule(null);
    setScheduleData(null);
    setShowAddTablet(false);
    setShowAddMeal(false);
  };

  const generateLocalSchedule = (bed) => {
    const pName = bed.patientName || "Admitted Patient";
    return {
      bedId: bed.bedId,
      bedNumber: bed.bedNumber,
      ward: bed.ward,
      bedType: bed.bedType,
      patientName: pName,
      status: bed.status,
      admissionDate: bed.admissionDate,
      tabletSchedule: [
        {
          id: 1,
          time: "07:30 AM",
          tabletName: "Pantoprazole 40mg (Antacid / Gastric Relief)",
          dosage: "1 Tablet (Oral)",
          foodRelation: "Before Food (Empty Stomach)",
          status: "GIVEN",
          nurseNotes: "Taken with 1 glass of warm water",
        },
        {
          id: 2,
          time: "09:00 AM",
          tabletName: "Amoxicillin 500mg + Vitamin C 500mg",
          dosage: "1 Cap + 1 Tab",
          foodRelation: "After Breakfast",
          status: "GIVEN",
          nurseNotes: "Taken post morning breakfast",
        },
        {
          id: 3,
          time: "01:30 PM",
          tabletName: "Paracetamol 650mg (Dolo) + B-Complex",
          dosage: "1 Tablet each",
          foodRelation: "After Lunch",
          status: "PENDING",
          nurseNotes: "For fever & post-op discomfort",
        },
        {
          id: 4,
          time: "06:00 PM",
          tabletName: "Multivitamin & Zinc Immunity Supplement",
          dosage: "1 Tablet",
          foodRelation: "After Evening Tea/Snacks",
          status: "PENDING",
          nurseNotes: "Routine dietary supplement",
        },
        {
          id: 5,
          time: "09:00 PM",
          tabletName: "Amoxicillin 500mg + Atorvastatin 10mg",
          dosage: "1 Cap + 1 Tab",
          foodRelation: "After Dinner",
          status: "PENDING",
          nurseNotes: "Night antibiotic & cholesterol dose",
        },
      ],
      foodSchedule: [
        {
          id: 1,
          time: "07:30 AM",
          mealType: "Morning Drink",
          dietType: "Warm Herbal Drink",
          items: "1 Cup Herbal Green Tea with 4 Soaked Almonds",
          status: "SERVED",
          notes: "No added sugar",
        },
        {
          id: 2,
          time: "08:30 AM",
          mealType: "Breakfast",
          dietType: "Soft & Nutritious Diet",
          items: "3 Steamed Idlis with Fresh Vegetable Sambar & Mint Chutney, 1 Boiled Egg white",
          status: "SERVED",
          notes: "Low salt, zero oil preparation",
        },
        {
          id: 3,
          time: "11:30 AM",
          mealType: "Mid-Morning Drink",
          dietType: "Natural Electrolyte / Clear Soup",
          items: "Fresh Tender Coconut Water or Warm Vegetable Soup",
          status: "PENDING",
          notes: "Electrolyte maintenance",
        },
        {
          id: 4,
          time: "01:00 PM",
          mealType: "Lunch",
          dietType: "Balanced Clinical Meal",
          items: "1 Bowl Steamed Rice, Moong Dal, Steamed Green Beans & Carrots, 1 Cup Low-fat Fresh Curd",
          status: "PENDING",
          notes: "Diabetic friendly, balanced fiber",
        },
        {
          id: 5,
          time: "05:00 PM",
          mealType: "Evening Snacks",
          dietType: "Light Refreshment",
          items: "Warm Low-fat Milk / Green Tea + 2 Multigrain Digestive Biscuits / Roasted Makhana",
          status: "PENDING",
          notes: "Sugar-free beverage",
        },
        {
          id: 6,
          time: "08:00 PM",
          mealType: "Dinner",
          dietType: "Easy Digestible Night Meal",
          items: "2 Soft Whole Wheat Phulkas, Mixed Vegetable Stew / Moong Dal Khichdi, 1 Cup Soup",
          status: "PENDING",
          notes: "Complete meal before 8:30 PM",
        },
        {
          id: 7,
          time: "09:30 PM",
          mealType: "Bedtime Drink",
          dietType: "Comfort Hydration",
          items: "1 Small Cup Warm Turmeric Milk",
          status: "PENDING",
          notes: "Soothing bedtime drink",
        },
      ],
    };
  };

  const handleToggleTabletStatus = (id) => {
    if (!scheduleData) return;
    const updated = {
      ...scheduleData,
      tabletSchedule: scheduleData.tabletSchedule.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "GIVEN" ? "PENDING" : "GIVEN";
          return { ...t, status: nextStatus };
        }
        return t;
      }),
    };
    setScheduleData(updated);
    saveScheduleToServer(updated);
  };

  const handleToggleFoodStatus = (id) => {
    if (!scheduleData) return;
    const updated = {
      ...scheduleData,
      foodSchedule: scheduleData.foodSchedule.map((f) => {
        if (f.id === id) {
          const nextStatus = f.status === "SERVED" ? "PENDING" : "SERVED";
          return { ...f, status: nextStatus };
        }
        return f;
      }),
    };
    setScheduleData(updated);
    saveScheduleToServer(updated);
  };

  const handleAddTabletSubmit = (e) => {
    e.preventDefault();
    if (!newTablet.tabletName.trim()) return;

    const newId = Date.now();
    const entry = {
      id: newId,
      time: newTablet.time,
      tabletName: newTablet.tabletName.trim(),
      dosage: newTablet.dosage.trim(),
      foodRelation: newTablet.foodRelation,
      status: "PENDING",
      nurseNotes: newTablet.nurseNotes.trim() || "Prescribed dose",
    };

    const updated = {
      ...scheduleData,
      tabletSchedule: [...(scheduleData?.tabletSchedule || []), entry],
    };

    setScheduleData(updated);
    saveScheduleToServer(updated);
    setNewTablet({
      time: "08:00 AM",
      tabletName: "",
      dosage: "1 Tablet (Oral)",
      foodRelation: "After Breakfast",
      status: "PENDING",
      nurseNotes: "",
    });
    setShowAddTablet(false);
  };

  const handleAddMealSubmit = (e) => {
    e.preventDefault();
    if (!newMeal.items.trim()) return;

    const newId = Date.now();
    const entry = {
      id: newId,
      time: newMeal.time,
      mealType: newMeal.mealType,
      dietType: newMeal.dietType,
      items: newMeal.items.trim(),
      status: "PENDING",
      notes: newMeal.notes.trim(),
    };

    const updated = {
      ...scheduleData,
      foodSchedule: [...(scheduleData?.foodSchedule || []), entry],
    };

    setScheduleData(updated);
    saveScheduleToServer(updated);
    setNewMeal({
      time: "08:30 AM",
      mealType: "Breakfast",
      dietType: "Standard Balanced Diet",
      items: "",
      status: "PENDING",
      notes: "",
    });
    setShowAddMeal(false);
  };

  const saveScheduleToServer = async (updated) => {
    if (!selectedBedForSchedule) return;
    try {
      await fetch(`${API_URL}/api/beds/${selectedBedForSchedule.bedId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn("Saved schedule locally:", e);
    }
  };

  const filteredBeds = beds.filter((b) => {
    const s = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !s ||
      (b.bedNumber && b.bedNumber.toLowerCase().includes(s)) ||
      (b.ward && b.ward.toLowerCase().includes(s)) ||
      (b.patientName && b.patientName.toLowerCase().includes(s)) ||
      (b.bedType && b.bedType.toLowerCase().includes(s));

    const matchesWard = filterWard === "ALL" || b.ward === filterWard;
    const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;

    return matchesSearch && matchesWard && matchesStatus;
  });

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === "OCCUPIED").length;
  const availableBeds = beds.filter((b) => b.status === "AVAILABLE").length;
  const maintenanceBeds = beds.filter((b) => b.status === "MAINTENANCE").length;

  return (
    <div className="beds-page">
      <div className="page-header">
        <div>
          <h1>🛏️ Bed &amp; Ward Management</h1>
          <p>
            Real-time hospital bed allocation, ward monitoring, and patient daily care (Tablets &amp; Food Schedules)
          </p>
        </div>
        <div className="header-badge-warden">
          <span>👑 Chief Bed Warden Desk</span>
        </div>
      </div>

      <div className="bed-stats-grid">
        <div className="bed-stat-card total">
          <div className="bed-stat-icon">🛏️</div>
          <div>
            <span>Total Hospital Beds</span>
            <h3>{totalBeds}</h3>
          </div>
        </div>

        <div className="bed-stat-card occupied">
          <div className="bed-stat-icon">👤</div>
          <div>
            <span>Occupied Beds</span>
            <h3 style={{ color: "#b91c1c" }}>{occupiedBeds}</h3>
          </div>
        </div>

        <div className="bed-stat-card available">
          <div className="bed-stat-icon">🟢</div>
          <div>
            <span>Available Beds</span>
            <h3 style={{ color: "#059669" }}>{availableBeds}</h3>
          </div>
        </div>

        <div className="bed-stat-card maintenance">
          <div className="bed-stat-icon">🔧</div>
          <div>
            <span>In Maintenance</span>
            <h3 style={{ color: "#d97706" }}>{maintenanceBeds}</h3>
          </div>
        </div>
      </div>

      {error && <div className="bed-alert error">⚠ {error}</div>}
      {successMsg && <div className="bed-alert success">✓ {successMsg}</div>}

      <div className="bed-form-card">
        <div className="card-top">
          <h2>{editingId ? "✏️ Update Hospital Bed" : "➕ Add / Allocate Hospital Bed"}</h2>
          <p>Assign patient, ward section, bed type, and status</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Bed Number *</label>
              <input
                type="text"
                name="bedNumber"
                placeholder="e.g. B-101, ICU-04, P-205"
                value={formData.bedNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ward / Section *</label>
              <select name="ward" value={formData.ward} onChange={handleChange} required>
                <option value="General Ward A">General Ward A (Medical)</option>
                <option value="General Ward B">General Ward B (Surgical)</option>
                <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                <option value="Cardiac ICU (CCU)">Cardiac ICU (CCU)</option>
                <option value="Emergency Trauma Care">Emergency Trauma Care</option>
                <option value="Private Deluxe Ward">Private Deluxe Ward</option>
                <option value="Semi-Private Ward">Semi-Private Ward</option>
                <option value="Pediatric Ward">Pediatric Ward</option>
                <option value="Post-Op Recovery Ward">Post-Op Recovery Ward</option>
              </select>
            </div>

            <div className="form-group">
              <label>Bed Category / Type *</label>
              <select name="bedType" value={formData.bedType} onChange={handleChange} required>
                <option value="GENERAL">General Ward Bed</option>
                <option value="ICU">ICU Advanced Life Support</option>
                <option value="PRIVATE">Private Single Room</option>
                <option value="SEMI-PRIVATE">Semi-Private Double Bed</option>
                <option value="EMERGENCY">Emergency Triage Bed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Bed Status *</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="AVAILABLE">🟢 Available (Ready for Admission)</option>
                <option value="OCCUPIED">🔴 Occupied (Patient Admitted)</option>
                <option value="MAINTENANCE">🟡 Maintenance (Sanitizing / Repair)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assign Registered Patient (Optional)</label>
              <select name="patientId" value={formData.patientId} onChange={handleChange}>
                <option value="">-- Select from Registered Patients --</option>
                {patients.map((p) => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.firstName} {p.lastName || ""} (ID: #{p.patientId} - {p.disease || "General"})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Patient Full Name</label>
              <input
                type="text"
                name="patientName"
                placeholder="Enter patient name (if occupied)"
                value={formData.patientName}
                onChange={handleChange}
              />
            </div>

            {formData.status === "OCCUPIED" && (
              <div className="form-group">
                <label>Admission Date</label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Saving Bed..." : editingId ? "💾 Update Bed" : "➕ Add Hospital Bed"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    bedNumber: "",
                    ward: "General Ward A",
                    bedType: "GENERAL",
                    status: "AVAILABLE",
                    patientName: "",
                    patientId: "",
                    admissionDate: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="beds-table-card">
        <div className="table-header-row">
          <div>
            <h2>🛏️ Hospital Bed Roster &amp; Schedules</h2>
            <p>Click on any patient or the 📅 Schedule button to view medication &amp; diet timings</p>
          </div>

          <div className="table-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search bed, ward, patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={filterWard} onChange={(e) => setFilterWard(e.target.value)} className="filter-select">
              <option value="ALL">All Wards</option>
              <option value="General Ward A">General Ward A</option>
              <option value="Intensive Care Unit (ICU)">ICU</option>
              <option value="Private Deluxe Ward">Private Deluxe</option>
              <option value="Emergency Trauma Care">Emergency</option>
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="ALL">All Statuses</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="AVAILABLE">Available</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Bed No.</th>
                <th>Ward / Section</th>
                <th>Type</th>
                <th>Admitted Patient</th>
                <th>Admission Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBeds.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    No hospital beds matching your search / filter.
                  </td>
                </tr>
              ) : (
                filteredBeds.map((bed) => {
                  const hasPatient = bed.patientName && bed.patientName.trim().length > 0;
                  return (
                    <tr key={bed.bedId}>
                      <td>#{bed.bedId}</td>
                      <td>
                        <strong className="bed-tag">{bed.bedNumber}</strong>
                      </td>
                      <td>{bed.ward}</td>
                      <td>
                        <span className="type-pill">{bed.bedType}</span>
                      </td>
                      <td>
                        {hasPatient ? (
                          <div
                            className="patient-link-cell"
                            onClick={() => openScheduleModal(bed)}
                            title="Click to view Tablet & Food Schedule"
                          >
                            <span className="p-avatar">{bed.patientName.charAt(0).toUpperCase()}</span>
                            <span className="p-name">{bed.patientName}</span>
                            <span className="view-schedule-hint">📅 View Schedule</span>
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8", fontStyle: "italic" }}>None (Empty)</span>
                        )}
                      </td>
                      <td>{bed.admissionDate ? String(bed.admissionDate).substring(0, 10) : "—"}</td>
                      <td>
                        <span className={`status-pill ${String(bed.status || "AVAILABLE").toLowerCase()}`}>
                          {bed.status === "OCCUPIED" ? "🔴 Occupied" : bed.status === "AVAILABLE" ? "🟢 Available" : "🟡 Maintenance"}
                        </span>
                      </td>
                      <td>
                        <div className="action-btn-group">
                          {hasPatient && (
                            <button
                              type="button"
                              className="btn-schedule"
                              onClick={() => openScheduleModal(bed)}
                              title="Daily Tablet & Food Schedule"
                            >
                              📅 Schedule
                            </button>
                          )}
                          <button type="button" className="btn-edit" onClick={() => handleEdit(bed)}>
                            Edit
                          </button>
                          <button type="button" className="btn-del" onClick={() => handleDelete(bed.bedId)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBedForSchedule && (
        <div className="schedule-modal-overlay" onClick={closeScheduleModal}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal-header">
              <div className="header-patient-info">
                <div className="modal-avatar">
                  {(selectedBedForSchedule.patientName || "P").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{selectedBedForSchedule.patientName || "Admitted Patient"}</h3>
                  <div className="patient-meta-row">
                    <span>🛏️ Bed: <strong>{selectedBedForSchedule.bedNumber}</strong></span>
                    <span>🏥 Ward: <strong>{selectedBedForSchedule.ward}</strong></span>
                    <span>Type: <strong>{selectedBedForSchedule.bedType}</strong></span>
                    {selectedBedForSchedule.admissionDate && (
                      <span>Admitted: <strong>{String(selectedBedForSchedule.admissionDate).substring(0, 10)}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              <button type="button" className="close-modal-btn" onClick={closeScheduleModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="schedule-tabs">
              <button
                type="button"
                className={`tab-btn ${activeScheduleTab === "tablets" ? "active" : ""}`}
                onClick={() => setActiveScheduleTab("tablets")}
              >
                💊 Tablet &amp; Medication Schedule (Hourly)
              </button>
              <button
                type="button"
                className={`tab-btn ${activeScheduleTab === "food" ? "active" : ""}`}
                onClick={() => setActiveScheduleTab("food")}
              >
                🥗 Diet &amp; Food Schedule (Meals &amp; Timings)
              </button>
            </div>

            <div className="schedule-modal-body">
              {scheduleLoading ? (
                <div className="schedule-loading">
                  <div className="spinner"></div>
                  <p>Loading patient care schedule...</p>
                </div>
              ) : activeScheduleTab === "tablets" ? (
                <div className="schedule-tab-content">
                  <div className="schedule-section-header">
                    <div>
                      <h4>Daily Medication Administration Chart</h4>
                      <p>Prescribed medicines, exact timings, and relation to meals (Before / After Food)</p>
                    </div>
                    <button
                      type="button"
                      className="add-item-btn"
                      onClick={() => setShowAddTablet(!showAddTablet)}
                    >
                      {showAddTablet ? "✕ Cancel" : "➕ Add Medication Dose"}
                    </button>
                  </div>

                  {showAddTablet && (
                    <form onSubmit={handleAddTabletSubmit} className="add-entry-form">
                      <h5>➕ Add Tablet Dose to Patient Routine</h5>
                      <div className="entry-form-grid">
                        <div className="form-group">
                          <label>Intake Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 08:00 AM, 01:30 PM, 09:00 PM"
                            value={newTablet.time}
                            onChange={(e) => setNewTablet({ ...newTablet, time: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Tablet / Medicine Name &amp; Strength *</label>
                          <input
                            type="text"
                            placeholder="e.g. Pantoprazole 40mg, Paracetamol 650mg"
                            value={newTablet.tabletName}
                            onChange={(e) => setNewTablet({ ...newTablet, tabletName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Dosage &amp; Route</label>
                          <input
                            type="text"
                            placeholder="e.g. 1 Tablet (Oral), 5ml Syrup"
                            value={newTablet.dosage}
                            onChange={(e) => setNewTablet({ ...newTablet, dosage: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>Food Timing Instruction</label>
                          <select
                            value={newTablet.foodRelation}
                            onChange={(e) => setNewTablet({ ...newTablet, foodRelation: e.target.value })}
                          >
                            <option value="Before Food (Empty Stomach)">Before Food (Empty Stomach)</option>
                            <option value="After Breakfast">After Breakfast</option>
                            <option value="After Lunch">After Lunch</option>
                            <option value="After Evening Tea">After Evening Tea</option>
                            <option value="After Dinner">After Dinner</option>
                            <option value="Bedtime (Before Sleep)">Bedtime (Before Sleep)</option>
                            <option value="With Plenty of Water">With Plenty of Water</option>
                          </select>
                        </div>

                        <div className="form-group full-span">
                          <label>Nurse / Attendant Notes</label>
                          <input
                            type="text"
                            placeholder="e.g. Check blood pressure before administering"
                            value={newTablet.nurseNotes}
                            onChange={(e) => setNewTablet({ ...newTablet, nurseNotes: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="entry-form-actions">
                        <button type="submit" className="btn-save-entry">Save Tablet Timing</button>
                      </div>
                    </form>
                  )}

                  <div className="schedule-items-list">
                    {scheduleData?.tabletSchedule && scheduleData.tabletSchedule.length > 0 ? (
                      scheduleData.tabletSchedule.map((item) => (
                        <div key={item.id} className={`schedule-item-card ${item.status === "GIVEN" ? "completed" : "pending"}`}>
                          <div className="item-time-badge">
                            <span className="time-icon">⏰</span>
                            <strong>{item.time}</strong>
                          </div>

                          <div className="item-details">
                            <div className="item-title-row">
                              <h5 className="item-name">💊 {item.tabletName}</h5>
                              <span className="dosage-pill">{item.dosage}</span>
                            </div>

                            <div className="item-condition">
                              🍽️ Timing: <strong>{item.foodRelation}</strong>
                            </div>

                            {item.nurseNotes && (
                              <div className="item-notes">
                                📝 <em>{item.nurseNotes}</em>
                              </div>
                            )}
                          </div>

                          <div className="item-status-col">
                            <button
                              type="button"
                              className={`status-toggle-btn ${item.status === "GIVEN" ? "given" : "pending"}`}
                              onClick={() => handleToggleTabletStatus(item.id)}
                              title="Click to toggle administration status"
                            >
                              {item.status === "GIVEN" ? "✅ Administered" : "⏳ Pending Dose"}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-entries">No medication entries recorded for this patient.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="schedule-tab-content">
                  <div className="schedule-section-header">
                    <div>
                      <h4>Patient Daily Meal &amp; Diet Plan</h4>
                      <p>Timed meal service, nutritional guidelines, and special dietary restrictions</p>
                    </div>
                    <button
                      type="button"
                      className="add-item-btn"
                      onClick={() => setShowAddMeal(!showAddMeal)}
                    >
                      {showAddMeal ? "✕ Cancel" : "➕ Add Meal Timing"}
                    </button>
                  </div>

                  {showAddMeal && (
                    <form onSubmit={handleAddMealSubmit} className="add-entry-form">
                      <h5>➕ Add Meal to Patient Diet Schedule</h5>
                      <div className="entry-form-grid">
                        <div className="form-group">
                          <label>Serving Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 08:30 AM, 01:00 PM, 08:00 PM"
                            value={newMeal.time}
                            onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Meal Category</label>
                          <select
                            value={newMeal.mealType}
                            onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                          >
                            <option value="Morning Drink">Morning Drink (07:00 AM)</option>
                            <option value="Breakfast">Breakfast (08:30 AM)</option>
                            <option value="Mid-Morning Drink">Mid-Morning Refreshment (11:30 AM)</option>
                            <option value="Lunch">Lunch (01:00 PM)</option>
                            <option value="Evening Snacks">Evening Snacks (05:00 PM)</option>
                            <option value="Dinner">Dinner (08:00 PM)</option>
                            <option value="Bedtime Drink">Bedtime Drink (09:30 PM)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Diet Type</label>
                          <select
                            value={newMeal.dietType}
                            onChange={(e) => setNewMeal({ ...newMeal, dietType: e.target.value })}
                          >
                            <option value="Standard Balanced Diet">Standard Balanced Diet</option>
                            <option value="Diabetic Low-GI Diet">Diabetic Low-GI Diet</option>
                            <option value="Low Sodium Cardiac Diet">Low Sodium Cardiac Diet</option>
                            <option value="Soft & Easy Digestible Diet">Soft &amp; Easy Digestible Diet</option>
                            <option value="High Protein Post-Op Diet">High Protein Post-Op Diet</option>
                            <option value="Clear Liquid Diet">Clear Liquid Diet</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Dietary Restrictions</label>
                          <input
                            type="text"
                            placeholder="e.g. Sugar-free, Low salt, Fluid limit"
                            value={newMeal.notes}
                            onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                          />
                        </div>

                        <div className="form-group full-span">
                          <label>Food &amp; Menu Items Description *</label>
                          <input
                            type="text"
                            placeholder="e.g. 2 Phulkas, Yellow Moong Dal, Steamed Veggies, Curd"
                            value={newMeal.items}
                            onChange={(e) => setNewMeal({ ...newMeal, items: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="entry-form-actions">
                        <button type="submit" className="btn-save-entry">Save Meal Timing</button>
                      </div>
                    </form>
                  )}

                  <div className="schedule-items-list">
                    {scheduleData?.foodSchedule && scheduleData.foodSchedule.length > 0 ? (
                      scheduleData.foodSchedule.map((item) => (
                        <div key={item.id} className={`schedule-item-card food-card ${item.status === "SERVED" ? "completed" : "pending"}`}>
                          <div className="item-time-badge food-badge">
                            <span className="time-icon">🥗</span>
                            <strong>{item.time}</strong>
                          </div>

                          <div className="item-details">
                            <div className="item-title-row">
                              <h5 className="item-name">🍽️ {item.mealType}</h5>
                              <span className="diet-pill">{item.dietType}</span>
                            </div>

                            <div className="food-items-text">
                              <strong>Menu:</strong> {item.items}
                            </div>

                            {item.notes && (
                              <div className="item-notes">
                                ⚠️ <em>Restrictions: {item.notes}</em>
                              </div>
                            )}
                          </div>

                          <div className="item-status-col">
                            <button
                              type="button"
                              className={`status-toggle-btn ${item.status === "SERVED" ? "given" : "pending"}`}
                              onClick={() => handleToggleFoodStatus(item.id)}
                              title="Click to toggle food serving status"
                            >
                              {item.status === "SERVED" ? "✅ Served" : "⏳ Pending Service"}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-entries">No diet entries recorded for this patient.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="schedule-modal-footer">
              <button
                type="button"
                className="btn-print-chart"
                onClick={() => window.print()}
              >
                🖨️ Print Daily Care Chart
              </button>
              <button type="button" className="btn-close-chart" onClick={closeScheduleModal}>
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Beds;
