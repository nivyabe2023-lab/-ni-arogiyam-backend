package com.example.demo.service;

import com.example.demo.entity.MedicalRecord;
import com.example.demo.repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecordService(
            MedicalRecordRepository medicalRecordRepository) {

        this.medicalRecordRepository = medicalRecordRepository;
    }

    // Create medical record
    public MedicalRecord createRecord(MedicalRecord record) {

        record.setRecordDate(LocalDateTime.now());

        return medicalRecordRepository.save(record);
    }

    // Get all medical records
    public List<MedicalRecord> getAllRecords() {

        return medicalRecordRepository.findAll();
    }

    // Get record by ID
    public Optional<MedicalRecord> getRecordById(Long id) {

        return medicalRecordRepository.findById(id);
    }

    // Update medical record
    public MedicalRecord updateRecord(
            Long id,
            MedicalRecord updatedRecord) {

        return medicalRecordRepository.findById(id)
                .map(record -> {

                    record.setDiagnosis(
                            updatedRecord.getDiagnosis());

                    record.setTreatment(
                            updatedRecord.getTreatment());

                    record.setNotes(
                            updatedRecord.getNotes());

                    return medicalRecordRepository.save(record);
                })
                .orElse(null);
    }

    // Delete medical record
    public void deleteRecord(Long id) {

        medicalRecordRepository.deleteById(id);
    }
}