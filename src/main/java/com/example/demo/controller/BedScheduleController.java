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

        // Default In-Patient Prescribed Medicines
        List<Map<String, Object>> medicines = new ArrayList<>();

        Map<String, Object> m1 = new LinkedHashMap<>();
        m1.put("id", 1);
        m1.put("medicineName", "Tab. Telmisartan 40mg");
        m1.put("category", "Cardiology / Antihypertensive");
        m1.put("dosage", "1 Tablet (Oral)");
        m1.put("frequency", "Once Daily (1-0-0)");
        m1.put("instructions", "Morning Before Breakfast");
        m1.put("prescribedBy", "Dr. Suresh Menon (Cardiology)");
        m1.put("datePrescribed", "2026-08-28");
        m1.put("duration", "30 Days");
        m1.put("status", "ACTIVE");
        medicines.add(m1);

        Map<String, Object> m2 = new LinkedHashMap<>();
        m2.put("id", 2);
        m2.put("medicineName", "Tab. Metformin 500mg SR");
        m2.put("category", "Diabetology / Glycemic Control");
        m2.put("dosage", "1 Tablet (Oral)");
        m2.put("frequency", "Twice Daily (1-0-1)");
        m2.put("instructions", "With Meals (Breakfast & Dinner)");
        m2.put("prescribedBy", "Dr. Ananya Rao (General Medicine)");
        m2.put("datePrescribed", "2026-08-28");
        m2.put("duration", "30 Days");
        m2.put("status", "ACTIVE");
        medicines.add(m2);

        Map<String, Object> m3 = new LinkedHashMap<>();
        m3.put("id", 3);
        m3.put("medicineName", "Tab. Atorvastatin 20mg");
        m3.put("category", "Lipid Lowering / Statin");
        m3.put("dosage", "1 Tablet (Oral)");
        m3.put("frequency", "Once Nightly (0-0-1)");
        m3.put("instructions", "After Dinner (Bedtime)");
        m3.put("prescribedBy", "Dr. Suresh Menon (Cardiology)");
        m3.put("datePrescribed", "2026-09-01");
        m3.put("duration", "60 Days");
        m3.put("status", "ACTIVE");
        medicines.add(m3);

        Map<String, Object> m4 = new LinkedHashMap<>();
        m4.put("id", 4);
        m4.put("medicineName", "Inj. Pantoprazole 40mg IV");
        m4.put("category", "Gastroenterology / PPI");
        m4.put("dosage", "40mg IV Infusion");
        m4.put("frequency", "Once Daily (OD)");
        m4.put("instructions", "Slow IV injection with NS flush");
        m4.put("prescribedBy", "Dr. Suresh Menon");
        m4.put("datePrescribed", "2026-09-05");
        m4.put("duration", "5 Days");
        m4.put("status", "ACTIVE");
        medicines.add(m4);

        Map<String, Object> m5 = new LinkedHashMap<>();
        m5.put("id", 5);
        m5.put("medicineName", "Cap. Augmentin 625mg (Amoxicillin + Clavulanic)");
        m5.put("category", "Antibiotics / Anti-infective");
        m5.put("dosage", "1 Capsule (Oral)");
        m5.put("frequency", "Twice Daily (1-0-1)");
        m5.put("instructions", "After Food with water");
        m5.put("prescribedBy", "Dr. Ananya Rao");
        m5.put("datePrescribed", "2026-08-25");
        m5.put("duration", "7 Days");
        m5.put("status", "COMPLETED");
        medicines.add(m5);

        sched.put("medicines", medicines);

        // Default Laboratory & Diagnostic Reports
        List<Map<String, Object>> labReports = new ArrayList<>();

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
        l1.put("summary", "Cholesterol: 220 mg/dL, Troponin I: Normal (0.01 ng/mL). Cardiac enzymes stable; lipid fraction elevated.");
        List<Map<String, Object>> l1Params = new ArrayList<>();
        l1Params.add(Map.of("name", "High-Sensitivity Troponin-I (hs-cTnI)", "value", "0.01", "unit", "ng/mL", "refRange", "< 0.04 ng/mL", "status", "NORMAL"));
        l1Params.add(Map.of("name", "Total Cholesterol", "value", "220", "unit", "mg/dL", "refRange", "< 200 mg/dL", "status", "HIGH"));
        l1Params.add(Map.of("name", "LDL Cholesterol (Direct)", "value", "142", "unit", "mg/dL", "refRange", "< 100 mg/dL", "status", "HIGH"));
        l1Params.add(Map.of("name", "HDL Cholesterol", "value", "38", "unit", "mg/dL", "refRange", "> 40 mg/dL", "status", "LOW"));
        l1Params.add(Map.of("name", "Serum Triglycerides", "value", "190", "unit", "mg/dL", "refRange", "< 150 mg/dL", "status", "HIGH"));
        l1Params.add(Map.of("name", "Creatine Kinase-MB (CK-MB)", "value", "16.2", "unit", "U/L", "refRange", "< 25 U/L", "status", "NORMAL"));
        l1.put("parameters", l1Params);
        labReports.add(l1);

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
        l2.put("summary", "Hemogram profile within physiological limits. Leucocyte count and platelets normal.");
        List<Map<String, Object>> l2Params = new ArrayList<>();
        l2Params.add(Map.of("name", "Hemoglobin (Hb)", "value", "14.5", "unit", "g/dL", "refRange", "13.0 - 17.0", "status", "NORMAL"));
        l2Params.add(Map.of("name", "Total WBC Count", "value", "7,400", "unit", "/µL", "refRange", "4,000 - 11,000", "status", "NORMAL"));
        l2Params.add(Map.of("name", "Platelet Count", "value", "245,000", "unit", "/µL", "refRange", "150,000 - 450,000", "status", "NORMAL"));
        l2Params.add(Map.of("name", "Packed Cell Volume (PCV)", "value", "43.2", "unit", "%", "refRange", "40.0 - 50.0", "status", "NORMAL"));
        l2Params.add(Map.of("name", "ESR (Westergren)", "value", "12", "unit", "mm/hr", "refRange", "0 - 15", "status", "NORMAL"));
        l2Params.add(Map.of("name", "Neutrophils", "value", "62", "unit", "%", "refRange", "40 - 75", "status", "NORMAL"));
        l2Params.add(Map.of("name", "Lymphocytes", "value", "30", "unit", "%", "refRange", "20 - 45", "status", "NORMAL"));
        l2.put("parameters", l2Params);
        labReports.add(l2);

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
        l3.put("summary", "Serum Creatinine: 1.05 mg/dL, eGFR: 88 mL/min/1.73m². Adequate renal clearance.");
        List<Map<String, Object>> l3Params = new ArrayList<>();
        l3Params.add(Map.of("name", "Serum Creatinine", "value", "1.05", "unit", "mg/dL", "refRange", "0.70 - 1.30", "status", "NORMAL"));
        l3Params.add(Map.of("name", "Blood Urea Nitrogen (BUN)", "value", "18.2", "unit", "mg/dL", "refRange", "8.0 - 23.0", "status", "NORMAL"));
        l3Params.add(Map.of("name", "Serum Sodium (Na+)", "value", "139", "unit", "mEq/L", "refRange", "135 - 145", "status", "NORMAL"));
        l3Params.add(Map.of("name", "Serum Potassium (K+)", "value", "4.3", "unit", "mEq/L", "refRange", "3.5 - 5.1", "status", "NORMAL"));
        l3Params.add(Map.of("name", "eGFR", "value", "88", "unit", "mL/min/1.73m²", "refRange", "> 60", "status", "NORMAL"));
        l3.put("parameters", l3Params);
        labReports.add(l3);

        sched.put("labReports", labReports);

        return sched;
    }
}