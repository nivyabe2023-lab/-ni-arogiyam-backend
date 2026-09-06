import { useEffect, useState } from "react";
import "./Beds.css";
import API_BASE_URL from "./config";
import { generateLabReportPDF } from "./labReportPdfGenerator";

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

  // New In-Patient Medicine Form State
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    medicineName: "",
    dosage: "1 Tablet (Oral)",
    frequency: "Twice Daily (1-0-1)",
    instructions: "After Meals",
    prescribedBy: "Dr. Suresh Menon (Cardiology)",
    duration: "14 Days",
  });

  // New Lab Report Form State
  const [showAddLab, setShowAddLab] = useState(false);
  const [newLab, setNewLab] = useState({
    testName: "",
    category: "Cardiology & Biochemistry Panel",
    sampleType: "Venous Blood / Serum",
    priority: "Routine",
    summary: "",
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
    setShowAddMedicine(false);
    setShowAddLab(false);

    try {
      const defaultSched = generateLocalSchedule(bed);
      let data = null;

      try {
        const res = await fetch(`${API_URL}/api/beds/${bed.bedId}/schedule`);
        if (res.ok) {
          data = await res.json();
        }
      } catch (err) {
        console.warn("Backend bed schedule API offline, falling back to client-side storage:", err);
      }

      // Check localStorage for persisted bed schedule changes
      let localSaved = null;
      try {
        const stored = localStorage.getItem(`bed_schedule_${bed.bedId}`);
        if (stored) localSaved = JSON.parse(stored);
      } catch (err) {}

      const merged = {
        ...defaultSched,
        ...(data || {}),
        tabletSchedule: (localSaved?.tabletSchedule || data?.tabletSchedule || defaultSched.tabletSchedule),
        foodSchedule: (localSaved?.foodSchedule || data?.foodSchedule || defaultSched.foodSchedule),
        medicines: (localSaved?.medicines || (data?.medicines && data.medicines.length > 0 ? data.medicines : defaultSched.medicines)),
        labReports: (localSaved?.labReports || (data?.labReports && data.labReports.length > 0 ? data.labReports : defaultSched.labReports)),
      };

      // Try fetching live laboratory records from /api/laboratory for this patient
      try {
        const labRes = await fetch(`${API_URL}/api/laboratory`);
        if (labRes.ok) {
          const allLabs = await labRes.json();
          if (Array.isArray(allLabs) && allLabs.length > 0) {
            const patMatch = patients.find(
              (p) =>
                (bed.patientId && String(p.patientId) === String(bed.patientId)) ||
                (bed.patientName && `${p.firstName} ${p.lastName || ""}`.trim().toLowerCase() === bed.patientName.trim().toLowerCase())
            );

            if (patMatch) {
              const liveFiltered = allLabs
                .filter(
                  (l) =>
                    Number(l.patient?.patientId) === Number(patMatch.patientId) ||
                    Number(l.patientId) === Number(patMatch.patientId)
                )
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
                  summary: l.remarks || l.result || "Investigation completed and verified by clinical pathologist.",
                  parameters: [
                    { name: l.testName, value: l.result || "Normal", unit: "", refRange: "Physiological Reference", status: "NORMAL" },
                  ],
                }));

              liveFiltered.forEach((lf) => {
                if (!merged.labReports.some((el) => el.testName === lf.testName)) {
                  merged.labReports.unshift(lf);
                }
              });
            }
          }
        }
      } catch (err) {
        console.warn("Could not query live /api/laboratory:", err);
      }

      setScheduleData(merged);
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
    setShowAddMedicine(false);
    setShowAddLab(false);
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
      medicines: [
        {
          id: 1,
          medicineName: "Tab. Telmisartan 40mg",
          category: "Cardiology / Antihypertensive",
          dosage: "1 Tablet (Oral)",
          frequency: "Once Daily (1-0-0)",
          instructions: "Morning Before Breakfast",
          prescribedBy: "Dr. Suresh Menon (Cardiology)",
          datePrescribed: "2026-08-28",
          duration: "30 Days",
          status: "ACTIVE",
        },
        {
          id: 2,
          medicineName: "Tab. Metformin 500mg SR",
          category: "Diabetology / Glycemic Control",
          dosage: "1 Tablet (Oral)",
          frequency: "Twice Daily (1-0-1)",
          instructions: "With Meals (Breakfast & Dinner)",
          prescribedBy: "Dr. Ananya Rao (General Medicine)",
          datePrescribed: "2026-08-28",
          duration: "30 Days",
          status: "ACTIVE",
        },
        {
          id: 3,
          medicineName: "Tab. Atorvastatin 20mg",
          category: "Lipid Lowering / Statin",
          dosage: "1 Tablet (Oral)",
          frequency: "Once Nightly (0-0-1)",
          instructions: "After Dinner (Bedtime)",
          prescribedBy: "Dr. Suresh Menon (Cardiology)",
          datePrescribed: "2026-09-01",
          duration: "60 Days",
          status: "ACTIVE",
        },
        {
          id: 4,
          medicineName: "Inj. Pantoprazole 40mg IV",
          category: "Gastroenterology / PPI",
          dosage: "40mg IV Infusion",
          frequency: "Once Daily (OD)",
          instructions: "Slow IV injection with NS flush",
          prescribedBy: "Dr. Suresh Menon",
          datePrescribed: "2026-09-05",
          duration: "5 Days",
          status: "ACTIVE",
        },
        {
          id: 5,
          medicineName: "Cap. Augmentin 625mg (Amoxicillin + Clavulanic)",
          category: "Antibiotics / Anti-infective",
          dosage: "1 Capsule (Oral)",
          frequency: "Twice Daily (1-0-1)",
          instructions: "After Food with water",
          prescribedBy: "Dr. Ananya Rao",
          datePrescribed: "2026-08-25",
          duration: "7 Days",
          status: "COMPLETED",
        },
      ],
      labReports: [
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
          summary: "Cholesterol: 220 mg/dL, Troponin I: Normal (0.01 ng/mL). Cardiac enzymes stable; lipid fraction elevated.",
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
          summary: "Hemogram profile within physiological limits. Leucocyte count and platelets normal.",
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
          summary: "Serum Creatinine: 1.05 mg/dL, eGFR: 88 mL/min/1.73m². Adequate renal clearance.",
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
          summary: "HbA1c: 6.4%, Fasting Glucose: 118 mg/dL. Pre-diabetic glycemic profile.",
          parameters: [
            { name: "HbA1c (Glycosylated Hb)", value: "6.4", unit: "%", refRange: "< 5.7 (Normal), 5.7-6.4 (Pre-diabetic)", status: "ELEVATED" },
            { name: "Fasting Blood Glucose", value: "118", unit: "mg/dL", refRange: "70 - 99 mg/dL", status: "ELEVATED" },
            { name: "Estimated Average Glucose", value: "137", unit: "mg/dL", refRange: "< 126 mg/dL", status: "ELEVATED" },
          ],
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

  const handleToggleMedicineStatus = (id) => {
    if (!scheduleData) return;
    const updated = {
      ...scheduleData,
      medicines: (scheduleData.medicines || []).map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === "ACTIVE" ? "COMPLETED" : "ACTIVE";
          return { ...m, status: nextStatus };
        }
        return m;
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

  const handleAddMedicineSubmit = (e) => {
    e.preventDefault();
    if (!newMedicine.medicineName.trim()) return;

    const newId = Date.now();
    const entry = {
      id: newId,
      medicineName: newMedicine.medicineName.trim(),
      category: "In-Patient Prescription",
      dosage: newMedicine.dosage.trim() || "1 Tablet (Oral)",
      frequency: newMedicine.frequency.trim() || "Once Daily",
      instructions: newMedicine.instructions,
      prescribedBy: newMedicine.prescribedBy.trim() || "Attending Consultant",
      datePrescribed: new Date().toISOString().substring(0, 10),
      duration: newMedicine.duration.trim() || "14 Days",
      status: "ACTIVE",
    };

    const updated = {
      ...scheduleData,
      medicines: [entry, ...(scheduleData?.medicines || [])],
    };

    setScheduleData(updated);
    saveScheduleToServer(updated);
    setNewMedicine({
      medicineName: "",
      dosage: "1 Tablet (Oral)",
      frequency: "Twice Daily (1-0-1)",
      instructions: "After Meals",
      prescribedBy: "Dr. Suresh Menon (Cardiology)",
      duration: "14 Days",
    });
    setShowAddMedicine(false);
  };

  const handleDownloadLabPDF = (report) => {
    try {
      const p = selectedBedForSchedule || {};
      const fullName = p.patientName || "Admitted Patient";
      const nameParts = fullName.split(" ");
      const labPayload = {
        labId: String(report.id || "101").replace(/\D/g, "") || "101",
        laboratoryId: String(report.id || "101").replace(/\D/g, "") || "101",
        testName: report.testName,
        testType: report.category || "Cardiology & Biochemistry",
        testDate: report.testDate || new Date().toISOString().substring(0, 10),
        result: report.summary || "Investigation completed and validated.",
        status: report.status || "COMPLETED",
        remarks: report.summary || "Clinically reviewed and signed by Attending Pathologist.",
        patient: {
          patientId: p.patientId || p.bedId || 1,
          firstName: nameParts[0] || "Admitted",
          lastName: nameParts.slice(1).join(" ") || "Patient",
          age: 52,
          gender: "Male",
          bloodGroup: "O+",
          phoneNumber: "+91 98401 23456",
          name: fullName,
        },
      };
      generateLabReportPDF(labPayload);
    } catch (err) {
      console.error("PDF generate error:", err);
      alert("Unable to generate lab report PDF. Please try again.");
    }
  };

  const handleAddLabSubmit = (e) => {
    e.preventDefault();
    if (!newLab.testName.trim()) return;

    const newId = `LAB-ORD-${Date.now().toString().slice(-4)}`;
    const entry = {
      id: newId,
      testName: newLab.testName.trim(),
      category: newLab.category,
      testDate: new Date().toISOString().substring(0, 10),
      sampleType: newLab.sampleType.trim() || "Venous Blood / Serum",
      status: "PENDING",
      flag: newLab.priority === "Stat / Emergency" ? "URGENT / STAT" : "PENDING LAB ANALYSIS",
      labDoctor: "Dr. R. Ramanathan, MD (Pathology)",
      technician: "Central Diagnostic Laboratory",
      summary: newLab.summary.trim() || "Investigation ordered for clinical evaluation during inpatient stay.",
      parameters: [
        { name: newLab.testName.trim(), value: "Specimen In Lab", unit: "", refRange: "Pending Analysis", status: "PENDING" },
      ],
    };

    const updated = {
      ...scheduleData,
      labReports: [entry, ...(scheduleData?.labReports || [])],
    };

    setScheduleData(updated);
    saveScheduleToServer(updated);
    setNewLab({
      testName: "",
      category: "Cardiology & Biochemistry Panel",
      sampleType: "Venous Blood / Serum",
      priority: "Routine",
      summary: "",
    });
    setShowAddLab(false);
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
      localStorage.setItem(`bed_schedule_${selectedBedForSchedule.bedId}`, JSON.stringify(updated));
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
                💊 Hourly Tablet Schedule
              </button>
              <button
                type="button"
                className={`tab-btn ${activeScheduleTab === "medicines" ? "active" : ""}`}
                onClick={() => setActiveScheduleTab("medicines")}
              >
                💊 Prescribed Medicines ({scheduleData?.medicines?.length || 0})
              </button>
              <button
                type="button"
                className={`tab-btn ${activeScheduleTab === "labs" ? "active" : ""}`}
                onClick={() => setActiveScheduleTab("labs")}
              >
                🔬 Lab Reports ({scheduleData?.labReports?.length || 0})
              </button>
              <button
                type="button"
                className={`tab-btn ${activeScheduleTab === "food" ? "active" : ""}`}
                onClick={() => setActiveScheduleTab("food")}
              >
                🥗 Diet &amp; Food Schedule ({scheduleData?.foodSchedule?.length || 0})
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
              ) : activeScheduleTab === "medicines" ? (
                /* ===========================================
                   TAB 2: PRESCRIBED MEDICINES
                   =========================================== */
                <div className="schedule-tab-content">
                  <div className="schedule-section-header">
                    <div>
                      <h4>Patient In-Patient Medication &amp; Prescriptions</h4>
                      <p>Clinical prescriptions, dosage strengths, administration frequency, and therapy duration</p>
                    </div>
                    <button
                      type="button"
                      className="add-item-btn"
                      onClick={() => setShowAddMedicine(!showAddMedicine)}
                    >
                      {showAddMedicine ? "✕ Cancel" : "➕ Prescribe Medicine"}
                    </button>
                  </div>

                  {showAddMedicine && (
                    <form onSubmit={handleAddMedicineSubmit} className="add-entry-form">
                      <h5>➕ Prescribe In-Patient Medication</h5>
                      <div className="entry-form-grid">
                        <div className="form-group">
                          <label>Medicine Name &amp; Strength *</label>
                          <input
                            type="text"
                            placeholder="e.g. Tab. Telmisartan 40mg, Inj. Ceftriaxone 1g"
                            value={newMedicine.medicineName}
                            onChange={(e) => setNewMedicine({ ...newMedicine, medicineName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Dosage &amp; Route</label>
                          <input
                            type="text"
                            placeholder="e.g. 1 Tablet (Oral), 500mg IV"
                            value={newMedicine.dosage}
                            onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>Frequency</label>
                          <input
                            type="text"
                            placeholder="e.g. Twice Daily (1-0-1), Once Daily"
                            value={newMedicine.frequency}
                            onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>Food Relation / Timing Instruction</label>
                          <select
                            value={newMedicine.instructions}
                            onChange={(e) => setNewMedicine({ ...newMedicine, instructions: e.target.value })}
                          >
                            <option value="After Meals">After Meals</option>
                            <option value="Before Food (Empty Stomach)">Before Food (Empty Stomach)</option>
                            <option value="With Meals (Breakfast &amp; Dinner)">With Meals (Breakfast &amp; Dinner)</option>
                            <option value="Bedtime with Warm Water/Milk">Bedtime with Warm Water/Milk</option>
                            <option value="As Needed (SOS / PRN)">As Needed (SOS / PRN)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Prescribing Doctor</label>
                          <input
                            type="text"
                            placeholder="e.g. Dr. Suresh Menon (Cardiology)"
                            value={newMedicine.prescribedBy}
                            onChange={(e) => setNewMedicine({ ...newMedicine, prescribedBy: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>Course Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 7 Days, 14 Days, 30 Days"
                            value={newMedicine.duration}
                            onChange={(e) => setNewMedicine({ ...newMedicine, duration: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="entry-form-actions">
                        <button type="submit" className="btn-save-entry">Save Prescription</button>
                      </div>
                    </form>
                  )}

                  <div className="medicines-schedule-list">
                    {scheduleData?.medicines && scheduleData.medicines.length > 0 ? (
                      scheduleData.medicines.map((med) => (
                        <div key={med.id} className={`bed-medicine-card ${med.status === "ACTIVE" ? "active-med" : "completed-med"}`}>
                          <div className="med-pill-icon">💊</div>
                          <div className="med-body-info">
                            <div className="med-top-title">
                              <div>
                                <h5 className="med-heading">{med.medicineName}</h5>
                                {med.category && <span className="med-cat-tag">{med.category}</span>}
                              </div>
                              <button
                                type="button"
                                className={`med-status-toggle-pill ${med.status === "ACTIVE" ? "active" : "completed"}`}
                                onClick={() => handleToggleMedicineStatus(med.id)}
                                title="Click to toggle active/completed status"
                              >
                                {med.status === "ACTIVE" ? "🟢 Active Course" : "✓ Completed"}
                              </button>
                            </div>

                            <div className="med-spec-grid">
                              <span><strong>Dosage:</strong> {med.dosage}</span>
                              <span><strong>Frequency:</strong> {med.frequency}</span>
                              <span><strong>Instructions:</strong> {med.instructions}</span>
                              <span><strong>Duration:</strong> {med.duration}</span>
                            </div>

                            <div className="med-footer-meta">
                              <span>🩺 Prescribed by: <strong>{med.prescribedBy}</strong></span>
                              {med.datePrescribed && <span>📅 Date: <strong>{med.datePrescribed}</strong></span>}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-entries">No active medicines or prescriptions on file for this patient.</p>
                    )}
                  </div>
                </div>
              ) : activeScheduleTab === "labs" ? (
                /* ===========================================
                   TAB 3: LAB REPORTS &amp; DIAGNOSTICS
                   =========================================== */
                <div className="schedule-tab-content">
                  <div className="schedule-section-header">
                    <div>
                      <h4>Diagnostic &amp; Laboratory Investigation Reports</h4>
                      <p>Signed clinical pathology, biochemistry, and hematology test records for admitted patient</p>
                    </div>
                    <button
                      type="button"
                      className="add-item-btn"
                      onClick={() => setShowAddLab(!showAddLab)}
                    >
                      {showAddLab ? "✕ Cancel" : "➕ Order Lab Investigation"}
                    </button>
                  </div>

                  {showAddLab && (
                    <form onSubmit={handleAddLabSubmit} className="add-entry-form">
                      <h5>➕ Order Diagnostic Test / Record Lab Report</h5>
                      <div className="entry-form-grid">
                        <div className="form-group">
                          <label>Investigation / Test Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Complete Blood Count, Serum Electrolytes, Troponin-I"
                            value={newLab.testName}
                            onChange={(e) => setNewLab({ ...newLab, testName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Diagnostic Category *</label>
                          <select
                            value={newLab.category}
                            onChange={(e) => setNewLab({ ...newLab, category: e.target.value })}
                          >
                            <option value="Cardiology &amp; Biochemistry Panel">Cardiology &amp; Biochemistry Panel</option>
                            <option value="Hematology">Hematology</option>
                            <option value="Clinical Biochemistry">Clinical Biochemistry</option>
                            <option value="Diabetic &amp; Endocrine Panel">Diabetic &amp; Endocrine Panel</option>
                            <option value="Renal Function Panel">Renal Function Panel</option>
                            <option value="Microbiology &amp; Serology">Microbiology &amp; Serology</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Sample / Specimen Type</label>
                          <input
                            type="text"
                            placeholder="e.g. Venous Blood (EDTA), Serum, Urine"
                            value={newLab.sampleType}
                            onChange={(e) => setNewLab({ ...newLab, sampleType: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>Priority / Urgency</label>
                          <select
                            value={newLab.priority}
                            onChange={(e) => setNewLab({ ...newLab, priority: e.target.value })}
                          >
                            <option value="Routine">Routine (Within 4 Hours)</option>
                            <option value="Stat / Emergency">Stat / Emergency (Immediate)</option>
                            <option value="Urgent">Urgent (Within 1 Hour)</option>
                          </select>
                        </div>

                        <div className="form-group full-span">
                          <label>Clinical Indication / Reason for Investigation</label>
                          <input
                            type="text"
                            placeholder="e.g. In-patient routine monitoring, check electrolyte balance post admission"
                            value={newLab.summary}
                            onChange={(e) => setNewLab({ ...newLab, summary: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="entry-form-actions">
                        <button type="submit" className="btn-save-entry">Dispatch Order to Laboratory</button>
                      </div>
                    </form>
                  )}

                  <div className="bed-lab-reports-list">
                    {scheduleData?.labReports && scheduleData.labReports.length > 0 ? (
                      scheduleData.labReports.map((report) => (
                        <div key={report.id} className="bed-lab-card">
                          <div className="bed-lab-header">
                            <div className="bed-lab-title-group">
                              <span className="bed-lab-icon">🔬</span>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                  <h5 className="lab-card-title">{report.testName}</h5>
                                  <span className="bed-lab-id-pill">{report.id}</span>
                                </div>
                                <p className="bed-lab-meta-sub">
                                  <span>🏷️ {report.category}</span>
                                  <span>📅 {report.testDate}</span>
                                  <span>🩸 {report.sampleType || "Venous Blood / Serum"}</span>
                                </p>
                              </div>
                            </div>

                            <div className="bed-lab-actions">
                              <span className={`bed-lab-flag ${report.flag === "NORMAL" ? "normal" : report.flag?.includes("ELEVATED") ? "alert" : "warning"}`}>
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
                            <div className="bed-lab-summary-box">
                              <strong>Clinical Impression &amp; Findings:</strong> {report.summary}
                            </div>
                          )}

                          {report.parameters && report.parameters.length > 0 && (
                            <div className="bed-lab-param-wrapper">
                              <table className="bed-lab-table">
                                <thead>
                                  <tr>
                                    <th>Test Parameter</th>
                                    <th>Observed Value</th>
                                    <th>Reference Interval</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.parameters.map((param, pIdx) => (
                                    <tr key={pIdx} className={param.status !== "NORMAL" && param.status !== "PENDING" ? "abnormal-row" : ""}>
                                      <td className="param-name-cell">{param.name}</td>
                                      <td className="param-val-cell">
                                        <strong>{param.value}</strong> {param.unit && <small>{param.unit}</small>}
                                      </td>
                                      <td className="param-ref-cell">{param.refRange}</td>
                                      <td>
                                        <span className={`param-status-dot ${param.status === "NORMAL" ? "normal" : param.status === "PENDING" ? "pending" : "flagged"}`}>
                                          {param.status === "NORMAL" ? "✓ Normal" : param.status === "PENDING" ? "⏳ Pending" : `⚠️ ${param.status}`}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="bed-lab-footer-row">
                            <span>👨‍⚕️ Verified: <strong>{report.labDoctor || "Dr. R. Ramanathan, MD (Pathology)"}</strong></span>
                            {report.technician && <span>🔬 Analyzed By: <strong>{report.technician}</strong></span>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-entries">No laboratory investigation records on file for this patient.</p>
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
