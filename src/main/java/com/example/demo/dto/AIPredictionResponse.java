package com.example.demo.dto;

public class AIPredictionResponse {

    private String prediction;
    private String riskLevel;
    private Double confidence;
    private String recommendation;

    public AIPredictionResponse() {
    }

    public AIPredictionResponse(
            String prediction,
            String riskLevel,
            Double confidence,
            String recommendation) {

        this.prediction = prediction;
        this.riskLevel = riskLevel;
        this.confidence = confidence;
        this.recommendation = recommendation;
    }

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}