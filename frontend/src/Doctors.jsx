import { useEffect, useState } from "react";
import "./Doctors.css";
import API_BASE_URL from "./config";

// =========================================================
// API URL
// =========================================================

const API_URL = `${API_BASE_URL}/api/doctors`;

function Doctors() {

  // =========================================================
  // STATE
  // =========================================================

  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [showView, setShowView] = useState(false);

  const [editingDoctor, setEditingDoctor] = useState(null);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  // =========================================================
  // EMPTY FORM
  // =========================================================

  const emptyForm = {
    firstName: "",
    lastName: "",
    specialization: "",
    phoneNumber: "",
    email: "",
    experience: "",
    availability: "",
  };

  const [formData, setFormData] = useState({
    ...emptyForm,
  });

  // =========================================================
  // LOAD DOCTORS
  // =========================================================

  const loadDoctors = async () => {

    setLoading(true);
    setError("");

    try {

      console.log("Loading doctors from:", API_URL);

      const response = await fetch(API_URL);

      if (!response.ok) {

        const text = await response.text();

        console.error(
          "Doctor API error:",
          response.status,
          text
        );

        throw new Error(
          `Failed to fetch doctors (${response.status})`
        );
      }

      const data = await response.json();

      console.log("Doctors received:", data);

      if (Array.isArray(data)) {

        setDoctors(data);

      } else {

        setDoctors([]);

      }

    } catch (error) {

      console.error(
        "Load doctors error:",
        error
      );

      setError(
        "Unable to load doctors. Please make sure Spring Boot and Cloudflare Tunnel are running."
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadDoctors();

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
  // OPEN ADD FORM
  // =========================================================

  const openAddForm = () => {

    setEditingDoctor(null);

    setSelectedDoctor(null);

    setFormData({
      ...emptyForm,
    });

    setShowForm(true);

    setShowView(false);

    setError("");

    setSuccessMessage("");

  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const openEditForm = (doctor) => {

    setEditingDoctor(doctor);

    setSelectedDoctor(null);

    setFormData({

      firstName:
        doctor.firstName ?? "",

      lastName:
        doctor.lastName ?? "",

      specialization:
        doctor.specialization ?? "",

      phoneNumber:
        doctor.phoneNumber ?? "",

      email:
        doctor.email ?? "",

      experience:
        doctor.experience ?? "",

      availability:
        doctor.availability ?? "",

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

    setShowForm(false);

    setEditingDoctor(null);

    setFormData({
      ...emptyForm,
    });

  };

  // =========================================================
  // ADD / UPDATE DOCTOR
  // =========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setSuccessMessage("");

    // =======================================================
    // VALIDATION
    // =======================================================

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.specialization.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.email.trim() ||
      formData.experience === "" ||
      !formData.availability
    ) {

      setError(
        "Please fill in all required fields."
      );

      return;
    }

    // =======================================================
    // PHONE VALIDATION
    // =======================================================

    if (
      !/^\d{10}$/.test(
        formData.phoneNumber.trim()
      )
    ) {

      setError(
        "Phone number must contain exactly 10 digits."
      );

      return;
    }

    // =======================================================
    // EMAIL VALIDATION
    // =======================================================

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }

    // =======================================================
    // EXPERIENCE VALIDATION
    // =======================================================

    const experienceNumber =
      Number(formData.experience);

    if (
      Number.isNaN(experienceNumber) ||
      experienceNumber < 0 ||
      experienceNumber > 60
    ) {

      setError(
        "Experience must be between 0 and 60 years."
      );

      return;
    }

    // =======================================================
    // DOCTOR DATA
    // =======================================================

    const doctorData = {

      firstName:
        formData.firstName.trim(),

      lastName:
        formData.lastName.trim(),

      specialization:
        formData.specialization.trim(),

      phoneNumber:
        formData.phoneNumber.trim(),

      email:
        formData.email.trim(),

      experience:
        experienceNumber,

      availability:
        formData.availability,

    };

    // =======================================================
    // URL
    // =======================================================

    const url = editingDoctor
      ? `${API_URL}/${editingDoctor.doctorId}`
      : API_URL;

    const method = editingDoctor
      ? "PUT"
      : "POST";

    console.log(
      "Saving doctor:",
      url,
      doctorData
    );

    setSaving(true);

    try {

      const response = await fetch(url, {

        method: method,

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },

        body: JSON.stringify(
          doctorData
        ),

      });

      // =====================================================
      // SERVER ERROR
      // =====================================================

      if (!response.ok) {

        let message = "";

        try {

          message =
            await response.text();

        } catch {

          message = "";

        }

        console.error(
          "Save doctor response:",
          response.status,
          message
        );

        throw new Error(
          message ||
          (
            editingDoctor
              ? "Failed to update doctor."
              : "Failed to add doctor."
          )
        );

      }

      // =====================================================
      // SUCCESS RESPONSE
      // =====================================================

      let savedDoctor = null;

      try {

        const responseText =
          await response.text();

        if (responseText) {

          savedDoctor =
            JSON.parse(
              responseText
            );

        }

      } catch {

        savedDoctor = null;

      }

      console.log(
        "Doctor saved:",
        savedDoctor
      );

      if (editingDoctor) {

        setSuccessMessage(
          "Doctor updated successfully!"
        );

      } else {

        setSuccessMessage(
          "Doctor added successfully!"
        );

      }

      closeForm();

      await loadDoctors();

    } catch (error) {

      console.error(
        "Save doctor error:",
        error
      );

      setError(
        error.message ||
        "Unable to save doctor."
      );

    } finally {

      setSaving(false);

    }

  };

  // =========================================================
  // VIEW DOCTOR
  // =========================================================

  const openViewDoctor = (doctor) => {

    setSelectedDoctor(doctor);

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

    setSelectedDoctor(null);

  };

  // =========================================================
  // DELETE DOCTOR
  // =========================================================

  const handleDelete = async (doctorId) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this doctor?"
      );

    if (!confirmDelete) {

      return;

    }

    setError("");

    setSuccessMessage("");

    setDeletingId(doctorId);

    try {

      const deleteUrl =
        `${API_URL}/${doctorId}`;

      console.log(
        "Deleting doctor:",
        deleteUrl
      );

      const response =
        await fetch(
          deleteUrl,
          {
            method: "DELETE",

            headers: {
              "Accept": "application/json",
            },
          }
        );

      if (!response.ok) {

        let message = "";

        try {

          message =
            await response.text();

        } catch {

          message = "";

        }

        console.error(
          "Delete doctor response:",
          response.status,
          message
        );

        throw new Error(
          message ||
          "Unable to delete doctor."
        );

      }

      // =====================================================
      // REMOVE FROM UI
      // =====================================================

      setDoctors(
        (currentDoctors) =>
          currentDoctors.filter(
            (doctor) =>
              Number(
                doctor.doctorId
              ) !== Number(doctorId)
          )
      );

      setSuccessMessage(
        "Doctor deleted successfully!"
      );

    } catch (error) {

      console.error(
        "Delete doctor error:",
        error
      );

      setError(
        error.message ||
        "Unable to delete doctor."
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

  const filteredDoctors =
    doctors.filter((doctor) => {

      const fullName =
        `${doctor.firstName ?? ""} ${
          doctor.lastName ?? ""
        }`
          .trim()
          .toLowerCase();

      const specialization =
        String(
          doctor.specialization ?? ""
        ).toLowerCase();

      const phoneNumber =
        String(
          doctor.phoneNumber ?? ""
        ).toLowerCase();

      const email =
        String(
          doctor.email ?? ""
        ).toLowerCase();

      const availability =
        String(
          doctor.availability ?? ""
        ).toLowerCase();

      const experience =
        String(
          doctor.experience ?? ""
        ).toLowerCase();

      const doctorId =
        String(
          doctor.doctorId ?? ""
        ).toLowerCase();

      return (

        fullName.includes(
          searchValue
        ) ||

        specialization.includes(
          searchValue
        ) ||

        phoneNumber.includes(
          searchValue
        ) ||

        email.includes(
          searchValue
        ) ||

        availability.includes(
          searchValue
        ) ||

        experience.includes(
          searchValue
        ) ||

        doctorId.includes(
          searchValue
        )

      );

    });

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const clearSearch = () => {

    setSearch("");

  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {

    return (

      <div className="doctors-page">

        <div className="patients-header">

          <div>

            <h1>
              Doctors
            </h1>

            <p>
              Manage registered doctors
            </p>

          </div>

        </div>

        <div className="status-message">

          <div className="loading-spinner"></div>

          <h2>
            Loading doctors...
          </h2>

          <p>
            Connecting to hospital management system
          </p>

        </div>

      </div>

    );

  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <div className="doctors-page">

      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="patients-header">

        <div>

          <h1>
            Doctors
          </h1>

          <p>
            Manage registered doctors
          </p>

        </div>

        <button
          className="add-patient-button"
          onClick={openAddForm}
        >
          + Add Doctor
        </button>

      </div>


      {/* ===================================================
          SUCCESS MESSAGE
      ==================================================== */}

      {successMessage && (

        <div className="success-message">

          <span>
            ✓
          </span>

          {successMessage}

        </div>

      )}


      {/* ===================================================
          ERROR MESSAGE
      ==================================================== */}

      {error && (

        <div className="error-message">

          <span>
            !
          </span>

          {error}

        </div>

      )}


      {/* ===================================================
          SEARCH
      ==================================================== */}

      {!showForm && !showView && (

        <div className="patient-search">

          <div className="doctor-search-wrapper">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search by name, specialization, phone, email, ID..."
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
                onClick={clearSearch}
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
                  {filteredDoctors.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {doctors.length}
                </strong>{" "}
                doctors

              </span>

            ) : (

              <span>

                Total doctors:{" "}
                <strong>
                  {doctors.length}
                </strong>

              </span>

            )}

          </div>

        </div>

      )}


      {/* ===================================================
          ADD / EDIT FORM
      ==================================================== */}

      {showForm && (

        <div className="patient-form-card">

          <div className="form-header">

            <div>

              <h2>

                {editingDoctor
                  ? "Edit Doctor"
                  : "Add New Doctor"}

              </h2>

              <p>

                {editingDoctor
                  ? "Update doctor information"
                  : "Enter doctor information"}

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

              {/* FIRST NAME */}

              <div className="form-group">

                <label>
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={
                    formData.firstName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter first name"
                  required
                />

              </div>


              {/* LAST NAME */}

              <div className="form-group">

                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={
                    formData.lastName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter last name"
                  required
                />

              </div>


              {/* SPECIALIZATION */}

              <div className="form-group">

                <label>
                  Specialization
                </label>

                <input
                  type="text"
                  name="specialization"
                  value={
                    formData.specialization
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Cardiology"
                  required
                />

              </div>


              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phoneNumber"
                  value={
                    formData.phoneNumber
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter 10 digit phone number"
                  maxLength="10"
                  inputMode="numeric"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter email address"
                  required
                />

              </div>


              {/* EXPERIENCE */}

              <div className="form-group">

                <label>
                  Experience (Years)
                </label>

                <input
                  type="number"
                  name="experience"
                  value={
                    formData.experience
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter experience"
                  min="0"
                  max="60"
                  required
                />

              </div>


              {/* AVAILABILITY */}

              <div className="form-group">

                <label>
                  Availability
                </label>

                <select
                  name="availability"
                  value={
                    formData.availability
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select availability
                  </option>

                  <option value="Available">
                    Available
                  </option>

                  <option value="Busy">
                    Busy
                  </option>

                  <option value="On Leave">
                    On Leave
                  </option>

                </select>

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
                  : editingDoctor
                    ? "Update Doctor"
                    : "Save Doctor"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* ===================================================
          VIEW DOCTOR
      ==================================================== */}

      {showView &&
        selectedDoctor && (

          <div className="patient-form-card">

            <div className="form-header">

              <div>

                <h2>
                  Doctor Details
                </h2>

                <p>
                  Complete doctor information
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

                <span>
                  Doctor ID
                </span>

                <strong>
                  {selectedDoctor.doctorId}
                </strong>

              </div>


              <div>

                <span>
                  First Name
                </span>

                <strong>
                  {selectedDoctor.firstName ||
                    "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Last Name
                </span>

                <strong>
                  {selectedDoctor.lastName ||
                    "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Specialization
                </span>

                <strong>
                  {selectedDoctor.specialization ||
                    "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Phone Number
                </span>

                <strong>
                  {selectedDoctor.phoneNumber ||
                    "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Email
                </span>

                <strong>
                  {selectedDoctor.email ||
                    "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Experience
                </span>

                <strong>
                  {selectedDoctor.experience ??
                    0}{" "}
                  years
                </strong>

              </div>


              <div>

                <span>
                  Availability
                </span>

                <strong>
                  {selectedDoctor.availability ||
                    "N/A"}
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

                  const doctor =
                    selectedDoctor;

                  closeView();

                  openEditForm(
                    doctor
                  );

                }}
              >
                Edit Doctor
              </button>

            </div>

          </div>

        )}


      {/* ===================================================
          DOCTOR TABLE
      ==================================================== */}

      {!showForm && !showView && (

        <div className="patients-table-container">

          <table className="patients-table">

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Doctor Name
                </th>

                <th>
                  Specialization
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Email
                </th>

                <th>
                  Experience
                </th>

                <th>
                  Availability
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredDoctors.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="empty-table-message"
                  >

                    {search ? (

                      <>

                        <strong>
                          No doctors found
                        </strong>

                        <br />

                        <span>
                          Try another search term.
                        </span>

                      </>

                    ) : (

                      <>

                        <strong>
                          No doctors registered
                        </strong>

                        <br />

                        <span>
                          Click "+ Add Doctor" to register a doctor.
                        </span>

                      </>

                    )}

                  </td>

                </tr>

              ) : (

                filteredDoctors.map(
                  (doctor) => (

                    <tr
                      key={
                        doctor.doctorId
                      }
                    >

                      <td>
                        {doctor.doctorId}
                      </td>


                      <td>

                        <strong>

                          {doctor.firstName}{" "}

                          {doctor.lastName}

                        </strong>

                      </td>


                      <td>
                        {doctor.specialization ||
                          "N/A"}
                      </td>


                      <td>
                        {doctor.phoneNumber ||
                          "N/A"}
                      </td>


                      <td>
                        {doctor.email ||
                          "N/A"}
                      </td>


                      <td>

                        {doctor.experience ??
                          0}{" "}
                        years

                      </td>


                      <td>

                        <span
                          className={`doctor-status ${
                            (
                              doctor.availability ||
                              ""
                            )
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`}
                        >

                          {doctor.availability ||
                            "N/A"}

                        </span>

                      </td>


                      <td className="action-buttons">

                        <button
                          type="button"
                          className="view-button"
                          onClick={() =>
                            openViewDoctor(
                              doctor
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
                              doctor
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
                            doctor.doctorId
                          }
                          onClick={() =>
                            handleDelete(
                              doctor.doctorId
                            )
                          }
                        >

                          {deletingId ===
                          doctor.doctorId
                            ? "Deleting..."
                            : "Delete"}

                        </button>

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

  );

}

export default Doctors;