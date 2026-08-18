package com.example.demo.controller;

import com.example.demo.entity.PatientVisit;
import com.example.demo.service.PatientVisitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
public class PatientVisitController {

    private final PatientVisitService patientVisitService;

    public PatientVisitController(
            PatientVisitService patientVisitService) {

        this.patientVisitService = patientVisitService;
    }

    // =========================================================
    // CHECK IN PATIENT
    // =========================================================

    @PostMapping
    public ResponseEntity<PatientVisit> checkInPatient(
            @RequestBody PatientVisit visit) {

        PatientVisit savedVisit =
                patientVisitService.checkInPatient(visit);

        return ResponseEntity.ok(savedVisit);
    }

    // =========================================================
    // GET ALL VISITS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<PatientVisit>> getAllVisits() {

        return ResponseEntity.ok(
                patientVisitService.getAllVisits()
        );
    }

    // =========================================================
    // GET VISIT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<PatientVisit> getVisitById(
            @PathVariable Long id) {

        return patientVisitService
                .getVisitById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // UPDATE VISIT
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<PatientVisit> updateVisit(
            @PathVariable Long id,
            @RequestBody PatientVisit visit) {

        visit.setVisitId(id);

        PatientVisit updatedVisit =
                patientVisitService.updateVisit(visit);

        return ResponseEntity.ok(updatedVisit);
    }

    // =========================================================
    // DELETE VISIT
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(
            @PathVariable Long id) {

        patientVisitService.deleteVisit(id);

        return ResponseEntity.noContent().build();
    }
}