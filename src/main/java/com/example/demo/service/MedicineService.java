package com.example.demo.service;

import com.example.demo.entity.Medicine;
import com.example.demo.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    // Add medicine
    public Medicine createMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    // Get all medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // Get medicine by ID
    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }

    // Update medicine
    public Medicine updateMedicine(Long id, Medicine updatedMedicine) {

        return medicineRepository.findById(id)
                .map(medicine -> {

                    medicine.setMedicineName(
                            updatedMedicine.getMedicineName());

                    medicine.setCategory(
                            updatedMedicine.getCategory());

                    medicine.setQuantity(
                            updatedMedicine.getQuantity());

                    medicine.setPrice(
                            updatedMedicine.getPrice());

                    medicine.setManufacturer(
                            updatedMedicine.getManufacturer());

                    return medicineRepository.save(medicine);
                })
                .orElse(null);
    }

    // Delete medicine
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }
}