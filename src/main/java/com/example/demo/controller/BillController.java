package com.example.demo.controller;

import com.example.demo.entity.Bill;
import com.example.demo.service.BillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    // =========================================================
    // CREATE BILL
    // =========================================================

    @PostMapping
    public ResponseEntity<Bill> createBill(
            @RequestBody Bill bill) {

        Bill savedBill = billService.createBill(bill);

        return ResponseEntity.ok(savedBill);
    }

    // =========================================================
    // GET ALL BILLS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {

        return ResponseEntity.ok(
                billService.getAllBills()
        );
    }

    // =========================================================
    // GET BILL BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(
            @PathVariable Long id) {

        Bill bill = billService.getBillById(id);

        if (bill == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(bill);
    }

    // =========================================================
    // UPDATE BILL
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(
            @PathVariable Long id,
            @RequestBody Bill bill) {

        Bill updatedBill =
                billService.updateBill(id, bill);

        if (updatedBill == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedBill);
    }

    // =========================================================
    // DELETE BILL
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(
            @PathVariable Long id) {

        billService.deleteBill(id);

        return ResponseEntity.noContent().build();
    }
}