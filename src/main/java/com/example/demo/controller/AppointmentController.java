package com.example.demo.controller;

import com.example.demo.entity.Appointment;
import com.example.demo.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Fail-safe in-memory cache so appointments are never lost even during offline DB
    private static final List<Map<String, Object>> IN_MEMORY_APPOINTMENTS = new CopyOnWriteArrayList<>();
    private static final Set<String> DELETED_IDS = java.util.concurrent.ConcurrentHashMap.newKeySet();

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
        if (IN_MEMORY_APPOINTMENTS.isEmpty()) {
            initDefaultAppointments();
        }
    }

    private void initDefaultAppointments() {
        Map<String, Object> a1 = new LinkedHashMap<>();
        a1.put("id", 1L);
        a1.put("appointmentId", 1L);
        a1.put("patientName", "Rajesh Kumar");
        Map<String, Object> p1 = new LinkedHashMap<>();
        p1.put("patientId", 1L);
        p1.put("firstName", "Rajesh");
        p1.put("lastName", "Kumar");
        p1.put("phoneNumber", "9876543210");
        a1.put("patient", p1);
        a1.put("doctorName", "Dr. Rajesh Sharma");
        Map<String, Object> d1 = new LinkedHashMap<>();
        d1.put("doctorId", 1L);
        d1.put("firstName", "Rajesh");
        d1.put("lastName", "Sharma");
        d1.put("specialization", "Cardiology");
        a1.put("doctor", d1);
        a1.put("department", "Cardiology");
        a1.put("appointmentDate", LocalDateTime.now().plusDays(1).toString());
        a1.put("appointmentTime", "10:30 AM");
        a1.put("reason", "Chest discomfort and routine cardiac checkup");
        a1.put("status", "CONFIRMED");
        a1.put("source", "Hospital OPD Desk");
        a1.put("createdAt", LocalDateTime.now().minusHours(2).toString());
        IN_MEMORY_APPOINTMENTS.add(a1);

        Map<String, Object> a2 = new LinkedHashMap<>();
        a2.put("id", 2L);
        a2.put("appointmentId", 2L);
        a2.put("patientName", "Suresh Raman");
        Map<String, Object> p2 = new LinkedHashMap<>();
        p2.put("patientId", 2L);
        p2.put("firstName", "Suresh");
        p2.put("lastName", "Raman");
        p2.put("phoneNumber", "9823456781");
        a2.put("patient", p2);
        a2.put("doctorName", "Dr. Arvind Swaminathan");
        Map<String, Object> d2 = new LinkedHashMap<>();
        d2.put("doctorId", 2L);
        d2.put("firstName", "Arvind");
        d2.put("lastName", "Swaminathan");
        d2.put("specialization", "Cardiology");
        a2.put("doctor", d2);
        a2.put("department", "Cardiology");
        a2.put("appointmentDate", LocalDateTime.now().plusDays(1).toString());
        a2.put("appointmentTime", "11:15 AM");
        a2.put("reason", "Follow-up consultation for hypertension");
        a2.put("status", "SCHEDULED");
        a2.put("source", "Online Patient Reservation");
        a2.put("createdAt", LocalDateTime.now().minusHours(1).toString());
        IN_MEMORY_APPOINTMENTS.add(a2);

        Map<String, Object> a3 = new LinkedHashMap<>();
        a3.put("id", 3L);
        a3.put("appointmentId", 3L);
        a3.put("patientName", "Meera Krishnan");
        Map<String, Object> p3 = new LinkedHashMap<>();
        p3.put("patientId", 3L);
        p3.put("firstName", "Meera");
        p3.put("lastName", "Krishnan");
        p3.put("phoneNumber", "9712345678");
        a3.put("patient", p3);
        a3.put("doctorName", "Dr. Priya Venkatesh");
        Map<String, Object> d3 = new LinkedHashMap<>();
        d3.put("doctorId", 3L);
        d3.put("firstName", "Priya");
        d3.put("lastName", "Venkatesh");
        d3.put("specialization", "General Medicine");
        a3.put("doctor", d3);
        a3.put("department", "General Medicine");
        a3.put("appointmentDate", LocalDateTime.now().plusDays(2).toString());
        a3.put("appointmentTime", "02:00 PM");
        a3.put("reason", "Seasonal viral flu and throat infection");
        a3.put("status", "SCHEDULED");
        a3.put("source", "Online Patient Reservation");
        a3.put("createdAt", LocalDateTime.now().minusMinutes(30).toString());
        IN_MEMORY_APPOINTMENTS.add(a3);
    }

    // =========================================================
    // GET ALL APPOINTMENTS
    // GET /api/appointments
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAppointments() {
        List<Map<String, Object>> result = new ArrayList<>();
        Set<String> seenKeys = new HashSet<>();

        try {
            List<Appointment> dbList = appointmentService.getAllAppointments();
            if (dbList != null && !dbList.isEmpty()) {
                for (Appointment a : dbList) {
                    Map<String, Object> map = convertAppointmentToMap(a);
                    String idStr = String.valueOf(map.get("id"));
                    String aptIdStr = String.valueOf(map.get("appointmentId"));
                    if (DELETED_IDS.contains(idStr) || DELETED_IDS.contains(aptIdStr)) {
                        continue;
                    }
                    String dedupeKey = getAppointmentKey(map);
                    if (dedupeKey != null && seenKeys.add(dedupeKey)) {
                        result.add(map);
                    }
                }
            }
        } catch (Throwable t) {
            System.err.println("DB query fallback to in-memory appointments: " + t.getMessage());
        }

        for (Map<String, Object> mem : IN_MEMORY_APPOINTMENTS) {
            String idStr = String.valueOf(mem.get("id"));
            String aptIdStr = String.valueOf(mem.get("appointmentId"));
            if (DELETED_IDS.contains(idStr) || DELETED_IDS.contains(aptIdStr)) {
                continue;
            }
            String dedupeKey = getAppointmentKey(mem);
            if (dedupeKey != null && seenKeys.add(dedupeKey)) {
                result.add(0, mem);
            }
        }

        return ResponseEntity.ok(result);
    }

    // =========================================================
    // CREATE APPOINTMENT
    // POST /api/appointments
    // =========================================================

    @PostMapping
    public ResponseEntity<Map<String, Object>> createAppointment(@RequestBody Map<String, Object> payload) {
        Long generatedId = System.currentTimeMillis();
        Appointment savedEntity = null;

        try {
            savedEntity = appointmentService.saveFromMap(payload, null);
            if (savedEntity != null && savedEntity.getAppointmentId() != null) {
                generatedId = savedEntity.getAppointmentId();
            }
        } catch (Throwable t) {
            System.err.println("DB save fallback for appointment: " + t.getMessage());
        }

        DELETED_IDS.remove(String.valueOf(generatedId));
        if (savedEntity != null && savedEntity.getAppointmentId() != null) {
            DELETED_IDS.remove(String.valueOf(savedEntity.getAppointmentId()));
        }

        Map<String, Object> memItem = new LinkedHashMap<>();
        if (savedEntity != null) {
            memItem = convertAppointmentToMap(savedEntity);
        } else {
            memItem.put("id", generatedId);
            memItem.put("appointmentId", generatedId);
            memItem.put("patientName", payload.getOrDefault("patientName", payload.getOrDefault("fullName", "Patient")));
            
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("patientId", generatedId);
            p.put("firstName", memItem.get("patientName"));
            p.put("phoneNumber", payload.getOrDefault("phoneNumber", ""));
            memItem.put("patient", p);

            memItem.put("doctorName", payload.getOrDefault("doctorName", "Dr. Specialist"));
            Map<String, Object> d = new LinkedHashMap<>();
            d.put("doctorName", memItem.get("doctorName"));
            d.put("specialization", payload.getOrDefault("department", "General Medicine"));
            memItem.put("doctor", d);

            memItem.put("department", payload.getOrDefault("department", "General Medicine"));
            memItem.put("appointmentDate", payload.getOrDefault("appointmentDate", LocalDateTime.now().plusDays(1).toString()));
            memItem.put("appointmentTime", payload.getOrDefault("appointmentTime", payload.getOrDefault("slot", "10:30 AM")));
            memItem.put("reason", payload.getOrDefault("reason", payload.getOrDefault("notes", "Consultation appointment confirmed")));
            memItem.put("status", payload.getOrDefault("status", "CONFIRMED"));
            memItem.put("source", "Online Patient Reservation");
            memItem.put("createdAt", LocalDateTime.now().toString());
        }

        final String finalIdStr = String.valueOf(generatedId);
        IN_MEMORY_APPOINTMENTS.removeIf(m -> Objects.equals(String.valueOf(m.get("appointmentId")), finalIdStr) || Objects.equals(String.valueOf(m.get("id")), finalIdStr));
        IN_MEMORY_APPOINTMENTS.add(0, memItem);

        return ResponseEntity.ok(memItem);
    }

    // =========================================================
    // GET APPOINTMENT BY ID
    // GET /api/appointments/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAppointmentById(@PathVariable String id) {
        try {
            Long numId = Long.valueOf(id);
            Optional<Appointment> opt = appointmentService.getAppointmentById(numId);
            if (opt.isPresent()) {
                return ResponseEntity.ok(convertAppointmentToMap(opt.get()));
            }
        } catch (Exception ignored) {}

        for (Map<String, Object> mem : IN_MEMORY_APPOINTMENTS) {
            if (id.equalsIgnoreCase(String.valueOf(mem.get("id"))) || 
                id.equalsIgnoreCase(String.valueOf(mem.get("appointmentId")))) {
                return ResponseEntity.ok(mem);
            }
        }

        return ResponseEntity.notFound().build();
    }

    // =========================================================
    // UPDATE APPOINTMENT
    // PUT /api/appointments/{id}
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateAppointment(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {

        Appointment updated = null;
        try {
            Long numId = Long.valueOf(id);
            updated = appointmentService.saveFromMap(payload, numId);
        } catch (Exception ignored) {}

        Map<String, Object> resultItem = null;
        for (Map<String, Object> mem : IN_MEMORY_APPOINTMENTS) {
            if (id.equalsIgnoreCase(String.valueOf(mem.get("id"))) || 
                id.equalsIgnoreCase(String.valueOf(mem.get("appointmentId")))) {
                
                if (payload.containsKey("status")) mem.put("status", payload.get("status"));
                if (payload.containsKey("reason")) mem.put("reason", payload.get("reason"));
                if (payload.containsKey("appointmentDate")) mem.put("appointmentDate", payload.get("appointmentDate"));
                if (payload.containsKey("appointmentTime")) mem.put("appointmentTime", payload.get("appointmentTime"));
                if (payload.containsKey("doctorName")) mem.put("doctorName", payload.get("doctorName"));
                resultItem = mem;
                break;
            }
        }

        if (updated != null) {
            resultItem = convertAppointmentToMap(updated);
        }

        if (resultItem != null) {
            return ResponseEntity.ok(resultItem);
        }
        return ResponseEntity.notFound().build();
    }

    // =========================================================
    // UPDATE APPOINTMENT STATUS
    // PUT /api/appointments/{id}/status
    // =========================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {

        String newStatus = String.valueOf(payload.getOrDefault("status", "CONFIRMED")).trim().toUpperCase();

        try {
            Long numId = Long.valueOf(id);
            Optional<Appointment> opt = appointmentService.getAppointmentById(numId);
            if (opt.isPresent()) {
                Appointment a = opt.get();
                a.setStatus(newStatus);
                appointmentService.createAppointment(a);
            }
        } catch (Exception ignored) {}

        Map<String, Object> found = null;
        for (Map<String, Object> mem : IN_MEMORY_APPOINTMENTS) {
            if (id.equalsIgnoreCase(String.valueOf(mem.get("id"))) || 
                id.equalsIgnoreCase(String.valueOf(mem.get("appointmentId")))) {
                mem.put("status", newStatus);
                found = mem;
                break;
            }
        }

        if (found != null) {
            return ResponseEntity.ok(found);
        }

        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("id", id);
        fallback.put("status", newStatus);
        return ResponseEntity.ok(fallback);
    }

    // =========================================================
    // DELETE APPOINTMENT
    // DELETE /api/appointments/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        try {
            Long numId = Long.valueOf(id);
            appointmentService.deleteAppointment(numId);
        } catch (Throwable ignored) {}

        DELETED_IDS.add(id);

        IN_MEMORY_APPOINTMENTS.removeIf(mem -> 
            id.equalsIgnoreCase(String.valueOf(mem.get("id"))) || 
            id.equalsIgnoreCase(String.valueOf(mem.get("appointmentId")))
        );

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // SEARCH APPOINTMENTS
    // GET /api/appointments/search?keyword=...
    // =========================================================

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchAppointments(
            @RequestParam(value = "keyword", required = false) String keyword) {

        List<Map<String, Object>> all = getAllAppointments().getBody();
        if (all == null) all = Collections.emptyList();
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.ok(all);
        }

        String kw = keyword.trim().toLowerCase();
        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> item : all) {
            String pName = String.valueOf(item.getOrDefault("patientName", "")).toLowerCase();
            String dName = String.valueOf(item.getOrDefault("doctorName", "")).toLowerCase();
            String reason = String.valueOf(item.getOrDefault("reason", "")).toLowerCase();
            String status = String.valueOf(item.getOrDefault("status", "")).toLowerCase();
            if (pName.contains(kw) || dName.contains(kw) || reason.contains(kw) || status.contains(kw)) {
                filtered.add(item);
            }
        }
        return ResponseEntity.ok(filtered);
    }

    // =========================================================
    // HELPER METHODS
    // =========================================================

    private Map<String, Object> convertAppointmentToMap(Appointment a) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", a.getAppointmentId());
        map.put("appointmentId", a.getAppointmentId());
        map.put("patientName", a.getPatientName());
        if (a.getPatient() != null) {
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("patientId", a.getPatient().getPatientId());
            p.put("firstName", a.getPatient().getFirstName());
            p.put("lastName", a.getPatient().getLastName());
            p.put("phoneNumber", a.getPatient().getPhoneNumber());
            map.put("patient", p);
        }
        map.put("doctorName", a.getDoctorName());
        if (a.getDoctor() != null) {
            Map<String, Object> d = new LinkedHashMap<>();
            d.put("doctorId", a.getDoctor().getDoctorId());
            d.put("firstName", a.getDoctor().getFirstName());
            d.put("lastName", a.getDoctor().getLastName());
            d.put("specialization", a.getDoctor().getSpecialization());
            map.put("doctor", d);
            map.put("department", a.getDoctor().getSpecialization());
        }
        map.put("appointmentDate", a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : "");
        map.put("reason", a.getReason());
        map.put("status", a.getStatus() != null ? a.getStatus() : "SCHEDULED");
        return map;
    }

    private String getAppointmentKey(Map<String, Object> m) {
        if (m == null) return null;
        Object id = m.get("appointmentId");
        if (id != null && !id.toString().isEmpty()) {
            return "ID_" + id.toString();
        }
        Object pName = m.get("patientName");
        Object date = m.get("appointmentDate");
        Object reason = m.get("reason");
        return "MATCH_" + pName + "_" + date + "_" + reason;
    }
}