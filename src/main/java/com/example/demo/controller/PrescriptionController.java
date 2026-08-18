package com.example.demo.controller;

import com.example.demo.dto.PrescriptionResponse;
import com.example.demo.entity.Prescription;
import com.example.demo.service.PrescriptionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(
            PrescriptionService prescriptionService) {

        this.prescriptionService = prescriptionService;
    }

    // =========================================================
    // CREATE PRESCRIPTION
    // =========================================================

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(
            @RequestBody Prescription prescription) {

        Prescription savedPrescription =
                prescriptionService.createPrescription(
                        prescription
                );

        return ResponseEntity.ok(savedPrescription);
    }

    // =========================================================
    // GET ALL PRESCRIPTIONS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<PrescriptionResponse>>
    getAllPrescriptions() {

        List<PrescriptionResponse> response =
                prescriptionService
                        .getAllPrescriptions()
                        .stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET PRESCRIPTION BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponse>
    getPrescriptionById(
            @PathVariable Long id) {

        return prescriptionService
                .getPrescriptionById(id)
                .map(this::convertToResponse)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // UPDATE PRESCRIPTION
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Prescription>
    updatePrescription(
            @PathVariable Long id,
            @RequestBody Prescription prescription) {

        Prescription updatedPrescription =
                prescriptionService.updatePrescription(
                        id,
                        prescription
                );

        if (updatedPrescription == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                updatedPrescription
        );
    }

    // =========================================================
    // DELETE PRESCRIPTION
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(
            @PathVariable Long id) {

        prescriptionService.deletePrescription(id);

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // ENTITY → DTO
    // =========================================================

    private PrescriptionResponse convertToResponse(
            Prescription prescription) {

        PrescriptionResponse response =
                new PrescriptionResponse();

        // -----------------------------------------------------
        // PRESCRIPTION
        // -----------------------------------------------------

        response.setPrescriptionId(
                prescription.getPrescriptionId()
        );

        // -----------------------------------------------------
        // PATIENT
        // -----------------------------------------------------

        if (prescription.getPatient() != null) {

            response.setPatientId(
                    prescription
                            .getPatient()
                            .getPatientId()
            );

            response.setPatientName(
                    prescription
                            .getPatient()
                            .getFirstName()
                    + " "
                    + prescription
                            .getPatient()
                            .getLastName()
            );
        }

        // -----------------------------------------------------
        // DOCTOR
        // -----------------------------------------------------

        if (prescription.getDoctor() != null) {

            response.setDoctorId(
                    prescription
                            .getDoctor()
                            .getDoctorId()
            );

            response.setDoctorName(
                    prescription
                            .getDoctor()
                            .getFirstName()
                    + " "
                    + prescription
                            .getDoctor()
                            .getLastName()
            );
        }

        // -----------------------------------------------------
        // MEDICINE
        // -----------------------------------------------------

        if (prescription.getMedicine() != null) {

            response.setMedicineId(
                    prescription
                            .getMedicine()
                            .getMedicineId()
            );

            response.setMedicineName(
                    prescription
                            .getMedicine()
                            .getMedicineName()
            );
        }

        // -----------------------------------------------------
        // PRESCRIPTION DETAILS
        // -----------------------------------------------------

        response.setDosage(
                prescription.getDosage()
        );

        response.setFrequency(
                prescription.getFrequency()
        );

        response.setDurationDays(
                prescription.getDurationDays()
        );

        response.setInstructions(
                prescription.getInstructions()
        );

        return response;
    }
}