package com.example.demo.controller;

import com.example.demo.entity.Medicine;
import com.example.demo.service.MedicineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    // =========================================================
    // ADD MEDICINE
    // =========================================================

    @PostMapping
    public ResponseEntity<Medicine> createMedicine(
            @RequestBody Medicine medicine) {

        Medicine savedMedicine =
                medicineService.createMedicine(medicine);

        return ResponseEntity.ok(savedMedicine);
    }

    // =========================================================
    // GET ALL MEDICINES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {

        return ResponseEntity.ok(
                medicineService.getAllMedicines()
        );
    }

    // =========================================================
    // GET MEDICINE BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(
            @PathVariable Long id) {

        return medicineService
                .getMedicineById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // UPDATE MEDICINE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine) {

        Medicine updatedMedicine =
                medicineService.updateMedicine(
                        id,
                        medicine
                );

        if (updatedMedicine == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedMedicine);
    }

    // =========================================================
    // DELETE MEDICINE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(
            @PathVariable Long id) {

        medicineService.deleteMedicine(id);

        return ResponseEntity.noContent().build();
    }
}