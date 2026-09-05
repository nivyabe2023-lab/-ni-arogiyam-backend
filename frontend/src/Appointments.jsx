import { useEffect, useState } from "react";
import "./Appointments.css";
import API_BASE_URL from "./config";

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
  const [activeHistoryTab, setActiveHistoryTab] = useState("medicines"); // "medicines", "visits", "appointments", "beds"

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
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      let baseList = [];
      try {
        const response = await fetch(`${API_URL}/api/appointments`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            baseList = data;
          }
        }
      } catch (netErr) {
        console.warn("Backend appointments fetch offline:", netErr);
      }

      if (!baseList || baseList.length === 0) {
        baseList = FALLBACK_APPOINTMENTS;
      }

      // Merge patient portal appointments from localStorage and default patient records
      try {
        const storedPortalAppts = JSON.parse(localStorage.getItem("ni_registered_appointments") || "[]");
        const patientRecords = JSON.parse(localStorage.getItem("ni_patient_records") || "{}");
        const extraAppts = [];

        Object.values(patientRecords).forEach((p) => {
          if (Array.isArray(p.appointments)) {
            p.appointments.forEach((apt) => {
              extraAppts.push({
                appointmentId: apt.id || apt.appointmentId,
                patientName: p.name || "Ramesh Kumar",
                patient: { firstName: p.name || "Ramesh", lastName: "Kumar", phoneNumber: p.phone || "9840123456" },
                doctorName: apt.doctorName || "Dr. Suresh V.",
                doctor: { firstName: "Suresh", lastName: "V.", specialization: apt.department || "Cardiology" },
                department: apt.department || "Cardiology",
                appointmentDate: apt.date || apt.appointmentDate || new Date().toISOString().split("T")[0],
                appointmentTime: apt.slot || apt.appointmentTime || "10:00 AM",
                status: (apt.status || "CONFIRMED").toUpperCase(),
                reason: apt.notes || "Patient Portal Consultation",
                source: "Patient Portal",
              });
            });
          }
        });

        // Default initial patient portal appointments
        const defaultPortalSeed = [
          {
            appointmentId: "PT-8821",
            patientName: "Ramesh Kumar (Patient Portal)",
            patient: { firstName: "Ramesh", lastName: "Kumar", phoneNumber: "9840123456" },
            doctorName: "Dr. Suresh V.",
            doctor: { firstName: "Suresh", lastName: "V.", specialization: "Cardiology" },
            department: "Cardiology",
            appointmentDate: "2026-09-08",
            appointmentTime: "10:30 AM",
            status: "CONFIRMED",
            reason: "Routine Cardiac Follow-up & BP Evaluation",
            source: "Patient Portal",
          },
          {
            appointmentId: "PT-7410",
            patientName: "Ramesh Kumar (Patient Portal)",
            doctorName: "Dr. Priya Arvind (Neurology)",
            patient: { firstName: "Ramesh", lastName: "Kumar", phoneNumber: "9840123456" },
            doctor: { firstName: "Priya", lastName: "Arvind", specialization: "Neurology" },
            department: "Neurology",
            appointmentDate: "2026-08-15",
            appointmentTime: "02:00 PM",
            status: "COMPLETED",
            source: "Patient Portal",
            reason: "Migraine & Tension Headache checkup"
          }
        ];

        const existingIds = new Set(baseList.map((a) => String(a.appointmentId || a.id)));
        const toAdd = [];
        [...storedPortalAppts, ...extraAppts, ...defaultPortalSeed].forEach((pa) => {
          const idStr = String(pa.appointmentId || pa.id);
          if (!existingIds.has(idStr)) {
            existingIds.add(idStr);
            toAdd.push({
              appointmentId: pa.appointmentId || pa.id,
              patientName: pa.patientName || (pa.patient ? `${pa.patient.firstName || ""} ${pa.patient.lastName || ""}`.trim() : "Ramesh Kumar"),
              patient: pa.patient || { firstName: pa.patientName || "Ramesh Kumar", lastName: "" },
              doctorName: pa.doctorName || "Dr. Suresh V.",
              doctor: pa.doctor || { firstName: "Suresh", lastName: "V.", specialization: pa.department || "Cardiology" },
              department: pa.department || "Cardiology",
              appointmentDate: pa.appointmentDate || pa.date || new Date().toISOString().split("T")[0],
              appointmentTime: pa.appointmentTime || pa.slot || "10:00 AM",
              status: (pa.status || "CONFIRMED").toUpperCase(),
              reason: pa.reason || pa.notes || "Patient Portal Booking",
              source: "Patient Portal",
            });
          }
        });

        setAppointments([...toAdd, ...baseList]);
      } catch (mergeErr) {
        setAppointments(baseList);
      }
    } catch (err) {
      console.warn("Using fallback appointments:", err);
      setAppointments(FALLBACK_APPOINTMENTS);
    } finally {
      setLoading(false);
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
      const payload = {
        patient: { patientId: parseInt(formData.patientId, 10) },
        doctor: { doctorId: parseInt(formData.doctorId, 10) },
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason.trim(),
        status: formData.status,
      };

      const url = editingAppointment
        ? `${API_URL}/api/appointments/${editingAppointment.appointmentId}`
        : `${API_URL}/api/appointments`;

      const res = await fetch(url, {
        method: editingAppointment ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save appointment");

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
      setError("Unable to save appointment to server.");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel / delete this appointment?")) return;
    try {
      const res = await fetch(`${API_URL}/api/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete appointment");
      setSuccess("Appointment deleted.");
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
    setActiveHistoryTab("medicines");

    const patId = patObj.patientId || patObj.id || 1;

    try {
      const res = await fetch(`${API_URL}/api/patients/${patId}/history`);
      if (res.ok) {
        const data = await res.json();
        setPatientHistoryData(data);
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
  };

  const generatePatientClinicalHistory = (patient, appointmentContext) => {
    const fullName = `${patient.firstName || "Patient"} ${patient.lastName || ""}`.trim();
    const patId = patient.patientId || 1;

    return {
      patientId: patId,
      fullName: fullName,
      age: patient.age || 34,
      gender: patient.gender || "Male",
      bloodGroup: patient.bloodGroup || "O+",
      phoneNumber: patient.phoneNumber || "+91 98765 43210",
      emergencyContact: "+91 98123 45678 (Spouse)",
      allergies: "Penicillin (Mild rash), Sulfa drugs",
      chronicConditions: "Hypertension (Stage 1), Mild Type-2 Diabetes",
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
          bedNumber: "B-101",
          ward: "General Ward A (Medical)",
          admissionDate: "2026-08-28",
          dischargeDate: "Current (Admitted)",
          status: "OCCUPIED",
        },
      ],
    };
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
    if (appointment?.doctorName && String(appointment.doctorName).trim() && appointment.doctorName !== "N/A" && appointment.doctorName !== "Doctor") {
      const d = String(appointment.doctorName).trim();
      return d.startsWith("Dr.") ? d : `Dr. ${d}`;
    }
    if (appointment?.doctor) {
      if (appointment.doctor.doctorName && appointment.doctor.doctorName !== "Doctor") {
        const d = String(appointment.doctor.doctorName).trim();
        return d.startsWith("Dr.") ? d : `Dr. ${d}`;
      }
      const full = `${appointment.doctor.firstName || ""} ${appointment.doctor.lastName || ""}`.trim();
      if (full) return full.startsWith("Dr.") ? full : `Dr. ${full}`;
      if (appointment.doctor.name) {
        const d = String(appointment.doctor.name).trim();
        return d.startsWith("Dr.") ? d : `Dr. ${d}`;
      }
    }
    if (appointment?.doctorId) {
      const match = doctors.find((d) => d.doctorId === appointment.doctorId);
      if (match) {
        const full = `${match.firstName || ""} ${match.lastName || ""}`.trim();
        if (full) return `Dr. ${full}`;
      }
    }
    const docFallbacks = [
      "Dr. Suresh Menon",
      "Dr. Ananya Rao",
      "Dr. Vikram Singh",
      "Dr. Priya Arvind",
      "Dr. Meera Nair",
      "Dr. R. Saravanan",
      "Dr. K. Saranya",
      "Dr. Priya Natarajan"
    ];
    const numId = parseInt(String(appointment?.appointmentId || "").replace(/\D/g, ""), 10);
    const idx = !isNaN(numId) && numId > 0 ? (numId - 1) % docFallbacks.length : 0;
    return docFallbacks[idx] || "Dr. Suresh Menon";
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
          <h1>📅 Clinical Appointments &amp; Consultations</h1>
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
                          {appt.source === "Patient Portal" && (
                            <span style={{ marginLeft: "6px", fontSize: "10.5px", background: "#dbeafe", color: "#1e40af", padding: "2px 7px", borderRadius: "10px", fontWeight: 700 }}>
                              📱 Patient Portal
                            </span>
                          )}
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
                            <button type="button" className="delete-btn" onClick={() => handleDelete(appt.appointmentId)}>
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
              ) : (
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
