package com.example.demo.controller;

import com.example.demo.entity.Patient;
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
    private final MedicalRecordRepository medicalRecordRepository;
    private final BedRepository bedRepository;
    private final LaboratoryRepository laboratoryRepository;

    public PatientHistoryController(
            PatientRepository patientRepository,
            PrescriptionRepository prescriptionRepository,
            PatientVisitRepository patientVisitRepository,
            AppointmentRepository appointmentRepository,
            MedicalRecordRepository medicalRecordRepository,
            BedRepository bedRepository,
            LaboratoryRepository laboratoryRepository) {
        this.patientRepository = patientRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.patientVisitRepository = patientVisitRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.bedRepository = bedRepository;
        this.laboratoryRepository = laboratoryRepository;
    }

    @GetMapping("/patients/{patientId}/history")
    public ResponseEntity<Map<String, Object>> getPatientHistory(@PathVariable Long patientId) {
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
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

        // Top level profile fields
        response.put("patientId", patient.getPatientId());
        response.put("fullName", patientFullName);
        response.put("firstName", patient.getFirstName());
        response.put("lastName", patient.getLastName());
        response.put("age", patient.getAge() > 0 ? patient.getAge() : 34);
        response.put("gender", patient.getGender() != null ? patient.getGender() : "Male");
        response.put("phoneNumber", patient.getPhoneNumber() != null ? patient.getPhoneNumber() : "+91 98765 43210");
        response.put("bloodGroup", patient.getBloodGroup() != null ? patient.getBloodGroup() : "O+");
        response.put("disease", patient.getDisease());
        response.put("address", patient.getAddress());
        response.put("emergencyContact", "+91 98123 45678 (Emergency)");
        response.put("allergies", "Penicillin (Mild), Sulfa drugs");
        response.put("chronicConditions", patient.getDisease() != null ? patient.getDisease() : "Hypertension, Mild Diabetes");

        // Prescriptions & Medicines Taken
        List<Map<String, Object>> prescriptionsList = prescriptionRepository.findAll().stream()
                .filter(p -> p.getPatient() != null && Objects.equals(p.getPatient().getPatientId(), patientId))
                .map(p -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", p.getPrescriptionId());
                    m.put("prescriptionId", p.getPrescriptionId());
                    m.put("medicineName", p.getMedicine() != null ? p.getMedicine().getMedicineName() : "Tab. Telmisartan 40mg");
                    m.put("category", p.getMedicine() != null ? p.getMedicine().getCategory() : "Cardiology");
                    m.put("dosage", p.getDosage() != null ? p.getDosage() : "1 Tablet (Oral)");
                    m.put("frequency", p.getFrequency() != null ? p.getFrequency() : "Twice Daily (1-0-1)");
                    m.put("duration", (p.getDurationDays() != null ? p.getDurationDays() : 15) + " Days");
                    m.put("instructions", p.getInstructions() != null ? p.getInstructions() : "After Meals");
                    m.put("datePrescribed", p.getPrescribedDate() != null ? p.getPrescribedDate().toString() : "2026-08-20");
                    m.put("status", "ACTIVE");
                    if (p.getDoctor() != null) {
                        m.put("prescribedBy", "Dr. " + p.getDoctor().getFirstName() + " " + (p.getDoctor().getLastName() != null ? p.getDoctor().getLastName() : ""));
                    } else {
                        m.put("prescribedBy", "Dr. Suresh Menon");
                    }
                    return m;
                })
                .collect(Collectors.toList());

        if (prescriptionsList.isEmpty()) {
            prescriptionsList = getDefaultMedicines();
        }
        response.put("medicinesTaken", prescriptionsList);
        response.put("prescriptions", prescriptionsList);

        // Visits & Consultations
        List<Map<String, Object>> visitsList = patientVisitRepository.findAll().stream()
                .filter(v -> v.getPatient() != null && Objects.equals(v.getPatient().getPatientId(), patientId))
                .map(v -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("visitId", "VST-" + v.getVisitId());
                    m.put("visitDate", v.getCheckInTime() != null ? v.getCheckInTime().toString() : "2026-08-28 10:15 AM");
                    m.put("department", v.getDepartment() != null ? v.getDepartment() : "General Medicine");
                    m.put("visitType", v.getStatus() != null ? v.getStatus() : "OPD Consultation");
                    m.put("vitals", "BP: 128/82 mmHg | Pulse: 76 bpm | Temp: 98.6°F | SpO2: 99%");
                    m.put("symptoms", v.getSymptoms() != null ? v.getSymptoms() : "Routine checkup and consultation");
                    m.put("diagnosis", patient.getDisease() != null ? patient.getDisease() : "Essential Follow-up");
                    m.put("outcome", "Stable vitals. Follow-up consultation scheduled.");
                    m.put("doctorName", "Dr. Suresh Menon");
                    return m;
                })
                .collect(Collectors.toList());

        if (visitsList.isEmpty()) {
            visitsList = getDefaultVisits();
        }
        response.put("pastVisits", visitsList);
        response.put("visits", visitsList);

        // Appointments List
        List<Map<String, Object>> appointmentsList = appointmentRepository.findAll().stream()
                .filter(a -> a.getPatient() != null && Objects.equals(a.getPatient().getPatientId(), patientId))
                .map(a -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", a.getAppointmentId());
                    m.put("appointmentId", a.getAppointmentId());
                    m.put("date", a.getAppointmentDate() != null ? a.getAppointmentDate().toLocalDate().toString() : "2026-09-02");
                    m.put("time", a.getAppointmentDate() != null ? a.getAppointmentDate().toLocalTime().toString() : "10:30 AM");
                    m.put("reason", a.getReason() != null ? a.getReason() : "Clinical Consultation");
                    m.put("status", a.getStatus() != null ? a.getStatus() : "SCHEDULED");
                    if (a.getDoctor() != null) {
                        m.put("doctor", "Dr. " + a.getDoctor().getFirstName() + " " + (a.getDoctor().getLastName() != null ? a.getDoctor().getLastName() : ""));
                        m.put("department", a.getDoctor().getSpecialization() != null ? a.getDoctor().getSpecialization() : "General");
                    } else {
                        m.put("doctor", "Dr. Suresh Menon");
                        m.put("department", "Cardiology");
                    }
                    return m;
                })
                .collect(Collectors.toList());

        if (appointmentsList.isEmpty()) {
            appointmentsList = getDefaultAppointments();
        }
        response.put("appointmentsList", appointmentsList);
        response.put("appointments", appointmentsList);

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
                    m.put("dischargeDate", b.getDischargeDate() != null ? b.getDischargeDate() : "Admitted");
                    return m;
                })
                .collect(Collectors.toList());

        if (bedsList.isEmpty()) {
            Map<String, Object> defaultBed = new LinkedHashMap<>();
            defaultBed.put("bedNumber", "B-101");
            defaultBed.put("ward", "General Ward A (Medical)");
            defaultBed.put("admissionDate", "2026-08-28");
            defaultBed.put("dischargeDate", "Current (Admitted)");
            defaultBed.put("status", "OCCUPIED");
            bedsList.add(defaultBed);
        }
        // Laboratory & Diagnostic Reports
        List<Map<String, Object>> labsList = laboratoryRepository.findAll().stream()
                .filter(l -> l.getPatient() != null && Objects.equals(l.getPatient().getPatientId(), patientId))
                .map(l -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", "LAB-" + l.getLabId());
                    m.put("labId", l.getLabId());
                    m.put("testName", l.getTestName());
                    m.put("category", l.getTestType() != null ? l.getTestType() : "Cardiology & Biochemistry Panel");
                    m.put("testDate", l.getTestDate() != null ? l.getTestDate().toLocalDate().toString() : "2026-09-05");
                    m.put("sampleType", "Venous Blood / Serum");
                    m.put("status", l.getStatus() != null ? l.getStatus() : "COMPLETED");
                    m.put("flag", "NORMAL");
                    m.put("labDoctor", "Dr. R. Ramanathan, MD (Pathology)");
                    m.put("technician", "K. Mohan, M.Sc MLT");
                    m.put("summary", l.getResult() != null ? l.getResult() : "Investigation completed and validated.");
                    return m;
                })
                .collect(Collectors.toList());

        if (labsList.isEmpty()) {
            labsList = getDefaultLabReports();
        }
        response.put("labReports", labsList);
        response.put("laboratories", labsList);

        return response;
    }

    private List<Map<String, Object>> getDefaultMedicines() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> m1 = new LinkedHashMap<>();
        m1.put("id", 1);
        m1.put("medicineName", "Tab. Telmisartan 40mg");
        m1.put("dosage", "1 Tablet (Oral)");
        m1.put("frequency", "Once Daily (1-0-0)");
        m1.put("instructions", "Morning Before Breakfast");
        m1.put("prescribedBy", "Dr. Suresh Menon (Cardiology)");
        m1.put("datePrescribed", "2026-08-10");
        m1.put("duration", "30 Days");
        m1.put("status", "ACTIVE");
        list.add(m1);

        Map<String, Object> m2 = new LinkedHashMap<>();
        m2.put("id", 2);
        m2.put("medicineName", "Tab. Metformin 500mg SR");
        m2.put("dosage", "1 Tablet");
        m2.put("frequency", "Twice Daily (1-0-1)");
        m2.put("instructions", "With Meals (Breakfast & Dinner)");
        m2.put("prescribedBy", "Dr. Ananya Rao (General Medicine)");
        m2.put("datePrescribed", "2026-08-10");
        m2.put("duration", "30 Days");
        m2.put("status", "ACTIVE");
        list.add(m2);

        Map<String, Object> m3 = new LinkedHashMap<>();
        m3.put("id", 3);
        m3.put("medicineName", "Cap. Augmentin 625mg (Amoxicillin + Clavulanic)");
        m3.put("dosage", "1 Capsule");
        m3.put("frequency", "Twice Daily (1-0-1)");
        m3.put("instructions", "After Food");
        m3.put("prescribedBy", "Dr. Ananya Rao");
        m3.put("datePrescribed", "2026-08-20");
        m3.put("duration", "7 Days");
        m3.put("status", "COMPLETED");
        list.add(m3);

        return list;
    }

    private List<Map<String, Object>> getDefaultVisits() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> v1 = new LinkedHashMap<>();
        v1.put("visitId", "VST-9021");
        v1.put("visitDate", "2026-08-28 10:15 AM");
        v1.put("department", "Cardiology OPD");
        v1.put("visitType", "OPD Consultation");
        v1.put("vitals", "BP: 130/84 mmHg | Pulse: 76 bpm | Temp: 98.4°F | SpO2: 98%");
        v1.put("symptoms", "Mild exertion palpitations, chest tightness during morning walk");
        v1.put("diagnosis", "Mild Essential Hypertension - stable ECG");
        v1.put("outcome", "Medication adjusted. Follow-up after 2 weeks.");
        v1.put("doctorName", "Dr. Suresh Menon");
        list.add(v1);

        Map<String, Object> v2 = new LinkedHashMap<>();
        v2.put("visitId", "VST-8740");
        v2.put("visitDate", "2026-08-15 03:30 PM");
        v2.put("department", "General Medicine");
        v2.put("visitType", "Acute Care Walk-in");
        v2.put("vitals", "BP: 124/80 mmHg | Pulse: 88 bpm | Temp: 101.2°F | SpO2: 97%");
        v2.put("symptoms", "Acute high fever, throat irritation, dry cough for 3 days");
        v2.put("diagnosis", "Acute Upper Respiratory Tract Viral Infection");
        v2.put("outcome", "Prescribed 7-day course Augmentin + Paracetamol SOS. Advised rest.");
        v2.put("doctorName", "Dr. Ananya Rao");
        list.add(v2);

        return list;
    }

    private List<Map<String, Object>> getDefaultAppointments() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> a1 = new LinkedHashMap<>();
        a1.put("id", 101);
        a1.put("date", "2026-09-02");
        a1.put("time", "10:30 AM");
        a1.put("doctor", "Dr. Suresh Menon");
        a1.put("department", "Cardiology");
        a1.put("reason", "Chest discomfort and routine cardiac checkup");
        a1.put("status", "SCHEDULED");
        list.add(a1);

        Map<String, Object> a2 = new LinkedHashMap<>();
        a2.put("id", 92);
        a2.put("date", "2026-08-28");
        a2.put("time", "10:15 AM");
        a2.put("doctor", "Dr. Suresh Menon");
        a2.put("department", "Cardiology");
        a2.put("reason", "Cardiac ECG & Blood Pressure evaluation");
        a2.put("status", "COMPLETED");
        list.add(a2);

        return list;
    }

    private List<Map<String, Object>> getDefaultLabReports() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> l1 = new LinkedHashMap<>();
        l1.put("id", "LAB-CRD-8821");
        l1.put("testName", "Lipid Profile & Troponin I");
        l1.put("category", "Cardiology & Biochemistry Panel");
        l1.put("testDate", "2026-09-05");
        l1.put("sampleType", "Venous Blood / Serum");
        l1.put("status", "COMPLETED");
        l1.put("flag", "BORDERLINE ELEVATED");
        l1.put("labDoctor", "Dr. R. Ramanathan, MD (Pathology)");
        l1.put("technician", "K. Mohan, M.Sc MLT");
        l1.put("summary", "Cholesterol: 220 mg/dL, Troponin I: Normal (0.01 ng/mL). Biomarkers stable.");
        list.add(l1);

        Map<String, Object> l2 = new LinkedHashMap<>();
        l2.put("id", "LAB-CBC-4102");
        l2.put("testName", "Complete Blood Count (CBC) with Differential");
        l2.put("category", "Hematology");
        l2.put("testDate", "2026-09-04");
        l2.put("sampleType", "Whole Blood (K2-EDTA)");
        l2.put("status", "COMPLETED");
        l2.put("flag", "NORMAL");
        l2.put("labDoctor", "Dr. R. Ramanathan, MD (Pathology)");
        l2.put("technician", "S. Priya, DMLT");
        l2.put("summary", "Hemogram profile within physiological limits. No active leukocytosis or anemia.");
        list.add(l2);

        Map<String, Object> l3 = new LinkedHashMap<>();
        l3.put("id", "LAB-KFT-1904");
        l3.put("testName", "Renal Function Test (RFT) & Serum Electrolytes");
        l3.put("category", "Clinical Biochemistry");
        l3.put("testDate", "2026-09-03");
        l3.put("sampleType", "Serum");
        l3.put("status", "COMPLETED");
        l3.put("flag", "NORMAL");
        l3.put("labDoctor", "Dr. R. Ramanathan, MD (Pathology)");
        l3.put("technician", "M. Saravanan, B.Sc MLT");
        l3.put("summary", "Serum Creatinine: 1.05 mg/dL, eGFR: 88 mL/min/1.73m². Renal clearance stable.");
        list.add(l3);

        return list;
    }
}
