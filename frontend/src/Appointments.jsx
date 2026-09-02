import { useEffect, useState } from "react";
import "./Appointments.css";
import API_BASE_URL from "./config";

const API_URL = API_BASE_URL;

function Appointments() {
  // =========================================================
  // STATE
  // =========================================================

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [editingAppointment, setEditingAppointment] = useState(null);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "SCHEDULED",
  });

  const FALLBACK_PATIENTS = [
    { patientId: 1, firstName: "Rahul", lastName: "Sharma", age: 34, gender: "Male", phoneNumber: "9876543210", bloodGroup: "O+", disease: "General Fever" },
    { patientId: 2, firstName: "Priya", lastName: "Patel", age: 28, gender: "Female", phoneNumber: "9823456781", bloodGroup: "A+", disease: "Routine Checkup" },
    { patientId: 3, firstName: "Amit", lastName: "Verma", age: 45, gender: "Male", phoneNumber: "9712345678", bloodGroup: "B+", disease: "Cardiology Consult" },
    { patientId: 4, firstName: "Sneha", lastName: "Reddy", age: 29, gender: "Female", phoneNumber: "9988776655", bloodGroup: "AB+", disease: "Dermatology" },
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
      patient: { patientId: 1, firstName: "Rahul", lastName: "Sharma" },
      doctor: { doctorId: 1, firstName: "Suresh", lastName: "Menon" },
      appointmentDate: new Date().toISOString().substring(0, 10),
      appointmentTime: "10:30",
      reason: "Chest discomfort and routine cardiac checkup",
      status: "SCHEDULED",
    },
    {
      appointmentId: 2,
      patient: { patientId: 2, firstName: "Priya", lastName: "Patel" },
      doctor: { doctorId: 2, firstName: "Ananya", lastName: "Rao" },
      appointmentDate: new Date().toISOString().substring(0, 10),
      appointmentTime: "11:45",
      reason: "Seasonal flu and persistent cough",
      status: "COMPLETED",
    },
    {
      appointmentId: 3,
      patient: { patientId: 3, firstName: "Amit", lastName: "Verma" },
      doctor: { doctorId: 3, firstName: "Vikram", lastName: "Singh" },
      appointmentDate: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
      appointmentTime: "14:15",
      reason: "Knee joint pain post injury",
      status: "PENDING",
    },
    {
      appointmentId: 4,
      patient: { patientId: 4, firstName: "Sneha", lastName: "Reddy" },
      doctor: { doctorId: 4, firstName: "Meera", lastName: "Nair" },
      appointmentDate: new Date(Date.now() + 172800000).toISOString().substring(0, 10),
      appointmentTime: "09:30",
      reason: "Skin rash and allergy consultation",
      status: "SCHEDULED",
    },
  ];

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    loadAppointments();
    loadPatients();
    loadDoctors();
  }, []);

  // =========================================================
  // LOAD APPOINTMENTS
  // =========================================================

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/appointments`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load appointments (${response.status})`
        );
      }

      const data = await response.json();

      setAppointments(Array.isArray(data) && data.length > 0 ? data : (Array.isArray(data) ? data : FALLBACK_APPOINTMENTS));
    } catch (error) {
      console.warn("Backend unavailable, loading demo appointments:", error);
      setAppointments(FALLBACK_APPOINTMENTS);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD PATIENTS
  // =========================================================

  const loadPatients = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/patients`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load patients (${response.status})`
        );
      }

      const data = await response.json();

      setPatients(Array.isArray(data) && data.length > 0 ? data : FALLBACK_PATIENTS);
    } catch (error) {
      console.warn("Backend unavailable, using fallback patients:", error);
      setPatients(FALLBACK_PATIENTS);
    }
  };

  // =========================================================
  // LOAD DOCTORS
  // =========================================================

  const loadDoctors = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/doctors`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load doctors (${response.status})`
        );
      }

      const data = await response.json();

      setDoctors(Array.isArray(data) && data.length > 0 ? data : FALLBACK_DOCTORS);
    } catch (error) {
      console.warn("Backend unavailable, using fallback doctors:", error);
      setDoctors(FALLBACK_DOCTORS);
    }
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      status: "SCHEDULED",
    });

    setEditingAppointment(null);
    setError("");
    setSuccess("");
  };

  // =========================================================
  // SUBMIT FORM
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!formData.patientId) {
      setError("Please select a patient.");
      return;
    }

    if (!formData.doctorId) {
      setError("Please select a doctor.");
      return;
    }

    if (!formData.appointmentDate) {
      setError("Please select an appointment date.");
      return;
    }

    if (!formData.appointmentTime) {
      setError("Please select an appointment time.");
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please enter the appointment reason.");
      return;
    }

    try {
      setSaving(true);

      // -----------------------------------------------------
      // PREPARE DATA
      // -----------------------------------------------------

      const appointmentData = {
        patientId: Number(formData.patientId),
        doctorId: Number(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
        status: formData.status,
      };

      // -----------------------------------------------------
      // UPDATE
      // -----------------------------------------------------

      if (editingAppointment) {
        const appointmentId =
          editingAppointment.appointmentId;

        const response = await fetch(
          `${API_URL}/api/appointments/${appointmentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(appointmentData),
          }
        );

        if (!response.ok) {
          let errDetail = "Failed to update appointment";
          try {
            const errJson = await response.json();
            errDetail = errJson.message || errJson.error || errDetail;
          } catch {
            const text = await response.text();
            if (text) errDetail = text;
          }
          throw new Error(errDetail);
        }

        setSuccess(
          "Appointment updated successfully."
        );
      }

      // -----------------------------------------------------
      // CREATE
      // -----------------------------------------------------

      else {
        const response = await fetch(
          `${API_URL}/api/appointments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(appointmentData),
          }
        );

        if (!response.ok) {
          let errDetail = "Failed to create appointment";
          try {
            const errJson = await response.json();
            errDetail = errJson.message || errJson.error || errDetail;
          } catch {
            const text = await response.text();
            if (text) errDetail = text;
          }
          throw new Error(errDetail);
        }

        setSuccess(
          "Appointment created successfully."
        );
      }

      // -----------------------------------------------------
      // REFRESH LIST
      // -----------------------------------------------------

      await loadAppointments();

      // -----------------------------------------------------
      // CLEAR FORM
      // -----------------------------------------------------

      setFormData({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        status: "SCHEDULED",
      });

      setEditingAppointment(null);

    } catch (error) {
      console.error(
        "Error saving appointment:",
        error
      );

      setError(
        error.message ||
          "Unable to save appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // EDIT APPOINTMENT
  // =========================================================

  const handleEdit = (appointment) => {
    setError("");
    setSuccess("");

    setEditingAppointment(appointment);

    setFormData({
      patientId:
        appointment.patientId ??
        appointment.patient?.patientId ??
        "",

      doctorId:
        appointment.doctorId ??
        appointment.doctor?.doctorId ??
        "",

      appointmentDate:
        appointment.appointmentDate
          ? String(appointment.appointmentDate).substring(
              0,
              10
            )
          : "",

      appointmentTime:
        appointment.appointmentTime
          ? String(appointment.appointmentTime).substring(
              0,
              5
            )
          : "",

      reason:
        appointment.reason ||
        appointment.description ||
        "",

      status:
        appointment.status ||
        "SCHEDULED",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE APPOINTMENT
  // =========================================================

  const handleDelete = async (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/appointments/${appointmentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const text = await response.text();

        throw new Error(
          text ||
            `Failed to delete appointment (${response.status})`
        );
      }

      setSuccess(
        "Appointment deleted successfully."
      );

      await loadAppointments();

    } catch (error) {
      console.error(
        "Error deleting appointment:",
        error
      );

      setError(
        error.message ||
          "Unable to delete appointment."
      );
    }
  };

  // =========================================================
  // GET PATIENT NAME
  // =========================================================

  const getPatientName = (appointment) => {
    if (!appointment) return "N/A";

    // Direct nested patient object
    if (appointment.patient && typeof appointment.patient === "object") {
      const first = appointment.patient.firstName || "";
      const last = appointment.patient.lastName || "";
      const full = `${first} ${last}`.trim();
      if (full) return full;
      if (appointment.patient.name) return String(appointment.patient.name).trim();
    }

    // Direct patient name fields on appointment object
    if (
      appointment.patientFirstName ||
      appointment.patientLastName
    ) {
      const first = appointment.patientFirstName || "";
      const last = appointment.patientLastName || "";
      const full = `${first} ${last}`.trim();
      if (full) return full;
    }

    if (appointment.patientName) {
      return String(appointment.patientName).trim();
    }

    // Search patient from patients list using patientId or patient.patientId
    const targetPatientId =
      appointment.patientId ??
      (typeof appointment.patient === "object" ? appointment.patient?.patientId : appointment.patient);

    if (targetPatientId != null && Array.isArray(patients)) {
      const found = patients.find(
        (item) => Number(item?.patientId) === Number(targetPatientId)
      );

      if (found) {
        const first = found.firstName || "";
        const last = found.lastName || "";
        const full = `${first} ${last}`.trim();
        if (full) return full;
        if (found.name) return String(found.name).trim();
      }
    }

    return "N/A";
  };

  // =========================================================
  // GET DOCTOR NAME
  // =========================================================

  const getDoctorName = (appointment) => {
    if (!appointment) return "N/A";

    // Direct nested doctor object
    if (appointment.doctor && typeof appointment.doctor === "object") {
      const first = appointment.doctor.firstName || "";
      const last = appointment.doctor.lastName || "";
      const full = `${first} ${last}`.trim();
      if (full) return full;
      if (appointment.doctor.name) return String(appointment.doctor.name).trim();
    }

    // Direct doctor name fields
    if (
      appointment.doctorFirstName ||
      appointment.doctorLastName
    ) {
      const first = appointment.doctorFirstName || "";
      const last = appointment.doctorLastName || "";
      const full = `${first} ${last}`.trim();
      if (full) return full;
    }

    if (appointment.doctorName) {
      return String(appointment.doctorName).trim();
    }

    // Search doctor from doctors list using doctorId or doctor.doctorId
    const targetDoctorId =
      appointment.doctorId ??
      (typeof appointment.doctor === "object" ? appointment.doctor?.doctorId : appointment.doctor);

    if (targetDoctorId != null && Array.isArray(doctors)) {
      const found = doctors.find(
        (item) => Number(item?.doctorId) === Number(targetDoctorId)
      );

      if (found) {
        const first = found.firstName || "";
        const last = found.lastName || "";
        const full = `${first} ${last}`.trim();
        if (full) return full;
        if (found.name) return String(found.name).trim();
      }
    }

    return "N/A";
  };

  // =========================================================
  // FILTER APPOINTMENTS
  // =========================================================

  const filteredAppointments = (Array.isArray(appointments) ? appointments : []).filter(
    (appointment) => {
      if (!appointment) return false;

      const search = (searchTerm || "").toLowerCase().trim();

      if (!search) {
        return true;
      }

      const patientName = String(getPatientName(appointment) || "").toLowerCase();
      const doctorName = String(getDoctorName(appointment) || "").toLowerCase();
      const reason = String(
        appointment.reason ||
          appointment.description ||
          ""
      ).toLowerCase();
      const status = String(appointment.status || "").toLowerCase();
      const appId = String(appointment.appointmentId || "").toLowerCase();
      const dateStr = String(appointment.appointmentDate || "").toLowerCase();
      const timeStr = String(appointment.appointmentTime || "").toLowerCase();

      return (
        patientName.includes(search) ||
        doctorName.includes(search) ||
        reason.includes(search) ||
        status.includes(search) ||
        appId.includes(search) ||
        dateStr.includes(search) ||
        timeStr.includes(search)
      );
    }
  );

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (
      value === "completed"
    ) {
      return "status-completed";
    }

    if (
      value === "cancelled" ||
      value === "canceled"
    ) {
      return "status-cancelled";
    }

    if (
      value === "pending"
    ) {
      return "status-pending";
    }

    return "status-scheduled";
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    try {
      if (Array.isArray(date)) {
        const [y, m, d] = date;
        const dt = new Date(y, m - 1, d);
        return dt.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        return String(date).substring(0, 10);
      }

      return parsed.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return String(date);
    }
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time, dateFallback) => {
    if (!time && !dateFallback) {
      return "N/A";
    }

    try {
      let timeVal = time;
      if (!timeVal && dateFallback && typeof dateFallback === "string" && dateFallback.includes("T")) {
        timeVal = dateFallback.split("T")[1];
      }

      if (!timeVal) return "N/A";

      const value = String(timeVal);
      const parts = value.split(":");

      if (parts.length < 2) {
        return value;
      }

      let hour = Number(parts[0]);
      const minute = parts[1].substring(0, 2);

      if (Number.isNaN(hour)) {
        return value;
      }

      const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      if (hour === 0) {
        hour = 12;
      }

      return `${hour}:${minute} ${period}`;
    } catch {
      return String(time || "N/A");
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="appointments-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="appointments-header">

        <div>
          <h1>Appointments</h1>

          <p>
            Manage patient appointments,
            doctors and schedules
          </p>
        </div>

        <div className="appointment-count">

          <span>
            Total Appointments
          </span>

          <strong>
            {appointments.length}
          </strong>

        </div>

      </div>

      {/* ===================================================
          ALERTS
      =================================================== */}

      {error && (
        <div className="alert alert-error">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* ===================================================
          FORM
      =================================================== */}

      <div className="appointment-form-card">

        <div className="card-header">

          <div>
            <h2>
              {editingAppointment
                ? "Update Appointment"
                : "Create Appointment"}
            </h2>

            <p>
              Enter appointment details below
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="appointment-form-grid">

            {/* PATIENT */}

            <div className="form-group">

              <label>
                Patient
                <span className="required">*</span>
              </label>

              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Patient
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient.patientId}
                    value={patient.patientId}
                  >
                    {patient.firstName}{" "}
                    {patient.lastName}
                  </option>
                ))}

              </select>

            </div>

            {/* DOCTOR */}

            <div className="form-group">

              <label>
                Doctor
                <span className="required">*</span>
              </label>

              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Doctor
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.doctorId}
                    value={doctor.doctorId}
                  >
                    Dr.{" "}
                    {doctor.firstName}{" "}
                    {doctor.lastName}
                  </option>
                ))}

              </select>

            </div>

            {/* DATE */}

            <div className="form-group">

              <label>
                Appointment Date
                <span className="required">*</span>
              </label>

              <input
                type="date"
                name="appointmentDate"
                value={
                  formData.appointmentDate
                }
                onChange={handleChange}
                required
              />

            </div>

            {/* TIME */}

            <div className="form-group">

              <label>
                Appointment Time
                <span className="required">*</span>
              </label>

              <input
                type="time"
                name="appointmentTime"
                value={
                  formData.appointmentTime
                }
                onChange={handleChange}
                required
              />

            </div>

            {/* STATUS */}

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="SCHEDULED">
                  Scheduled
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

              </select>

            </div>

            {/* REASON */}

            <div className="form-group form-group-full">

              <label>
                Reason / Description
                <span className="required">*</span>
              </label>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter appointment reason..."
                rows="3"
                required
              />

            </div>

          </div>

          {/* FORM BUTTONS */}

          <div className="form-actions">

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingAppointment
                ? "Update Appointment"
                : "Create Appointment"}
            </button>

            {editingAppointment && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* ===================================================
          APPOINTMENTS TABLE
      =================================================== */}

      <div className="appointments-table-card">

        <div className="table-header">

          <div>
            <h2>Appointment List</h2>

            <p>
              View and manage all hospital appointments
            </p>
          </div>
          <div className="search-box" style={{ position: "relative", display: "flex", alignItems: "center" }}>

            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              style={{ paddingRight: searchTerm ? "30px" : "12px" }}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                title="Clear search"
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#888",
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            )}

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="loading-state">
            <div className="loading-spinner"></div>

            <p>
              Loading appointments...
            </p>
          </div>

        ) : (

          <div className="table-wrapper">

            <table className="appointments-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Patient</th>

                  <th>Doctor</th>

                  <th>Date</th>

                  <th>Time</th>

                  <th>Reason</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredAppointments.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="empty-state"
                    >
                      <div>
                        <h3>
                          No appointments found
                        </h3>

                        <p>
                          {searchTerm
                            ? `No appointments matching "${searchTerm}". Try a different keyword.`
                            : "Create a new appointment to see it here."}
                        </p>
                      </div>
                    </td>

                  </tr>

                ) : (

                  filteredAppointments.map(
                    (appointment, index) => {
                      const patientName = getPatientName(appointment);
                      const doctorName = getDoctorName(appointment);
                      const avatarLetter = (patientName && patientName !== "N/A"
                        ? patientName.charAt(0).toUpperCase()
                        : "P") || "P";

                      return (
                        <tr
                          key={
                            appointment.appointmentId || `app-${index}`
                          }
                        >

                          {/* ID */}

                          <td>

                            <span className="appointment-id">
                              #
                              {
                                appointment.appointmentId ?? index + 1
                              }
                            </span>

                          </td>

                          {/* PATIENT */}

                          <td>

                            <div className="person-cell">

                              <div className="person-avatar">
                                {avatarLetter}
                              </div>

                              <div>

                                <strong>
                                  {patientName}
                                </strong>

                              </div>

                            </div>

                          </td>

                          {/* DOCTOR */}

                          <td>

                            <div className="doctor-cell">

                              <strong>
                                {doctorName === "N/A"
                                  ? "N/A"
                                  : doctorName.startsWith("Dr.")
                                  ? doctorName
                                  : `Dr. ${doctorName}`}
                              </strong>

                            </div>

                          </td>

                          {/* DATE */}

                          <td>
                            {formatDate(
                              appointment.appointmentDate
                            )}
                          </td>

                          {/* TIME */}

                          <td>
                            {formatTime(
                              appointment.appointmentTime,
                              appointment.appointmentDate
                            )}
                          </td>

                          {/* REASON */}

                          <td>

                            <span className="reason-text">

                              {appointment.reason ||
                                appointment.description ||
                                "N/A"}

                            </span>

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`status-badge ${getStatusClass(
                                appointment.status
                              )}`}
                            >
                              {appointment.status ||
                                "SCHEDULED"}
                            </span>

                          </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="action-buttons">

                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(
                                  appointment
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  appointment.appointmentId
                                )
                              }
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

        )}

      </div>

    </div>
  );
}

export default Appointments;