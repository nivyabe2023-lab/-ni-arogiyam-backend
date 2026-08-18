package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "triage_results")
public class TriageResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long triageId;

    @OneToOne
    @JoinColumn(name = "visit_id", nullable = false)
    private PatientVisit visit;

    private String emergencyLevel;

    private String recommendedDepartment;

    private String recommendation;

    public TriageResult() {
    }

    public Long getTriageId() {
        return triageId;
    }

    public void setTriageId(Long triageId) {
        this.triageId = triageId;
    }

    public PatientVisit getVisit() {
        return visit;
    }

    public void setVisit(PatientVisit visit) {
        this.visit = visit;
    }

    public String getEmergencyLevel() {
        return emergencyLevel;
    }

    public void setEmergencyLevel(String emergencyLevel) {
        this.emergencyLevel = emergencyLevel;
    }

    public String getRecommendedDepartment() {
        return recommendedDepartment;
    }

    public void setRecommendedDepartment(String recommendedDepartment) {
        this.recommendedDepartment = recommendedDepartment;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}