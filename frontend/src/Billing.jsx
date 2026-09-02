import React, { useEffect, useMemo, useState } from "react";
import "./Billing.css";
import API_BASE_URL from "./config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = `${API_BASE_URL}/api`;

function Billing() {
  // =====================================================
  // STATE
  // =====================================================
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [beds, setBeds] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Medication items in form: [{ medicineId, name, quantity, price, dosage }]
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [newMedForm, setNewMedForm] = useState({
    medicineId: "",
    quantity: "1",
    price: "",
    dosage: ""
  });

  const [formData, setFormData] = useState({
    patientId: "",
    billDate: new Date().toISOString().split("T")[0],
    consultationFee: "800",
    laboratoryFee: "0",
    medicineFee: "0",
    roomFee: "0",
    otherCharges: "0",
    totalAmount: "800",
    paymentMethod: "UPI",
    paymentStatus: "PAID"
  });

  // =====================================================
  // LOAD DATA
  // =====================================================
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadBills(),
        loadPatients(),
        loadMedicines(),
        loadLabTests(),
        loadBeds(),
        loadPrescriptions(),
        loadDoctors()
      ]);
    } catch (err) {
      console.error("Error loading billing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadBills = async () => {
    try {
      const response = await fetch(`${API_URL}/bills`);
      if (response.ok) {
        const data = await response.json();
        setBills(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading bills:", err);
      setBills([]);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await fetch(`${API_URL}/patients`);
      if (response.ok) {
        const data = await response.json();
        setPatients(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading patients:", err);
      setPatients([]);
    }
  };

  const loadMedicines = async () => {
    try {
      const response = await fetch(`${API_URL}/medicines`);
      if (response.ok) {
        const data = await response.json();
        setMedicines(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading medicines:", err);
    }
  };

  const loadLabTests = async () => {
    try {
      const response = await fetch(`${API_URL}/laboratory`);
      if (response.ok) {
        const data = await response.json();
        setLabTests(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading laboratory:", err);
    }
  };

  const loadBeds = async () => {
    try {
      const response = await fetch(`${API_URL}/beds`);
      if (response.ok) {
        const data = await response.json();
        setBeds(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading beds:", err);
    }
  };

  const loadPrescriptions = async () => {
    try {
      const response = await fetch(`${API_URL}/prescriptions`);
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading prescriptions:", err);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/doctors`);
      if (response.ok) {
        const data = await response.json();
        setDoctors(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading doctors:", err);
    }
  };

  // =====================================================
  // PATIENT CLINICAL DATA RESOLUTION
  // =====================================================
  const getPatientObj = (patientId) => {
    return patients.find((p) => Number(p.patientId) === Number(patientId)) || null;
  };

  const getPatientBed = (patientId) => {
    const patient = getPatientObj(patientId);
    if (!patient) return null;
    const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim().toLowerCase();
    return (
      beds.find((b) => {
        const pName = (b.patientName || "").trim().toLowerCase();
        return pName && (fullName.includes(pName) || pName.includes(fullName));
      }) || null
    );
  };

  const getPatientLabTests = (patientId) => {
    return labTests.filter((l) => {
      if (l.patient && Number(l.patient.patientId) === Number(patientId)) return true;
      return false;
    });
  };

  const getPatientPrescriptions = (patientId) => {
    return prescriptions.filter((p) => {
      if (p.patientId && Number(p.patientId) === Number(patientId)) return true;
      if (p.patient && Number(p.patient.patientId) === Number(patientId)) return true;
      return false;
    });
  };

  // =====================================================
  // PATIENT SELECTION & AUTO POPULATE
  // =====================================================
  const handlePatientSelect = (e) => {
    const pId = e.target.value;
    const assignedBed = getPatientBed(pId);
    const pLabs = getPatientLabTests(pId);
    const pPrescs = getPatientPrescriptions(pId);

    // Auto add medications from patient prescriptions if available
    let initialMeds = [];
    if (pPrescs.length > 0) {
      initialMeds = pPrescs.map((pr) => {
        const med = medicines.find((m) => Number(m.medicineId) === Number(pr.medicineId));
        return {
          medicineId: pr.medicineId || (med ? med.medicineId : Date.now()),
          name: pr.medicineName || (med ? med.medicineName : "Prescribed Medication"),
          quantity: 1,
          price: med ? med.price || 150 : 150,
          dosage: `${pr.dosage || "1 Tab"} - ${pr.frequency || "Daily"}`
        };
      });
    }

    setSelectedMedicines(initialMeds);
    const medCharge = initialMeds.reduce((sum, m) => sum + m.quantity * m.price, 0);

    const roomCharge = assignedBed ? (assignedBed.bedType?.includes("ICU") ? 2500 : 1200) : 0;
    const labCharge = pLabs.length > 0 ? pLabs.length * 1100 : 0;
    const consultCharge = 800;
    const otherCharge = Number(formData.otherCharges || 0);

    const total = consultCharge + roomCharge + labCharge + medCharge + otherCharge;

    setFormData((prev) => ({
      ...prev,
      patientId: pId,
      consultationFee: String(consultCharge),
      roomFee: String(roomCharge),
      laboratoryFee: String(labCharge),
      medicineFee: String(medCharge),
      totalAmount: String(total)
    }));
  };

  // =====================================================
  // FORM CHANGE & AUTO SUM
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "patientId") {
      handlePatientSelect(e);
      return;
    }

    const updated = { ...formData, [name]: value };

    const c = Number(name === "consultationFee" ? value : updated.consultationFee || 0);
    const l = Number(name === "laboratoryFee" ? value : updated.laboratoryFee || 0);
    const m = Number(name === "medicineFee" ? value : updated.medicineFee || 0);
    const r = Number(name === "roomFee" ? value : updated.roomFee || 0);
    const o = Number(name === "otherCharges" ? value : updated.otherCharges || 0);

    if (["consultationFee", "laboratoryFee", "medicineFee", "roomFee", "otherCharges"].includes(name)) {
      updated.totalAmount = String(c + l + m + r + o);
    }

    setFormData(updated);
  };

  // =====================================================
  // MEDICATION HANDLERS
  // =====================================================
  const handleMedSelectChange = (e) => {
    const medId = e.target.value;
    const med = medicines.find((m) => Number(m.medicineId) === Number(medId));
    setNewMedForm({
      medicineId: medId,
      quantity: "1",
      price: med ? String(med.price || 150) : "150",
      dosage: "1 Tab Twice Daily (After Food)"
    });
  };

  const handleAddMedicineItem = () => {
    if (!newMedForm.medicineId) {
      alert("Please select a medicine from the list.");
      return;
    }

    const med = medicines.find((m) => Number(m.medicineId) === Number(newMedForm.medicineId));
    const medName = med ? med.medicineName : "Medication";
    const qty = Math.max(1, parseInt(newMedForm.quantity) || 1);
    const prc = parseFloat(newMedForm.price) || (med ? med.price || 150 : 150);

    const existingIndex = selectedMedicines.findIndex(
      (m) => Number(m.medicineId) === Number(newMedForm.medicineId)
    );

    let updatedMeds;
    if (existingIndex >= 0) {
      updatedMeds = selectedMedicines.map((m, idx) =>
        idx === existingIndex
          ? {
              ...m,
              quantity: m.quantity + qty,
              dosage: newMedForm.dosage || m.dosage
            }
          : m
      );
    } else {
      updatedMeds = [
        ...selectedMedicines,
        {
          medicineId: newMedForm.medicineId,
          name: medName,
          category: med?.category || "Tablets",
          quantity: qty,
          price: prc,
          dosage: newMedForm.dosage || "As Directed"
        }
      ];
    }

    setSelectedMedicines(updatedMeds);

    // Recalculate medicine fee and total
    const newMedFee = updatedMeds.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const c = Number(formData.consultationFee || 0);
    const l = Number(formData.laboratoryFee || 0);
    const r = Number(formData.roomFee || 0);
    const o = Number(formData.otherCharges || 0);

    setFormData((prev) => ({
      ...prev,
      medicineFee: String(newMedFee),
      totalAmount: String(c + l + newMedFee + r + o)
    }));

    // Reset input
    setNewMedForm({
      medicineId: "",
      quantity: "1",
      price: "",
      dosage: ""
    });
  };

  const handleUpdateMedQty = (idx, delta) => {
    const updated = selectedMedicines
      .map((item, i) => {
        if (i === idx) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    setSelectedMedicines(updated);

    const newMedFee = updated.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const c = Number(formData.consultationFee || 0);
    const l = Number(formData.laboratoryFee || 0);
    const r = Number(formData.roomFee || 0);
    const o = Number(formData.otherCharges || 0);

    setFormData((prev) => ({
      ...prev,
      medicineFee: String(newMedFee),
      totalAmount: String(c + l + newMedFee + r + o)
    }));
  };

  const handleRemoveMedItem = (idx) => {
    const updated = selectedMedicines.filter((_, i) => i !== idx);
    setSelectedMedicines(updated);

    const newMedFee = updated.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const c = Number(formData.consultationFee || 0);
    const l = Number(formData.laboratoryFee || 0);
    const r = Number(formData.roomFee || 0);
    const o = Number(formData.otherCharges || 0);

    setFormData((prev) => ({
      ...prev,
      medicineFee: String(newMedFee),
      totalAmount: String(c + l + newMedFee + r + o)
    }));
  };

  // =====================================================
  // GET PATIENT NAME
  // =====================================================
  const getPatientName = (bill) => {
    if (!bill) return "N/A";
    if (bill.patient && typeof bill.patient === "object") {
      const fullName = `${bill.patient.firstName || ""} ${bill.patient.lastName || ""}`.trim();
      if (fullName) return fullName;
    }
    if (bill.patient && typeof bill.patient === "string") return bill.patient;
    if (bill.patientId) {
      const patient = patients.find((item) => Number(item.patientId) === Number(bill.patientId));
      if (patient) return `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
    }
    return "N/A";
  };

  // =====================================================
  // SEARCH & FILTER
  // =====================================================
  const filteredBills = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return bills.filter((bill) => {
      const patientName = getPatientName(bill).toLowerCase();
      const paymentMethod = String(bill.paymentMethod || "").toLowerCase();
      const status = String(bill.paymentStatus || bill.status || "").toUpperCase();
      const billId = String(bill.billId || "").toLowerCase();

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PAID" && status === "PAID") ||
        (statusFilter === "PENDING" && status !== "PAID");

      const matchesSearch =
        !search ||
        patientName.includes(search) ||
        paymentMethod.includes(search) ||
        status.toLowerCase().includes(search) ||
        billId.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [bills, searchTerm, patients, statusFilter]);

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // =====================================================
  // ADD BILL
  // =====================================================
  const handleAddBill = () => {
    setEditingBill(null);
    setSelectedMedicines([]);

    setFormData({
      patientId: "",
      billDate: new Date().toISOString().split("T")[0],
      consultationFee: "800",
      laboratoryFee: "0",
      medicineFee: "0",
      roomFee: "0",
      otherCharges: "0",
      totalAmount: "800",
      paymentMethod: "UPI",
      paymentStatus: "PAID"
    });

    clearMessages();
    setShowForm(true);
  };

  // =====================================================
  // EDIT BILL
  // =====================================================
  const handleEdit = (bill) => {
    let patientId = "";
    if (bill.patient && typeof bill.patient === "object") {
      patientId = bill.patient.patientId || "";
    }
    if (!patientId && bill.patientId) {
      patientId = bill.patientId;
    }

    // Parse stored medications
    let parsedMeds = [];
    if (bill.medicationDetails) {
      try {
        parsedMeds = JSON.parse(bill.medicationDetails);
      } catch {
        parsedMeds = [];
      }
    }

    setSelectedMedicines(Array.isArray(parsedMeds) ? parsedMeds : []);
    setEditingBill(bill);

    setFormData({
      patientId: String(patientId),
      billDate: bill.billDate
        ? String(bill.billDate).substring(0, 10)
        : new Date().toISOString().split("T")[0],
      consultationFee: String(bill.consultationFee ?? "800"),
      laboratoryFee: String(bill.laboratoryFee ?? "0"),
      medicineFee: String(bill.medicineFee ?? "0"),
      roomFee: String(bill.roomFee ?? "0"),
      otherCharges: String(bill.otherCharges ?? "0"),
      totalAmount: String(bill.totalAmount ?? "800"),
      paymentMethod: bill.paymentMethod || "UPI",
      paymentStatus: bill.paymentStatus || bill.status || "PAID"
    });

    clearMessages();
    setShowForm(true);
  };

  // =====================================================
  // SAVE BILL
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!formData.patientId) {
      setError("Please select a patient.");
      return;
    }

    try {
      setSaving(true);
      const selectedPatient = patients.find(
        (p) => Number(p.patientId) === Number(formData.patientId)
      );
      if (!selectedPatient) {
        setError("Selected patient was not found.");
        return;
      }

      const billData = {
        patient: selectedPatient,
        billDate: formData.billDate,
        consultationFee: Number(formData.consultationFee || 0),
        laboratoryFee: Number(formData.laboratoryFee || 0),
        medicineFee: Number(formData.medicineFee || 0),
        roomFee: Number(formData.roomFee || 0),
        otherCharges: Number(formData.otherCharges || 0),
        totalAmount: Number(formData.totalAmount || 0),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        status: formData.paymentStatus,
        medicationDetails: JSON.stringify(selectedMedicines)
      };

      const url = editingBill ? `${API_URL}/bills/${editingBill.billId}` : `${API_URL}/bills`;

      const method = editingBill ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(billData)
      });

      const savedBill = await response.json();

      setSuccess(editingBill ? "Bill updated successfully!" : "Bill generated successfully!");
      setShowForm(false);
      setEditingBill(null);
      await loadBills();

      // Automatically open the generated invoice modal so user can lively view & download PDF
      if (savedBill && savedBill.billId) {
        handleViewInvoice(savedBill);
      }

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error saving bill:", err);
      setError(err.message || "Unable to save bill.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE BILL
  // =====================================================
  const handleDelete = async (billId) => {
    const confirmed = window.confirm("Are you sure you want to delete this bill record?");
    if (!confirmed) return;

    try {
      clearMessages();
      const response = await fetch(`${API_URL}/bills/${billId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete bill.");
      }

      setBills((prev) => prev.filter((b) => b.billId !== billId));
      setSuccess("Bill record deleted successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete bill error:", err);
      setError("Unable to delete bill.");
    }
  };

  // =====================================================
  // VIEW INVOICE MODAL
  // =====================================================
  const handleViewInvoice = (bill) => {
    const patientId = bill.patient?.patientId || bill.patientId;
    const patient = getPatientObj(patientId) || bill.patient;
    const bed = getPatientBed(patientId);
    const labs = getPatientLabTests(patientId);

    // Parse medications if available
    let meds = [];
    if (bill.medicationDetails) {
      try {
        meds = JSON.parse(bill.medicationDetails);
      } catch {
        meds = [];
      }
    }

    setViewingInvoice({
      bill,
      patient,
      bed,
      labs,
      meds: Array.isArray(meds) ? meds : []
    });
  };

  // =====================================================
  // DOWNLOAD INVOICE PDF (CORRECTED & POLISHED)
  // =====================================================
  const downloadInvoicePDF = (bill, patient, bed, labs, meds) => {
    try {
      if (!bill) return;

      const doc = new jsPDF();

      // Resolve patient info
      const pObj = patient || (bill.patient && typeof bill.patient === "object" ? bill.patient : getPatientObj(bill.patientId));
      const pName = pObj ? `${pObj.firstName || ""} ${pObj.lastName || ""}`.trim() : (bill.patient || "Patient");
      const pGenderAge = pObj ? `${pObj.gender || "N/A"}, ${pObj.age ? pObj.age + " yrs" : "N/A"}` : "N/A";
      const pPhone = pObj ? (pObj.phoneNumber || pObj.phone || "N/A") : "N/A";
      const pAddress = pObj ? (pObj.address || "Registered Hospital Outpatient") : "Registered Hospital Outpatient";
      const pBed = bed ? `Bed #${bed.bedNumber} (${bed.bedType || "General"})` : "Outpatient (OPD)";
      const billStatus = (bill.paymentStatus || bill.status || "PAID").toUpperCase();

      // Resolve medications
      let medicationList = meds;
      if (!medicationList || medicationList.length === 0) {
        if (bill.medicationDetails) {
          try {
            medicationList = JSON.parse(bill.medicationDetails);
          } catch {
            medicationList = [];
          }
        }
      }
      if (!Array.isArray(medicationList)) medicationList = [];

      // Top Hospital Banner (Deep Emerald)
      doc.setFillColor(6, 78, 59); // #064E3B
      doc.rect(0, 0, 210, 42, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("NI AROGIYAM HOSPITAL", 14, 16);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Multi-Speciality Healthcare & Research Institute | NABH & ISO 9001:2015 Certified", 14, 23);
      doc.text("No. 45 Healthcare Boulevard, Chennai, Tamil Nadu - 600001 | GSTIN: 33AAAAA0000A1Z5", 14, 29);
      doc.text("Helpline: +91 44 2838 9000 | Email: billing@ni-arogiyam.org | Web: ni-arogiyam.vercel.app", 14, 35);

      // Invoice Title Strip
      doc.setFillColor(240, 253, 244);
      doc.rect(14, 47, 182, 11, "F");
      doc.setDrawColor(187, 247, 208);
      doc.rect(14, 47, 182, 11, "D");

      doc.setTextColor(6, 78, 59);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("TAX INVOICE / OFFICIAL HOSPITAL BILL STATEMENT", 18, 54);

      // Patient & Bill Info Grid Table
      autoTable(doc, {
        startY: 62,
        head: [["Invoice / Billing Information", "Patient & Clinical Details"]],
        body: [
          [`Invoice No: INV-2026-${String(bill.billId || 1).padStart(4, "0")}`, `Patient Name: ${pName}`],
          [`Bill Date: ${bill.billDate || new Date().toISOString().split("T")[0]}`, `Age / Gender: ${pGenderAge}`],
          [`Payment Method: ${bill.paymentMethod || "UPI"}`, `Contact: ${pPhone}`],
          [`Payment Status: ${billStatus}`, `Admission / Ward: ${pBed}`],
          [`Doctor / Specialist: ${bill.doctorName || "Assigned Consultant"}`, `Address: ${pAddress}`]
        ],
        theme: "plain",
        headStyles: {
          fillColor: [8, 127, 91],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [30, 41, 59]
        },
        margin: { left: 14, right: 14 }
      });

      let currentY = doc.lastAutoTable.finalY + 6;

      // Itemized Table
      const items = [];
      let itemIndex = 1;

      // 1. Consultation
      if (Number(bill.consultationFee || 0) > 0) {
        items.push([
          itemIndex++,
          "Doctor Consultation & Clinical Assessment",
          "Specialist Consultation Charge",
          "1",
          `Rs. ${Number(bill.consultationFee).toFixed(2)}`,
          `Rs. ${Number(bill.consultationFee).toFixed(2)}`
        ]);
      }

      // 2. Medications
      if (medicationList && medicationList.length > 0) {
        medicationList.forEach((m) => {
          const q = Number(m.quantity || 1);
          const p = Number(m.price || 0);
          const total = q * p;
          items.push([
            itemIndex++,
            `Pharmacy: ${m.name || m.medicineName || "Prescribed Medicine"}`,
            m.dosage ? `Dosage: ${m.dosage}` : "Oral / Dispensed Prescription",
            String(q),
            `Rs. ${p.toFixed(2)}`,
            `Rs. ${total.toFixed(2)}`
          ]);
        });
      } else if (Number(bill.medicineFee || 0) > 0) {
        items.push([
          itemIndex++,
          "Prescribed Medications & Pharmacy Dispensation",
          "Hospital Pharmacy Cumulative Medicines",
          "1",
          `Rs. ${Number(bill.medicineFee).toFixed(2)}`,
          `Rs. ${Number(bill.medicineFee).toFixed(2)}`
        ]);
      }

      // 3. Laboratory
      if (Number(bill.laboratoryFee || 0) > 0) {
        items.push([
          itemIndex++,
          "Diagnostic & Laboratory Investigations",
          labs && labs.length > 0
            ? labs.map((l) => l.testName || "Diagnostic Test").join(", ")
            : "Pathology / Diagnostic Panels",
          labs && labs.length > 0 ? String(labs.length) : "1",
          `Rs. ${(Number(bill.laboratoryFee) / (labs?.length || 1)).toFixed(2)}`,
          `Rs. ${Number(bill.laboratoryFee).toFixed(2)}`
        ]);
      }

      // 4. Room / Bed
      if (Number(bill.roomFee || 0) > 0) {
        items.push([
          itemIndex++,
          "Inpatient Room & Bed Care Charges",
          bed ? `${bed.bedType || "General"} Ward Accommodation` : "Inpatient Care",
          "1",
          `Rs. ${Number(bill.roomFee).toFixed(2)}`,
          `Rs. ${Number(bill.roomFee).toFixed(2)}`
        ]);
      }

      // 5. Other Charges
      if (Number(bill.otherCharges || 0) > 0) {
        items.push([
          itemIndex++,
          "Nursing & Hospital Consumables",
          "Clinical consumables & nursing administration",
          "1",
          `Rs. ${Number(bill.otherCharges).toFixed(2)}`,
          `Rs. ${Number(bill.otherCharges).toFixed(2)}`
        ]);
      }

      autoTable(doc, {
        startY: currentY,
        head: [["#", "Service / Medication Description", "Particulars / Dosage", "Qty", "Rate (Rs.)", "Amount (Rs.)"]],
        body: items,
        theme: "grid",
        headStyles: {
          fillColor: [6, 78, 59],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8.5
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [15, 23, 42]
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 55 },
          2: { cellWidth: 55 },
          3: { cellWidth: 15, halign: "center" },
          4: { cellWidth: 22, halign: "right" },
          5: { cellWidth: 25, halign: "right" }
        },
        margin: { left: 14, right: 14 }
      });

      currentY = doc.lastAutoTable.finalY + 5;

      // Totals Box
      const totalAmount = Number(bill.totalAmount || 0);
      const paidAmount = billStatus === "PAID" ? totalAmount : 0;
      const balanceDue = totalAmount - paidAmount;

      autoTable(doc, {
        startY: currentY,
        body: [
          ["Subtotal:", `Rs. ${totalAmount.toFixed(2)}`],
          ["Healthcare GST Exemption (0%):", "Rs. 0.00"],
          ["Net Total Amount:", `Rs. ${totalAmount.toFixed(2)}`],
          ["Amount Paid:", `Rs. ${paidAmount.toFixed(2)}`],
          ["Balance Outstanding:", `Rs. ${balanceDue.toFixed(2)}`]
        ],
        theme: "plain",
        bodyStyles: {
          fontSize: 8.5,
          fontStyle: "bold",
          textColor: [23, 59, 43]
        },
        columnStyles: {
          0: { halign: "right", cellWidth: 130 },
          1: { halign: "right", cellWidth: 52 }
        },
        margin: { left: 14, right: 14 }
      });

      currentY = doc.lastAutoTable.finalY + 12;

      if (currentY > 250) {
        doc.addPage();
        currentY = 30;
      }

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Notes: Healthcare clinical and diagnostic services are exempt from GST under Government regulations.", 14, currentY);
      currentY += 14;

      doc.setDrawColor(148, 163, 184);
      doc.line(14, currentY, 70, currentY);
      doc.line(140, currentY, 196, currentY);

      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text("Prepared By / Billing Officer", 14, currentY + 5);
      doc.text(bill.verifiedBy ? `Verified: ${bill.verifiedBy}` : "Authorized Signatory / Seal", 140, currentY + 5);

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `NI AROGIYAM Hospital Billing Module | Patient Tax Invoice | Page ${i} of ${pageCount}`,
          105,
          290,
          { align: "center" }
        );
      }

      const filename = `NI_AROGIYAM_INVOICE_#${bill.billId || "BILL"}_${String(pName).replace(/\s+/g, "_")}.pdf`;
      doc.save(filename);
    } catch (pdfErr) {
      console.error("PDF generation failed:", pdfErr);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================
  const handleCancel = () => {
    setShowForm(false);
    setEditingBill(null);
    setSelectedMedicines([]);
    clearMessages();
  };

  // =====================================================
  // REVENUE TOTALS
  // =====================================================
  const totalRevenue = useMemo(() => {
    return bills.reduce((total, bill) => total + Number(bill.totalAmount || 0), 0);
  }, [bills]);

  const paidRevenue = useMemo(() => {
    return bills
      .filter(
        (bill) =>
          String(bill.paymentStatus || bill.status || "").toUpperCase() === "PAID"
      )
      .reduce((total, bill) => total + Number(bill.totalAmount || 0), 0);
  }, [bills]);

  const pendingRevenue = useMemo(() => {
    return bills
      .filter(
        (bill) =>
          String(bill.paymentStatus || bill.status || "").toUpperCase() !== "PAID"
      )
      .reduce((total, bill) => total + Number(bill.totalAmount || 0), 0);
  }, [bills]);

  // =====================================================
  // JSX
  // =====================================================
  return (
    <div className="billing-page">
      {/* =================================================
          HEADER
      ================================================= */}
      <div className="billing-header">
        <div className="billing-title-section">
          <h1>Billing & Financial Management</h1>
          <p>Create itemized invoices, manage patient medications & fees, and export official tax bills</p>
        </div>

        <button className="billing-add-btn" onClick={handleAddBill}>
          + Create New Bill
        </button>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}
      <div className="billing-summary">
        <div className="billing-summary-card">
          <span>Total Bills</span>
          <strong>{bills.length}</strong>
        </div>

        <div className="billing-summary-card">
          <span>Total Revenue</span>
          <strong>₹{totalRevenue.toFixed(2)}</strong>
        </div>

        <div className="billing-summary-card">
          <span>Paid Revenue</span>
          <strong>₹{paidRevenue.toFixed(2)}</strong>
        </div>

        <div className="billing-summary-card">
          <span>Pending Revenue</span>
          <strong>₹{pendingRevenue.toFixed(2)}</strong>
        </div>
      </div>

      {/* =================================================
          SUCCESS / ERROR ALERTS
      ================================================= */}
      {success && <div className="billing-success">{success}</div>}
      {error && <div className="billing-error">{error}</div>}

      {/* =================================================
          ADD / EDIT BILL FORM
      ================================================= */}
      {showForm && (
        <div className="billing-form-container">
          <div className="billing-form-header">
            <div>
              <h2>{editingBill ? "Edit Patient Bill" : "Create Itemized Patient Bill"}</h2>
              <p>Select patient, add prescribed medications, configure fee breakdown and payment details</p>
            </div>

            <button type="button" className="billing-close-btn" onClick={handleCancel}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="billing-form-grid">
              {/* PATIENT */}
              <div className="billing-form-group">
                <label>Select Patient *</label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((patient) => (
                    <option key={patient.patientId} value={patient.patientId}>
                      #{patient.patientId} - {patient.firstName} {patient.lastName} ({patient.gender || "Patient"})
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div className="billing-form-group">
                <label>Bill Date *</label>
                <input
                  type="date"
                  name="billDate"
                  value={formData.billDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* =============================================
                MEDICATION PICKER SECTION
            ============================================= */}
            <div className="billing-medication-section">
              <div className="billing-med-section-header">
                <h3>Pharmacy & Prescribed Medications</h3>
                <p>Add dispensed medicines to itemize this bill</p>
              </div>

              <div className="billing-med-picker-row">
                <div className="billing-form-group" style={{ flex: 2 }}>
                  <label>Select Medicine</label>
                  <select
                    value={newMedForm.medicineId}
                    onChange={handleMedSelectChange}
                  >
                    <option value="">-- Choose from Pharmacy Inventory --</option>
                    {medicines.map((med) => (
                      <option key={med.medicineId} value={med.medicineId}>
                        {med.medicineName} ({med.category || "Tablets"}) - ₹{med.price || 150} (Stock: {med.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="billing-form-group" style={{ flex: 1 }}>
                  <label>Dosage / Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 tab twice daily"
                    value={newMedForm.dosage}
                    onChange={(e) => setNewMedForm({ ...newMedForm, dosage: e.target.value })}
                  />
                </div>

                <div className="billing-form-group" style={{ width: "90px" }}>
                  <label>Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={newMedForm.quantity}
                    onChange={(e) => setNewMedForm({ ...newMedForm, quantity: e.target.value })}
                  />
                </div>

                <div className="billing-form-group" style={{ width: "110px" }}>
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMedForm.price}
                    onChange={(e) => setNewMedForm({ ...newMedForm, price: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  className="billing-add-med-btn"
                  onClick={handleAddMedicineItem}
                >
                  + Add Medicine
                </button>
              </div>

              {/* LIST OF SELECTED MEDICINES */}
              {selectedMedicines.length > 0 ? (
                <div className="billing-meds-table-wrapper">
                  <table className="billing-meds-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Medicine Name</th>
                        <th>Dosage</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMedicines.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <strong>{item.name}</strong>
                          </td>
                          <td>
                            <small>{item.dosage || "As directed"}</small>
                          </td>
                          <td>₹{Number(item.price).toFixed(2)}</td>
                          <td>
                            <div className="med-qty-control">
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => handleUpdateMedQty(idx, -1)}
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => handleUpdateMedQty(idx, 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>
                            <strong className="med-subtotal">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </strong>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="med-remove-btn"
                              onClick={() => handleRemoveMedItem(idx)}
                              title="Remove item"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="billing-no-meds">
                  No medications added yet. Choose a medicine above to include pharmacy charges.
                </div>
              )}
            </div>

            {/* =============================================
                FEE BREAKDOWN & TOTALS
            ============================================= */}
            <div className="billing-fees-grid">
              <div className="billing-form-group">
                <label>Doctor Consultation Fee (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                />
              </div>

              <div className="billing-form-group">
                <label>Medication / Pharmacy Fee (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="medicineFee"
                  value={formData.medicineFee}
                  onChange={handleChange}
                />
              </div>

              <div className="billing-form-group">
                <label>Laboratory / Diagnostic Fee (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="laboratoryFee"
                  value={formData.laboratoryFee}
                  onChange={handleChange}
                />
              </div>

              <div className="billing-form-group">
                <label>Room / Bed Stay Fee (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="roomFee"
                  value={formData.roomFee}
                  onChange={handleChange}
                />
              </div>

              <div className="billing-form-group">
                <label>Other / Nursing Charges (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="otherCharges"
                  value={formData.otherCharges}
                  onChange={handleChange}
                />
              </div>

              <div className="billing-form-group highlight-total">
                <label>Total Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* =============================================
                PAYMENT DETAILS
            ============================================= */}
            <div className="billing-form-grid" style={{ marginTop: "16px" }}>
              <div className="billing-form-group">
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="UPI">UPI / QR</option>
                  <option value="GPAY">Google Pay</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="CASH">Cash</option>
                  <option value="NET_BANKING">Net Banking</option>
                </select>
              </div>

              <div className="billing-form-group">
                <label>Payment Status</label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="billing-form-actions">
              <button
                type="button"
                className="billing-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="billing-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving Bill..."
                  : editingBill
                  ? "Update Bill & Persist"
                  : "Save Bill & Generate Invoice"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================
          DETAILED INVOICE MODAL
      ================================================= */}
      {viewingInvoice && (
        <div className="invoice-modal-backdrop" onClick={() => setViewingInvoice(null)}>
          <div className="invoice-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-modal-header no-print">
              <div>
                <h2>Hospital Tax Invoice Statement</h2>
                <p>Invoice #INV-2026-{String(viewingInvoice.bill.billId).padStart(4, "0")}</p>
              </div>

              <div className="invoice-modal-header-actions">
                <button
                  type="button"
                  className="invoice-pdf-btn"
                  onClick={() =>
                    downloadInvoicePDF(
                      viewingInvoice.bill,
                      viewingInvoice.patient,
                      viewingInvoice.bed,
                      viewingInvoice.labs,
                      viewingInvoice.meds
                    )
                  }
                >
                  <span>📥</span> Download Invoice PDF
                </button>

                <button
                  type="button"
                  className="invoice-print-btn"
                  onClick={() => window.print()}
                >
                  <span>🖨️</span> Print
                </button>

                <button
                  type="button"
                  className="invoice-close-btn"
                  onClick={() => setViewingInvoice(null)}
                >
                  ×
                </button>
              </div>
            </div>

            {/* PRINTABLE INVOICE PAPER */}
            <div className="invoice-paper" id="invoice-paper">
              {/* TOP HEADER */}
              <div className="invoice-brand-header">
                <div className="invoice-brand-left">
                  <h1>NI AROGIYAM HOSPITAL</h1>
                  <p className="invoice-tagline">Multi-Speciality Healthcare & Research Institute</p>
                  <p className="invoice-address">
                    No. 45 Health Care Blvd, Chennai, Tamil Nadu - 600001
                  </p>
                  <p className="invoice-contact">
                    GSTIN: <strong>33AAAAA0000A1Z5</strong> | Helpline: +91 44 2838 9000
                  </p>
                </div>

                <div className="invoice-brand-right">
                  <div className="invoice-number-badge">
                    <span>TAX INVOICE</span>
                    <strong>INV-2026-{String(viewingInvoice.bill.billId).padStart(4, "0")}</strong>
                  </div>
                  <div className="invoice-meta-date">
                    <span>Date: {viewingInvoice.bill.billDate || "N/A"}</span>
                    <span
                      className={`invoice-status-pill ${
                        (viewingInvoice.bill.paymentStatus || viewingInvoice.bill.status || "PAID").toUpperCase() === "PAID"
                          ? "paid"
                          : "pending"
                      }`}
                    >
                      {(viewingInvoice.bill.paymentStatus || viewingInvoice.bill.status || "PAID").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* PATIENT & ADMISSION DETAILS GRID */}
              <div className="invoice-patient-grid">
                <div className="patient-box">
                  <h4>Billed To (Patient Details):</h4>
                  <p className="patient-main-name">
                    {getPatientName(viewingInvoice.bill)}
                  </p>
                  <p>
                    <strong>Age / Gender:</strong>{" "}
                    {viewingInvoice.patient?.age ? viewingInvoice.patient.age + " yrs" : "N/A"} /{" "}
                    {viewingInvoice.patient?.gender || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {viewingInvoice.patient?.phoneNumber || viewingInvoice.patient?.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {viewingInvoice.patient?.address || "Registered Hospital Outpatient"}
                  </p>
                </div>

                <div className="admission-box">
                  <h4>Hospital Admission & Care:</h4>
                  <p>
                    <strong>Ward / Bed:</strong>{" "}
                    {viewingInvoice.bed
                      ? `Bed #${viewingInvoice.bed.bedNumber} (${viewingInvoice.bed.bedType || "General"})`
                      : "Outpatient Care (OPD)"}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> {viewingInvoice.bill.paymentMethod || "UPI"}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span style={{ fontWeight: "bold", color: "#087f5b" }}>
                      {(viewingInvoice.bill.paymentStatus || viewingInvoice.bill.status || "PAID").toUpperCase()}
                    </span>
                  </p>
                  <p>
                    <strong>Billing Officer:</strong> Central Hospital Accounts
                  </p>
                </div>
              </div>

              {/* ITEMIZED CHARGES TABLE */}
              <div className="invoice-table-section">
                <table className="invoice-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}>#</th>
                      <th>Service / Item Description</th>
                      <th>Particulars / Dosage</th>
                      <th style={{ width: "60px", textAlign: "center" }}>Qty</th>
                      <th style={{ width: "100px", textAlign: "right" }}>Rate (₹)</th>
                      <th style={{ width: "110px", textAlign: "right" }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 1. CONSULTATION */}
                    {Number(viewingInvoice.bill.consultationFee || 0) > 0 && (
                      <tr>
                        <td>1</td>
                        <td>
                          <strong>Doctor Consultation & OPD Assessment</strong>
                        </td>
                        <td>General Physician / Specialist Consultation</td>
                        <td style={{ textAlign: "center" }}>1</td>
                        <td style={{ textAlign: "right" }}>
                          ₹{Number(viewingInvoice.bill.consultationFee).toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <strong>₹{Number(viewingInvoice.bill.consultationFee).toFixed(2)}</strong>
                        </td>
                      </tr>
                    )}

                    {/* 2. MEDICATIONS */}
                    {viewingInvoice.meds && viewingInvoice.meds.length > 0 ? (
                      viewingInvoice.meds.map((m, mIdx) => (
                        <tr key={`med-${mIdx}`}>
                          <td>{mIdx + 2}</td>
                          <td>
                            <strong>Pharmacy: {m.name || "Dispensed Medicine"}</strong>
                          </td>
                          <td>
                            <small>{m.dosage || "Oral / Dispensed Prescription"}</small>
                          </td>
                          <td style={{ textAlign: "center" }}>{m.quantity || 1}</td>
                          <td style={{ textAlign: "right" }}>
                            ₹{Number(m.price || 0).toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <strong>₹{(Number(m.quantity || 1) * Number(m.price || 0)).toFixed(2)}</strong>
                          </td>
                        </tr>
                      ))
                    ) : Number(viewingInvoice.bill.medicineFee || 0) > 0 ? (
                      <tr>
                        <td>2</td>
                        <td>
                          <strong>Prescribed Medications & Pharmacy Dispensation</strong>
                        </td>
                        <td>Cumulative Pharmacy Items</td>
                        <td style={{ textAlign: "center" }}>1</td>
                        <td style={{ textAlign: "right" }}>
                          ₹{Number(viewingInvoice.bill.medicineFee).toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <strong>₹{Number(viewingInvoice.bill.medicineFee).toFixed(2)}</strong>
                        </td>
                      </tr>
                    ) : null}

                    {/* 3. LABORATORY */}
                    {Number(viewingInvoice.bill.laboratoryFee || 0) > 0 && (
                      <tr>
                        <td>{viewingInvoice.meds?.length ? viewingInvoice.meds.length + 2 : 3}</td>
                        <td>
                          <strong>Diagnostic & Laboratory Investigations</strong>
                        </td>
                        <td>
                          {viewingInvoice.labs && viewingInvoice.labs.length > 0
                            ? viewingInvoice.labs.map((l) => l.testName || "Diagnostic Test").join(", ")
                            : "Pathology & Diagnostic Panels"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {viewingInvoice.labs?.length || 1}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          ₹{(Number(viewingInvoice.bill.laboratoryFee) / (viewingInvoice.labs?.length || 1)).toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <strong>₹{Number(viewingInvoice.bill.laboratoryFee).toFixed(2)}</strong>
                        </td>
                      </tr>
                    )}

                    {/* 4. ROOM / BED */}
                    {Number(viewingInvoice.bill.roomFee || 0) > 0 && (
                      <tr>
                        <td>{viewingInvoice.meds?.length ? viewingInvoice.meds.length + 3 : 4}</td>
                        <td>
                          <strong>Inpatient Room & Bed Care Charges</strong>
                        </td>
                        <td>
                          {viewingInvoice.bed
                            ? `${viewingInvoice.bed.bedType || "General"} Bed Stay & Round Care`
                            : "Inpatient Ward Stay"}
                        </td>
                        <td style={{ textAlign: "center" }}>1</td>
                        <td style={{ textAlign: "right" }}>
                          ₹{Number(viewingInvoice.bill.roomFee).toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <strong>₹{Number(viewingInvoice.bill.roomFee).toFixed(2)}</strong>
                        </td>
                      </tr>
                    )}

                    {/* 5. OTHER */}
                    {Number(viewingInvoice.bill.otherCharges || 0) > 0 && (
                      <tr>
                        <td>{viewingInvoice.meds?.length ? viewingInvoice.meds.length + 4 : 5}</td>
                        <td>
                          <strong>Nursing Administration & Hospital Sundries</strong>
                        </td>
                        <td>Clinical consumables & nursing services</td>
                        <td style={{ textAlign: "center" }}>1</td>
                        <td style={{ textAlign: "right" }}>
                          ₹{Number(viewingInvoice.bill.otherCharges).toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <strong>₹{Number(viewingInvoice.bill.otherCharges).toFixed(2)}</strong>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* TOTALS & BREAKDOWN SUMMARY */}
              <div className="invoice-bottom-grid">
                <div className="invoice-notes-block">
                  <h5>Payment & Exemption Terms:</h5>
                  <p>1. Healthcare clinical, consultation and diagnostic services are exempt from GST under Ministry of Finance regulations.</p>
                  <p>2. Prescribed medicines are dispensed according to standard hospital pharmacy guidelines.</p>
                  <p>3. This is a computer-generated official tax invoice and patient bill receipt.</p>
                </div>

                <div className="invoice-calculation-block">
                  <div className="calc-row">
                    <span>Subtotal:</span>
                    <span>₹{Number(viewingInvoice.bill.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="calc-row">
                    <span>GST (Healthcare Exemption 0%):</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="calc-row total-highlight">
                    <span>Total Amount Payable:</span>
                    <span>₹{Number(viewingInvoice.bill.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="calc-row paid-row">
                    <span>Amount Paid:</span>
                    <span>
                      ₹
                      {(viewingInvoice.bill.paymentStatus || viewingInvoice.bill.status || "PAID").toUpperCase() === "PAID"
                        ? Number(viewingInvoice.bill.totalAmount || 0).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="calc-row due-row">
                    <span>Balance Due:</span>
                    <span>
                      ₹
                      {(viewingInvoice.bill.paymentStatus || viewingInvoice.bill.status || "PAID").toUpperCase() === "PAID"
                        ? "0.00"
                        : Number(viewingInvoice.bill.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SIGNATURE SECTION */}
              <div className="invoice-signature-section">
                <div className="sig-block">
                  <div className="sig-line"></div>
                  <p>Prepared By / Billing Officer</p>
                </div>
                <div className="sig-block">
                  <div className="sig-line"></div>
                  <p>Authorized Signatory & Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SEARCH & FILTER
      ================================================= */}
      <div className="billing-search-container">
        <input
          type="text"
          className="billing-search"
          placeholder="Search bills by ID, patient name, payment method or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="billing-filter-group">
          <button
            type="button"
            className={`billing-filter-btn ${statusFilter === "ALL" ? "active" : ""}`}
            onClick={() => setStatusFilter("ALL")}
          >
            All Bills ({bills.length})
          </button>
          <button
            type="button"
            className={`billing-filter-btn ${statusFilter === "PAID" ? "active" : ""}`}
            onClick={() => setStatusFilter("PAID")}
          >
            Paid
          </button>
          <button
            type="button"
            className={`billing-filter-btn ${statusFilter === "PENDING" ? "active" : ""}`}
            onClick={() => setStatusFilter("PENDING")}
          >
            Pending
          </button>
        </div>
      </div>

      {/* =================================================
          BILLS TABLE
      ================================================= */}
      <div className="billing-table-container">
        <table className="billing-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Bill Date</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="billing-empty">
                  Loading hospital bills...
                </td>
              </tr>
            ) : filteredBills.length === 0 ? (
              <tr>
                <td colSpan="7" className="billing-empty">
                  {searchTerm ? "No bills match your search." : "No bills found."}
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => {
                const status = (bill.paymentStatus || bill.status || "PENDING").toUpperCase();

                return (
                  <tr key={bill.billId}>
                    {/* ID */}
                    <td>#{bill.billId}</td>

                    {/* PATIENT */}
                    <td>
                      <span className="billing-patient-name">{getPatientName(bill)}</span>
                    </td>

                    {/* DATE */}
                    <td>{bill.billDate || "N/A"}</td>

                    {/* AMOUNT */}
                    <td>
                      <span className="billing-amount">
                        ₹{Number(bill.totalAmount || 0).toFixed(2)}
                      </span>
                    </td>

                    {/* PAYMENT METHOD */}
                    <td>{bill.paymentMethod || "UPI"}</td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`billing-status ${status === "PAID" ? "paid" : "pending"}`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="billing-actions">
                        <button
                          type="button"
                          className="billing-view-btn"
                          title="View Tax Invoice & Medications"
                          onClick={() => handleViewInvoice(bill)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="billing-pdf-btn"
                          title="Download Invoice PDF"
                          onClick={() => {
                            const patientId = bill.patient?.patientId || bill.patientId;
                            const patient = getPatientObj(patientId) || bill.patient;
                            const bed = getPatientBed(patientId);
                            const labs = getPatientLabTests(patientId);
                            let meds = [];
                            if (bill.medicationDetails) {
                              try {
                                meds = JSON.parse(bill.medicationDetails);
                              } catch {
                                meds = [];
                              }
                            }
                            downloadInvoicePDF(bill, patient, bed, labs, meds);
                          }}
                        >
                          PDF
                        </button>

                        <button
                          type="button"
                          className="billing-edit-btn"
                          title="Edit Bill"
                          onClick={() => handleEdit(bill)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="billing-delete-btn"
                          title="Delete Bill Record"
                          onClick={() => handleDelete(bill.billId)}
                        >
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
  );
}

export default Billing;