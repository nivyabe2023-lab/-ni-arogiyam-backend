package com.example.demo.service;

import com.example.demo.entity.Appointment;
import com.example.demo.entity.Doctor;
import com.example.demo.entity.Patient;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    // ==========================================
    // CREATE APPOINTMENT (FROM ENTITY)
    // ==========================================

    public Appointment createAppointment(Appointment appointment) {
        if (appointment.getPatient() != null && appointment.getPatient().getPatientId() != null) {
            patientRepository.findById(appointment.getPatient().getPatientId())
                    .ifPresent(appointment::setPatient);
        }
        if (appointment.getDoctor() != null && appointment.getDoctor().getDoctorId() != null) {
            doctorRepository.findById(appointment.getDoctor().getDoctorId())
                    .ifPresent(appointment::setDoctor);
        }
        return appointmentRepository.save(appointment);
    }

    // ==========================================
    // CREATE / UPDATE APPOINTMENT (FROM MAP/JSON)
    // ==========================================

    public Appointment saveFromMap(Map<String, Object> map, Long existingId) {
        Appointment appointment = existingId != null 
                ? appointmentRepository.findById(existingId).orElse(new Appointment())
                : new Appointment();

        // Resolve Patient
        Long patientId = null;
        if (map.containsKey("patientId") && map.get("patientId") != null) {
            try {
                patientId = Long.valueOf(map.get("patientId").toString().trim());
            } catch (Exception ignored) {}
        } else if (map.containsKey("patient") && map.get("patient") instanceof Map<?, ?> pMap) {
            if (pMap.containsKey("patientId") && pMap.get("patientId") != null) {
                try {
                    patientId = Long.valueOf(pMap.get("patientId").toString().trim());
                } catch (Exception ignored) {}
            }
        }
        if (patientId != null) {
            patientRepository.findById(patientId).ifPresent(appointment::setPatient);
        }
        if (appointment.getPatient() == null && map.containsKey("patientName") && map.get("patientName") != null) {
            String pName = map.get("patientName").toString().trim();
            if (!pName.isEmpty()) {
                patientRepository.findAll().stream()
                        .filter(p -> pName.equalsIgnoreCase(p.getFirstName()) || 
                                     pName.equalsIgnoreCase(p.getFirstName() + " " + p.getLastName()) ||
                                     pName.toLowerCase().contains(p.getFirstName().toLowerCase()))
                        .findFirst()
                        .ifPresent(appointment::setPatient);

                if (appointment.getPatient() == null) {
                    String[] parts = pName.split("\\s+", 2);
                    Patient newP = new Patient();
                    newP.setFirstName(parts[0]);
                    newP.setLastName(parts.length > 1 ? parts[1] : "");
                    newP.setPhoneNumber(map.containsKey("phoneNumber") ? map.get("phoneNumber").toString() : "9840001122");
                    newP.setBloodGroup("O+");
                    try {
                        appointment.setPatient(patientRepository.save(newP));
                    } catch (Exception ignored) {}
                }
            }
        }
        if (appointment.getPatient() == null) {
            patientRepository.findAll().stream().findFirst().ifPresent(appointment::setPatient);
        }

        // Resolve Doctor
        Long doctorId = null;
        if (map.containsKey("doctorId") && map.get("doctorId") != null) {
            try {
                doctorId = Long.valueOf(map.get("doctorId").toString().trim());
            } catch (Exception ignored) {}
        } else if (map.containsKey("doctor") && map.get("doctor") instanceof Map<?, ?> dMap) {
            if (dMap.containsKey("doctorId") && dMap.get("doctorId") != null) {
                try {
                    doctorId = Long.valueOf(dMap.get("doctorId").toString().trim());
                } catch (Exception ignored) {}
            }
        }
        if (doctorId != null) {
            doctorRepository.findById(doctorId).ifPresent(appointment::setDoctor);
        }
        if (appointment.getDoctor() == null && map.containsKey("doctorName") && map.get("doctorName") != null) {
            String dName = map.get("doctorName").toString().trim().replace("Dr.", "").replace("Dr", "").trim();
            if (!dName.isEmpty()) {
                doctorRepository.findAll().stream()
                        .filter(d -> dName.equalsIgnoreCase(d.getFirstName()) ||
                                     dName.equalsIgnoreCase(d.getFirstName() + " " + d.getLastName()) ||
                                     d.getFirstName().toLowerCase().contains(dName.toLowerCase()) ||
                                     dName.toLowerCase().contains(d.getFirstName().toLowerCase()))
                        .findFirst()
                        .ifPresent(appointment::setDoctor);
            }
        }
        if (appointment.getDoctor() == null && map.containsKey("department") && map.get("department") != null) {
            String dept = map.get("department").toString().trim();
            doctorRepository.findAll().stream()
                    .filter(d -> d.getSpecialization() != null && d.getSpecialization().toLowerCase().contains(dept.toLowerCase()))
                    .findFirst()
                    .ifPresent(appointment::setDoctor);
        }
        if (appointment.getDoctor() == null) {
            doctorRepository.findAll().stream().findFirst().ifPresent(appointment::setDoctor);
        }

        // Resolve Reason & Status
        if (map.containsKey("reason") && map.get("reason") != null) {
            appointment.setReason(map.get("reason").toString());
        }
        if (map.containsKey("status") && map.get("status") != null) {
            appointment.setStatus(map.get("status").toString());
        } else if (appointment.getStatus() == null) {
            appointment.setStatus("SCHEDULED");
        }

        // Resolve Appointment Date & Time
        if (map.containsKey("appointmentDate") && map.get("appointmentDate") != null) {
            String dateStr = map.get("appointmentDate").toString().trim();
            String timeStr = map.containsKey("appointmentTime") && map.get("appointmentTime") != null 
                    ? map.get("appointmentTime").toString().trim() : "10:00";
            try {
                if (dateStr.contains("T")) {
                    appointment.setAppointmentDate(LocalDateTime.parse(dateStr.substring(0, 19)));
                } else {
                    LocalDate d = LocalDate.parse(dateStr);
                    LocalTime t;
                    String upperTime = timeStr.toUpperCase();
                    if (upperTime.contains("AM") || upperTime.contains("PM")) {
                        try {
                            t = LocalTime.parse(upperTime, DateTimeFormatter.ofPattern("h:mm a"));
                        } catch (Exception e1) {
                            try {
                                t = LocalTime.parse(upperTime, DateTimeFormatter.ofPattern("hh:mm a"));
                            } catch (Exception e2) {
                                t = LocalTime.of(10, 0);
                            }
                        }
                    } else {
                        t = LocalTime.parse(timeStr.length() == 5 ? timeStr + ":00" : timeStr);
                    }
                    appointment.setAppointmentDate(LocalDateTime.of(d, t));
                }
            } catch (Exception e) {
                appointment.setAppointmentDate(LocalDateTime.now().plusDays(1));
            }
        } else if (appointment.getAppointmentDate() == null) {
            appointment.setAppointmentDate(LocalDateTime.now().plusDays(1));
        }

        return appointmentRepository.save(appointment);
    }

    // ==========================================
    // GET ALL APPOINTMENTS
    // ==========================================

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // ==========================================
    // GET APPOINTMENT BY ID
    // ==========================================

    public Optional<Appointment> getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId);
    }

    // ==========================================
    // UPDATE APPOINTMENT
    // ==========================================

    public Appointment updateAppointment(
            Long appointmentId,
            Appointment appointmentDetails) {

        Appointment existingAppointment =
                appointmentRepository.findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found with ID: "
                                                + appointmentId
                                )
                        );

        if (appointmentDetails.getPatient() != null && appointmentDetails.getPatient().getPatientId() != null) {
            patientRepository.findById(appointmentDetails.getPatient().getPatientId())
                    .ifPresent(existingAppointment::setPatient);
        }

        if (appointmentDetails.getDoctor() != null && appointmentDetails.getDoctor().getDoctorId() != null) {
            doctorRepository.findById(appointmentDetails.getDoctor().getDoctorId())
                    .ifPresent(existingAppointment::setDoctor);
        }

        if (appointmentDetails.getAppointmentDate() != null) {
            existingAppointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
        }
        if (appointmentDetails.getReason() != null) {
            existingAppointment.setReason(appointmentDetails.getReason());
        }
        if (appointmentDetails.getStatus() != null) {
            existingAppointment.setStatus(appointmentDetails.getStatus());
        }

        return appointmentRepository.save(existingAppointment);
    }

    // ==========================================
    // DELETE APPOINTMENT
    // ==========================================

    public void deleteAppointment(Long appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }

    // ==========================================
    // SEARCH APPOINTMENTS
    // ==========================================

    public List<Appointment> searchAppointments(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return appointmentRepository.findAll();
        }
        return appointmentRepository.searchAppointments(keyword.trim());
    }
}