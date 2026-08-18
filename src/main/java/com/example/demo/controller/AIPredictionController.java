package com.example.demo.controller;

import com.example.demo.dto.AIPredictionRequest;
import com.example.demo.dto.AIPredictionResponse;
import com.example.demo.service.AIPredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-prediction")
public class AIPredictionController {

    private final AIPredictionService aiPredictionService;

    public AIPredictionController(
            AIPredictionService aiPredictionService) {

        this.aiPredictionService = aiPredictionService;
    }

    // =========================================================
    // AI PREDICTION
    // POST /api/ai-prediction/predict
    // =========================================================

    @PostMapping("/predict")
    public ResponseEntity<AIPredictionResponse> predict(
            @RequestBody AIPredictionRequest request) {

        AIPredictionResponse response =
                aiPredictionService.predict(request);

        return ResponseEntity.ok(response);
    }
}