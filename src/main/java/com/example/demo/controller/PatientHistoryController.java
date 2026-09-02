package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PatientHistoryController {

    private final PatientRepository patientRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientVisitRepository patientVisitRepository;
    private final AppointmentRepository appointmentRepository;
    private final BedRepository bedRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public PatientHistoryController(
            PatientRepository patientRepository,
            PrescriptionRepository prescriptionRepository,
            PatientVisitRepository patientVisitRepository,
            AppointmentRepository appointmentRepository,
            BedRepository bedRepository,
            MedicalRecordRepository medicalRecordRepository) {
        this.patientRepository = patientRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.patientVisitRepository = patientVisitRepository;
        this.appointmentRepository = appointmentRepository;
        this.bedRepository = bedRepository;
        this.medicalRecordRepository = medicalRecordRepository;
    }

    @GetMapping("/patients/{id}/history")
    public ResponseEntity<Map<String, Object>> getPatientHistory(@PathVariable Long id) {
        Optional<Patient> patientOpt = patientRepository.findById(id);
        if (patientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Patient patient = patientOpt.get();
        Map<String, Object> history = buildPatientHistory(patient);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/appointments/patient/{patientId}/history")
    public ResponseEntity<Map<String, Object>> getPatientHistoryByAppointmentPatientId(@PathVariable Long patientId) {
        return getPatientHistory(patientId);
    }

    private Map<String, Object> buildPatientHistory(Patient patient) {
        Long patientId = patient.getPatientId();
        String patientFullName = (patient.getFirstName() + " " + (patient.getLastName() != null ? patient.getLastName() : "")).trim();

        Map<String, Object> response = new LinkedHashMap<>();

        // Patient Profile
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("patientId", patient.getPatientId());
        profile.put("firstName", patient.getFirstName());
        profile.put("lastName", patient.getLastName());
        profile.put("fullName", patientFullName);
        profile.put("age", patient.getAge());
        profile.put("gender", patient.getGender());
        profile.put("phoneNumber", patient.getPhoneNumber());
        profile.put("bloodGroup", patient.getBloodGroup());
        profile.put("disease", patient.getDisease());
        profile.put("address", patient.getAddress());
        profile.put("aadharNumber", patient.getAadharNumber());
        response.put("patient", profile);

        // Prescriptions & Medicines Taken
        List<Map<String, Object>> prescriptionsList = prescriptionRepository.findAll().stream()
                .filter(p -> p.getPatient() != null && Objects.equals(p.getPatient().getPatientId(), patientId))
                .map(p -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("prescriptionId", p.getPrescriptionId());
                    m.put("medicineName", p.getMedicine() != null ? p.getMedicine().getMedicineName() : "General Medication");
                    m.put("category", p.getMedicine() != null ? p.getMedicine().getCategory() : "General");
                    m.put("dosage", p.getDosage() != null ? p.getDosage() : "As directed");
                    m.put("frequency", p.getFrequency() != null ? p.getFrequency() : "1-0-1");
                    m.put("durationDays", p.getDurationDays() != null ? p.getDurationDays() : 5);
                    m.put("instructions", p.getInstructions() != null ? p.getInstructions() : "After Food");
                    m.put("prescribedDate", p.getPrescribedDate());
                    if (p.getDoctor() != null) {
                        m.put("doctorId", p.getDoctor().getDoctorId());
                        m.put("doctorName", (p.getDoctor().getFirstName() + " " + (p.getDoctor().getLastName() != null ? p.getDoctor().getLastName() : "")).trim());
                        m.put("specialization", p.getDoctor().getSpecialization());
                    }
                    return m;
                })
                .collect(Collectors.toList());
        response.put("prescriptions", prescriptionsList);

        // Visits & Consultations
        List<Map<String, Object>> visitsList = patientVisitRepository.findAll().stream()
                .filter(v -> v.getPatient() != null && Objects.equals(v.getPatient().getPatientId(), patientId))
                .map(v -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("visitId", v.getVisitId());
                    m.put("checkInTime", v.getCheckInTime());
                    m.put("checkOutTime", v.getCheckOutTime());
                    m.put("department", v.getDepartment());
                    m.put("symptoms", v.getSymptoms());
                    m.put("emergencyLevel", v.getEmergencyLevel());
                    m.put("status", v.getStatus());
                    return m;
                })
                .collect(Collectors.toList());
        response.put("visits", visitsList);

        // Appointments
        List<Map<String, Object>> appointmentsList = appointmentRepository.findAll().stream()
                .filter(a -> a.getPatient() != null && Objects.equals(a.getPatient().getPatientId(), patientId))
                .map(a -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("appointmentId", a.getAppointmentId());
                    m.put("appointmentDate", a.getAppointmentDate());
                    m.put("reason", a.getReason());
                    m.put("status", a.getStatus());
                    if (a.getDoctor() != null) {
                        m.put("doctorId", a.getDoctor().getDoctorId());
                        m.put("doctorName", (a.getDoctor().getFirstName() + " " + (a.getDoctor().getLastName() != null ? a.getDoctor().getLastName() : "")).trim());
                        m.put("specialization", a.getDoctor().getSpecialization());
                    }
                    return m;
                })
                .collect(Collectors.toList());
        response.put("appointments", appointmentsList);

        // Medical Records
        List<Map<String, Object>> recordsList = medicalRecordRepository.findAll().stream()
                .filter(r -> r.getPatient() != null && Objects.equals(r.getPatient().getPatientId(), patientId))
                .map(r -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("recordId", r.getRecordId());
                    m.put("diagnosis", r.getDiagnosis());
                    m.put("treatment", r.getTreatment());
                    m.put("recordDate", r.getRecordDate());
                    m.put("notes", r.getNotes());
                    if (r.getDoctor() != null) {
                        m.put("doctorName", (r.getDoctor().getFirstName() + " " + (r.getDoctor().getLastName() != null ? r.getDoctor().getLastName() : "")).trim());
                    }
                    return m;
                })
                .collect(Collectors.toList());
        response.put("medicalRecords", recordsList);

        // Bed Allocations
        List<Map<String, Object>> bedsList = bedRepository.findAll().stream()
                .filter(b -> b.getPatientName() != null && 
                        (b.getPatientName().equalsIgnoreCase(patientFullName) || 
                         b.getPatientName().toLowerCase().contains(patient.getFirstName().toLowerCase())))
                .map(b -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("bedId", b.getBedId());
                    m.put("bedNumber", b.getBedNumber());
                    m.put("ward", b.getWard());
                    m.put("bedType", b.getBedType());
                    m.put("status", b.getStatus());
                    m.put("admissionDate", b.getAdmissionDate());
                    m.put("dischargeDate", b.getDischargeDate());
                    return m;
                })
                .collect(Collectors.toList());
        response.put("beds", bedsList);

        return response;
    }
}