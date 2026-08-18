package com.example.demo.service;

import com.example.demo.entity.Patient;
import com.example.demo.repository.PatientRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Register patient
    public Patient registerPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // Get all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // Get patient by ID
    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    // Update patient
    public Patient updatePatient(Long id, Patient patientDetails) {

        Patient existingPatient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found with ID: " + id)
                );

        existingPatient.setFirstName(patientDetails.getFirstName());
        existingPatient.setLastName(patientDetails.getLastName());
        existingPatient.setAge(patientDetails.getAge());
        existingPatient.setGender(patientDetails.getGender());
        existingPatient.setPhoneNumber(patientDetails.getPhoneNumber());
        existingPatient.setBloodGroup(patientDetails.getBloodGroup());
        existingPatient.setDisease(patientDetails.getDisease());
        existingPatient.setAddress(patientDetails.getAddress());

        return patientRepository.save(existingPatient);
    }

    // Delete patient
    public void deletePatient(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found with ID: " + id)
                );

        try {
            patientRepository.delete(patient);
            patientRepository.flush();

        } catch (DataIntegrityViolationException e) {

            throw new RuntimeException(
                    "Cannot delete this patient because the patient has " +
                    "associated appointments, prescriptions, bills, or other records."
            );
        }
    }
}