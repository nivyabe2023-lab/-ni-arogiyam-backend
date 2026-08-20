package com.example.demo.config;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initHospitalData(
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository,
            MedicineRepository medicineRepository,
            LaboratoryRepository laboratoryRepository,
            BedRepository bedRepository,
            BillRepository billRepository,
            ReportRepository reportRepository
    ) {
        return args -> {
            // =========================================================
            // 1. DEFAULT USERS (ADMIN & STAFF USER)
            // =========================================================
            var existingAdmin = userRepository.findByUsernameIgnoreCase("admin");
            if (existingAdmin.isEmpty()) {
                User admin = new User();
                admin.setUsername("Admin");
                admin.setPassword("Admin@123");
                admin.setFullName("Hospital Administrator");
                admin.setEmail("admin@ni-arogiyam.com");
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("✅ Default Admin created: username=Admin, password=Admin@123, role=ADMIN");
            } else {
                User admin = existingAdmin.get();
                admin.setUsername("Admin");
                admin.setPassword("Admin@123");
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("✅ Existing Admin synchronized: username=Admin, password=Admin@123, role=ADMIN");
            }

            var existingUser = userRepository.findByUsernameIgnoreCase("user");
            if (existingUser.isEmpty()) {
                User staffUser = new User();
                staffUser.setUsername("user");
                staffUser.setPassword("user123");
                staffUser.setFullName("Hospital Staff User");
                staffUser.setEmail("staff@ni-arogiyam.com");
                staffUser.setRole("STAFF");
                userRepository.save(staffUser);
                System.out.println("✅ Default Staff User created: username=user, password=user123, role=STAFF");
            }

            // =========================================================
            // 2. DOCTORS ACROSS MULTIPLE SPECIALTIES / DOMAINS
            // =========================================================
            if (doctorRepository.count() < 5) {
                Doctor d1 = new Doctor();
                d1.setFirstName("Rajesh");
                d1.setLastName("Sharma");
                d1.setSpecialization("Cardiologist");
                d1.setPhoneNumber("9876543210");
                d1.setEmail("dr.rajesh.sharma@ni-arogiyam.com");
                d1.setExperience(15);
                d1.setAvailability("Mon - Sat (09:00 AM - 02:00 PM)");
                doctorRepository.save(d1);

                Doctor d2 = new Doctor();
                d2.setFirstName("Priya");
                d2.setLastName("Venkatesh");
                d2.setSpecialization("Neurologist");
                d2.setPhoneNumber("9876543211");
                d2.setEmail("dr.priya.v@ni-arogiyam.com");
                d2.setExperience(12);
                d2.setAvailability("Mon - Fri (10:00 AM - 04:00 PM)");
                doctorRepository.save(d2);

                Doctor d3 = new Doctor();
                d3.setFirstName("Ananya");
                d3.setLastName("Iyer");
                d3.setSpecialization("Orthopedic Surgeon");
                d3.setPhoneNumber("9876543212");
                d3.setEmail("dr.ananya.iyer@ni-arogiyam.com");
                d3.setExperience(10);
                d3.setAvailability("Tue - Sat (09:00 AM - 01:00 PM)");
                doctorRepository.save(d3);

                Doctor d4 = new Doctor();
                d4.setFirstName("Karthik");
                d4.setLastName("Subramanian");
                d4.setSpecialization("Pediatrician");
                d4.setPhoneNumber("9876543213");
                d4.setEmail("dr.karthik.s@ni-arogiyam.com");
                d4.setExperience(8);
                d4.setAvailability("Mon - Sat (08:30 AM - 01:30 PM)");
                doctorRepository.save(d4);

                Doctor d5 = new Doctor();
                d5.setFirstName("Shalini");
                d5.setLastName("Nair");
                d5.setSpecialization("Dermatologist");
                d5.setPhoneNumber("9876543214");
                d5.setEmail("dr.shalini.nair@ni-arogiyam.com");
                d5.setExperience(9);
                d5.setAvailability("Mon - Fri (02:00 PM - 06:00 PM)");
                doctorRepository.save(d5);

                Doctor d6 = new Doctor();
                d6.setFirstName("Arvind");
                d6.setLastName("Swaminathan");
                d6.setSpecialization("General Physician & Diabetologist");
                d6.setPhoneNumber("9876543215");
                d6.setEmail("dr.arvind.s@ni-arogiyam.com");
                d6.setExperience(14);
                d6.setAvailability("Mon - Sat (09:00 AM - 05:00 PM)");
                doctorRepository.save(d6);

                Doctor d7 = new Doctor();
                d7.setFirstName("Meenakshi");
                d7.setLastName("Sundaram");
                d7.setSpecialization("Oncologist");
                d7.setPhoneNumber("9876543216");
                d7.setEmail("dr.meenakshi.s@ni-arogiyam.com");
                d7.setExperience(16);
                d7.setAvailability("Mon, Wed, Fri (10:00 AM - 03:00 PM)");
                doctorRepository.save(d7);

                Doctor d8 = new Doctor();
                d8.setFirstName("Vivek");
                d8.setLastName("Murthy");
                d8.setSpecialization("Nephrologist");
                d8.setPhoneNumber("9876543217");
                d8.setEmail("dr.vivek.m@ni-arogiyam.com");
                d8.setExperience(13);
                d8.setAvailability("Mon - Fri (09:00 AM - 01:00 PM)");
                doctorRepository.save(d8);

                Doctor d9 = new Doctor();
                d9.setFirstName("Saranya");
                d9.setLastName("Devi");
                d9.setSpecialization("Gynecologist & Obstetrician");
                d9.setPhoneNumber("9876543218");
                d9.setEmail("dr.saranya.d@ni-arogiyam.com");
                d9.setExperience(11);
                d9.setAvailability("Mon - Sat (10:00 AM - 03:00 PM)");
                doctorRepository.save(d9);

                Doctor d10 = new Doctor();
                d10.setFirstName("Harish");
                d10.setLastName("Balaji");
                d10.setSpecialization("ENT Specialist");
                d10.setPhoneNumber("9876543219");
                d10.setEmail("dr.harish.b@ni-arogiyam.com");
                d10.setExperience(9);
                d10.setAvailability("Tue - Sun (09:30 AM - 02:30 PM)");
                doctorRepository.save(d10);

                System.out.println("✅ Seeded 10 Doctors across Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, General Medicine, Oncology, Nephrology, Gynecology, ENT.");
            }

            // =========================================================
            // 3. REALISTIC PATIENT RECORDS
            // =========================================================
            if (patientRepository.count() < 5) {
                Patient p1 = new Patient(null, "Rajesh", "Kumar", 52, "Male", "9840123456", "O+", "Coronary Artery Disease (CAD)", "12, 4th Main Road, Anna Nagar, Chennai", "541278902341");
                Patient p2 = new Patient(null, "Meera", "Krishnan", 45, "Female", "9840234567", "B+", "Chronic Migraine & Cervical Spondylosis", "45, Usman Road, T. Nagar, Chennai", "892345617890");
                Patient p3 = new Patient(null, "Suresh", "Raman", 61, "Male", "9840345678", "A+", "Type 2 Diabetes Mellitus with Hypertension", "78, 100 Feet Road, Velachery, Chennai", "345678901234");
                Patient p4 = new Patient(null, "Kavitha", "Sundar", 28, "Female", "9840456789", "AB+", "Acute Bronchial Asthma", "23, Gandhi Nagar, Adyar, Chennai", "678901234567");
                Patient p5 = new Patient(null, "Arunachalam", "Pillai", 68, "Male", "9840567890", "O-", "Bilateral Knee Osteoarthritis", "89, GST Road, Tambaram, Chennai", "901234567890");
                Patient p6 = new Patient(null, "Deepa", "Natarajan", 34, "Female", "9840678901", "A-", "Atopic Dermatitis & Eczema", "56, Luz Church Road, Mylapore, Chennai", "432187650987");
                Patient p7 = new Patient(null, "Vigneshwaran", "Karthik", 39, "Male", "9840789012", "B-", "Chronic Kidney Disease Stage 2", "77, North Usman Road, T. Nagar, Chennai", "789012345678");
                Patient p8 = new Patient(null, "Radhika", "Parthasarathy", 31, "Female", "9840890123", "O+", "First Trimester Antenatal Care & Thyroid Screening", "34, Sardar Patel Road, Guindy, Chennai", "234567890123");
                Patient p9 = new Patient(null, "Murugesan", "Thevar", 58, "Male", "9840901234", "AB-", "Chronic Sinusitis & DNS", "19, Rajaji Salai, George Town, Chennai", "901234567123");
                Patient p10 = new Patient(null, "Aarthi", "Sridharan", 26, "Female", "9840012345", "A+", "Generalized Anxiety & Insomnia", "88, Santhome High Road, Mylapore, Chennai", "456789012345");

                patientRepository.save(p1);
                patientRepository.save(p2);
                patientRepository.save(p3);
                patientRepository.save(p4);
                patientRepository.save(p5);
                patientRepository.save(p6);
                patientRepository.save(p7);
                patientRepository.save(p8);
                patientRepository.save(p9);
                patientRepository.save(p10);

                System.out.println("✅ Seeded 10 comprehensive Patient records with Aadhaar numbers and conditions.");
            }

            // =========================================================
            // 4. APPOINTMENTS (LINKED TO SPECIALISTS)
            // =========================================================
            if (appointmentRepository.count() < 5) {
                var patientsList = patientRepository.findAll();
                var doctorsList = doctorRepository.findAll();

                if (!patientsList.isEmpty() && !doctorsList.isEmpty()) {
                    Patient pRajesh = patientsList.get(0);
                    Patient pMeera = patientsList.size() > 1 ? patientsList.get(1) : pRajesh;
                    Patient pSuresh = patientsList.size() > 2 ? patientsList.get(2) : pRajesh;
                    Patient pKavitha = patientsList.size() > 3 ? patientsList.get(3) : pRajesh;
                    Patient pArunachalam = patientsList.size() > 4 ? patientsList.get(4) : pRajesh;
                    Patient pDeepa = patientsList.size() > 5 ? patientsList.get(5) : pRajesh;
                    Patient pVignesh = patientsList.size() > 6 ? patientsList.get(6) : pRajesh;
                    Patient pRadhika = patientsList.size() > 7 ? patientsList.get(7) : pRajesh;

                    Doctor dCardio = doctorsList.stream().filter(d -> d.getSpecialization().contains("Cardio")).findFirst().orElse(doctorsList.get(0));
                    Doctor dNeuro = doctorsList.stream().filter(d -> d.getSpecialization().contains("Neuro")).findFirst().orElse(doctorsList.get(0));
                    Doctor dPhysician = doctorsList.stream().filter(d -> d.getSpecialization().contains("Physician")).findFirst().orElse(doctorsList.get(0));
                    Doctor dOrtho = doctorsList.stream().filter(d -> d.getSpecialization().contains("Ortho")).findFirst().orElse(doctorsList.get(0));
                    Doctor dPediatric = doctorsList.stream().filter(d -> d.getSpecialization().contains("Pedia")).findFirst().orElse(doctorsList.get(0));
                    Doctor dDerma = doctorsList.stream().filter(d -> d.getSpecialization().contains("Derma")).findFirst().orElse(doctorsList.get(0));
                    Doctor dNephro = doctorsList.stream().filter(d -> d.getSpecialization().contains("Nephro")).findFirst().orElse(doctorsList.get(0));
                    Doctor dGyneco = doctorsList.stream().filter(d -> d.getSpecialization().contains("Gyneco")).findFirst().orElse(doctorsList.get(0));

                    Appointment a1 = new Appointment();
                    a1.setPatient(pRajesh);
                    a1.setDoctor(dCardio);
                    a1.setAppointmentDate(LocalDateTime.now().withHour(10).withMinute(30));
                    a1.setReason("Cardiac Angiography Evaluation & ECG Review");
                    a1.setStatus("CONFIRMED");
                    appointmentRepository.save(a1);

                    Appointment a2 = new Appointment();
                    a2.setPatient(pSuresh);
                    a2.setDoctor(dPhysician);
                    a2.setAppointmentDate(LocalDateTime.now().withHour(11).withMinute(15));
                    a2.setReason("Diabetic follow-up & Blood Sugar Monitoring");
                    a2.setStatus("SCHEDULED");
                    appointmentRepository.save(a2);

                    Appointment a3 = new Appointment();
                    a3.setPatient(pMeera);
                    a3.setDoctor(dNeuro);
                    a3.setAppointmentDate(LocalDateTime.now().withHour(14).withMinute(0));
                    a3.setReason("Severe Migraine & Cervical Spine Evaluation");
                    a3.setStatus("SCHEDULED");
                    appointmentRepository.save(a3);

                    Appointment a4 = new Appointment();
                    a4.setPatient(pArunachalam);
                    a4.setDoctor(dOrtho);
                    a4.setAppointmentDate(LocalDateTime.now().plusDays(1).withHour(9).withMinute(45));
                    a4.setReason("Knee Joint Pain & X-Ray Examination");
                    a4.setStatus("SCHEDULED");
                    appointmentRepository.save(a4);

                    Appointment a5 = new Appointment();
                    a5.setPatient(pKavitha);
                    a5.setDoctor(dPediatric);
                    a5.setAppointmentDate(LocalDateTime.now().plusDays(1).withHour(11).withMinute(30));
                    a5.setReason("Asthma Nebulization & Allergy Screening");
                    a5.setStatus("SCHEDULED");
                    appointmentRepository.save(a5);

                    Appointment a6 = new Appointment();
                    a6.setPatient(pDeepa);
                    a6.setDoctor(dDerma);
                    a6.setAppointmentDate(LocalDateTime.now().plusDays(2).withHour(15).withMinute(0));
                    a6.setReason("Atopic Dermatitis patch test review");
                    a6.setStatus("SCHEDULED");
                    appointmentRepository.save(a6);

                    Appointment a7 = new Appointment();
                    a7.setPatient(pVignesh);
                    a7.setDoctor(dNephro);
                    a7.setAppointmentDate(LocalDateTime.now().plusDays(2).withHour(10).withMinute(0));
                    a7.setReason("Renal Function & Serum Creatinine Review");
                    a7.setStatus("SCHEDULED");
                    appointmentRepository.save(a7);

                    Appointment a8 = new Appointment();
                    a8.setPatient(pRadhika);
                    a8.setDoctor(dGyneco);
                    a8.setAppointmentDate(LocalDateTime.now().plusDays(3).withHour(11).withMinute(0));
                    a8.setReason("Obstetric Ultrasound & Routine Antenatal Checkup");
                    a8.setStatus("CONFIRMED");
                    appointmentRepository.save(a8);

                    System.out.println("✅ Seeded 8 scheduled Appointments with Cardiologist, Neurologist, Nephrologist, Gynecologist, etc.");
                }
            }

            // =========================================================
            // 5. PHARMACY MEDICINES
            // =========================================================
            if (medicineRepository.count() < 5) {
                Medicine m1 = new Medicine();
                m1.setMedicineName("Atorvastatin 20mg");
                m1.setCategory("Cardiovascular");
                m1.setQuantity(500);
                m1.setPrice(180.0);
                m1.setManufacturer("Sun Pharma");
                medicineRepository.save(m1);

                Medicine m2 = new Medicine();
                m2.setMedicineName("Metoprolol Succinate 50mg");
                m2.setCategory("Cardiovascular / Beta Blocker");
                m2.setQuantity(400);
                m2.setPrice(145.0);
                m2.setManufacturer("Cipla");
                medicineRepository.save(m2);

                Medicine m3 = new Medicine();
                m3.setMedicineName("Metformin 500mg");
                m3.setCategory("Anti-Diabetic");
                m3.setQuantity(800);
                m3.setPrice(65.0);
                m3.setManufacturer("USV Ltd");
                medicineRepository.save(m3);

                Medicine m4 = new Medicine();
                m4.setMedicineName("Telmisartan 40mg");
                m4.setCategory("Anti-Hypertensive");
                m4.setQuantity(600);
                m4.setPrice(120.0);
                m4.setManufacturer("Glenmark");
                medicineRepository.save(m4);

                Medicine m5 = new Medicine();
                m5.setMedicineName("Budesonide Inhaler 200mcg");
                m5.setCategory("Respiratory");
                m5.setQuantity(250);
                m5.setPrice(320.0);
                m5.setManufacturer("Cipla");
                medicineRepository.save(m5);

                Medicine m6 = new Medicine();
                m6.setMedicineName("Sumatriptan 50mg");
                m6.setCategory("Neurology / Migraine");
                m6.setQuantity(150);
                m6.setPrice(210.0);
                m6.setManufacturer("Dr. Reddy's");
                medicineRepository.save(m6);

                Medicine m7 = new Medicine();
                m7.setMedicineName("Paracetamol 650mg");
                m7.setCategory("Analgesic / Antipyretic");
                m7.setQuantity(1500);
                m7.setPrice(35.0);
                m7.setManufacturer("Micro Labs");
                medicineRepository.save(m7);

                Medicine m8 = new Medicine();
                m8.setMedicineName("Amoxicillin + Clavulanic Acid 625mg");
                m8.setCategory("Antibiotic");
                m8.setQuantity(350);
                m8.setPrice(190.0);
                m8.setManufacturer("Alkem Laboratories");
                medicineRepository.save(m8);

                Medicine m9 = new Medicine();
                m9.setMedicineName("Pantoprazole 40mg");
                m9.setCategory("Gastrointestinal / Antacid");
                m9.setQuantity(700);
                m9.setPrice(95.0);
                m9.setManufacturer("Aristo Pharma");
                medicineRepository.save(m9);

                Medicine m10 = new Medicine();
                m10.setMedicineName("Methylcobalamin + Pregabalin 75mg");
                m10.setCategory("Neurology / Nerve Health");
                m10.setQuantity(300);
                m10.setPrice(260.0);
                m10.setManufacturer("Torrent Pharma");
                medicineRepository.save(m10);

                System.out.println("✅ Seeded essential Pharmacy Medicines.");
            }

            // =========================================================
            // 6. LABORATORY INVESTIGATIONS
            // =========================================================
            if (laboratoryRepository.count() < 4) {
                var patientsList = patientRepository.findAll();
                if (!patientsList.isEmpty()) {
                    Laboratory l1 = new Laboratory();
                    l1.setPatient(patientsList.get(0));
                    l1.setTestName("Lipid Profile & Troponin I");
                    l1.setTestType("Cardiology Panel");
                    l1.setTestDate(LocalDateTime.now().minusDays(1));
                    l1.setResult("Cholesterol: 220 mg/dL, Troponin I: Normal (0.01 ng/mL)");
                    l1.setStatus("COMPLETED");
                    l1.setRemarks("Biomarkers stable. Continue statin therapy.");
                    laboratoryRepository.save(l1);

                    if (patientsList.size() > 2) {
                        Laboratory l2 = new Laboratory();
                        l2.setPatient(patientsList.get(2));
                        l2.setTestName("HbA1c & Fasting Glucose");
                        l2.setTestType("Diabetic Panel");
                        l2.setTestDate(LocalDateTime.now().minusDays(2));
                        l2.setResult("HbA1c: 7.4%, Fasting Glucose: 142 mg/dL");
                        l2.setStatus("COMPLETED");
                        l2.setRemarks("Target HbA1c < 7.0%. Diet management advised.");
                        laboratoryRepository.save(l2);
                    }

                    if (patientsList.size() > 1) {
                        Laboratory l3 = new Laboratory();
                        l3.setPatient(patientsList.get(1));
                        l3.setTestName("MRI Brain & Cervical Spine");
                        l3.setTestType("Radiology / Neuroimaging");
                        l3.setTestDate(LocalDateTime.now());
                        l3.setResult("Mild C5-C6 disc bulge; no intracranial pathology.");
                        l3.setStatus("IN_PROGRESS");
                        l3.setRemarks("Awaiting full radiologist sign-off.");
                        laboratoryRepository.save(l3);
                    }

                    if (patientsList.size() > 6) {
                        Laboratory l4 = new Laboratory();
                        l4.setPatient(patientsList.get(6));
                        l4.setTestName("Renal Function Test & Serum Creatinine");
                        l4.setTestType("Nephrology Panel");
                        l4.setTestDate(LocalDateTime.now().minusDays(1));
                        l4.setResult("Serum Creatinine: 1.6 mg/dL, eGFR: 55 mL/min/1.73m²");
                        l4.setStatus("COMPLETED");
                        l4.setRemarks("CKD Stage 2 stable. Maintain hydration and low-sodium diet.");
                        laboratoryRepository.save(l4);
                    }

                    if (patientsList.size() > 7) {
                        Laboratory l5 = new Laboratory();
                        l5.setPatient(patientsList.get(7));
                        l5.setTestName("Complete Blood Count & Thyroid Panel (TSH)");
                        l5.setTestType("Endocrine & Hematology");
                        l5.setTestDate(LocalDateTime.now());
                        l5.setResult("Hemoglobin: 12.2 g/dL, TSH: 2.1 mIU/L (Euthyroid)");
                        l5.setStatus("COMPLETED");
                        l5.setRemarks("Normal maternal parameters.");
                        laboratoryRepository.save(l5);
                    }

                    System.out.println("✅ Seeded Laboratory Investigation records.");
                }
            }

            // =========================================================
            // 7. HOSPITAL BEDS & OCCUPANCY
            // =========================================================
            if (bedRepository.count() < 5) {
                Bed b1 = new Bed();
                b1.setBedNumber("CCU-101");
                b1.setWard("Cardiology Critical Unit");
                b1.setBedType("Cardiac ICU");
                b1.setPatientName("Rajesh Kumar");
                b1.setStatus("OCCUPIED");
                b1.setAdmissionDate(LocalDate.now().minusDays(1));
                bedRepository.save(b1);

                Bed b2 = new Bed();
                b2.setBedNumber("NEURO-204");
                b2.setWard("Neurology Ward");
                b2.setBedType("Special Inpatient Room");
                b2.setPatientName("Meera Krishnan");
                b2.setStatus("OCCUPIED");
                b2.setAdmissionDate(LocalDate.now());
                bedRepository.save(b2);

                Bed b3 = new Bed();
                b3.setBedNumber("GEN-301");
                b3.setWard("General Male Ward");
                b3.setBedType("Standard Bed");
                b3.setStatus("AVAILABLE");
                bedRepository.save(b3);

                Bed b4 = new Bed();
                b4.setBedNumber("GEN-302");
                b4.setWard("General Male Ward");
                b4.setBedType("Standard Bed");
                b4.setStatus("AVAILABLE");
                bedRepository.save(b4);

                Bed b5 = new Bed();
                b5.setBedNumber("ICU-001");
                b5.setWard("Emergency ICU");
                b5.setBedType("Ventilator Bed");
                b5.setStatus("AVAILABLE");
                bedRepository.save(b5);

                Bed b6 = new Bed();
                b6.setBedNumber("ORTHO-105");
                b6.setWard("Orthopedic Ward");
                b6.setBedType("Standard Bed");
                b6.setStatus("AVAILABLE");
                bedRepository.save(b6);

                Bed b7 = new Bed();
                b7.setBedNumber("PED-201");
                b7.setWard("Pediatric Ward");
                b7.setBedType("Pediatric Bed");
                b7.setStatus("AVAILABLE");
                bedRepository.save(b7);

                Bed b8 = new Bed();
                b8.setBedNumber("MAT-102");
                b8.setWard("Maternity Ward");
                b8.setBedType("Deluxe Room");
                b8.setStatus("AVAILABLE");
                bedRepository.save(b8);

                System.out.println("✅ Seeded Hospital Beds & Ward allocation.");
            }

            // =========================================================
            // 8. BILLING & INVOICES
            // =========================================================
            if (billRepository.count() < 4) {
                var patientsList = patientRepository.findAll();
                if (!patientsList.isEmpty()) {
                    Bill bill1 = new Bill();
                    bill1.setPatient(patientsList.get(0));
                    bill1.setBillDate(LocalDate.now().minusDays(1));
                    bill1.setConsultationFee(800.0);
                    bill1.setLaboratoryFee(2200.0);
                    bill1.setMedicineFee(1500.0);
                    bill1.setRoomFee(0.0);
                    bill1.setOtherCharges(0.0);
                    bill1.setTotalAmount(4500.0);
                    bill1.setPaymentMethod("UPI");
                    bill1.setPaymentStatus("PAID");
                    bill1.setStatus("PAID");
                    billRepository.save(bill1);

                    if (patientsList.size() > 2) {
                        Bill bill2 = new Bill();
                        bill2.setPatient(patientsList.get(2));
                        bill2.setBillDate(LocalDate.now());
                        bill2.setConsultationFee(600.0);
                        bill2.setLaboratoryFee(850.0);
                        bill2.setMedicineFee(400.0);
                        bill2.setRoomFee(0.0);
                        bill2.setOtherCharges(0.0);
                        bill2.setTotalAmount(1850.0);
                        bill2.setPaymentMethod("CARD");
                        bill2.setPaymentStatus("PAID");
                        bill2.setStatus("PAID");
                        billRepository.save(bill2);
                    }

                    if (patientsList.size() > 1) {
                        Bill bill3 = new Bill();
                        bill3.setPatient(patientsList.get(1));
                        bill3.setBillDate(LocalDate.now());
                        bill3.setConsultationFee(1000.0);
                        bill3.setLaboratoryFee(6000.0);
                        bill3.setMedicineFee(1200.0);
                        bill3.setRoomFee(0.0);
                        bill3.setOtherCharges(0.0);
                        bill3.setTotalAmount(8200.0);
                        bill3.setPaymentMethod("CASH");
                        bill3.setPaymentStatus("PENDING");
                        bill3.setStatus("PENDING");
                        billRepository.save(bill3);
                    }

                    if (patientsList.size() > 4) {
                        Bill bill4 = new Bill();
                        bill4.setPatient(patientsList.get(4));
                        bill4.setBillDate(LocalDate.now());
                        bill4.setConsultationFee(700.0);
                        bill4.setLaboratoryFee(1200.0);
                        bill4.setMedicineFee(500.0);
                        bill4.setRoomFee(0.0);
                        bill4.setOtherCharges(0.0);
                        bill4.setTotalAmount(2400.0);
                        bill4.setPaymentMethod("CASH");
                        bill4.setPaymentStatus("PENDING");
                        bill4.setStatus("PENDING");
                        billRepository.save(bill4);
                    }

                    if (patientsList.size() > 6) {
                        Bill bill5 = new Bill();
                        bill5.setPatient(patientsList.get(6));
                        bill5.setBillDate(LocalDate.now());
                        bill5.setConsultationFee(900.0);
                        bill5.setLaboratoryFee(1500.0);
                        bill5.setMedicineFee(800.0);
                        bill5.setRoomFee(0.0);
                        bill5.setOtherCharges(0.0);
                        bill5.setTotalAmount(3200.0);
                        bill5.setPaymentMethod("UPI");
                        bill5.setPaymentStatus("PAID");
                        bill5.setStatus("PAID");
                        billRepository.save(bill5);
                    }

                    System.out.println("✅ Seeded Billing & Payment records.");
                }
            }

            // =========================================================
            // 9. HOSPITAL REPORTS
            // =========================================================
            if (reportRepository.count() < 4) {
                Report r1 = new Report();
                r1.setReportTitle("Cardiology Department Clinical & Patient Flow Report");
                r1.setReportType("Clinical Department Report");
                r1.setDescription("Monthly clinical outcomes, angiographies, and patient volume in Cardiology department.");
                r1.setGeneratedBy("Dr. Rajesh Sharma (Cardiologist)");
                r1.setGeneratedDate(LocalDateTime.now().minusDays(1));
                r1.setStatus("Generated");
                reportRepository.save(r1);

                Report r2 = new Report();
                r2.setReportTitle("Hospital Resource Utilization & Bed Occupancy Report");
                r2.setReportType("Operations Report");
                r2.setDescription("Real-time bed utilization across CCU, ICU, Neuro, Ortho, and General wards.");
                r2.setGeneratedBy("Hospital Administrator");
                r2.setGeneratedDate(LocalDateTime.now());
                r2.setStatus("Generated");
                reportRepository.save(r2);

                Report r3 = new Report();
                r3.setReportTitle("Monthly Pharmacy Dispensation & Inventory Audit");
                r3.setReportType("Pharmacy Report");
                r3.setDescription("Dispensation volumes and stock levels for critical cardiac, diabetic, antibiotic, and respiratory medicines.");
                r3.setGeneratedBy("Chief Pharmacist");
                r3.setGeneratedDate(LocalDateTime.now().minusDays(3));
                r3.setStatus("Generated");
                reportRepository.save(r3);

                Report r4 = new Report();
                r4.setReportTitle("Monthly Revenue, Invoices & Accounts Audit");
                r4.setReportType("Financial Report");
                r4.setDescription("Summary of collections across OPD consultations, IPD room admissions, Diagnostic investigations, and Pharmacy.");
                r4.setGeneratedBy("Finance Department");
                r4.setGeneratedDate(LocalDateTime.now().minusDays(1));
                r4.setStatus("Generated");
                reportRepository.save(r4);

                Report r5 = new Report();
                r5.setReportTitle("Laboratory Diagnostic Turnaround & Quality Assurance");
                r5.setReportType("Laboratory Report");
                r5.setDescription("Average test completion times for Troponin I, Lipid Profile, HbA1c, Renal panels, and MRI scans.");
                r5.setGeneratedBy("Chief Pathologist");
                r5.setGeneratedDate(LocalDateTime.now());
                r5.setStatus("Generated");
                reportRepository.save(r5);

                System.out.println("✅ Seeded Hospital Reports.");
            }
        };
    }
}

