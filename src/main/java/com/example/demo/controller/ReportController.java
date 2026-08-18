package com.example.demo.controller;

import com.example.demo.entity.Report;
import com.example.demo.service.ReportService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // CREATE REPORT
    @PostMapping
    public ResponseEntity<Report> createReport(
            @RequestBody Report report) {

        Report savedReport =
                reportService.createReport(report);

        return ResponseEntity.ok(savedReport);
    }

    // GET ALL REPORTS
    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {

        return ResponseEntity.ok(
                reportService.getAllReports()
        );
    }

    // GET REPORT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(
            @PathVariable Long id) {

        return reportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE REPORT
    @PutMapping("/{id}")
    public ResponseEntity<Report> updateReport(
            @PathVariable Long id,
            @RequestBody Report report) {

        Report updatedReport =
                reportService.updateReport(id, report);

        if (updatedReport == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedReport);
    }

    // DELETE REPORT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(
            @PathVariable Long id) {

        boolean deleted =
                reportService.deleteReport(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}