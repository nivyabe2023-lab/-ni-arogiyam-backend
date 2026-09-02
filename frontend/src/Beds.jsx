import { useEffect, useState } from "react";
import "./Beds.css";
import API_BASE_URL from "./config";

const API_URL = API_BASE_URL;

function Beds() {

  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    bedNumber: "",
    ward: "",
    bedType: "",
    status: "AVAILABLE",
    patientId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBeds();
    loadPatients();
  }, []);

  const loadBeds = async () => {

    try {

      const response = await fetch(
        `${API_URL}/api/beds`
      );

      if (!response.ok) {
        throw new Error("Failed to load beds");
      }

      const data = await response.json();

      setBeds(data);

    } catch (error) {

      console.error(error);

      setError("Unable to load beds.");

    }
  };

  const loadPatients = async () => {

    try {

      const response = await fetch(
        `${API_URL}/api/patients`
      );

      if (!response.ok) {
        throw new Error("Failed to load patients");
      }

      const data = await response.json();

      setPatients(data);

    } catch (error) {

      console.error(error);

    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const url = editingId
        ? `${API_URL}/api/beds/${editingId}`
        : `${API_URL}/api/beds`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save bed");
      }

      await loadBeds();

      setEditingId(null);

      setFormData({
        bedNumber: "",
        ward: "",
        bedType: "",
        status: "AVAILABLE",
        patientId: "",
      });

    } catch (error) {

      console.error(error);

      setError("Unable to save bed.");

    } finally {

      setLoading(false);

    }
  };

  const handleEdit = (bed) => {

    setEditingId(bed.bedId);

    setFormData({
      bedNumber: bed.bedNumber || "",
      ward: bed.ward || "",
      bedType: bed.bedType || "",
      status: bed.status || "AVAILABLE",
      patientId: bed.patientId || "",
    });
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this bed?")) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/api/beds/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete bed");
      }

      await loadBeds();

    } catch (error) {

      console.error(error);

      setError("Unable to delete bed.");

    }
  };

  return (
    <div className="beds-page">

      <div className="page-header">

        <div>
          <h1>Bed Management</h1>

          <p>
            Manage hospital beds, wards and patient allocation
          </p>
        </div>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="bed-form-card">

        <h2>
          {editingId
            ? "Update Bed"
            : "Add New Bed"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">

              <label>Bed Number</label>

              <input
                type="text"
                name="bedNumber"
                value={formData.bedNumber}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Ward</label>

              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Bed Type</label>

              <select
                name="bedType"
                value={formData.bedType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Type
                </option>

                <option value="GENERAL">
                  General
                </option>

                <option value="ICU">
                  ICU
                </option>

                <option value="PRIVATE">
                  Private
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="AVAILABLE">
                  Available
                </option>

                <option value="OCCUPIED">
                  Occupied
                </option>

                <option value="MAINTENANCE">
                  Maintenance
                </option>

              </select>

            </div>

          </div>

          <div className="form-actions">

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Bed"
                : "Add Bed"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);

                  setFormData({
                    bedNumber: "",
                    ward: "",
                    bedType: "",
                    status: "AVAILABLE",
                    patientId: "",
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

        <h2>Hospital Beds</h2>

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Bed Number</th>
                <th>Ward</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {beds.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    style={{ textAlign: "center" }}
                  >
                    No beds found
                  </td>

                </tr>

              ) : (

                beds.map((bed) => (

                  <tr key={bed.bedId}>

                    <td>
                      {bed.bedId}
                    </td>

                    <td>
                      {bed.bedNumber}
                    </td>

                    <td>
                      {bed.ward}
                    </td>

                    <td>
                      {bed.bedType}
                    </td>

                    <td>
                      {bed.status}
                    </td>

                    <td>

                      <button
                        onClick={() =>
                          handleEdit(bed)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(bed.bedId)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Beds;