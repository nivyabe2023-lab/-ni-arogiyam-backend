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

      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading appointments:", error);

      setError(
        "Unable to load appointments. Please check whether Spring Boot is running."
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
      const response = await fetch(
        `${API_URL}/api/patients`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load patients (${response.status})`
        );
      }

      const data = await response.json();

      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading patients:", error);

      setError(
        "Unable to load patients."
      );
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

      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading doctors:", error);

      setError(
        "Unable to load doctors."
      );
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
  // FILTER APPOINTMENTS
  // =========================================================

  const filteredAppointments =
    appointments.filter((appointment) => {
      const search =
        searchTerm.toLowerCase().trim();

      if (!search) {
        return true;
      }

      const patientName = getPatientName(
        appointment
      ).toLowerCase();

      const doctorName = getDoctorName(
        appointment
      ).toLowerCase();

      const reason = String(
        appointment.reason ||
          appointment.description ||
          ""
      ).toLowerCase();

      const status = String(
        appointment.status || ""
      ).toLowerCase();

      return (
        patientName.includes(search) ||
        doctorName.includes(search) ||
        reason.includes(search) ||
        status.includes(search)
      );
    });

  // =========================================================
  // GET PATIENT NAME
  // =========================================================

  const getPatientName = (appointment) => {
    // Direct nested patient object
    if (appointment.patient) {
      return `${appointment.patient.firstName || ""} ${
        appointment.patient.lastName || ""
      }`.trim();
    }

    // Direct patient name fields
    if (
      appointment.patientFirstName ||
      appointment.patientLastName
    ) {
      return `${appointment.patientFirstName || ""} ${
        appointment.patientLastName || ""
      }`.trim();
    }

    // Search patient from patients list
    const patient = patients.find(
      (item) =>
        Number(item.patientId) ===
        Number(appointment.patientId)
    );

    if (patient) {
      return `${patient.firstName || ""} ${
        patient.lastName || ""
      }`.trim();
    }

    return "N/A";
  };

  // =========================================================
  // GET DOCTOR NAME
  // =========================================================

  const getDoctorName = (appointment) => {
    // Direct nested doctor object
    if (appointment.doctor) {
      return `${appointment.doctor.firstName || ""} ${
        appointment.doctor.lastName || ""
      }`.trim();
    }

    // Direct doctor name fields
    if (
      appointment.doctorFirstName ||
      appointment.doctorLastName
    ) {
      return `${appointment.doctorFirstName || ""} ${
        appointment.doctorLastName || ""
      }`.trim();
    }

    // Search doctor from doctors list
    const doctor = doctors.find(
      (item) =>
        Number(item.doctorId) ===
        Number(appointment.doctorId)
    );

    if (doctor) {
      return `${doctor.firstName || ""} ${
        doctor.lastName || ""
      }`.trim();
    }

    return "N/A";
  };

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
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time) => {
    if (!time) {
      return "N/A";
    }

    const value = String(time);

    const parts = value.split(":");

    if (parts.length < 2) {
      return value;
    }

    let hour = Number(parts[0]);
    const minute = parts[1];

    if (Number.isNaN(hour)) {
      return value;
    }

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${hour}:${minute} ${period}`;
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

          <div className="search-box">

            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

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
                          Create a new appointment
                          to see it here.
                        </p>
                      </div>
                    </td>

                  </tr>

                ) : (

                  filteredAppointments.map(
                    (appointment) => (

                      <tr
                        key={
                          appointment.appointmentId
                        }
                      >

                        {/* ID */}

                        <td>

                          <span className="appointment-id">
                            #
                            {
                              appointment.appointmentId
                            }
                          </span>

                        </td>

                        {/* PATIENT */}

                        <td>

                          <div className="person-cell">

                            <div className="person-avatar">
                              {getPatientName(
                                appointment
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <strong>
                                {getPatientName(
                                  appointment
                                )}
                              </strong>

                            </div>

                          </div>

                        </td>

                        {/* DOCTOR */}

                        <td>

                          <div className="doctor-cell">

                            <strong>
                              {getDoctorName(
                                appointment
                              ) === "N/A"
                                ? "N/A"
                                : `Dr. ${getDoctorName(
                                    appointment
                                  )}`}
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
                            appointment.appointmentTime
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

                    )
                  )

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