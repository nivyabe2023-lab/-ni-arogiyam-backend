package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    private LocalDateTime appointmentDate;

    private String reason;

    private String status;

    public Appointment() {
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDoctorName() {
        if (doctor != null) {
            String f = doctor.getFirstName() != null ? doctor.getFirstName().trim() : "";
            String l = doctor.getLastName() != null ? doctor.getLastName().trim() : "";
            String full = (f + " " + l).trim();
            if (full.isEmpty()) {
                return "Dr. Specialist";
            }
            if (full.toLowerCase().startsWith("dr.") || full.toLowerCase().startsWith("dr ")) {
                return full;
            }
            return "Dr. " + full;
        }
        return "Dr. Specialist";
    }

    public String getPatientName() {
        if (patient != null) {
            String f = patient.getFirstName() != null ? patient.getFirstName().trim() : "";
            String l = patient.getLastName() != null ? patient.getLastName().trim() : "";
            String full = (f + " " + l).trim();
            if (!full.isEmpty()) {
                return full;
            }
        }
        return "Registered Patient";
    }
}