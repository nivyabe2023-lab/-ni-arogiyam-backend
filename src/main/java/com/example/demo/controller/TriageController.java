package com.example.demo.controller;

import com.example.demo.entity.PatientVisit;
import com.example.demo.entity.TriageResult;
import com.example.demo.service.TriageService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/triage")
public class TriageController {

    private final TriageService triageService;

    public TriageController(TriageService triageService) {
        this.triageService = triageService;
    }

    // =========================================================
    // ANALYZE PATIENT SYMPTOMS
    // =========================================================

    @PostMapping
    public ResponseEntity<TriageResult> analyzeSymptoms(
            @RequestBody PatientVisit visit) {

        TriageResult result =
                triageService.analyzeSymptoms(visit);

        return ResponseEntity.ok(result);
    }

    // =========================================================
    // GET TRIAGE RESULT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<TriageResult> getTriageResult(
            @PathVariable Long id) {

        TriageResult result =
                triageService.getTriageResultById(id);

        if (result == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(result);
    }
}