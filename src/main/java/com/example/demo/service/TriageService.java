package com.example.demo.service;

import com.example.demo.entity.PatientVisit;
import com.example.demo.entity.TriageResult;
import com.example.demo.repository.TriageRepository;
import org.springframework.stereotype.Service;

@Service
public class TriageService {

    private final TriageRepository triageRepository;

    public TriageService(TriageRepository triageRepository) {
        this.triageRepository = triageRepository;
    }

    public TriageResult analyzeSymptoms(PatientVisit visit) {

        String symptoms = visit.getSymptoms().toLowerCase();

        String emergencyLevel;
        String department;
        String recommendation;

        // High-priority symptoms
        if (symptoms.contains("chest pain")
                || symptoms.contains("difficulty breathing")
                || symptoms.contains("unconscious")
                || symptoms.contains("severe bleeding")) {

            emergencyLevel = "HIGH";
            department = "EMERGENCY";
            recommendation = "Immediate medical evaluation required.";

        // Medium-priority symptoms
        } else if (symptoms.contains("high fever")
                || symptoms.contains("vomiting")
                || symptoms.contains("severe headache")
                || symptoms.contains("abdominal pain")) {

            emergencyLevel = "MEDIUM";
            department = "GENERAL MEDICINE";
            recommendation = "Medical evaluation should be done soon.";

        // Low-priority symptoms
        } else {

            emergencyLevel = "LOW";
            department = "GENERAL MEDICINE";
            recommendation = "Routine medical consultation recommended.";
        }
        visit.setEmergencyLevel(emergencyLevel);
        TriageResult result = new TriageResult();

        result.setVisit(visit);
        result.setEmergencyLevel(emergencyLevel);
        result.setRecommendedDepartment(department);
        result.setRecommendation(recommendation);

        return triageRepository.save(result);
    }

    public TriageResult getTriageResultById(Long id) {

        return triageRepository.findById(id)
                .orElse(null);
    }
}