package com.example.demo.service;

import com.example.demo.entity.Doctor;
import com.example.demo.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // ==========================================
    // ADD DOCTOR
    // ==========================================

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // ==========================================
    // GET ALL DOCTORS
    // ==========================================

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // ==========================================
    // GET DOCTOR BY ID
    // ==========================================

    public Optional<Doctor> getDoctorById(Long doctorId) {
        return doctorRepository.findById(doctorId);
    }

    // ==========================================
    // UPDATE DOCTOR
    // ==========================================

    public Doctor updateDoctor(
            Long doctorId,
            Doctor doctorDetails) {

        Doctor existingDoctor =
                doctorRepository.findById(doctorId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Doctor not found with ID: "
                                                + doctorId
                                )
                        );

        existingDoctor.setFirstName(
                doctorDetails.getFirstName()
        );

        existingDoctor.setLastName(
                doctorDetails.getLastName()
        );

        existingDoctor.setSpecialization(
                doctorDetails.getSpecialization()
        );

        existingDoctor.setPhoneNumber(
                doctorDetails.getPhoneNumber()
        );

        existingDoctor.setEmail(
                doctorDetails.getEmail()
        );

        existingDoctor.setExperience(
                doctorDetails.getExperience()
        );

        existingDoctor.setAvailability(
                doctorDetails.getAvailability()
        );

        return doctorRepository.save(
                existingDoctor
        );
    }

    // ==========================================
    // DELETE DOCTOR
    // ==========================================

    public void deleteDoctor(Long doctorId) {
        doctorRepository.deleteById(doctorId);
    }
}