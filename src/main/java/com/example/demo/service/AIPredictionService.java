package com.example.demo.service;

import com.example.demo.dto.AIPredictionRequest;
import com.example.demo.dto.AIPredictionResponse;
import org.springframework.stereotype.Service;

@Service
public class AIPredictionService {

    public AIPredictionResponse predict(AIPredictionRequest request) {

        int riskScore = 0;

        String prediction;
        String riskLevel;
        String recommendation;

        // ==============================
        // TEMPERATURE CHECK
        // ==============================

        if (request.getTemperature() != null) {

            if (request.getTemperature() >= 39.0) {
                riskScore += 3;
            } else if (request.getTemperature() >= 38.0) {
                riskScore += 2;
            } else if (request.getTemperature() >= 37.5) {
                riskScore += 1;
            }
        }

        // ==============================
        // HEART RATE CHECK
        // ==============================

        if (request.getHeartRate() != null) {

            if (request.getHeartRate() > 120) {
                riskScore += 3;
            } else if (request.getHeartRate() > 100) {
                riskScore += 2;
            } else if (request.getHeartRate() > 90) {
                riskScore += 1;
            }
        }

        // ==============================
        // OXYGEN LEVEL CHECK
        // ==============================

        if (request.getOxygenLevel() != null) {

            if (request.getOxygenLevel() < 90) {
                riskScore += 4;
            } else if (request.getOxygenLevel() < 94) {
                riskScore += 3;
            } else if (request.getOxygenLevel() < 96) {
                riskScore += 1;
            }
        }

        // ==============================
        // SYMPTOMS CHECK
        // ==============================

        if (request.getSymptoms() != null
                && !request.getSymptoms().trim().isEmpty()) {

            String symptoms =
                    request.getSymptoms().toLowerCase();

            if (symptoms.contains("chest pain")) {
                riskScore += 3;
            }

            if (symptoms.contains("breathing")
                    || symptoms.contains("shortness of breath")) {
                riskScore += 3;
            }

            if (symptoms.contains("fever")) {
                riskScore += 2;
            }

            if (symptoms.contains("cough")) {
                riskScore += 1;
            }

            if (symptoms.contains("headache")) {
                riskScore += 1;
            }

            if (symptoms.contains("vomiting")) {
                riskScore += 1;
            }
        }

        // ==============================
        // DETERMINE RISK
        // ==============================

        if (riskScore >= 7) {

            prediction = "High Risk Condition";

            riskLevel = "High";

            recommendation =
                    "Immediate medical evaluation is recommended.";

        } else if (riskScore >= 4) {

            prediction =
                    "Possible Infection or Health Risk";

            riskLevel = "Moderate";

            recommendation =
                    "Consult a physician and monitor the patient's vital signs.";

        } else if (riskScore >= 2) {

            prediction =
                    "Mild Health Risk";

            riskLevel = "Low";

            recommendation =
                    "Monitor symptoms and consider medical consultation if symptoms persist.";

        } else {

            prediction =
                    "No Significant Risk Detected";

            riskLevel = "Low";

            recommendation =
                    "Continue routine monitoring and healthy practices.";
        }

        // ==============================
        // DEMO CONFIDENCE
        // ==============================

        double confidence;

        if (riskScore >= 7) {

            confidence = 90.0;

        } else if (riskScore >= 4) {

            confidence = 85.0;

        } else if (riskScore >= 2) {

            confidence = 78.0;

        } else {

            confidence = 92.0;
        }

        // ==============================
        // RETURN RESULT
        // ==============================
        // 
        return new AIPredictionResponse(
                prediction,
                riskLevel,
                confidence,
                recommendation
        );
    }
}