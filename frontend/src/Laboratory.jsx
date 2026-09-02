import { useEffect, useState } from "react";
import "./Laboratory.css";
import API_BASE_URL from "./config";

const API_URL = `${API_BASE_URL}/api`;

function Laboratory() {
  // =========================================================
  // STATE
  // =========================================================

  const [laboratories, setLaboratories] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  const [editingLab, setEditingLab] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);

  const [formData, setFormData] = useState({
    patientId: "",
    testName: "",
    testType: "",
    testDate: "",
    result: "",
    status: "PENDING",
    remarks: "",
  });

  // =========================================================
  // EMPTY FORM
  // =========================================================

  const emptyForm = {
    patientId: "",
    testName: "",
    testType: "",
    testDate: "",
    result: "",
    status: "PENDING",
    remarks: "",
  };

  // =========================================================
  // API ERROR HELPER
  // =========================================================

  const getErrorMessage = async (response, defaultMessage) => {
    try {
      const text = await response.text();

      if (text && text.trim()) {
        return text;
      }
    } catch (error) {
      console.error("Unable to read server error:", error);
    }

    return defaultMessage;
  };

  // =========================================================
  // LOAD LABORATORY RECORDS
  // =========================================================

  const loadLaboratories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/laboratory`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          `Failed to load laboratory records (${response.status})`
        );

        throw new Error(message);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setLaboratories(data);
      } else {
        setLaboratories([]);
      }
    } catch (error) {
      console.error("Load laboratory error:", error);

      setLaboratories([]);

      setError(
        error.message ||
          "Unable to load laboratory records. Please make sure the Spring Boot backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD PATIENTS
  // =========================================================

  const loadPatients = async () => {
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          `Failed to load patients (${response.status})`
        );

        throw new Error(message);
      }

      const data = await response.json();

      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load patients error:", error);

      setPatients([]);

      setError(
        error.message ||
          "Unable to load patients."
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadLaboratories(),
        loadPatients(),
      ]);
    };

    loadData();
  }, []);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      ...emptyForm,
    });
  };

  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  const openAddForm = () => {
    setEditingLab(null);
    setSelectedLab(null);

    resetForm();

    setShowForm(true);
    setShowView(false);

    setError("");
    setSuccessMessage("");
  };

  // =========================================================
  // FORMAT DATE FOR DATETIME-LOCAL
  // =========================================================

  const formatDateForInput = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    try {
      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return String(dateValue).substring(0, 16);
      }

      const year = date.getFullYear();

      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        date.getDate()
      ).padStart(2, "0");

      const hours = String(
        date.getHours()
      ).padStart(2, "0");

      const minutes = String(
        date.getMinutes()
      ).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return String(dateValue).substring(0, 16);
    }
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const openEditForm = (laboratory) => {
    setEditingLab(laboratory);
    setSelectedLab(null);

    setFormData({
      patientId:
        laboratory.patient?.patientId ??
        laboratory.patientId ??
        "",

      testName:
        laboratory.testName ?? "",

      testType:
        laboratory.testType ?? "",

      testDate:
        formatDateForInput(
          laboratory.testDate
        ),

      result:
        laboratory.result ?? "",

      status:
        laboratory.status || "PENDING",

      remarks:
        laboratory.remarks ?? "",
    });

    setShowForm(true);
    setShowView(false);

    setError("");
    setSuccessMessage("");
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingLab(null);

    resetForm();

    setError("");
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    if (!formData.patientId) {
      return "Please select a patient.";
    }

    if (!formData.testName.trim()) {
      return "Please enter the test name.";
    }

    if (!formData.testType) {
      return "Please select the test type.";
    }

    if (!formData.testDate) {
      return "Please select the test date.";
    }

    if (!formData.status) {
      return "Please select the test status.";
    }

    const selectedPatient = patients.find(
      (patient) =>
        Number(patient.patientId) ===
        Number(formData.patientId)
    );

    if (!selectedPatient) {
      return "Selected patient was not found.";
    }

    return "";
  };

  // =========================================================
  // ADD / UPDATE LABORATORY
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const laboratoryData = {
      patient: {
        patientId: Number(formData.patientId),
      },

      testName:
        formData.testName.trim(),

      testType:
        formData.testType,

      testDate:
        formData.testDate
          ? formData.testDate.length === 16
            ? `${formData.testDate}:00`
            : formData.testDate
          : null,

      result:
        formData.result.trim(),

      status:
        formData.status,

      remarks:
        formData.remarks.trim(),
    };

    const url = editingLab
      ? `${API_URL}/laboratory/${editingLab.labId}`
      : `${API_URL}/laboratory`;

    const method = editingLab
      ? "PUT"
      : "POST";

    try {
      setSaving(true);

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(
          laboratoryData
        ),
      });

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          editingLab
            ? "Failed to update laboratory record."
            : "Failed to add laboratory record."
        );

        throw new Error(message);
      }

      let savedData = null;

      try {
        savedData = await response.json();
      } catch {
        savedData = null;
      }

      console.log(
        "Laboratory saved:",
        savedData
      );

      setSuccessMessage(
        editingLab
          ? "Laboratory record updated successfully!"
          : "Laboratory record added successfully!"
      );

      setShowForm(false);
      setEditingLab(null);

      resetForm();

      await loadLaboratories();
    } catch (error) {
      console.error(
        "Save laboratory error:",
        error
      );

      setError(
        error.message ||
          "Unable to save laboratory record."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // VIEW LABORATORY RECORD
  // =========================================================

  const openView = (laboratory) => {
    setSelectedLab(laboratory);

    setShowView(true);
    setShowForm(false);

    setError("");
    setSuccessMessage("");
  };

  // =========================================================
  // CLOSE VIEW
  // =========================================================

  const closeView = () => {
    setShowView(false);
    setSelectedLab(null);
  };

  // =========================================================
  // DELETE LABORATORY RECORD
  // =========================================================

  const handleDelete = async (labId) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this laboratory record?"
      );

    if (!confirmDelete) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setDeletingId(labId);

    try {
      const response = await fetch(
        `${API_URL}/laboratory/${labId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Failed to delete laboratory record."
        );

        throw new Error(message);
      }

      // Immediately remove from UI
      setLaboratories(
        (current) =>
          current.filter(
            (lab) =>
              Number(lab.labId) !==
              Number(labId)
          )
      );

      setSuccessMessage(
        "Laboratory record deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete laboratory error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete laboratory record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const searchValue =
    search.trim().toLowerCase();

  const filteredLaboratories =
    laboratories.filter(
      (laboratory) => {
        const patientName =
          `${laboratory.patient?.firstName || ""} ${
            laboratory.patient?.lastName || ""
          }`
            .trim()
            .toLowerCase();

        const patientId =
          String(
            laboratory.patient?.patientId ??
              laboratory.patientId ??
              ""
          ).toLowerCase();

        const testName =
          String(
            laboratory.testName || ""
          ).toLowerCase();

        const testType =
          String(
            laboratory.testType || ""
          ).toLowerCase();

        const status =
          String(
            laboratory.status || ""
          ).toLowerCase();

        const result =
          String(
            laboratory.result || ""
          ).toLowerCase();

        const labId =
          String(
            laboratory.labId || ""
          ).toLowerCase();

        return (
          patientName.includes(searchValue) ||
          patientId.includes(searchValue) ||
          testName.includes(searchValue) ||
          testType.includes(searchValue) ||
          status.includes(searchValue) ||
          result.includes(searchValue) ||
          labId.includes(searchValue)
        );
      }
    );

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    const value =
      String(status || "")
        .toLowerCase()
        .replace(/\s+/g, "-");

    return value;
  };

  // =========================================================
  // DATE DISPLAY
  // =========================================================

  const formatDisplayDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    try {
      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return String(dateValue);
      }

      return date.toLocaleString();
    } catch {
      return String(dateValue);
    }
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="patients-page">

        <div className="patients-header">

          <div>
            <h1>Laboratory</h1>

            <p>
              Manage laboratory tests and patient reports
            </p>
          </div>

        </div>

        <div className="status-message">

          <div className="loading-spinner"></div>

          <h2>
            Loading laboratory records...
          </h2>

          <p>
            Connecting to hospital management system
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="patients-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="patients-header">

        <div>
          <h1>Laboratory</h1>

          <p>
            Manage laboratory tests and patient reports
          </p>
        </div>

        <button
          type="button"
          className="add-patient-button"
          onClick={openAddForm}
        >
          + Add Lab Test
        </button>

      </div>

      {/* =====================================================
          SUCCESS
      ====================================================== */}

      {successMessage && (
        <div className="success-message">
          <span>✓</span>
          {successMessage}
        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="error-message">
          <span>!</span>
          {error}
        </div>
      )}

      {/* =====================================================
          SEARCH
      ====================================================== */}

      {!showForm && !showView && (
        <div className="patient-search">

          <div className="doctor-search-wrapper">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search by patient, test, type, result, status or ID..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search-button"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}

          </div>

          <div className="search-result-info">

            {search ? (
              <span>
                Showing{" "}
                <strong>
                  {filteredLaboratories.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {laboratories.length}
                </strong>{" "}
                records
              </span>
            ) : (
              <span>
                Total laboratory records:{" "}
                <strong>
                  {laboratories.length}
                </strong>
              </span>
            )}

          </div>

        </div>
      )}

      {/* =====================================================
          ADD / EDIT FORM
      ====================================================== */}

      {showForm && (
        <div className="patient-form-card">

          <div className="form-header">

            <div>

              <h2>
                {editingLab
                  ? "Edit Laboratory Test"
                  : "Add Laboratory Test"}
              </h2>

              <p>
                {editingLab
                  ? "Update laboratory test information"
                  : "Enter laboratory test information"}
              </p>

            </div>

            <button
              type="button"
              className="close-button"
              onClick={closeForm}
              disabled={saving}
            >
              ×
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* PATIENT */}

              <div className="form-group">

                <label>
                  Patient
                </label>

                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select patient
                  </option>

                  {patients.map(
                    (patient) => (
                      <option
                        key={
                          patient.patientId
                        }
                        value={
                          patient.patientId
                        }
                      >
                        {patient.firstName}{" "}
                        {patient.lastName}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* TEST NAME */}

              <div className="form-group">

                <label>
                  Test Name
                </label>

                <input
                  type="text"
                  name="testName"
                  value={
                    formData.testName
                  }
                  onChange={handleChange}
                  placeholder="Enter test name"
                  required
                />

              </div>

              {/* TEST TYPE */}

              <div className="form-group">

                <label>
                  Test Type
                </label>

                <select
                  name="testType"
                  value={
                    formData.testType
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select test type
                  </option>

                  <option value="Hematology">
                    Hematology
                  </option>

                  <option value="Biochemistry">
                    Biochemistry
                  </option>

                  <option value="Microbiology">
                    Microbiology
                  </option>

                  <option value="Pathology">
                    Pathology
                  </option>

                  <option value="Radiology">
                    Radiology
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* DATE */}

              <div className="form-group">

                <label>
                  Test Date
                </label>

                <input
                  type="datetime-local"
                  name="testDate"
                  value={
                    formData.testDate
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              {/* RESULT */}

              <div className="form-group">

                <label>
                  Result
                </label>

                <input
                  type="text"
                  name="result"
                  value={
                    formData.result
                  }
                  onChange={handleChange}
                  placeholder="Enter result"
                />

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                </select>

              </div>

              {/* REMARKS */}

              <div className="form-group">

                <label>
                  Remarks
                </label>

                <input
                  type="text"
                  name="remarks"
                  value={
                    formData.remarks
                  }
                  onChange={handleChange}
                  placeholder="Enter remarks"
                />

              </div>

            </div>

            {/* FORM ACTIONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-patient-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingLab
                    ? "Update Test"
                    : "Save Test"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =====================================================
          VIEW
      ====================================================== */}

      {showView && selectedLab && (
        <div className="patient-form-card">

          <div className="form-header">

            <div>

              <h2>
                Laboratory Test Details
              </h2>

              <p>
                Complete laboratory information
              </p>

            </div>

            <button
              type="button"
              className="close-button"
              onClick={closeView}
            >
              ×
            </button>

          </div>

          <div className="patient-details-grid">

            <div>
              <span>Lab ID</span>

              <strong>
                {selectedLab.labId ??
                  "N/A"}
              </strong>
            </div>

            <div>
              <span>Patient</span>

              <strong>
                {selectedLab.patient
                  ? `${selectedLab.patient.firstName || ""} ${
                      selectedLab.patient.lastName || ""
                    }`.trim()
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>Test Name</span>

              <strong>
                {selectedLab.testName ||
                  "N/A"}
              </strong>
            </div>

            <div>
              <span>Test Type</span>

              <strong>
                {selectedLab.testType ||
                  "N/A"}
              </strong>
            </div>

            <div>
              <span>Test Date</span>

              <strong>
                {formatDisplayDate(
                  selectedLab.testDate
                )}
              </strong>
            </div>

            <div>
              <span>Result</span>

              <strong>
                {selectedLab.result ||
                  "Pending"}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong>
                {selectedLab.status ||
                  "PENDING"}
              </strong>
            </div>

            <div>
              <span>Remarks</span>

              <strong>
                {selectedLab.remarks ||
                  "-"}
              </strong>
            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={closeView}
            >
              Close
            </button>

            <button
              type="button"
              className="save-patient-button"
              onClick={() => {
                const lab =
                  selectedLab;

                closeView();
                openEditForm(lab);
              }}
            >
              Edit Test
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          TABLE
      ====================================================== */}

      {!showForm && !showView && (
        <div className="patients-table-container">

          <table className="patients-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Test Name</th>
                <th>Test Type</th>
                <th>Date</th>
                <th>Result</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredLaboratories.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="empty-table-message"
                  >

                    {search ? (
                      <>
                        <strong>
                          No laboratory records found
                        </strong>

                        <br />

                        <span>
                          Try another search term.
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>
                          No laboratory records registered
                        </strong>

                        <br />

                        <span>
                          Click "+ Add Lab Test" to add a record.
                        </span>
                      </>
                    )}

                  </td>

                </tr>

              ) : (

                filteredLaboratories.map(
                  (laboratory) => {

                    const patientName =
                      laboratory.patient
                        ? `${laboratory.patient.firstName || ""} ${
                            laboratory.patient.lastName || ""
                          }`.trim()
                        : "N/A";

                    return (
                      <tr
                        key={
                          laboratory.labId
                        }
                      >

                        <td>
                          {laboratory.labId}
                        </td>

                        <td>
                          <strong>
                            {patientName ||
                              "N/A"}
                          </strong>
                        </td>

                        <td>
                          {laboratory.testName ||
                            "N/A"}
                        </td>

                        <td>
                          {laboratory.testType ||
                            "N/A"}
                        </td>

                        <td>
                          {formatDisplayDate(
                            laboratory.testDate
                          )}
                        </td>

                        <td>
                          {laboratory.result ||
                            "Pending"}
                        </td>

                        <td>

                          <span
                            className={`doctor-status ${getStatusClass(
                              laboratory.status
                            )}`}
                          >
                            {laboratory.status ||
                              "PENDING"}
                          </span>

                        </td>

                        <td className="action-buttons">

                          <button
                            type="button"
                            className="view-button"
                            onClick={() =>
                              openView(
                                laboratory
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              openEditForm(
                                laboratory
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            disabled={
                              deletingId ===
                              laboratory.labId
                            }
                            onClick={() =>
                              handleDelete(
                                laboratory.labId
                              )
                            }
                          >
                            {deletingId ===
                            laboratory.labId
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Laboratory;