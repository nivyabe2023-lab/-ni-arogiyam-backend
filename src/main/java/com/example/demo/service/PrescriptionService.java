package com.example.demo.service;

import com.example.demo.entity.Medicine;
import com.example.demo.entity.Prescription;
import com.example.demo.repository.MedicineRepository;
import com.example.demo.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicineRepository medicineRepository;

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository,
            MedicineRepository medicineRepository) {

        this.prescriptionRepository = prescriptionRepository;
        this.medicineRepository = medicineRepository;
    }

    // Create prescription and reduce medicine stock
    public Prescription createPrescription(Prescription prescription) {

        prescription.setPrescribedDate(LocalDateTime.now());

        Medicine medicine = medicineRepository
                .findById(prescription.getMedicine().getMedicineId())
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found"));

        // Check stock
        if (medicine.getQuantity() <= 0) {
            throw new RuntimeException("Medicine is out of stock");
        }

        // Reduce quantity by 1
        medicine.setQuantity(medicine.getQuantity() - 1);

        medicineRepository.save(medicine);

        return prescriptionRepository.save(prescription);
    }

    // Get all prescriptions
    public List<Prescription> getAllPrescriptions() {

        return prescriptionRepository.findAll();
    }

    // Get prescription by ID
    public Optional<Prescription> getPrescriptionById(Long id) {

        return prescriptionRepository.findById(id);
    }

    // Update prescription
    public Prescription updatePrescription(
            Long id,
            Prescription updatedPrescription) {

        return prescriptionRepository.findById(id)
                .map(prescription -> {

                    prescription.setMedicine(
                            updatedPrescription.getMedicine());

                    prescription.setDosage(
                            updatedPrescription.getDosage());

                    prescription.setFrequency(
                            updatedPrescription.getFrequency());

                    prescription.setDurationDays(
                            updatedPrescription.getDurationDays());

                    prescription.setInstructions(
                            updatedPrescription.getInstructions());

                    return prescriptionRepository.save(prescription);
                })
                .orElse(null);
    }

    // Delete prescription
    public void deletePrescription(Long id) {

        prescriptionRepository.deleteById(id);
    }
}