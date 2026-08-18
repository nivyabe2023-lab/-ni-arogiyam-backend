package com.example.demo.controller;

import com.example.demo.entity.Doctor;
import com.example.demo.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // =========================================================
    // ADD DOCTOR
    // =========================================================

    @PostMapping
    public ResponseEntity<Doctor> addDoctor(
            @RequestBody Doctor doctor) {

        Doctor savedDoctor =
                doctorService.addDoctor(doctor);

        return ResponseEntity.ok(savedDoctor);
    }

    // =========================================================
    // GET ALL DOCTORS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {

        return ResponseEntity.ok(
                doctorService.getAllDoctors()
        );
    }

    // =========================================================
    // GET DOCTOR BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(
            @PathVariable Long id) {

        return doctorService
                .getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // UPDATE DOCTOR
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor doctorDetails) {

        try {

            Doctor updatedDoctor =
                    doctorService.updateDoctor(
                            id,
                            doctorDetails
                    );

            return ResponseEntity.ok(updatedDoctor);

        } catch (RuntimeException exception) {

            return ResponseEntity.notFound().build();
        }
    }

    // =========================================================
    // DELETE DOCTOR
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(
            @PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return ResponseEntity.noContent().build();
    }
}