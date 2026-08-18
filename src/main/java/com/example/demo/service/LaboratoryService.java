package com.example.demo.service;

import com.example.demo.entity.Laboratory;
import com.example.demo.repository.LaboratoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LaboratoryService {

    private final LaboratoryRepository laboratoryRepository;

    public LaboratoryService(LaboratoryRepository laboratoryRepository) {
        this.laboratoryRepository = laboratoryRepository;
    }

    // Create laboratory record
    public Laboratory createLaboratory(Laboratory laboratory) {
        return laboratoryRepository.save(laboratory);
    }

    // Get all laboratory records
    public List<Laboratory> getAllLaboratories() {
        return laboratoryRepository.findAll();
    }

    // Get laboratory record by ID
    public Optional<Laboratory> getLaboratoryById(Long id) {
        return laboratoryRepository.findById(id);
    }

    // Update laboratory record
    public Laboratory updateLaboratory(
            Long id,
            Laboratory details) {

        Laboratory existing =
                laboratoryRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Laboratory record not found with ID: "
                                                + id
                                )
                        );

        existing.setPatient(details.getPatient());
        existing.setTestName(details.getTestName());
        existing.setTestType(details.getTestType());
        existing.setTestDate(details.getTestDate());
        existing.setResult(details.getResult());
        existing.setStatus(details.getStatus());
        existing.setRemarks(details.getRemarks());

        return laboratoryRepository.save(existing);
    }

    // Delete laboratory record
    public void deleteLaboratory(Long id) {

        if (!laboratoryRepository.existsById(id)) {
            throw new RuntimeException(
                    "Laboratory record not found with ID: " + id
            );
        }

        laboratoryRepository.deleteById(id);
    }
}