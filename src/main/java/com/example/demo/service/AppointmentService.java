package com.example.demo.service;

import com.example.demo.entity.Appointment;
import com.example.demo.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // ==========================================
    // CREATE APPOINTMENT
    // ==========================================

    public Appointment createAppointment(Appointment appointment) {

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

        existingAppointment.setPatient(
                appointmentDetails.getPatient()
        );

        existingAppointment.setDoctor(
                appointmentDetails.getDoctor()
        );

        existingAppointment.setAppointmentDate(
                appointmentDetails.getAppointmentDate()
        );

        existingAppointment.setReason(
                appointmentDetails.getReason()
        );

        existingAppointment.setStatus(
                appointmentDetails.getStatus()
        );

        return appointmentRepository.save(existingAppointment);
    }

    // ==========================================
    // DELETE APPOINTMENT
    // ==========================================

    public void deleteAppointment(Long appointmentId) {

        appointmentRepository.deleteById(appointmentId);
    }
}