import { useEffect, useState } from "react";
import "./Pharmacy.css";
import API_BASE_URL from "./config";

const API_URL = `${API_BASE_URL}/api/medicines`;

function Pharmacy() {

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    medicineName: "",
    category: "",
    quantity: "",
    price: "",
    manufacturer: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================================
  // LOAD MEDICINES
  // ================================

  const loadMedicines = () => {

    fetch(API_URL)
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to load medicines");
        }

        return response.json();
      })
      .then((data) => {
        setMedicines(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to connect to Spring Boot backend");
      });
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  // ================================
  // HANDLE INPUT
  // ================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  // ================================
  // OPEN ADD FORM
  // ================================

  const openAddForm = () => {

    setEditingId(null);

    setForm({
      medicineName: "",
      category: "",
      quantity: "",
      price: "",
      manufacturer: ""
    });

    setMessage("");
    setError("");

    setShowForm(true);
  };

  // ================================
  // EDIT MEDICINE
  // ================================

  const editMedicine = (medicine) => {

    setEditingId(medicine.medicineId);

    setForm({
      medicineName: medicine.medicineName || "",
      category: medicine.category || "",
      quantity: medicine.quantity || "",
      price: medicine.price || "",
      manufacturer: medicine.manufacturer || ""
    });

    setMessage("");
    setError("");

    setShowForm(true);
  };

  // ================================
  // SAVE MEDICINE
  // ================================

  const saveMedicine = (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    const medicineData = {
      medicineName: form.medicineName,
      category: form.category,
      quantity: Number(form.quantity),
      price: Number(form.price),
      manufacturer: form.manufacturer
    };

    const url = editingId
      ? `${API_URL}/${editingId}`
      : API_URL;

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(medicineData)
    })
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to save medicine");
        }

        return response.json();
      })
      .then(() => {

        setMessage(
          editingId
            ? "Medicine updated successfully!"
            : "Medicine added successfully!"
        );

        setShowForm(false);

        setForm({
          medicineName: "",
          category: "",
          quantity: "",
          price: "",
          manufacturer: ""
        });

        setEditingId(null);

        loadMedicines();
      })
      .catch((err) => {

        console.error(err);

        setError("Unable to save medicine");
      });
  };

  // ================================
  // DELETE MEDICINE
  // ================================

  const deleteMedicine = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    })
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to delete medicine");
        }

        setMessage("Medicine deleted successfully!");

        loadMedicines();
      })
      .catch((err) => {

        console.error(err);

        setError("Unable to delete medicine");
      });
  };

  // ================================
  // SEARCH
  // ================================

  const filteredMedicines = medicines.filter((medicine) => {

    const searchText = search.toLowerCase();

    return (
      medicine.medicineName?.toLowerCase().includes(searchText) ||
      medicine.category?.toLowerCase().includes(searchText) ||
      medicine.manufacturer?.toLowerCase().includes(searchText)
    );
  });

  // ================================
  // CLOSE FORM
  // ================================

  const closeForm = () => {

    setShowForm(false);

    setEditingId(null);

    setForm({
      medicineName: "",
      category: "",
      quantity: "",
      price: "",
      manufacturer: ""
    });
  };

  // ================================
  // PAGE
  // ================================

  return (
    <div className="pharmacy-page">

      {/* HEADER */}

      <div className="pharmacy-header">

        <div>
          <h1>Pharmacy</h1>

          <p>
            Manage medicines, stock and pharmacy inventory
          </p>
        </div>

        <button
          className="add-medicine-button"
          onClick={openAddForm}
        >
          + Add Medicine
        </button>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="pharmacy-message success">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="pharmacy-message error">
          {error}
        </div>
      )}

      {/* ADD / EDIT FORM */}

      {showForm && (

        <div className="medicine-form-container">

          <div className="medicine-form-header">

            <div>

              <h2>
                {editingId
                  ? "Edit Medicine"
                  : "Add New Medicine"}
              </h2>

              <p>
                Enter medicine information
              </p>

            </div>

            <button
              className="medicine-close-btn"
              onClick={closeForm}
            >
              ×
            </button>

          </div>

          <form onSubmit={saveMedicine}>

            <div className="medicine-form-grid">

              <div className="medicine-form-group">

                <label>
                  Medicine Name
                </label>

                <input
                  type="text"
                  name="medicineName"
                  value={form.medicineName}
                  onChange={handleChange}
                  placeholder="Enter medicine name"
                  required
                />

              </div>

              <div className="medicine-form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Example: Painkiller"
                  required
                />

              </div>

              <div className="medicine-form-group">

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="0"
                  required
                />

              </div>

              <div className="medicine-form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />

              </div>

              <div className="medicine-form-group full-width">

                <label>
                  Manufacturer
                </label>

                <input
                  type="text"
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={handleChange}
                  placeholder="Enter manufacturer"
                  required
                />

              </div>

            </div>

            <div className="medicine-form-buttons">

              <button
                type="button"
                className="medicine-cancel-btn"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="medicine-save-btn"
              >
                {editingId
                  ? "Update Medicine"
                  : "Save Medicine"}
              </button>

            </div>

          </form>

        </div>

      )}

      {/* SEARCH */}

      <input
        type="text"
        className="pharmacy-search"
        placeholder="Search medicines..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}

      <div className="medicine-table-container">

        <table className="medicine-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Medicine Name</th>

              <th>Category</th>

              <th>Quantity</th>

              <th>Price</th>

              <th>Manufacturer</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredMedicines.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="medicine-empty"
                >
                  No medicines found
                </td>

              </tr>

            ) : (

              filteredMedicines.map((medicine) => {

                let quantityClass = "quantity-normal";

                if (medicine.quantity === 0) {
                  quantityClass = "quantity-out";
                } else if (medicine.quantity < 10) {
                  quantityClass = "quantity-low";
                }

                return (

                  <tr key={medicine.medicineId}>

                    <td>
                      {medicine.medicineId}
                    </td>

                    <td className="medicine-name">
                      {medicine.medicineName}
                    </td>

                    <td>
                      {medicine.category}
                    </td>

                    <td
                      className={quantityClass}
                    >
                      {medicine.quantity}
                    </td>

                    <td className="medicine-price">
                      ₹{Number(medicine.price).toFixed(2)}
                    </td>

                    <td>
                      {medicine.manufacturer}
                    </td>

                    <td>

                      {medicine.quantity === 0 ? (
                        <span className="quantity-out">
                          OUT OF STOCK
                        </span>
                      ) : medicine.quantity < 10 ? (
                        <span className="quantity-low">
                          LOW STOCK
                        </span>
                      ) : (
                        <span className="quantity-normal">
                          AVAILABLE
                        </span>
                      )}

                    </td>

                    <td>

                      <div className="medicine-actions">

                        <button
                          className="medicine-edit-btn"
                          onClick={() =>
                            editMedicine(medicine)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="medicine-delete-btn"
                          onClick={() =>
                            deleteMedicine(
                              medicine.medicineId
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

    </div>
  );
}

export default Pharmacy;