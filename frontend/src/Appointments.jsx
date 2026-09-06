import { useEffect, useState } from "react";
import "./Appointments.css";
import API_BASE_URL from "./config";
import { generateLabReportPDF } from "./labReportPdfGenerator";

const API_URL = API_BASE_URL;

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDoctor, setFilterDoctor] = useState("ALL");

  const [editingAppointment, setEditingAppointment] = useState(null);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "SCHEDULED",
  });

  // =========================================================
  // PATIENT TOTAL CLINICAL HISTORY DOSSIER MODAL STATE
  // =========================================================
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);
  const [patientHistoryData, setPatientHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState("medicines"); // "medicines", "visits", "appointments", "beds", "labs"

  // Quick In-Modal New Appointment Form
  const [showQuickBookForm, setShowQuickBookForm] = useState(false);
  const [quickBookData, setQuickBookData] = useState({
    doctorId: "",
    appointmentDate: new Date().toISOString().substring(0, 10),
    appointmentTime: "10:00",
    reason: "Follow-up consultation",
  });

  // Quick In-Modal Add Medicine Form
  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [newMedicineData, setNewMedicineData] = useState({
    medicineName: "",
    dosage: "1 Tablet (Oral)",
    frequency: "Twice daily (1-0-1)",
    instructions: "After Meals",
    prescribedBy: "Dr. Suresh Menon",
    duration: "10 Days",
  });

  // Quick In-Modal Order Lab Test Form
  const [showAddLabForm, setShowAddLabForm] = useState(false);
  const [newLabData, setNewLabData] = useState({
    testName: "",
    category: "Cardiology & Biochemistry Panel",
    sampleType: "Venous Blood / Serum",
    priority: "Routine",
    summary: "Physician ordered diagnostic evaluation",
  });

  const userRole = (localStorage.getItem("userRole") || "ADMIN").toUpperCase();
  const isDoctor = userRole === "DOCTOR";
  const loggedInName = localStorage.getItem("loggedInUser") || "Doctor";

  const FALLBACK_PATIENTS = [
    { patientId: 1, firstName: "Rahul", lastName: "Sharma", age: 34, gender: "Male", phoneNumber: "9876543210", bloodGroup: "O+", disease: "Hypertension & Seasonal Fever" },
    { patientId: 2, firstName: "Priya", lastName: "Patel", age: 28, gender: "Female", phoneNumber: "9823456781", bloodGroup: "A+", disease: "Type-2 Diabetes & Respiratory Infection" },
    { patientId: 3, firstName: "Amit", lastName: "Verma", age: 45, gender: "Male", phoneNumber: "9712345678", bloodGroup: "B+", disease: "Cardiac Follow-up & Chest Discomfort" },
    { patientId: 4, firstName: "Sneha", lastName: "Reddy", age: 29, gender: "Female", phoneNumber: "9988776655", bloodGroup: "AB+", disease: "Allergy & Post-Op Recovery" },
  ];

  const FALLBACK_DOCTORS = [
    { doctorId: 1, firstName: "Suresh", lastName: "Menon", specialization: "Cardiology", phoneNumber: "9811122233", email: "suresh@hospital.com", availability: "AVAILABLE" },
    { doctorId: 2, firstName: "Ananya", lastName: "Rao", specialization: "General Medicine", phoneNumber: "9822233344", email: "ananya@hospital.com", availability: "AVAILABLE" },
    { doctorId: 3, firstName: "Vikram", lastName: "Singh", specialization: "Orthopedics", phoneNumber: "9833344455", email: "vikram@hospital.com", availability: "AVAILABLE" },
    { doctorId: 4, firstName: "Meera", lastName: "Nair", specialization: "Pediatrics", phoneNumber: "9844455566", email: "meera@hospital.com", availability: "AVAILABLE" },
  ];

  const FALLBACK_APPOINTMENTS = [
    {
      appointmentId: 1,
      patient: { patientId: 1, firstName: "Rahul", lastName: "Sharma", age: 34, gender: "Male", bloodGroup: "O+", phoneNumber: "9876543210" },
      doctor: { doctorId: 1, firstName: "Suresh", lastName: "Menon", specialization: "Cardiology" },
      appointmentDate: new Date().toISOString().substring(0, 10),
      appointmentTime: "10:30",
      reason: "Chest discomfort and routine cardiac checkup",
      status: "SCHEDULED",
    },
    {
      appointmentId: 2,
      patient: { patientId: 2, firstName: "Priya", lastName: "Patel", age: 28, gender: "Female", bloodGroup: "A+", phoneNumber: "9823456781" },
      doctor: { doctorId: 2, firstName: "Ananya", lastName: "Rao", specialization: "General Medicine" },
      appointmentDate: new Date().toISOString().substring(0, 10),
      appointmentTime: "11:45",
      reason: "Seasonal flu, fever, and persistent cough",
      status: "COMPLETED",
    },
    {
      appointmentId: 3,
      patient: { patientId: 3, firstName: "Amit", lastName: "Verma", age: 45, gender: "Male", bloodGroup: "B+", phoneNumber: "9712345678" },
      doctor: { doctorId: 3, firstName: "Vikram", lastName: "Singh", specialization: "Orthopedics" },
      appointmentDate: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
      appointmentTime: "14:15",
      reason: "Knee joint pain post injury & physiotherapy review",
      status: "PENDING",
    },
    {
      appointmentId: 4,
      patient: { patientId: 4, firstName: "Sneha", lastName: "Reddy", age: 29, gender: "Female", bloodGroup: "AB+", phoneNumber: "9988776655" },
      doctor: { doctorId: 4, firstName: "Meera", lastName: "Nair", specialization: "Pediatrics" },
      appointmentDate: new Date(Date.now() + 172800000).toISOString().substring(0, 10),
      appointmentTime: "09:30",
      reason: "Skin rash, acute allergy, and medication review",
      status: "SCHEDULED",
    },
  ];

  useEffect(() => {
    loadAppointments();
    loadPatients();
    loadDoctors();

    const handleUpdate = () => {
      loadAppointments();
    };
    window.addEventListener("hospital_appointments_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    let bc = null;
    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel("hospital_appointments_channel");
      bc.onmessage = () => {
        loadAppointments();
      };
    }

    const interval = setInterval(loadAppointments, 3000);

    return () => {
      window.removeEventListener("hospital_appointments_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (bc) bc.close();
      clearInterval(interval);
    };
  }, []);

  const getPortalAppointments = () => {
    let localAppts = [];
    try {
      const sysAppts = JSON.parse(localStorage.getItem("system_appointments") || "[]");
      if (Array.isArray(sysAppts)) {
        localAppts.push(...sysAppts);
      }
    } catch (e) {}

    try {
      const patientRecords = JSON.parse(localStorage.getItem("patient_portal_records") || "{}");
      Object.values(patientRecords).forEach((pat) => {
        if (pat && Array.isArray(pat.appointments)) {
          pat.appointments.forEach((apt) => {
            const alreadyInSys = localAppts.some((s) => 
              (s.id && apt.id && String(s.id) === String(apt.id)) ||
              (s.appointmentId && apt.appointmentId && String(s.appointmentId) === String(apt.appointmentId)) ||
              (s.id && apt.appointmentId && String(s.id) === String(apt.appointmentId)) ||
              (s.appointmentId && apt.id && String(s.appointmentId) === String(apt.id))
            );
            if (!alreadyInSys) {
              localAppts.push({
                id: apt.id || `NIA-CARD-${Math.floor(1000 + Math.random() * 9000)}`,
                appointmentId: apt.appointmentId || apt.id || "APT-" + Math.floor(1000 + Math.random() * 9000),
                patient: { firstName: pat.name || "Ramesh Kumar", lastName: "", phoneNumber: pat.phone || "" },
                patientName: pat.name || "Ramesh Kumar",
                doctor: { doctorName: apt.doctorName || "Dr. Rajesh Sharma", specialization: apt.department || "Cardiology" },
                doctorName: apt.doctorName || "Dr. Rajesh Sharma",
                appointmentDate: apt.date || apt.appointmentDate || new Date().toISOString().substring(0, 10),
                appointmentTime: apt.slot || apt.appointmentTime || "10:30 AM",
                reason: apt.notes || apt.reason || `Patient Portal: ${apt.department || "Specialist"} Consultation`,
                status: (apt.status || "CONFIRMED").toUpperCase(),
              });
            }
          });
        }
      });
    } catch (e) {}

    return localAppts;
  };

  const loadAppointments = async () => {
    try {
      setLoading(false);
      setError("");
      let serverData = [];
      try {
        const response = await fetch(`${API_URL}/api/appointments`);
        if (response.ok) {
          serverData = await response.json();
        }
      } catch (e) {}

      const localAppts = getPortalAppointments();
      const baseList = Array.isArray(serverData) && serverData.length > 0 ? serverData : FALLBACK_APPOINTMENTS;
      const combined = [...localAppts];

      baseList.forEach((b) => {
        const exists = combined.some((c) => {
          if (c.appointmentId && b.appointmentId && String(c.appointmentId) === String(b.appointmentId)) return true;
          if (c.id && b.id && String(c.id) === String(b.id)) return true;
          if (c.id && b.appointmentId && String(c.id) === String(b.appointmentId)) return true;
          if (c.appointmentId && b.id && String(c.appointmentId) === String(b.id)) return true;
          
          const cPat = (c.patientName || (c.patient ? `${c.patient.firstName || ""} ${c.patient.lastName || ""}` : "")).toLowerCase().trim();
          const bPat = (b.patientName || (b.patient ? `${b.patient.firstName || ""} ${b.patient.lastName || ""}` : "")).toLowerCase().trim();
          const cDate = String(c.appointmentDate || c.date || "").substring(0, 10);
          const bDate = String(b.appointmentDate || b.date || "").substring(0, 10);
          return cPat && bPat && cPat === bPat && cDate === bDate;
        });

        if (!exists) {
          combined.push(b);
        }
      });

      setAppointments(combined);
    } catch (err) {
      console.warn("Using fallback appointments:", err);
      const localAppts = getPortalAppointments();
      setAppointments([...localAppts, ...FALLBACK_APPOINTMENTS]);
    }
  };

  const loadPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/api/patients`);
      if (res.ok) {
        const data = await res.json();
        setPatients(Array.isArray(data) && data.length > 0 ? data : FALLBACK_PATIENTS);
      } else {
        setPatients(FALLBACK_PATIENTS);
      }
    } catch {
      setPatients(FALLBACK_PATIENTS);
    }
  };

  const loadDoctors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/doctors`);
      if (res.ok) {
        const data = await res.json();
        setDoctors(Array.isArray(data) && data.length > 0 ? data : FALLBACK_DOCTORS);
      } else {
        setDoctors(FALLBACK_DOCTORS);
      }
    } catch {
      setDoctors(FALLBACK_DOCTORS);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const pObj = patients.find(p => String(p.patientId) === String(formData.patientId)) || { firstName: "Patient", lastName: "" };
      const dObj = doctors.find(d => String(d.doctorId) === String(formData.doctorId)) || { firstName: "Doctor", lastName: "", specialization: "General Medicine" };
      const patientFullName = `${pObj.firstName || ""} ${pObj.lastName || ""}`.trim();
      const doctorFullName = dObj.firstName ? `Dr. ${dObj.firstName} ${dObj.lastName || ""}`.trim() : "Dr. Specialist";

      const aptIdVal = editingAppointment?.appointmentId || editingAppointment?.id || Date.now();
      const payload = {
        id: editingAppointment?.id || `NIA-${(dObj.specialization || "CARD").substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        appointmentId: aptIdVal,
        patientId: parseInt(formData.patientId, 10),
        patientName: patientFullName,
        patient: {
          patientId: parseInt(formData.patientId, 10),
          firstName: pObj.firstName,
          lastName: pObj.lastName,
          phoneNumber: pObj.phoneNumber,
        },
        doctorId: parseInt(formData.doctorId, 10),
        doctorName: doctorFullName,
        doctor: {
          doctorId: parseInt(formData.doctorId, 10),
          firstName: dObj.firstName,
          lastName: dObj.lastName,
          doctorName: doctorFullName,
          specialization: dObj.specialization,
        },
        department: dObj.specialization || "General Medicine",
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        date: formData.appointmentDate,
        slot: formData.appointmentTime,
        reason: formData.reason.trim(),
        status: formData.status,
      };

      // 1. Save to localStorage system_appointments permanently
      try {
        const sys = JSON.parse(localStorage.getItem("system_appointments") || "[]");
        const updatedSys = [payload, ...sys.filter(s => String(s.appointmentId) !== String(aptIdVal) && String(s.id) !== String(payload.id))];
        localStorage.setItem("system_appointments", JSON.stringify(updatedSys));
      } catch (e) {}

      // 2. Broadcast immediately across all browser tabs
      window.dispatchEvent(new CustomEvent("hospital_appointments_updated", { detail: payload }));
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("hospital_appointments_channel");
        bc.postMessage({ type: "APPOINTMENT_SAVED", appointment: payload });
        bc.close();
      }

      // 3. Post to backend REST API
      const url = editingAppointment
        ? `${API_URL}/api/appointments/${aptIdVal}`
        : `${API_URL}/api/appointments`;

      await fetch(url, {
        method: editingAppointment ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});

      setSuccess(editingAppointment ? "Appointment updated successfully!" : "Appointment scheduled successfully!");
      setEditingAppointment(null);
      setFormData({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        status: "SCHEDULED",
      });
      await loadAppointments();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Unable to save appointment.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    const patId = appointment?.patient?.patientId || appointment?.patientId || "";
    const docId = appointment?.doctor?.doctorId || appointment?.doctorId || "";

    setFormData({
      patientId: patId ? String(patId) : "",
      doctorId: docId ? String(docId) : "",
      appointmentDate: appointment.appointmentDate ? String(appointment.appointmentDate).substring(0, 10) : "",
      appointmentTime: appointment.appointmentTime || "",
      reason: appointment.reason || "",
      status: appointment.status || "SCHEDULED",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickStatusChange = async (appointment, newStatus) => {
    const aptId = appointment.appointmentId || appointment.id;
    try {
      setAppointments((prev) =>
        prev.map((a) => {
          if (String(a.appointmentId) === String(aptId) || String(a.id) === String(aptId)) {
            return { ...a, status: newStatus };
          }
          return a;
        })
      );

      try {
        const sys = JSON.parse(localStorage.getItem("system_appointments") || "[]");
        const updatedSys = sys.map((s) => {
          if (String(s.appointmentId) === String(aptId) || String(s.id) === String(aptId)) {
            return { ...s, status: newStatus };
          }
          return s;
        });
        localStorage.setItem("system_appointments", JSON.stringify(updatedSys));
      } catch (e) {}

      try {
        const records = JSON.parse(localStorage.getItem("patient_portal_records") || "{}");
        let recChanged = false;
        Object.keys(records).forEach((k) => {
          if (records[k] && Array.isArray(records[k].appointments)) {
            records[k].appointments = records[k].appointments.map((a) => {
              if (String(a.id) === String(aptId) || String(a.appointmentId) === String(aptId)) {
                recChanged = true;
                return { ...a, status: newStatus };
              }
              return a;
            });
          }
        });
        if (recChanged) {
          localStorage.setItem("patient_portal_records", JSON.stringify(records));
        }
      } catch (e) {}

      window.dispatchEvent(new CustomEvent("hospital_appointments_updated", { detail: { id: aptId, status: newStatus } }));
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("hospital_appointments_channel");
        bc.postMessage({ type: "APPOINTMENT_STATUS", id: aptId, status: newStatus });
        bc.close();
      }

      await fetch(`${API_URL}/api/appointments/${aptId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => {});

      setSuccess(`Appointment marked as ${newStatus}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel / delete this appointment permanently?")) return;
    try {
      try {
        const sys = JSON.parse(localStorage.getItem("system_appointments") || "[]");
        const updatedSys = sys.filter(s => String(s.appointmentId) !== String(id) && String(s.id) !== String(id));
        localStorage.setItem("system_appointments", JSON.stringify(updatedSys));
      } catch (e) {}

      try {
        const records = JSON.parse(localStorage.getItem("patient_portal_records") || "{}");
        let recChanged = false;
        Object.keys(records).forEach((k) => {
          if (records[k] && Array.isArray(records[k].appointments)) {
            const origLen = records[k].appointments.length;
            records[k].appointments = records[k].appointments.filter(a => String(a.id) !== String(id) && String(a.appointmentId) !== String(id));
            if (records[k].appointments.length !== origLen) recChanged = true;
          }
        });
        if (recChanged) {
          localStorage.setItem("patient_portal_records", JSON.stringify(records));
        }
      } catch (e) {}

      window.dispatchEvent(new CustomEvent("hospital_appointments_updated", { detail: { id, type: "DELETED" } }));
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("hospital_appointments_channel");
        bc.postMessage({ type: "APPOINTMENT_DELETED", id });
        bc.close();
      }

      await fetch(`${API_URL}/api/appointments/${id}`, { method: "DELETE" }).catch(() => {});

      setSuccess("Appointment permanently deleted.");
      await loadAppointments();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Unable to delete appointment.");
    }
  };

  // =========================================================
  // PATIENT TOTAL CLINICAL HISTORY DOSSIER
  // =========================================================

  const openPatientHistoryModal = async (patient, appointmentContext = null) => {
    let patObj = patient;
    if (!patObj && appointmentContext?.patient) patObj = appointmentContext.patient;
    if (!patObj) {
      patObj = { patientId: 1, firstName: "Rahul", lastName: "Sharma" };
    }

    setSelectedPatientForHistory(patObj);
    setHistoryLoading(true);
    setShowQuickBookForm(false);
    setShowAddMedicineForm(false);
    setShowAddLabForm(false);
    setActiveHistoryTab("medicines");

    const patId = patObj.patientId || patObj.id || 1;

    try {
      const res = await fetch(`${API_URL}/api/patients/${patId}/history`);
      if (res.ok) {
        const data = await res.json();

        // Also fetch live laboratory records from /api/laboratory
        let liveLabs = [];
        try {
          const labRes = await fetch(`${API_URL}/api/laboratory`);
          if (labRes.ok) {
            const allLabs = await labRes.json();
            if (Array.isArray(allLabs)) {
              liveLabs = allLabs
                .filter((l) => Number(l.patient?.patientId) === Number(patId) || Number(l.patientId) === Number(patId))
                .map((l) => ({
                  id: `LAB-${l.labId || l.id || Math.floor(1000 + Math.random() * 9000)}`,
                  testName: l.testName,
                  category: l.testType || "Cardiology & Biochemistry Panel",
                  testDate: l.testDate ? String(l.testDate).substring(0, 10) : new Date().toISOString().substring(0, 10),
                  sampleType: "Venous Blood / Serum",
                  status: l.status || "COMPLETED",
                  flag: l.status === "COMPLETED" ? "NORMAL" : "IN PROGRESS",
                  labDoctor: "Dr. R. Ramanathan, MD (Pathology)",
                  technician: "Central Diagnostic Laboratory",
                  summary: l.remarks || l.result || "Investigation validated by clinical pathologist.",
                  parameters: [
                    { name: l.testName, value: l.result || "Normal", unit: "", refRange: "Physiological Reference", status: "NORMAL" },
                  ],
                }));
            }
          }
        } catch (e) {
          console.warn("Could not fetch /api/laboratory:", e);
        }

        const generated = generatePatientClinicalHistory(patObj, appointmentContext);
        const mergedLabs = [...liveLabs, ...(data.labReports || [])];
        (generated.labReports || []).forEach((gl) => {
          if (!mergedLabs.some((ml) => ml.testName === gl.testName)) {
            mergedLabs.push(gl);
          }
        });

        setPatientHistoryData({
          ...data,
          labReports: mergedLabs,
        });
      } else {
        throw new Error("Failed to fetch history");
      }
    } catch (e) {
      console.warn("Using generated clinical history:", e);
      setPatientHistoryData(generatePatientClinicalHistory(patObj, appointmentContext));
    } finally {
      setHistoryLoading(false);
    }
  };

  const closePatientHistoryModal = () => {
    setSelectedPatientForHistory(null);
    setPatientHistoryData(null);
    setShowQuickBookForm(false);
    setShowAddMedicineForm(false);
    setShowAddLabForm(false);
  };

  const generatePatientClinicalHistory = (patient, appointmentContext) => {
    const fullName = `${patient.firstName || "Patient"} ${patient.lastName || ""}`.trim();
    const patId = patient.patientId || 1;

    let savedLabs = [];
    try {
      const stored = localStorage.getItem(`patient_labs_${patId}`);
      if (stored) savedLabs = JSON.parse(stored);
    } catch (e) {}

    const defaultLabs = [
      {
        id: "LAB-CRD-8821",
        testName: "Lipid Profile & Troponin I",
        category: "Cardiology & Biochemistry Panel",
        testDate: "2026-09-05",
        sampleType: "Venous Blood / Serum",
        status: "COMPLETED",
        flag: "BORDERLINE ELEVATED",
        labDoctor: "Dr. R. Ramanathan, MD (Pathology)",
        technician: "K. Mohan, M.Sc MLT",
        summary: "Cholesterol: 220 mg/dL, Troponin I: Normal (0.01 ng/mL). Biomarkers stable.",
        parameters: [
          { name: "High-Sensitivity Troponin-I (hs-cTnI)", value: "0.01", unit: "ng/mL", refRange: "< 0.04 ng/mL", status: "NORMAL" },
          { name: "Total Cholesterol", value: "220", unit: "mg/dL", refRange: "< 200 mg/dL", status: "HIGH" },
          { name: "LDL Cholesterol (Direct)", value: "142", unit: "mg/dL", refRange: "< 100 mg/dL", status: "HIGH" },
          { name: "HDL Cholesterol", value: "38", unit: "mg/dL", refRange: "> 40 mg/dL", status: "LOW" },
          { name: "Serum Triglycerides", value: "190", unit: "mg/dL", refRange: "< 150 mg/dL", status: "HIGH" },
          { name: "Creatine Kinase-MB (CK-MB)", value: "16.2", unit: "U/L", refRange: "< 25 U/L", status: "NORMAL" },
        ],
      },
      {
        id: "LAB-CBC-4102",
        testName: "Complete Blood Count (CBC) with Differential",
        category: "Hematology",
        testDate: "2026-09-04",
        sampleType: "Whole Blood (K2-EDTA)",
        status: "COMPLETED",
        flag: "NORMAL",
        labDoctor: "Dr. R. Ramanathan, MD (Pathology)",
        technician: "S. Priya, DMLT",
        summary: "Hemogram profile within physiological limits. No active leukocytosis or anemia.",
        parameters: [
          { name: "Hemoglobin (Hb)", value: "14.5", unit: "g/dL", refRange: "13.0 - 17.0", status: "NORMAL" },
          { name: "Total WBC Count", value: "7,400", unit: "/µL", refRange: "4,000 - 11,000", status: "NORMAL" },
          { name: "Platelet Count", value: "245,000", unit: "/µL", refRange: "150,000 - 450,000", status: "NORMAL" },
          { name: "Packed Cell Volume (PCV)", value: "43.2", unit: "%", refRange: "40.0 - 50.0", status: "NORMAL" },
          { name: "ESR (Westergren)", value: "12", unit: "mm/hr", refRange: "0 - 15", status: "NORMAL" },
          { name: "Neutrophils", value: "62", unit: "%", refRange: "40 - 75", status: "NORMAL" },
          { name: "Lymphocytes", value: "30", unit: "%", refRange: "20 - 45", status: "NORMAL" },
        ],
      },
      {
        id: "LAB-KFT-1904",
        testName: "Renal Function Test (RFT) & Serum Electrolytes",
        category: "Clinical Biochemistry",
        testDate: "2026-09-03",
        sampleType: "Serum",
        status: "COMPLETED",
        flag: "NORMAL",
        labDoctor: "Dr. R. Ramanathan, MD (Pathology)",
        technician: "M. Saravanan, B.Sc MLT",
        summary: "Serum Creatinine: 1.05 mg/dL, eGFR: 88 mL/min/1.73m². Renal clearance stable.",
        parameters: [
          { name: "Serum Creatinine", value: "1.05", unit: "mg/dL", refRange: "0.70 - 1.30", status: "NORMAL" },
          { name: "Blood Urea Nitrogen (BUN)", value: "18.2", unit: "mg/dL", refRange: "8.0 - 23.0", status: "NORMAL" },
          { name: "Serum Sodium (Na+)", value: "139", unit: "mEq/L", refRange: "135 - 145", status: "NORMAL" },
          { name: "Serum Potassium (K+)", value: "4.3", unit: "mEq/L", refRange: "3.5 - 5.1", status: "NORMAL" },
          { name: "eGFR", value: "88", unit: "mL/min/1.73m²", refRange: "> 60", status: "NORMAL" },
        ],
      },
      {
        id: "LAB-DIA-3301",
        testName: "HbA1c & Fasting Plasma Glucose",
        category: "Diabetic & Endocrine Panel",
        testDate: "2026-08-28",
        sampleType: "Whole Blood & Fluoride Plasma",
        status: "COMPLETED",
        flag: "BORDERLINE ELEVATED",
        labDoctor: "Dr. R. Ramanathan, MD (Pathology)",
        technician: "K. Mohan, M.Sc MLT",
        summary: "HbA1c: 6.4%, Fasting Glucose: 118 mg/dL. Pre-diabetic metabolic profile.",
        parameters: [
          { name: "HbA1c (Glycosylated Hb)", value: "6.4", unit: "%", refRange: "< 5.7 (Normal), 5.7-6.4 (Pre-diabetic)", status: "ELEVATED" },
          { name: "Fasting Blood Glucose", value: "118", unit: "mg/dL", refRange: "70 - 99 mg/dL", status: "ELEVATED" },
          { name: "Estimated Average Glucose", value: "137", unit: "mg/dL", refRange: "< 126 mg/dL", status: "ELEVATED" },
        ],
      },
      {
        id: "LAB-ECG-7719",
        testName: "12-Lead Electrocardiogram (ECG) & 2D Echo",
        category: "Cardiology Diagnostic",
        testDate: "2026-08-28",
        sampleType: "Electrocardiographic Trace",
        status: "COMPLETED",
        flag: "NORMAL",
        labDoctor: "Dr. Suresh Menon, DM (Cardio)",
        technician: "R. Anitha, Echo Tech",
        summary: "Normal sinus rhythm (74 bpm). LVEF 58%. No acute ST-elevation.",
        parameters: [
          { name: "Ventricular Rate", value: "74", unit: "bpm", refRange: "60 - 100 bpm", status: "NORMAL" },
          { name: "PR Interval", value: "162", unit: "ms", refRange: "120 - 200 ms", status: "NORMAL" },
          { name: "QRS Duration", value: "88", unit: "ms", refRange: "80 - 120 ms", status: "NORMAL" },
          { name: "QTc Interval", value: "418", unit: "ms", refRange: "< 440 ms", status: "NORMAL" },
          { name: "LVEF (Echo)", value: "58", unit: "%", refRange: "55 - 70 %", status: "NORMAL" },
        ],
      },
    ];

    const finalLabs = [...savedLabs];
    defaultLabs.forEach((dl) => {
      if (!finalLabs.some((fl) => fl.testName === dl.testName)) {
        finalLabs.push(dl);
      }
    });

    return {
      patientId: patId,
      fullName: fullName,
      age: patient.age || 52,
      gender: patient.gender || "Male",
      bloodGroup: patient.bloodGroup || "O+",
      phoneNumber: patient.phoneNumber || "+91 9840123456",
      emergencyContact: "+91 98123 45678 (Spouse)",
      allergies: "Penicillin (Mild), Sulfa drugs",
      chronicConditions: patient.disease || "Coronary Artery Disease (CAD)",
      medicinesTaken: [
        {
          id: 1,
          medicineName: "Tab. Telmisartan 40mg",
          dosage: "1 Tablet",
          frequency: "Once Daily (1-0-0)",
          instructions: "Morning Before Breakfast",
          prescribedBy: "Dr. Suresh Menon (Cardiology)",
          datePrescribed: "2026-08-10",
          duration: "30 Days",
          status: "ACTIVE",
        },
        {
          id: 2,
          medicineName: "Tab. Metformin 500mg SR",
          dosage: "1 Tablet",
          frequency: "Twice Daily (1-0-1)",
          instructions: "With Meals (Post Breakfast & Dinner)",
          prescribedBy: "Dr. Ananya Rao (General Medicine)",
          datePrescribed: "2026-08-10",
          duration: "30 Days",
          status: "ACTIVE",
        },
        {
          id: 3,
          medicineName: "Cap. Amoxicillin + Clavulanic Acid 625mg (Augmentin)",
          dosage: "1 Capsule",
          frequency: "Twice Daily (1-0-1)",
          instructions: "After Food",
          prescribedBy: "Dr. Ananya Rao (General Medicine)",
          datePrescribed: "2026-08-20",
          duration: "7 Days",
          status: "COMPLETED",
        },
        {
          id: 4,
          medicineName: "Tab. Dolo 650mg (Paracetamol)",
          dosage: "1 Tablet SOS",
          frequency: "As needed for fever > 100°F",
          instructions: "After Food",
          prescribedBy: "Dr. Suresh Menon",
          datePrescribed: "2026-08-20",
          duration: "5 Days",
          status: "COMPLETED",
        },
        {
          id: 5,
          medicineName: "Tab. Atorvastatin 10mg",
          dosage: "1 Tablet",
          frequency: "Night Bedtime (0-0-1)",
          instructions: "After Dinner Before Sleep",
          prescribedBy: "Dr. Suresh Menon (Cardiology)",
          datePrescribed: "2026-08-10",
          duration: "60 Days",
          status: "ACTIVE",
        },
      ],
      pastVisits: [
        {
          visitId: "VST-9021",
          visitDate: "2026-08-28 10:15 AM",
          department: "Cardiology & Vascular OPD",
          doctorName: "Dr. Suresh Menon",
          visitType: "OPD Consultation",
          vitals: "BP: 130/84 mmHg | Pulse: 76 bpm | Temp: 98.4°F | SpO2: 98%",
          symptoms: "Mild exertion palpitations, chest tightness during morning walk",
          diagnosis: "Mild Essential Hypertension - stable ECG, lipid profile advised",
          outcome: "Medication adjusted. Follow-up after 2 weeks.",
        },
        {
          visitId: "VST-8740",
          visitDate: "2026-08-15 03:30 PM",
          department: "General Medicine",
          doctorName: "Dr. Ananya Rao",
          visitType: "Acute Care Walk-in",
          vitals: "BP: 124/80 mmHg | Pulse: 88 bpm | Temp: 101.2°F | SpO2: 97%",
          symptoms: "Acute high fever, throat irritation, dry cough for 3 days",
          diagnosis: "Acute Upper Respiratory Tract Viral Infection",
          outcome: "Prescribed 7-day course Augmentin + Paracetamol SOS. Advised rest.",
        },
        {
          visitId: "VST-7910",
          visitDate: "2026-07-02 11:00 AM",
          department: "Preventive Health Checkup",
          doctorName: "Dr. Vikram Singh",
          visitType: "Executive Health Package",
          vitals: "BP: 128/82 mmHg | Pulse: 72 bpm | Temp: 98.6°F | SpO2: 99%",
          symptoms: "Annual routine executive health checkup",
          diagnosis: "Mild borderline HbA1c (6.2%), Normal Liver/Kidney Function",
          outcome: "Dietary modifications and daily 30min brisk walking prescribed.",
        },
      ],
      appointmentsList: [
        {
          id: 101,
          date: appointmentContext?.appointmentDate || "2026-09-02",
          time: appointmentContext?.appointmentTime || "10:30 AM",
          doctor: getDoctorName(appointmentContext) || "Dr. Suresh Menon",
          department: "Cardiology",
          reason: appointmentContext?.reason || "Chest discomfort and routine cardiac checkup",
          status: appointmentContext?.status || "SCHEDULED",
        },
        {
          id: 92,
          date: "2026-08-28",
          time: "10:15 AM",
          doctor: "Dr. Suresh Menon",
          department: "Cardiology",
          reason: "Cardiac ECG & Blood Pressure evaluation",
          status: "COMPLETED",
        },
        {
          id: 84,
          date: "2026-08-15",
          time: "03:30 PM",
          doctor: "Dr. Ananya Rao",
          department: "General Medicine",
          reason: "Fever and severe throat infection",
          status: "COMPLETED",
        },
      ],
      bedAllocations: [
        {
          bedNumber: "CCU-101",
          ward: "Cardiology Critical Unit",
          admissionDate: "2026-09-05",
          dischargeDate: "Admitted",
          status: "OCCUPIED",
        },
      ],
      labReports: finalLabs,
    };
  };

  const handleDownloadLabPDF = (report) => {
    try {
      const p = patientHistoryData || {};
      const fullName = p.fullName || `${selectedPatientForHistory?.firstName || "Rajesh"} ${selectedPatientForHistory?.lastName || "Kumar"}`.trim();
      const nameParts = fullName.split(" ");
      const labPayload = {
        labId: report.id?.replace(/\D/g, "") || "101",
        laboratoryId: report.id?.replace(/\D/g, "") || "101",
        testName: report.testName,
        testType: report.category || "Cardiology & Biochemistry",
        testDate: report.testDate || new Date().toISOString().substring(0, 10),
        result: report.summary || "Investigation completed and validated.",
        status: report.status || "COMPLETED",
        remarks: report.summary || "Clinically reviewed and signed by Attending Pathologist.",
        patient: {
          patientId: p.patientId || selectedPatientForHistory?.patientId || 1,
          firstName: nameParts[0] || "Rajesh",
          lastName: nameParts.slice(1).join(" ") || "Kumar",
          age: p.age || 52,
          gender: p.gender || "Male",
          bloodGroup: p.bloodGroup || "O+",
          phoneNumber: p.phoneNumber || "9840123456",
          name: fullName,
        },
      };
      generateLabReportPDF(labPayload);
    } catch (err) {
      console.error("Failed to generate lab report PDF:", err);
      window.print();
    }
  };

  const handleAddLabReportSubmit = (e) => {
    e.preventDefault();
    if (!newLabData.testName.trim() || !selectedPatientForHistory) return;

    const patId = patientHistoryData?.patientId || selectedPatientForHistory.patientId || 1;
    const generatedId = `LAB-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport = {
      id: generatedId,
      testName: newLabData.testName.trim(),
      category: newLabData.category,
      testDate: new Date().toISOString().split("T")[0],
      sampleType: newLabData.sampleType || "Venous Blood (Serum)",
      status: "SAMPLE COLLECTED",
      flag: newLabData.priority === "Stat / Emergency" ? "EMERGENCY" : "IN PROGRESS",
      labDoctor: `Ordered by ${loggedInName || "Attending Physician"}`,
      technician: "Automated Diagnostic Analyzer",
      summary: newLabData.summary || `Investigation ordered on ${new Date().toLocaleDateString()}`,
      parameters: [
        { name: "Sample Intake Verification", value: "Verified", unit: "", refRange: "Intact", status: "NORMAL" },
        { name: "Processing Priority", value: newLabData.priority, unit: "", refRange: "Standard TAT", status: "NORMAL" },
      ],
    };

    const updatedList = [newReport, ...(patientHistoryData?.labReports || [])];
    const updated = {
      ...patientHistoryData,
      labReports: updatedList,
    };
    setPatientHistoryData(updated);

    try {
      localStorage.setItem(`patient_labs_${patId}`, JSON.stringify(updatedList));
    } catch (err) {
      console.warn(err);
    }

    setShowAddLabForm(false);
    setNewLabData({
      testName: "",
      category: "Cardiology & Biochemistry Panel",
      sampleType: "Venous Blood / Serum",
      priority: "Routine",
      summary: "Physician ordered diagnostic evaluation",
    });
    setSuccess("New diagnostic lab test ordered successfully!");
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleQuickBookAppointment = (e) => {
    e.preventDefault();
    if (!quickBookData.doctorId || !selectedPatientForHistory) return;

    const selectedDoc = doctors.find((d) => String(d.doctorId) === String(quickBookData.doctorId));
    const docName = selectedDoc ? `Dr. ${selectedDoc.firstName} ${selectedDoc.lastName || ""}`.trim() : "Dr. Consultant";

    const newAppt = {
      id: Date.now(),
      date: quickBookData.appointmentDate,
      time: quickBookData.appointmentTime,
      doctor: docName,
      department: selectedDoc?.specialization || "Clinical Consultation",
      reason: quickBookData.reason.trim(),
      status: "SCHEDULED",
    };

    const updated = {
      ...patientHistoryData,
      appointmentsList: [newAppt, ...(patientHistoryData?.appointmentsList || [])],
    };

    setPatientHistoryData(updated);
    setShowQuickBookForm(false);
    setSuccess("New follow-up appointment booked for patient!");
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleAddMedicineSubmit = (e) => {
    e.preventDefault();
    if (!newMedicineData.medicineName.trim()) return;

    const newMed = {
      id: Date.now(),
      medicineName: newMedicineData.medicineName.trim(),
      dosage: newMedicineData.dosage.trim(),
      frequency: newMedicineData.frequency.trim(),
      instructions: newMedicineData.instructions.trim(),
      prescribedBy: newMedicineData.prescribedBy || loggedInName,
      datePrescribed: new Date().toISOString().substring(0, 10),
      duration: newMedicineData.duration.trim(),
      status: "ACTIVE",
    };

    const updated = {
      ...patientHistoryData,
      medicinesTaken: [newMed, ...(patientHistoryData?.medicinesTaken || [])],
    };

    setPatientHistoryData(updated);
    setShowAddMedicineForm(false);
    setNewMedicineData({
      medicineName: "",
      dosage: "1 Tablet (Oral)",
      frequency: "Twice daily (1-0-1)",
      instructions: "After Meals",
      prescribedBy: loggedInName,
      duration: "10 Days",
    });
    setSuccess("New medication added to patient medical record!");
    setTimeout(() => setSuccess(""), 4000);
  };

  const getPatientName = (appointment) => {
    if (appointment?.patient?.firstName) {
      return `${appointment.patient.firstName} ${appointment.patient.lastName || ""}`.trim();
    }
    if (appointment?.patientName) return appointment.patientName;
    if (appointment?.patientId) {
      const match = patients.find((p) => p.patientId === appointment.patientId);
      if (match) return `${match.firstName} ${match.lastName || ""}`.trim();
    }
    return "Admitted Patient";
  };

  const getDoctorName = (appointment) => {
    if (appointment?.doctorName) return appointment.doctorName;
    if (appointment?.doctor?.firstName) {
      return `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName || ""}`.trim();
    }
    if (appointment?.doctor?.doctorName) return appointment.doctor.doctorName;
    if (appointment?.doctor?.name) return appointment.doctor.name;
    if (appointment?.doctorId) {
      const match = doctors.find((d) => d.doctorId === appointment.doctorId);
      if (match) return `Dr. ${match.firstName} ${match.lastName || ""}`.trim();
    }
    if (appointment?.department) return `Dr. ${appointment.department} Specialist`;
    return "Dr. Suresh Menon";
  };

  const getStatusClass = (status) => {
    switch (String(status).toUpperCase()) {
      case "COMPLETED":
        return "status-completed";
      case "PENDING":
        return "status-pending";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "status-scheduled";
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const pName = getPatientName(appt).toLowerCase();
    const dName = getDoctorName(appt).toLowerCase();
    const reason = (appt.reason || "").toLowerCase();
    const s = searchTerm.toLowerCase().trim();

    const matchesSearch = !s || pName.includes(s) || dName.includes(s) || reason.includes(s);
    const matchesStatus = filterStatus === "ALL" || appt.status === filterStatus;
    const matchesDoc = filterDoctor === "ALL" || String(appt.doctor?.doctorId || appt.doctorId) === filterDoctor;

    return matchesSearch && matchesStatus && matchesDoc;
  });

  return (
    <div className="appointments-page">
      {/* HEADER */}
      <div className="appointments-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
            <h1 style={{ margin: 0 }}>📅 Clinical Appointments &amp; Consultations</h1>
            <span className="nav-badge live" style={{ padding: "3px 8px", fontSize: "0.7rem", display: "inline-block" }}>
              Live Real-Time Synced
            </span>
          </div>
          <p>Schedule patient consultations and click any patient to review their total medical history</p>
        </div>

        <div className="doctor-badge-info">
          <span>🩺 {isDoctor ? "Doctor Clinical Portal" : "Hospital Consultation Desk"}</span>
          <strong>{appointments.length} Total Appointments</strong>
        </div>
      </div>

      {isDoctor && (
        <div className="doctor-notice-card">
          <div className="doc-icon">👨‍⚕️</div>
          <div>
            <strong>Doctor Quick Tip:</strong>
            <p>Click on any patient's name or the <strong>📋 Total History</strong> button to open the complete medical dossier showing medicines taken, past hospital visits, and clinical notes.</p>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">⚠ {error}</div>}
      {success && <div className="alert alert-success">✓ {success}</div>}

      {/* SCHEDULE APPOINTMENT FORM */}
      <div className="appointment-form-card">
        <div className="card-header">
          <h2>{editingAppointment ? "✏️ Edit Consultation Appointment" : "➕ Schedule New Appointment"}</h2>
          <p>Select registered patient, consultant doctor, date and clinical reason</p>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Patient *</label>
              <select name="patientId" value={formData.patientId} onChange={handleChange} required>
                <option value="">-- Select Registered Patient --</option>
                {patients.map((p) => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.firstName} {p.lastName || ""} (ID: #{p.patientId} - {p.disease || "General"})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Consultant Doctor *</label>
              <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                <option value="">-- Select Specialist Doctor --</option>
                {doctors.map((d) => (
                  <option key={d.doctorId} value={d.doctorId}>
                    Dr. {d.firstName} {d.lastName || ""} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Appointment Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Appointment Time *</label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PENDING">Pending Approval</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Reason / Symptoms / Clinical Notes *</label>
              <input
                type="text"
                name="reason"
                placeholder="e.g. Follow-up consultation for hypertension and chest discomfort"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? "Scheduling..." : editingAppointment ? "💾 Update Appointment" : "📅 Book Appointment"}
            </button>
            {editingAppointment && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingAppointment(null);
                  setFormData({
                    patientId: "",
                    doctorId: "",
                    appointmentDate: "",
                    appointmentTime: "",
                    reason: "",
                    status: "SCHEDULED",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* APPOINTMENTS TABLE */}
      <div className="appointments-table-card">
        <div className="table-header-row">
          <div>
            <h2>📋 Patient Appointment Roster</h2>
            <p>Click on any patient or the 📋 Total History button to inspect clinical records</p>
          </div>

          <div className="table-filters">
            <input
              type="text"
              placeholder="Search patient, doctor, reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)} className="filter-select">
              <option value="ALL">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.doctorId} value={String(d.doctorId)}>
                  Dr. {d.firstName} ({d.specialization})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient (Click for History)</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason / Symptoms</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                      No appointments matching your search filter.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt, idx) => {
                    const patientName = getPatientName(appt);
                    const doctorName = getDoctorName(appt);
                    const avatarChar = patientName.charAt(0).toUpperCase() || "P";
                    const patientObj = appt.patient || { firstName: patientName, patientId: appt.patientId || idx + 1 };

                    return (
                      <tr key={appt.appointmentId || idx}>
                        <td>
                          <span className="appointment-id">#{appt.appointmentId || idx + 1}</span>
                        </td>
                        <td>
                          <div
                            className="patient-history-trigger"
                            onClick={() => openPatientHistoryModal(patientObj, appt)}
                            title="Click to view Total Medical & Medication History"
                          >
                            <span className="p-avatar">{avatarChar}</span>
                            <div>
                              <strong className="p-name">{patientName}</strong>
                              <span className="history-badge">📋 Total History</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`}</strong>
                        </td>
                        <td>{appt.appointmentDate ? String(appt.appointmentDate).substring(0, 10) : "—"}</td>
                        <td>{appt.appointmentTime || "10:00 AM"}</td>
                        <td>
                          <span className="reason-text">{appt.reason || "Consultation"}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusClass(appt.status)}`}>
                            {appt.status || "SCHEDULED"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {appt.status !== "CONFIRMED" && (
                              <button
                                type="button"
                                style={{
                                  background: "#ecfdf5",
                                  color: "#047857",
                                  border: "1px solid #a7f3d0",
                                  padding: "5px 9px",
                                  borderRadius: "5px",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleQuickStatusChange(appt, "CONFIRMED")}
                                title="Confirm this appointment"
                              >
                                ✓ Confirm
                              </button>
                            )}
                            {appt.status !== "COMPLETED" && (
                              <button
                                type="button"
                                style={{
                                  background: "#eff6ff",
                                  color: "#1d4ed8",
                                  border: "1px solid #bfdbfe",
                                  padding: "5px 9px",
                                  borderRadius: "5px",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleQuickStatusChange(appt, "COMPLETED")}
                                title="Mark appointment completed"
                              >
                                ✓ Done
                              </button>
                            )}
                            <button
                              type="button"
                              className="history-btn"
                              onClick={() => openPatientHistoryModal(patientObj, appt)}
                              title="View Total Patient History"
                            >
                              📋 History
                            </button>
                            <button type="button" className="edit-btn" onClick={() => handleEdit(appt)}>
                              Edit
                            </button>
                            <button type="button" className="delete-btn" onClick={() => handleDelete(appt.appointmentId || appt.id)}>
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
        )}
      </div>

      {/* =====================================================
          TOTAL PATIENT CLINICAL HISTORY DOSSIER MODAL
          ===================================================== */}
      {selectedPatientForHistory && (
        <div className="history-modal-overlay" onClick={closePatientHistoryModal}>
          <div className="history-modal" onClick={(e) => e.stopPropagation()}>
            {/* DOSSIER HEADER */}
            <div className="history-modal-header">
              <div className="dossier-patient-bio">
                <div className="bio-avatar">
                  {(selectedPatientForHistory.firstName || "P").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="bio-title-row">
                    <h3>{patientHistoryData?.fullName || `${selectedPatientForHistory.firstName} ${selectedPatientForHistory.lastName || ""}`.trim()}</h3>
                    <span className="patient-id-tag">Patient ID: #{patientHistoryData?.patientId || selectedPatientForHistory.patientId || "1"}</span>
                  </div>
                  <div className="bio-meta-row">
                    <span>Age: <strong>{patientHistoryData?.age || 34} Yrs</strong></span>
                    <span>Gender: <strong>{patientHistoryData?.gender || "Male"}</strong></span>
                    <span>Blood: <strong style={{ color: "#ef4444" }}>{patientHistoryData?.bloodGroup || "O+"}</strong></span>
                    <span>Phone: <strong>{patientHistoryData?.phoneNumber || "+91 98765 43210"}</strong></span>
                  </div>
                </div>
              </div>

              <button type="button" className="close-modal-btn" onClick={closePatientHistoryModal} aria-label="Close">
                ✕
              </button>
            </div>

            {/* CLINICAL SUMMARY BANNER */}
            <div className="clinical-summary-banner">
              <div className="summary-pill">
                <strong>⚠️ Known Allergies:</strong>
                <span>{patientHistoryData?.allergies || "None reported"}</span>
              </div>
              <div className="summary-pill">
                <strong>🩺 Chronic Diagnoses:</strong>
                <span>{patientHistoryData?.chronicConditions || "Hypertension, Mild Diabetes"}</span>
              </div>
            </div>

            {/* DOSSIER TABS */}
            <div className="history-tabs">
              <button
                type="button"
                className={`history-tab-btn ${activeHistoryTab === "medicines" ? "active" : ""}`}
                onClick={() => setActiveHistoryTab("medicines")}
              >
                💊 Medicines &amp; Prescriptions Taken ({patientHistoryData?.medicinesTaken?.length || 0})
              </button>
              <button
                type="button"
                className={`history-tab-btn ${activeHistoryTab === "visits" ? "active" : ""}`}
                onClick={() => setActiveHistoryTab("visits")}
              >
                🏥 Hospital Visits &amp; Consultations ({patientHistoryData?.pastVisits?.length || 0})
              </button>
              <button
                type="button"
                className={`history-tab-btn ${activeHistoryTab === "appointments" ? "active" : ""}`}
                onClick={() => setActiveHistoryTab("appointments")}
              >
                📅 Appointments Timeline &amp; Booking ({patientHistoryData?.appointmentsList?.length || 0})
              </button>
              <button
                type="button"
                className={`history-tab-btn ${activeHistoryTab === "beds" ? "active" : ""}`}
                onClick={() => setActiveHistoryTab("beds")}
              >
                🛏️ Bed &amp; Ward Stays
              </button>
              <button
                type="button"
                className={`history-tab-btn ${activeHistoryTab === "labs" ? "active" : ""}`}
                onClick={() => setActiveHistoryTab("labs")}
              >
                🔬 Lab Reports ({patientHistoryData?.labReports?.length || 0})
              </button>
            </div>

            {/* DOSSIER BODY */}
            <div className="history-modal-body">
              {historyLoading ? (
                <div className="history-loading">
                  <div className="spinner"></div>
                  <p>Aggregating patient medical dossier...</p>
                </div>
              ) : activeHistoryTab === "medicines" ? (
                /* ===========================================
                   TAB 1: MEDICINES TAKEN HISTORY
                   =========================================== */
                <div className="history-tab-pane">
                  <div className="tab-pane-header">
                    <div>
                      <h4>Prescribed Medication &amp; Dosage History</h4>
                      <p>Full record of all tablets, capsules, dosages, and instructions prescribed by doctors</p>
                    </div>
                    <button
                      type="button"
                      className="add-med-btn"
                      onClick={() => setShowAddMedicineForm(!showAddMedicineForm)}
                    >
                      {showAddMedicineForm ? "✕ Cancel" : "➕ Add Prescription"}
                    </button>
                  </div>

                  {/* ADD MEDICINE FORM */}
                  {showAddMedicineForm && (
                    <form onSubmit={handleAddMedicineSubmit} className="add-medicine-inline-form">
                      <h5>➕ Prescribe New Medication</h5>
                      <div className="form-grid-3">
                        <div className="form-group">
                          <label>Medicine Name &amp; Strength *</label>
                          <input
                            type="text"
                            placeholder="e.g. Tab. Telmisartan 40mg"
                            value={newMedicineData.medicineName}
                            onChange={(e) => setNewMedicineData({ ...newMedicineData, medicineName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Dosage</label>
                          <input
                            type="text"
                            placeholder="e.g. 1 Tablet (Oral)"
                            value={newMedicineData.dosage}
                            onChange={(e) => setNewMedicineData({ ...newMedicineData, dosage: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Frequency</label>
                          <input
                            type="text"
                            placeholder="e.g. Twice Daily (1-0-1)"
                            value={newMedicineData.frequency}
                            onChange={(e) => setNewMedicineData({ ...newMedicineData, frequency: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Food Relation / Timing</label>
                          <select
                            value={newMedicineData.instructions}
                            onChange={(e) => setNewMedicineData({ ...newMedicineData, instructions: e.target.value })}
                          >
                            <option value="After Meals">After Meals</option>
                            <option value="Before Food (Empty Stomach)">Before Food (Empty Stomach)</option>
                            <option value="Bedtime with Milk">Bedtime with Milk</option>
                            <option value="As Needed (SOS)">As Needed (SOS)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Prescribed By</label>
                          <input
                            type="text"
                            placeholder="Dr. Consultant Name"
                            value={newMedicineData.prescribedBy}
                            onChange={(e) => setNewMedicineData({ ...newMedicineData, prescribedBy: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Course Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 15 Days, 30 Days"
                            value={newMedicineData.duration}
                            onChange={(e) => setNewMedicineData({ ...newMedicineData, duration: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-actions-end">
                        <button type="submit" className="save-med-btn">Prescribe Medicine</button>
                      </div>
                    </form>
                  )}

                  {/* MEDICINE CARDS / TABLE */}
                  <div className="medicines-history-list">
                    {patientHistoryData?.medicinesTaken && patientHistoryData.medicinesTaken.length > 0 ? (
                      patientHistoryData.medicinesTaken.map((med) => (
                        <div key={med.id} className="medicine-history-card">
                          <div className="med-icon-col">💊</div>
                          <div className="med-info-col">
                            <div className="med-title-row">
                              <h5>{med.medicineName}</h5>
                              <span className={`med-status-pill ${med.status.toLowerCase()}`}>
                                {med.status === "ACTIVE" ? "🟢 Active Course" : "✓ Completed"}
                              </span>
                            </div>
                            <div className="med-timing-grid">
                              <span><strong>Dosage:</strong> {med.dosage}</span>
                              <span><strong>Frequency:</strong> {med.frequency}</span>
                              <span><strong>Instructions:</strong> {med.instructions}</span>
                              <span><strong>Duration:</strong> {med.duration}</span>
                            </div>
                            <div className="med-doctor-note">
                              🩺 Prescribed by: <strong>{med.prescribedBy}</strong> &bull; Date: {med.datePrescribed}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-records">No prescription history found for this patient.</p>
                    )}
                  </div>
                </div>
              ) : activeHistoryTab === "visits" ? (
                /* ===========================================
                   TAB 2: HOSPITAL VISITS HISTORY
                   =========================================== */
                <div className="history-tab-pane">
                  <div className="tab-pane-header">
                    <div>
                      <h4>Past Hospital Visits &amp; Check-in Timeline</h4>
                      <p>Chronological record of emergency, inpatient, and outpatient hospital consultations</p>
                    </div>
                  </div>

                  <div className="visits-timeline">
                    {patientHistoryData?.pastVisits && patientHistoryData.pastVisits.length > 0 ? (
                      patientHistoryData.pastVisits.map((visit, idx) => (
                        <div key={visit.visitId || idx} className="visit-timeline-card">
                          <div className="timeline-node">
                            <div className="node-dot">🏥</div>
                            <div className="node-line"></div>
                          </div>
                          <div className="visit-card-content">
                            <div className="visit-top-row">
                              <div>
                                <h5>{visit.department}</h5>
                                <span className="visit-date">🕒 {visit.visitDate} ({visit.visitType})</span>
                              </div>
                              <span className="visit-id-badge">{visit.visitId}</span>
                            </div>

                            <div className="vitals-strip">
                              📊 <strong>Vitals Recorded:</strong> {visit.vitals}
                            </div>

                            <div className="visit-clinical-details">
                              <div>
                                <strong>Presenting Symptoms:</strong> {visit.symptoms}
                              </div>
                              <div>
                                <strong>Clinical Diagnosis:</strong> {visit.diagnosis}
                              </div>
                              <div>
                                <strong>Doctor Outcome / Advice:</strong> <em>{visit.outcome}</em>
                              </div>
                            </div>

                            <div className="visit-footer-doctor">
                              👨‍⚕️ Attending Physician: <strong>{visit.doctorName}</strong>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-records">No previous hospital visits recorded.</p>
                    )}
                  </div>
                </div>
              ) : activeHistoryTab === "appointments" ? (
                /* ===========================================
                   TAB 3: APPOINTMENTS & BOOKING
                   =========================================== */
                <div className="history-tab-pane">
                  <div className="tab-pane-header">
                    <div>
                      <h4>Patient Consultations &amp; Booking Timeline</h4>
                      <p>Past visits, current schedule, and quick follow-up booking</p>
                    </div>
                    <button
                      type="button"
                      className="add-med-btn"
                      onClick={() => setShowQuickBookForm(!showQuickBookForm)}
                    >
                      {showQuickBookForm ? "✕ Cancel" : "📅 Schedule Follow-up Appointment"}
                    </button>
                  </div>

                  {/* QUICK BOOK FORM */}
                  {showQuickBookForm && (
                    <form onSubmit={handleQuickBookAppointment} className="add-medicine-inline-form">
                      <h5>📅 Book Next Follow-up Consultation</h5>
                      <div className="form-grid-3">
                        <div className="form-group">
                          <label>Consultant Doctor *</label>
                          <select
                            value={quickBookData.doctorId}
                            onChange={(e) => setQuickBookData({ ...quickBookData, doctorId: e.target.value })}
                            required
                          >
                            <option value="">-- Select Specialist Doctor --</option>
                            {doctors.map((d) => (
                              <option key={d.doctorId} value={d.doctorId}>
                                Dr. {d.firstName} {d.lastName || ""} ({d.specialization})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Appointment Date *</label>
                          <input
                            type="date"
                            value={quickBookData.appointmentDate}
                            onChange={(e) => setQuickBookData({ ...quickBookData, appointmentDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Appointment Time *</label>
                          <input
                            type="time"
                            value={quickBookData.appointmentTime}
                            onChange={(e) => setQuickBookData({ ...quickBookData, appointmentTime: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group full-span" style={{ gridColumn: "1 / -1" }}>
                          <label>Reason / Follow-up Purpose *</label>
                          <input
                            type="text"
                            placeholder="e.g. Post-treatment evaluation and blood pressure checkup"
                            value={quickBookData.reason}
                            onChange={(e) => setQuickBookData({ ...quickBookData, reason: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-actions-end">
                        <button type="submit" className="save-med-btn">Confirm Appointment</button>
                      </div>
                    </form>
                  )}

                  {/* APPOINTMENTS LIST */}
                  <div className="patient-appts-list">
                    {patientHistoryData?.appointmentsList && patientHistoryData.appointmentsList.length > 0 ? (
                      patientHistoryData.appointmentsList.map((app) => (
                        <div key={app.id} className="patient-appt-card">
                          <div className="appt-date-box">
                            <span className="cal-icon">📅</span>
                            <strong>{app.date}</strong>
                            <small>{app.time}</small>
                          </div>
                          <div className="appt-details-box">
                            <h5>{app.reason}</h5>
                            <p>👨‍⚕️ Consultant: <strong>{app.doctor}</strong> &bull; Dept: {app.department || "Clinical"}</p>
                          </div>
                          <div>
                            <span className={`status-badge ${getStatusClass(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-records">No appointments recorded for this patient.</p>
                    )}
                  </div>
                </div>
              ) : activeHistoryTab === "beds" ? (
                /* ===========================================
                   TAB 4: BED & WARD STAYS
                   =========================================== */
                <div className="history-tab-pane">
                  <div className="tab-pane-header">
                    <div>
                      <h4>Inpatient Ward &amp; Bed Allocation History</h4>
                      <p>Room, ward section, and admission details for this patient</p>
                    </div>
                  </div>

                  <div className="patient-appts-list">
                    {patientHistoryData?.bedAllocations && patientHistoryData.bedAllocations.length > 0 ? (
                      patientHistoryData.bedAllocations.map((bed, idx) => (
                        <div key={idx} className="patient-appt-card">
                          <div className="appt-date-box" style={{ background: "#ecfdf5", borderColor: "#a7f3d0" }}>
                            <span className="cal-icon">🛏️</span>
                            <strong style={{ color: "#065f46" }}>{bed.bedNumber}</strong>
                          </div>
                          <div className="appt-details-box">
                            <h5>{bed.ward}</h5>
                            <p>Admission Date: <strong>{bed.admissionDate}</strong> &bull; Discharge: <strong>{bed.dischargeDate}</strong></p>
                          </div>
                          <div>
                            <span className="status-badge status-completed">
                              {bed.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-records">No inpatient bed stays recorded for this patient.</p>
                    )}
                  </div>
                </div>
              ) : (
                /* ===========================================
                   TAB 5: LAB & DIAGNOSTIC REPORTS
                   =========================================== */
                <div className="history-tab-pane">
                  <div className="tab-pane-header">
                    <div>
                      <h4>Laboratory &amp; Diagnostic Pathology Reports</h4>
                      <p>Clinical investigation findings, biomarkers, and pathology reports for this patient</p>
                    </div>
                    <button
                      type="button"
                      className="add-med-btn"
                      onClick={() => setShowAddLabForm(!showAddLabForm)}
                    >
                      {showAddLabForm ? "✕ Cancel" : "🔬 Order New Lab Test"}
                    </button>
                  </div>

                  {/* ORDER LAB TEST INLINE FORM */}
                  {showAddLabForm && (
                    <form onSubmit={handleAddLabReportSubmit} className="add-medicine-inline-form">
                      <h5>🔬 Order Diagnostic Investigation / Lab Test</h5>
                      <div className="form-grid-3">
                        <div className="form-group">
                          <label>Investigation / Test Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Serum Troponin-I, Liver Function Test (LFT)"
                            value={newLabData.testName}
                            onChange={(e) => setNewLabData({ ...newLabData, testName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Diagnostic Category *</label>
                          <select
                            value={newLabData.category}
                            onChange={(e) => setNewLabData({ ...newLabData, category: e.target.value })}
                          >
                            <option value="Cardiology & Biochemistry Panel">Cardiology &amp; Biochemistry Panel</option>
                            <option value="Hematology">Hematology</option>
                            <option value="Clinical Biochemistry">Clinical Biochemistry</option>
                            <option value="Diabetic & Endocrine Panel">Diabetic &amp; Endocrine Panel</option>
                            <option value="Microbiology & Serology">Microbiology &amp; Serology</option>
                            <option value="Radiology & Imaging">Radiology &amp; Imaging</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Sample / Specimen Type</label>
                          <input
                            type="text"
                            placeholder="e.g. Venous Blood (EDTA), Serum"
                            value={newLabData.sampleType}
                            onChange={(e) => setNewLabData({ ...newLabData, sampleType: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Priority / Urgency</label>
                          <select
                            value={newLabData.priority}
                            onChange={(e) => setNewLabData({ ...newLabData, priority: e.target.value })}
                          >
                            <option value="Routine">Routine (Within 4 Hours)</option>
                            <option value="Stat / Emergency">Stat / Emergency (Immediate)</option>
                            <option value="Urgent">Urgent (Within 1 Hour)</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                          <label>Clinical Indication / Reason for Investigation</label>
                          <input
                            type="text"
                            placeholder="e.g. Evaluate chest tightness, cardiac markers post CCU admission"
                            value={newLabData.summary}
                            onChange={(e) => setNewLabData({ ...newLabData, summary: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-actions-end">
                        <button type="submit" className="save-med-btn">
                          Confirm &amp; Dispatch Order to Laboratory
                        </button>
                      </div>
                    </form>
                  )}

                  {/* LAB REPORTS LIST */}
                  <div className="patient-lab-reports-list">
                    {patientHistoryData?.labReports && patientHistoryData.labReports.length > 0 ? (
                      patientHistoryData.labReports.map((report) => (
                        <div key={report.id} className="dossier-lab-card">
                          <div className="dossier-lab-header">
                            <div className="dossier-lab-title-group">
                              <span className="lab-card-icon">🔬</span>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                  <h5>{report.testName}</h5>
                                  <span className="lab-id-pill">{report.id}</span>
                                </div>
                                <p className="lab-meta-sub">
                                  <span>🏷️ {report.category}</span>
                                  <span>📅 {report.testDate}</span>
                                  <span>🩸 Specimen: {report.sampleType || "Venous Blood"}</span>
                                </p>
                              </div>
                            </div>
                            <div className="dossier-lab-status-actions">
                              <span className={`lab-flag-badge ${report.flag === "NORMAL" ? "normal" : report.flag?.includes("ELEVATED") ? "alert" : "warning"}`}>
                                {report.flag || report.status}
                              </span>
                              <button
                                type="button"
                                className="btn-download-lab-pdf"
                                onClick={() => handleDownloadLabPDF(report)}
                                title="Download Official Signed Lab Report PDF"
                              >
                                📥 PDF Report
                              </button>
                            </div>
                          </div>

                          {report.summary && (
                            <div className="lab-clinical-summary-box">
                              <strong>Clinical Impression &amp; Remarks:</strong> {report.summary}
                            </div>
                          )}

                          {report.parameters && report.parameters.length > 0 && (
                            <div className="lab-param-table-wrapper">
                              <table className="dossier-lab-table">
                                <thead>
                                  <tr>
                                    <th>Test Parameter</th>
                                    <th>Observed Value</th>
                                    <th>Reference Range</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.parameters.map((param, pIdx) => (
                                    <tr key={pIdx} className={param.status !== "NORMAL" ? "abnormal-row" : ""}>
                                      <td className="param-name-cell">{param.name}</td>
                                      <td className="param-val-cell">
                                        <strong>{param.value}</strong> {param.unit && <small>{param.unit}</small>}
                                      </td>
                                      <td className="param-ref-cell">{param.refRange}</td>
                                      <td>
                                        <span className={`param-status-dot ${param.status === "NORMAL" ? "normal" : "flagged"}`}>
                                          {param.status === "NORMAL" ? "✓ Normal" : `⚠️ ${param.status}`}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="dossier-lab-footer-row">
                            <span>👨‍⚕️ Verified: <strong>{report.labDoctor || "Dr. R. Ramanathan, MD (Pathology)"}</strong></span>
                            {report.technician && <span>🔬 Analyzed By: <strong>{report.technician}</strong></span>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-records">No laboratory investigation records found for this patient.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* DOSSIER FOOTER */}
            <div className="history-modal-footer">
              <button
                type="button"
                className="btn-print-dossier"
                onClick={() => window.print()}
              >
                🖨️ Print Complete Patient Clinical Dossier
              </button>
              <button type="button" className="btn-close-dossier" onClick={closePatientHistoryModal}>
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
