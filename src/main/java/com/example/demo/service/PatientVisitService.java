package com.example.demo.service;

import com.example.demo.entity.PatientVisit;
import com.example.demo.repository.PatientVisitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientVisitService {

    private final PatientVisitRepository patientVisitRepository;

    public PatientVisitService(PatientVisitRepository patientVisitRepository) {
        this.patientVisitRepository = patientVisitRepository;
    }

    // Check in a patient
    public PatientVisit checkInPatient(PatientVisit visit) {
        return patientVisitRepository.save(visit);
    }

    // Get all patient visits
    public List<PatientVisit> getAllVisits() {
        return patientVisitRepository.findAll();
    }

    // Get visit by ID
    public Optional<PatientVisit> getVisitById(Long visitId) {
        return patientVisitRepository.findById(visitId);
    }

    // Update patient visit
    public PatientVisit updateVisit(PatientVisit visit) {
        return patientVisitRepository.save(visit);
    }

    // Delete visit
    public void deleteVisit(Long visitId) {
        patientVisitRepository.deleteById(visitId);
    }
}