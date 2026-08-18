package com.example.demo.controller;

import com.example.demo.entity.Laboratory;
import com.example.demo.service.LaboratoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laboratory")
public class LaboratoryController {

    private final LaboratoryService laboratoryService;

    public LaboratoryController(
            LaboratoryService laboratoryService) {

        this.laboratoryService = laboratoryService;
    }

    // =========================================================
    // CREATE LABORATORY RECORD
    // =========================================================

    @PostMapping
    public ResponseEntity<Laboratory> createLaboratory(
            @RequestBody Laboratory laboratory) {

        Laboratory savedLaboratory =
                laboratoryService.createLaboratory(laboratory);

        return ResponseEntity.ok(savedLaboratory);
    }

    // =========================================================
    // GET ALL LABORATORY RECORDS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Laboratory>>
    getAllLaboratories() {

        return ResponseEntity.ok(
                laboratoryService.getAllLaboratories()
        );
    }

    // =========================================================
    // GET LABORATORY RECORD BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Laboratory>
    getLaboratoryById(@PathVariable Long id) {

        return laboratoryService
                .getLaboratoryById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // UPDATE LABORATORY RECORD
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Laboratory>
    updateLaboratory(
            @PathVariable Long id,
            @RequestBody Laboratory laboratory) {

        Laboratory updatedLaboratory =
                laboratoryService.updateLaboratory(
                        id,
                        laboratory
                );

        if (updatedLaboratory == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedLaboratory);
    }

    // =========================================================
    // DELETE LABORATORY RECORD
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteLaboratory(@PathVariable Long id) {

        laboratoryService.deleteLaboratory(id);

        return ResponseEntity.noContent().build();
    }
}