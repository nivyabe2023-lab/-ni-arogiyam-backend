package com.example.demo.service;

import com.example.demo.entity.Report;
import com.example.demo.repository.ReportRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    // =========================================================
    // CREATE REPORT
    // =========================================================

    public Report createReport(Report report) {

        if (report.getGeneratedDate() == null) {
            report.setGeneratedDate(LocalDateTime.now());
        }

        if (report.getStatus() == null ||
                report.getStatus().trim().isEmpty()) {

            report.setStatus("Generated");
        }

        if (report.getGeneratedBy() == null ||
                report.getGeneratedBy().trim().isEmpty()) {

            report.setGeneratedBy("Administrator");
        }

        return reportRepository.save(report);
    }

    // =========================================================
    // GET ALL REPORTS
    // =========================================================

    public List<Report> getAllReports() {

        return reportRepository.findAll();
    }

    // =========================================================
    // GET REPORT BY ID
    // =========================================================

    public Optional<Report> getReportById(Long id) {

        return reportRepository.findById(id);
    }

    // =========================================================
    // UPDATE REPORT
    // =========================================================

    public Report updateReport(
            Long id,
            Report report) {

        Optional<Report> existingReport =
                reportRepository.findById(id);

        if (existingReport.isEmpty()) {
            return null;
        }

        Report existing = existingReport.get();

        existing.setReportType(
                report.getReportType()
        );

        existing.setReportTitle(
                report.getReportTitle()
        );

        existing.setDescription(
                report.getDescription()
        );

        existing.setGeneratedBy(
                report.getGeneratedBy()
        );

        existing.setStatus(
                report.getStatus()
        );

        if (report.getPatientName() != null) {
            existing.setPatientName(report.getPatientName());
        }

        if (report.getDoctorName() != null) {
            existing.setDoctorName(report.getDoctorName());
        }

        if (report.getVerifiedBy() != null) {
            existing.setVerifiedBy(report.getVerifiedBy());
        }

        return reportRepository.save(existing);
    }

    // =========================================================
    // DELETE REPORT
    // =========================================================

    public boolean deleteReport(Long id) {

        if (!reportRepository.existsById(id)) {
            return false;
        }

        reportRepository.deleteById(id);

        return true;
    }
}