package com.example.demo.controller;

import com.example.demo.entity.Bed;
import com.example.demo.service.BedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beds")
public class BedController {

    private final BedService bedService;

    public BedController(BedService bedService) {
        this.bedService = bedService;
    }

    // =========================================================
    // CREATE BED
    // =========================================================

    @PostMapping
    public ResponseEntity<Bed> createBed(
            @RequestBody Bed bed) {

        Bed savedBed = bedService.createBed(bed);

        return ResponseEntity.ok(savedBed);
    }

    // =========================================================
    // GET ALL BEDS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Bed>> getAllBeds() {

        return ResponseEntity.ok(
                bedService.getAllBeds()
        );
    }

    // =========================================================
    // GET BED BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Bed> getBedById(
            @PathVariable Long id) {

        return bedService.getBedById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // UPDATE BED
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Bed> updateBed(
            @PathVariable Long id,
            @RequestBody Bed bed) {

        Bed updatedBed =
                bedService.updateBed(id, bed);

        if (updatedBed == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedBed);
    }

    // =========================================================
    // DELETE BED
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBed(
            @PathVariable Long id) {

        boolean deleted =
                bedService.deleteBed(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}