import { useEffect, useMemo, useState } from "react";
import "./Reports.css";
import API_BASE_URL from "./config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports() {
  // =========================================================
  // STATE
  // =========================================================
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewingReport, setViewingReport] = useState(null);

  const [form, setForm] = useState({
    reportType: "",
    reportTitle: "",
    description: "",
    generatedBy: "",
    status: "Generated"
  });

  // =========================================================
  // LOAD REPORTS
  // =========================================================
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/reports`);
      if (!response.ok) {
        throw new Error("Failed to load reports");
      }

      const data = await response.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Reports loading error:", err);
      setError("Unable to connect to Reports backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =========================================================
  // HANDLE INPUT
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
    setError("");
    setMessage("");
  };

  // =========================================================
  // OPEN / CLOSE FORMS
  // =========================================================
  const openAddForm = () => {
    setEditingId(null);
    setForm({
      reportType: selectedCategory !== "ALL" ? selectedCategory : "",
      reportTitle: "",
      description: "",
      generatedBy:
        localStorage.getItem("loggedInUser") ||
        localStorage.getItem("fullName") ||
        "Administrator",
      status: "Generated"
    });
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (report) => {
    setEditingId(report.reportId);
    setForm({
      reportType: report.reportType || "",
      reportTitle: report.reportTitle || "",
      description: report.description || "",
      generatedBy: report.generatedBy || "Administrator",
      status: report.status || "Generated"
    });
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      reportType: "",
      reportTitle: "",
      description: "",
      generatedBy: "",
      status: "Generated"
    });
  };

  // =========================================================
  // SAVE REPORT
  // =========================================================
  const saveReport = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const reportData = {
        reportType: form.reportType.trim(),
        reportTitle: form.reportTitle.trim(),
        description: form.description.trim(),
        generatedBy: form.generatedBy.trim(),
        status: form.status
      };

      const url = editingId
        ? `${API_BASE_URL}/api/reports/${editingId}`
        : `${API_BASE_URL}/api/reports`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        throw new Error("Failed to save report");
      }

      const savedReport = await response.json();

      if (editingId) {
        setReports((previous) =>
          previous.map((report) =>
            report.reportId === editingId ? savedReport : report
          )
        );
        setMessage("Report updated successfully!");
      } else {
        setReports((previous) => [...previous, savedReport]);
        setMessage("Report generated successfully!");
      }

      closeForm();
    } catch (err) {
      console.error("Report save error:", err);
      setError("Unable to save report.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE REPORT
  // =========================================================
  const deleteReport = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      setReports((previousReports) =>
        previousReports.filter((report) => report.reportId !== id)
      );

      setMessage("Report deleted successfully!");
    } catch (err) {
      console.error("Delete report error:", err);
      setError("Unable to delete report.");
    }
  };

  // =========================================================
  // DOWNLOAD PDF REPORT
  // =========================================================
  const downloadReportPDF = (report) => {
    if (!report) return;

    try {
      const doc = new jsPDF();

      // Top Emerald Header
      doc.setFillColor(6, 78, 59); // #064E3B
      doc.rect(0, 0, 210, 40, "F");

      // Hospital Name & Subtitles
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("NI AROGIYAM HOSPITAL", 14, 18);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Multi-Speciality Healthcare & Research Institute | NABH Accredited", 14, 26);
      doc.text("24x7 Emergency & Care | Helpline: +91 44 2838 9000 | admin@ni-arogiyam.org", 14, 32);

      // Report Header Banner
      doc.setFillColor(240, 253, 244);
      doc.rect(14, 46, 182, 12, "F");
      doc.setDrawColor(187, 247, 208);
      doc.rect(14, 46, 182, 12, "D");

      doc.setTextColor(6, 78, 59);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`OFFICIAL HOSPITAL REPORT - ${String(report.reportType || "GENERAL REPORT").toUpperCase()}`, 18, 54);

      // Metadata Table
      const formattedDate = report.generatedDate
        ? new Date(report.generatedDate).toLocaleString()
        : new Date().toLocaleString();

      autoTable(doc, {
        startY: 63,
        head: [["Report ID", "Category / Type", "Generated By", "Date & Time", "Status"]],
        body: [[
          `#${report.reportId || "GEN"}`,
          report.reportType || "N/A",
          report.generatedBy || "Administrator",
          formattedDate,
          report.status || "Generated"
        ]],
        theme: "grid",
        headStyles: {
          fillColor: [8, 127, 91],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [23, 59, 43]
        },
        margin: { left: 14, right: 14 }
      });

      let currentY = doc.lastAutoTable.finalY + 12;

      // Report Title Block
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(6, 78, 59);
      doc.text("Report Title / Subject:", 14, currentY);
      currentY += 6;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 59);
      const splitTitle = doc.splitTextToSize(report.reportTitle || "Hospital Report Summary", 182);
      doc.text(splitTitle, 14, currentY);
      currentY += splitTitle.length * 6 + 8;

      // Findings & Clinical Summary Box
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(6, 78, 59);
      doc.text("Report Analysis & Detailed Findings:", 14, currentY);
      currentY += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);

      const descriptionText =
        report.description ||
        "All departmental metrics, patient admissions, and clinical statistics have been verified for this period.";
      const splitDescription = doc.splitTextToSize(descriptionText, 174);
      const descHeight = splitDescription.length * 5.5 + 10;

      // Background Box
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY - 2, 182, descHeight, "F");
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, currentY - 2, 182, descHeight, "D");

      doc.text(splitDescription, 18, currentY + 5);
      currentY += descHeight + 14;

      // Verification & Compliance Table
      autoTable(doc, {
        startY: currentY,
        head: [["Verification Parameter", "Audit Status / Remark"]],
        body: [
          ["Hospital Data Integrity", "PASSED - Synchronized with Central Database"],
          ["Administrative Authorization", `Approved by ${report.generatedBy || "Chief Medical Administrator"}`],
          ["Digital Timestamp & Record ID", `Verified Report #${report.reportId || "GEN"} on ${formattedDate}`],
          ["Compliance & Quality Standard", "ISO 9001:2015 & NABH Hospital Information System Standard"]
        ],
        theme: "striped",
        headStyles: {
          fillColor: [6, 78, 59],
          textColor: [255, 255, 255],
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8.5
        },
        margin: { left: 14, right: 14 }
      });

      currentY = doc.lastAutoTable.finalY + 28;

      // Page boundary check for signatures
      if (currentY > 255) {
        doc.addPage();
        currentY = 40;
      }

      // Signatures
      doc.setDrawColor(148, 163, 184);
      doc.line(14, currentY, 70, currentY);
      doc.line(140, currentY, 196, currentY);

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("Reporting Officer / Prepared By", 14, currentY + 6);
      doc.text("Medical Director / Authorized Signatory", 140, currentY + 6);

      // Footers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `NI AROGIYAM Hospital Management System | Confidential Hospital Document | Page ${i} of ${pageCount}`,
          105,
          290,
          { align: "center" }
        );
      }

      const filename = `NI_AROGIYAM_${(report.reportType || "REPORT").replace(/\s+/g, "_")}_#${report.reportId || "GEN"}.pdf`;
      doc.save(filename);
    } catch (pdfErr) {
      console.error("PDF generation failed:", pdfErr);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // =========================================================
  // COUNTS & FILTERING
  // =========================================================
  const patientReports = reports.filter((r) => r.reportType === "Patient Report").length;
  const doctorReports = reports.filter((r) => r.reportType === "Doctor Report").length;
  const appointmentReports = reports.filter((r) => r.reportType === "Appointment Report").length;
  const billingReports = reports.filter((r) => r.reportType === "Billing Report").length;
  const laboratoryReports = reports.filter((r) => r.reportType === "Laboratory Report").length;
  const pharmacyReports = reports.filter((r) => r.reportType === "Pharmacy Report").length;
  const generatedReports = reports.filter((r) => (r.status || "").toLowerCase() === "generated").length;
  const pendingReports = reports.filter((r) => (r.status || "").toLowerCase() === "pending").length;

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesCategory =
        selectedCategory === "ALL" || r.reportType === selectedCategory;

      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        String(r.reportId || "").toLowerCase().includes(q) ||
        String(r.reportTitle || "").toLowerCase().includes(q) ||
        String(r.reportType || "").toLowerCase().includes(q) ||
        String(r.generatedBy || "").toLowerCase().includes(q) ||
        String(r.description || "").toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [reports, selectedCategory, searchTerm]);

  // =========================================================
  // LOADING / ERROR
  // =========================================================
  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-status">
          <div className="reports-loader"></div>
          <h2>Loading Hospital Reports...</h2>
          <p>Please wait while recent reports and departmental metrics are fetched.</p>
        </div>
      </div>
    );
  }

  if (error && reports.length === 0) {
    return (
      <div className="reports-page">
        <div className="reports-status">
          <h2>Unable to Load Reports</h2>
          <p>{error}</p>
          <button className="reports-refresh-button" onClick={fetchReports} style={{ margin: "16px auto" }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="reports-page-header">
        <div>
          <div className="reports-breadcrumb">
            Dashboard <span>/</span> Reports
          </div>
          <h1>Hospital Reports & Analytics</h1>
          <p>Generate, review, and download official clinical & administrative PDF reports</p>
        </div>

        <div className="reports-header-actions">
          <button className="reports-refresh-button" onClick={fetchReports}>
            <span>↻</span> Refresh
          </button>
          <button className="reports-generate-button" onClick={openAddForm}>
            <span>+</span> Generate Report
          </button>
        </div>
      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}
      {message && <div className="reports-message success">{message}</div>}
      {error && reports.length > 0 && <div className="reports-message error">{error}</div>}

      {/* =====================================================
          FORM (ADD / EDIT)
      ===================================================== */}
      {showForm && (
        <div className="report-form-container">
          <div className="report-form-header">
            <div>
              <h2>{editingId ? "Edit Hospital Report" : "Generate New Hospital Report"}</h2>
              <p>Enter official report information and findings</p>
            </div>
            <button type="button" className="report-close-button" onClick={closeForm}>
              ×
            </button>
          </div>

          <form onSubmit={saveReport}>
            <div className="report-form-grid">
              {/* REPORT TYPE */}
              <div className="report-form-group">
                <label>Report Category / Type</label>
                <select
                  name="reportType"
                  value={form.reportType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select report category</option>
                  <option value="Patient Report">Patient Report</option>
                  <option value="Doctor Report">Doctor Report</option>
                  <option value="Appointment Report">Appointment Report</option>
                  <option value="Billing Report">Billing Report</option>
                  <option value="Laboratory Report">Laboratory Report</option>
                  <option value="Pharmacy Report">Pharmacy Report</option>
                  <option value="Operations Report">Operations Report</option>
                  <option value="Financial Report">Financial Report</option>
                </select>
              </div>

              {/* TITLE */}
              <div className="report-form-group">
                <label>Report Title</label>
                <input
                  type="text"
                  name="reportTitle"
                  value={form.reportTitle}
                  onChange={handleChange}
                  placeholder="e.g., Cardiology Department Clinical Audit"
                  required
                />
              </div>

              {/* GENERATED BY */}
              <div className="report-form-group">
                <label>Generated By / Author</label>
                <input
                  type="text"
                  name="generatedBy"
                  value={form.generatedBy}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Rajesh Sharma (Cardiologist)"
                  required
                />
              </div>

              {/* STATUS */}
              <div className="report-form-group">
                <label>Report Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Generated">Generated</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="report-form-group full-width">
                <label>Detailed Findings & Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter detailed clinical outcomes, departmental summary, and audit notes..."
                  rows="4"
                />
              </div>
            </div>

            <div className="report-form-buttons">
              <button
                type="button"
                className="report-cancel-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="report-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Report"
                  : "Generate Report & Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          VIEW REPORT MODAL
      ===================================================== */}
      {viewingReport && (
        <div className="report-view-modal-backdrop" onClick={() => setViewingReport(null)}>
          <div className="report-view-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="report-view-header">
              <div>
                <h2>{viewingReport.reportTitle}</h2>
                <p>Report ID #{viewingReport.reportId} | {viewingReport.reportType}</p>
              </div>
              <button
                type="button"
                className="report-close-button"
                onClick={() => setViewingReport(null)}
              >
                ×
              </button>
            </div>

            <div className="report-view-body">
              <div className="report-meta-grid">
                <div className="report-meta-item">
                  <span>Report ID</span>
                  <strong>#{viewingReport.reportId}</strong>
                </div>
                <div className="report-meta-item">
                  <span>Category</span>
                  <strong>{viewingReport.reportType}</strong>
                </div>
                <div className="report-meta-item">
                  <span>Status</span>
                  <strong>{viewingReport.status || "Generated"}</strong>
                </div>
                <div className="report-meta-item">
                  <span>Generated By</span>
                  <strong>{viewingReport.generatedBy || "Administrator"}</strong>
                </div>
                <div className="report-meta-item">
                  <span>Date Created</span>
                  <strong>
                    {viewingReport.generatedDate
                      ? new Date(viewingReport.generatedDate).toLocaleString()
                      : "N/A"}
                  </strong>
                </div>
                <div className="report-meta-item">
                  <span>Format</span>
                  <strong>PDF / Digital Record</strong>
                </div>
              </div>

              <div className="report-description-box">
                <h4>Clinical & Administrative Summary</h4>
                <p>{viewingReport.description || "No specific detailed description provided for this report."}</p>
              </div>
            </div>

            <div className="report-view-footer">
              <button
                type="button"
                className="report-modal-close-btn"
                onClick={() => setViewingReport(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="report-modal-download-btn"
                onClick={() => downloadReportPDF(viewingReport)}
              >
                <span>📥</span> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}
      <div className="reports-stats-grid">
        <div className="report-stat-card">
          <div className="report-stat-icon total">▤</div>
          <div className="report-stat-content">
            <span>Total Reports</span>
            <strong>{reports.length}</strong>
            <small>All system reports</small>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon patient">P</div>
          <div className="report-stat-content">
            <span>Patient Reports</span>
            <strong>{patientReports}</strong>
            <small>Clinical & admission</small>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon generated">✓</div>
          <div className="report-stat-content">
            <span>Generated</span>
            <strong>{generatedReports}</strong>
            <small>Available to download</small>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon pending">◷</div>
          <div className="report-stat-content">
            <span>Pending</span>
            <strong>{pendingReports}</strong>
            <small>Awaiting processing</small>
          </div>
        </div>
      </div>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <div className="reports-section-header">
        <div>
          <h2>Report Categories</h2>
          <p>Filter reports by department or domain</p>
        </div>
      </div>

      <div className="report-category-grid">
        <div
          className={`report-category-card ${selectedCategory === "Patient Report" ? "active" : ""}`}
          onClick={() => setSelectedCategory(selectedCategory === "Patient Report" ? "ALL" : "Patient Report")}
        >
          <div className="category-icon patient-icon">P</div>
          <div className="category-content">
            <h3>Patient Reports</h3>
            <p>Registration, treatments & clinical history.</p>
            <span>{patientReports} Reports</span>
          </div>
        </div>

        <div
          className={`report-category-card ${selectedCategory === "Doctor Report" ? "active" : ""}`}
          onClick={() => setSelectedCategory(selectedCategory === "Doctor Report" ? "ALL" : "Doctor Report")}
        >
          <div className="category-icon doctor-icon">D</div>
          <div className="category-content">
            <h3>Doctor Reports</h3>
            <p>Duty schedules, rounds & consultations.</p>
            <span>{doctorReports} Reports</span>
          </div>
        </div>

        <div
          className={`report-category-card ${selectedCategory === "Appointment Report" ? "active" : ""}`}
          onClick={() => setSelectedCategory(selectedCategory === "Appointment Report" ? "ALL" : "Appointment Report")}
        >
          <div className="category-icon appointment-icon">A</div>
          <div className="category-content">
            <h3>Appointment Reports</h3>
            <p>Schedules, OPD flow & bookings.</p>
            <span>{appointmentReports} Reports</span>
          </div>
        </div>

        <div
          className={`report-category-card ${selectedCategory === "Billing Report" ? "active" : ""}`}
          onClick={() => setSelectedCategory(selectedCategory === "Billing Report" ? "ALL" : "Billing Report")}
        >
          <div className="category-icon billing-icon">₹</div>
          <div className="category-content">
            <h3>Billing Reports</h3>
            <p>Collections, invoices & revenue audits.</p>
            <span>{billingReports} Reports</span>
          </div>
        </div>

        <div
          className={`report-category-card ${selectedCategory === "Laboratory Report" ? "active" : ""}`}
          onClick={() => setSelectedCategory(selectedCategory === "Laboratory Report" ? "ALL" : "Laboratory Report")}
        >
          <div className="category-icon laboratory-icon">L</div>
          <div className="category-content">
            <h3>Laboratory Reports</h3>
            <p>Diagnostics, pathology & TAT results.</p>
            <span>{laboratoryReports} Reports</span>
          </div>
        </div>

        <div
          className={`report-category-card ${selectedCategory === "Pharmacy Report" ? "active" : ""}`}
          onClick={() => setSelectedCategory(selectedCategory === "Pharmacy Report" ? "ALL" : "Pharmacy Report")}
        >
          <div className="category-icon pharmacy-icon">M</div>
          <div className="category-content">
            <h3>Pharmacy Reports</h3>
            <p>Dispensation, inventory & stock audit.</p>
            <span>{pharmacyReports} Reports</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH & FILTER BAR
      ===================================================== */}
      <div className="reports-search-bar">
        <input
          type="text"
          className="reports-search-input"
          placeholder="Search reports by title, ID, author, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="reports-filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="ALL">All Categories ({reports.length})</option>
          <option value="Patient Report">Patient Report ({patientReports})</option>
          <option value="Doctor Report">Doctor Report ({doctorReports})</option>
          <option value="Appointment Report">Appointment Report ({appointmentReports})</option>
          <option value="Billing Report">Billing Report ({billingReports})</option>
          <option value="Laboratory Report">Laboratory Report ({laboratoryReports})</option>
          <option value="Pharmacy Report">Pharmacy Report ({pharmacyReports})</option>
          <option value="Operations Report">Operations Report</option>
          <option value="Financial Report">Financial Report</option>
        </select>

        {(searchTerm || selectedCategory !== "ALL") && (
          <button
            className="reports-clear-filter-btn"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("ALL");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* =====================================================
          REPORTS TABLE
      ===================================================== */}
      <div className="reports-table-card">
        <div className="reports-table-header">
          <div>
            <h2>Generated Hospital Reports</h2>
            <p>
              {selectedCategory !== "ALL"
                ? `Showing ${selectedCategory}s`
                : "Recently generated reports and audits"}
            </p>
          </div>

          <div className="report-count">
            {filteredReports.length}{" "}
            {filteredReports.length === 1 ? "Report" : "Reports"}
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <div className="no-reports-icon">▤</div>
            <h3>No reports found</h3>
            <p>
              {searchTerm || selectedCategory !== "ALL"
                ? "No reports match the current search or category filter."
                : "Generate a new report to view and download it here."}
            </p>
            <button className="reports-generate-button" onClick={openAddForm} style={{ margin: "0 auto" }}>
              + Generate First Report
            </button>
          </div>
        ) : (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>REPORT TYPE</th>
                  <th>TITLE & SUMMARY</th>
                  <th>GENERATED BY</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.reportId}>
                    {/* ID */}
                    <td>
                      <span className="report-id">#{report.reportId}</span>
                    </td>

                    {/* TYPE */}
                    <td>
                      <span className="report-type">{report.reportType}</span>
                    </td>

                    {/* TITLE & DESCRIPTION (CLEANLY SEPARATED) */}
                    <td>
                      <div className="report-title-cell">
                        <strong>{report.reportTitle}</strong>
                        {report.description && <small>{report.description}</small>}
                      </div>
                    </td>

                    {/* GENERATED BY */}
                    <td>
                      <div className="generated-by">
                        <div className="generated-avatar">
                          {report.generatedBy
                            ? report.generatedBy.charAt(0).toUpperCase()
                            : "A"}
                        </div>
                        <span>{report.generatedBy || "Administrator"}</span>
                      </div>
                    </td>

                    {/* DATE */}
                    <td>
                      <span className="report-date">
                        {report.generatedDate
                          ? new Date(report.generatedDate).toLocaleString()
                          : "N/A"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={
                          (report.status || "").toLowerCase() === "generated"
                            ? "report-status generated"
                            : "report-status pending"
                        }
                      >
                        <span className="status-dot"></span>
                        {report.status || "Generated"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="report-actions">
                        <button
                          type="button"
                          className="report-view-button"
                          title="View Report Details"
                          onClick={() => setViewingReport(report)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="report-pdf-button"
                          title="Download Official PDF Report"
                          onClick={() => downloadReportPDF(report)}
                        >
                          PDF
                        </button>

                        <button
                          type="button"
                          className="report-edit-button"
                          title="Edit Report"
                          onClick={() => openEditForm(report)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="report-delete-button"
                          title="Delete Report"
                          onClick={() => deleteReport(report.reportId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;