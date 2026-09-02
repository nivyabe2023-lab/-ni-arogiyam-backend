import { useEffect, useState } from "react";
import "./AIPrediction.css";
import API_BASE_URL from "./config";

const API_URL = API_BASE_URL;

function AIPrediction() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [oxygenLevel, setOxygenLevel] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/patients`);

      if (!response.ok) {
        throw new Error("Failed to load patients");
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load patients.");
    }
  };

  const handlePrediction = async (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      setError("Please select a patient.");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const response = await fetch(
        `${API_URL}/api/ai-prediction/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: Number(selectedPatient),
            oxygenLevel: Number(oxygenLevel),
            heartRate: Number(heartRate),
            temperature: Number(temperature),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();

      setPrediction(data);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to get AI prediction. Please check the Spring Boot server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-prediction-page">

      <div className="page-header">
        <div>
          <h1>AI Prediction</h1>
          <p>AI-based patient risk prediction and clinical support</p>
        </div>
      </div>

      <div className="ai-prediction-container">

        <div className="prediction-card">

          <h2>Patient Risk Assessment</h2>

          <form onSubmit={handlePrediction}>

            <div className="form-group">
              <label>Patient</label>

              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Select Patient</option>

                {patients.map((patient) => (
                  <option
                    key={patient.patientId}
                    value={patient.patientId}
                  >
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Oxygen Level (%)</label>

              <input
                type="number"
                value={oxygenLevel}
                onChange={(e) => setOxygenLevel(e.target.value)}
                placeholder="Example: 98"
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Heart Rate (BPM)</label>

              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="Example: 80"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Temperature (°C)</label>

              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="Example: 37.0"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="predict-btn"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Generate AI Prediction"}
            </button>

          </form>
        </div>

        {prediction && (
          <div className="prediction-result">

            <h2>ClearRun AI Prediction</h2>

            <div className="result-box">

              <div className="result-item">
                <span>Risk Level</span>
                <strong>
                  {prediction.riskLevel || "N/A"}
                </strong>
              </div>

              <div className="result-item">
                <span>Confidence</span>
                <strong>
                  {prediction.confidence
                    ? `${prediction.confidence}%`
                    : "N/A"}
                </strong>
              </div>

              <div className="recommendation">
                <h3>Recommendation</h3>

                <p>
                  {prediction.recommendation ||
                    "Consult a physician and monitor the patient's vital signs."}
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default AIPrediction;