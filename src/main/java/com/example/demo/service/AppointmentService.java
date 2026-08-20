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
            patientId = Long.valueOf(map.get("patientId").toString());
        } else if (map.containsKey("patient") && map.get("patient") instanceof Map<?, ?> pMap) {
            if (pMap.containsKey("patientId") && pMap.get("patientId") != null) {
                patientId = Long.valueOf(pMap.get("patientId").toString());
            }
        }
        if (patientId != null) {
            patientRepository.findById(patientId).ifPresent(appointment::setPatient);
        }

        // Resolve Doctor
        Long doctorId = null;
        if (map.containsKey("doctorId") && map.get("doctorId") != null) {
            doctorId = Long.valueOf(map.get("doctorId").toString());
        } else if (map.containsKey("doctor") && map.get("doctor") instanceof Map<?, ?> dMap) {
            if (dMap.containsKey("doctorId") && dMap.get("doctorId") != null) {
                doctorId = Long.valueOf(dMap.get("doctorId").toString());
            }
        }
        if (doctorId != null) {
            doctorRepository.findById(doctorId).ifPresent(appointment::setDoctor);
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
            String dateStr = map.get("appointmentDate").toString();
            String timeStr = map.containsKey("appointmentTime") && map.get("appointmentTime") != null 
                    ? map.get("appointmentTime").toString() : "10:00";
            try {
                if (dateStr.contains("T")) {
                    appointment.setAppointmentDate(LocalDateTime.parse(dateStr.substring(0, 19)));
                } else {
                    LocalDate d = LocalDate.parse(dateStr);
                    LocalTime t = LocalTime.parse(timeStr.length() == 5 ? timeStr + ":00" : timeStr);
                    appointment.setAppointmentDate(LocalDateTime.of(d, t));
                }
            } catch (Exception e) {
                appointment.setAppointmentDate(LocalDateTime.now().plusDays(1));
            }
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
}