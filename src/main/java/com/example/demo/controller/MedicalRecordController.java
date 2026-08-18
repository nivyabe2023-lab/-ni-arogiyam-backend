package com.example.demo.controller;

import com.example.demo.entity.MedicalRecord;
import com.example.demo.service.MedicalRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(
            MedicalRecordService medicalRecordService) {

        this.medicalRecordService = medicalRecordService;
    }

    // =========================================================
    // CREATE MEDICAL RECORD
    // =========================================================

    @PostMapping
    public ResponseEntity<MedicalRecord> createRecord(
            @RequestBody MedicalRecord record) {

        MedicalRecord savedRecord =
                medicalRecordService.createRecord(record);

        return ResponseEntity.ok(savedRecord);
    }

    // =========================================================
    // GET ALL MEDICAL RECORDS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<MedicalRecord>> getAllRecords() {

        return ResponseEntity.ok(
                medicalRecordService.getAllRecords()
        );
    }

    // =========================================================
    // GET MEDICAL RECORD BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getRecordById(
            @PathVariable Long id) {

        return medicalRecordService
                .getRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // UPDATE MEDICAL RECORD
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> updateRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecord record) {

        MedicalRecord updatedRecord =
                medicalRecordService.updateRecord(
                        id,
                        record
                );

        if (updatedRecord == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedRecord);
    }

    // =========================================================
    // DELETE MEDICAL RECORD
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(
            @PathVariable Long id) {

        medicalRecordService.deleteRecord(id);

        return ResponseEntity.noContent().build();
    }
}