package com.example.demo.controller;

import com.example.demo.entity.Appointment;
import com.example.demo.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {

        this.appointmentService = appointmentService;
    }

    // =========================================================
    // CREATE APPOINTMENT
    // POST /api/appointments
    // =========================================================

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody Map<String, Object> payload) {

        Appointment savedAppointment =
                appointmentService.saveFromMap(payload, null);

        return ResponseEntity.ok(savedAppointment);
    }

    // =========================================================
    // GET ALL APPOINTMENTS
    // GET /api/appointments
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {

        return ResponseEntity.ok(
                appointmentService.getAllAppointments()
        );
    }

    // =========================================================
    // GET APPOINTMENT BY ID
    // GET /api/appointments/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(
            @PathVariable Long id) {

        return appointmentService
                .getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // UPDATE APPOINTMENT
    // PUT /api/appointments/{id}
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        Appointment updatedAppointment =
                appointmentService.saveFromMap(payload, id);

        if (updatedAppointment == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedAppointment);
    }

    // =========================================================
    // DELETE APPOINTMENT
    // DELETE /api/appointments/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(
            @PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        return ResponseEntity.noContent().build();
    }
}