package com.example.demo.controller;

import com.example.demo.entity.Bed;
import com.example.demo.repository.BedRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/beds")
public class BedScheduleController {

    private final BedRepository bedRepository;

    // In-memory persistent cache per bedId for schedules (persists during runtime)
    private static final Map<Long, Map<String, Object>> SCHEDULE_STORE = new ConcurrentHashMap<>();

    public BedScheduleController(BedRepository bedRepository) {
        this.bedRepository = bedRepository;
    }

    @GetMapping("/{bedId}/schedule")
    public ResponseEntity<Map<String, Object>> getBedSchedule(@PathVariable Long bedId) {
        Optional<Bed> bedOpt = bedRepository.findById(bedId);
        if (bedOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Bed bed = bedOpt.get();
        Map<String, Object> schedule = SCHEDULE_STORE.computeIfAbsent(bedId, id -> generateDefaultSchedule(bed));
        
        // Ensure bed info is up to date
        schedule.put("bedId", bed.getBedId());
        schedule.put("bedNumber", bed.getBedNumber());
        schedule.put("ward", bed.getWard());
        schedule.put("bedType", bed.getBedType());
        schedule.put("patientName", bed.getPatientName() != null ? bed.getPatientName() : "Unassigned Patient");
        schedule.put("status", bed.getStatus());
        schedule.put("admissionDate", bed.getAdmissionDate());

        return ResponseEntity.ok(schedule);
    }

    @PostMapping("/{bedId}/schedule")
    public ResponseEntity<Map<String, Object>> saveBedSchedule(
            @PathVariable Long bedId,
            @RequestBody Map<String, Object> newSchedule) {
        
        Optional<Bed> bedOpt = bedRepository.findById(bedId);
        if (bedOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Bed bed = bedOpt.get();
        newSchedule.put("bedId", bed.getBedId());
        newSchedule.put("bedNumber", bed.getBedNumber());
        newSchedule.put("ward", bed.getWard());
        newSchedule.put("bedType", bed.getBedType());
        newSchedule.put("patientName", bed.getPatientName() != null ? bed.getPatientName() : "Unassigned Patient");

        SCHEDULE_STORE.put(bedId, newSchedule);
        return ResponseEntity.ok(newSchedule);
    }

    @PutMapping("/{bedId}/schedule")
    public ResponseEntity<Map<String, Object>> updateBedSchedule(
            @PathVariable Long bedId,
            @RequestBody Map<String, Object> updatedSchedule) {
        return saveBedSchedule(bedId, updatedSchedule);
    }

    private Map<String, Object> generateDefaultSchedule(Bed bed) {
        Map<String, Object> sched = new LinkedHashMap<>();
        sched.put("bedId", bed.getBedId());
        sched.put("bedNumber", bed.getBedNumber());
        sched.put("ward", bed.getWard());
        sched.put("bedType", bed.getBedType());
        sched.put("patientName", bed.getPatientName() != null ? bed.getPatientName() : "General Admitted Patient");
        sched.put("status", bed.getStatus());
        sched.put("admissionDate", bed.getAdmissionDate());

        // Default Tablet / Medication Schedule
        List<Map<String, Object>> tablets = new ArrayList<>();

        Map<String, Object> t1 = new LinkedHashMap<>();
        t1.put("id", 1);
        t1.put("time", "07:30 AM");
        t1.put("tabletName", "Pantoprazole 40mg (Antacid)");
        t1.put("dosage", "1 Tablet (Oral)");
        t1.put("foodRelation", "Before Food (Empty Stomach)");
        t1.put("status", "GIVEN");
        t1.put("nurseNotes", "Administered with warm water");
        tablets.add(t1);

        Map<String, Object> t2 = new LinkedHashMap<>();
        t2.put("id", 2);
        t2.put("time", "09:00 AM");
        t2.put("tabletName", "Amoxicillin 500mg + Vitamin C 500mg");
        t2.put("dosage", "1 Cap + 1 Tab");
        t2.put("foodRelation", "After Breakfast");
        t2.put("status", "GIVEN");
        t2.put("nurseNotes", "Post morning breakfast");
        tablets.add(t2);

        Map<String, Object> t3 = new LinkedHashMap<>();
        t3.put("id", 3);
        t3.put("time", "01:30 PM");
        t3.put("tabletName", "Paracetamol 650mg (Dolo)");
        t3.put("dosage", "1 Tablet (Oral)");
        t3.put("foodRelation", "After Lunch");
        t3.put("status", "PENDING");
        t3.put("nurseNotes", "For fever and pain relief");
        tablets.add(t3);

        Map<String, Object> t4 = new LinkedHashMap<>();
        t4.put("id", 4);
        t4.put("time", "06:00 PM");
        t4.put("tabletName", "Multivitamin & Zinc Supplement");
        t4.put("dosage", "1 Tablet");
        t4.put("foodRelation", "After Evening Tea/Snacks");
        t4.put("status", "PENDING");
        t4.put("nurseNotes", "Routine immunity booster");
        tablets.add(t4);

        Map<String, Object> t5 = new LinkedHashMap<>();
        t5.put("id", 5);
        t5.put("time", "09:00 PM");
        t5.put("tabletName", "Amoxicillin 500mg + Atorvastatin 10mg");
        t5.put("dosage", "1 Cap + 1 Tab");
        t5.put("foodRelation", "After Dinner");
        t5.put("status", "PENDING");
        t5.put("nurseNotes", "Night dose after dinner");
        tablets.add(t5);

        sched.put("tabletSchedule", tablets);

        // Default Food / Diet Schedule
        List<Map<String, Object>> foods = new ArrayList<>();

        Map<String, Object> f1 = new LinkedHashMap<>();
        f1.put("id", 1);
        f1.put("time", "07:30 AM");
        f1.put("mealType", "Morning Drink");
        f1.put("dietType", "Warm Herbal Green Tea / Luke Warm Water");
        f1.put("items", "1 Cup Warm Herbal Tea with 4 Soaked Almonds");
        f1.put("status", "SERVED");
        f1.put("notes", "No added refined sugar");
        foods.add(f1);

        Map<String, Object> f2 = new LinkedHashMap<>();
        f2.put("id", 2);
        f2.put("time", "08:30 AM");
        f2.put("mealType", "Breakfast");
        f2.put("dietType", "Soft & Easy Digestible Hospital Diet");
        f2.put("items", "3 Steamed Idlis with Vegetable Sambar & Mint Chutney, 1 Boiled Egg white");
        f2.put("status", "SERVED");
        f2.put("notes", "Low salt, oil-free preparation");
        foods.add(f2);

        Map<String, Object> f3 = new LinkedHashMap<>();
        f3.put("id", 3);
        f3.put("time", "11:30 AM");
        f3.put("mealType", "Mid-Morning Refreshment");
        f3.put("dietType", "Fresh Hydration / Soup");
        f3.put("items", "Fresh Tender Coconut Water or Warm Clear Vegetable Soup");
        f3.put("status", "PENDING");
        f3.put("notes", "Electrolyte restoration");
        foods.add(f3);

        Map<String, Object> f4 = new LinkedHashMap<>();
        f4.put("id", 4);
        f4.put("time", "01:00 PM");
        f4.put("mealType", "Lunch");
        f4.put("dietType", "Standard Nutritious Clinical Meal");
        f4.put("items", "1 Bowl Steamed Sona Masoori Rice, Yellow Moong Dal, Steamed Beans & Carrots, 1 Cup Low-fat Fresh Curd");
        f4.put("status", "PENDING");
        f4.put("notes", "Balanced carbohydrates & proteins");
        foods.add(f4);

        Map<String, Object> f5 = new LinkedHashMap<>();
        f5.put("id", 5);
        f5.put("time", "05:00 PM");
        f5.put("mealType", "Evening Snacks");
        f5.put("dietType", "Light Snacks");
        f5.put("items", "Warm Milk (Low Fat) or Green Tea + 2 Multigrain Biscuits / Roasted Makhana");
        f5.put("status", "PENDING");
        f5.put("notes", "Sugar-free milk");
        foods.add(f5);

        Map<String, Object> f6 = new LinkedHashMap<>();
        f6.put("id", 6);
        f6.put("time", "08:00 PM");
        f6.put("mealType", "Dinner");
        f6.put("dietType", "Light Night Meal");
        f6.put("items", "2 Soft Whole Wheat Phulkas, Mixed Vegetable Stew / Moong Dal Khichdi, 1 Cup Soup");
        f6.put("status", "PENDING");
        f6.put("notes", "To be completed 2 hours before sleep");
        foods.add(f6);

        Map<String, Object> f7 = new LinkedHashMap<>();
        f7.put("id", 7);
        f7.put("time", "09:30 PM");
        f7.put("mealType", "Bedtime Drink");
        f7.put("dietType", "Comfort Hydration");
        f7.put("items", "1 Small Cup Warm Turmeric Milk");
        f7.put("status", "PENDING");
        f7.put("notes", "Warm bedtime drink");
        foods.add(f7);

        sched.put("foodSchedule", foods);

        return sched;
    }
}