package com.example.demo.service;

import com.example.demo.entity.Bed;
import com.example.demo.repository.BedRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BedService {

    private final BedRepository bedRepository;

    public BedService(BedRepository bedRepository) {
        this.bedRepository = bedRepository;
    }

    // Create bed
    public Bed createBed(Bed bed) {
        return bedRepository.save(bed);
    }

    // Get all beds
    public List<Bed> getAllBeds() {
        return bedRepository.findAll();
    }

    // Get bed by ID
    public Optional<Bed> getBedById(Long id) {
        return bedRepository.findById(id);
    }

    // Update bed
    public Bed updateBed(Long id, Bed updatedBed) {

        return bedRepository.findById(id)
                .map(bed -> {

                    bed.setBedNumber(updatedBed.getBedNumber());
                    bed.setWard(updatedBed.getWard());
                    bed.setBedType(updatedBed.getBedType());
                    bed.setPatientName(updatedBed.getPatientName());
                    bed.setStatus(updatedBed.getStatus());
                    bed.setAdmissionDate(updatedBed.getAdmissionDate());
                    bed.setDischargeDate(updatedBed.getDischargeDate());

                    return bedRepository.save(bed);
                })
                .orElse(null);
    }

    // Delete bed
    public boolean deleteBed(Long id) {

        if (!bedRepository.existsById(id)) {
            return false;
        }

        bedRepository.deleteById(id);
        return true;
    }
}