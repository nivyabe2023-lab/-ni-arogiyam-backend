package com.example.demo.controller;

import com.example.demo.entity.Bed;
import com.example.demo.entity.Bill;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.BedRepository;
import com.example.demo.repository.BillRepository;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.MedicineRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.repository.PrescriptionRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicineRepository medicineRepository;
    private final BillRepository billRepository;
    private final BedRepository bedRepository;

    public DashboardController(
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            PrescriptionRepository prescriptionRepository,
            MedicineRepository medicineRepository,
            BillRepository billRepository,
            BedRepository bedRepository) {

        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.medicineRepository = medicineRepository;
        this.billRepository = billRepository;
        this.bedRepository = bedRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboard() {

        Map<String, Object> dashboard = new HashMap<>();

        // =====================================================
        // BASIC COUNTS
        // =====================================================

        long totalPatients = patientRepository.count();

        long totalDoctors = doctorRepository.count();

        long totalAppointments = appointmentRepository.count();

        long totalPrescriptions = prescriptionRepository.count();

        long totalMedicines = medicineRepository.count();

        long totalBills = billRepository.count();


        dashboard.put(
                "totalPatients",
                totalPatients
        );

        dashboard.put(
                "totalDoctors",
                totalDoctors
        );

        dashboard.put(
                "totalAppointments",
                totalAppointments
        );

        dashboard.put(
                "totalPrescriptions",
                totalPrescriptions
        );

        dashboard.put(
                "totalMedicines",
                totalMedicines
        );

        dashboard.put(
                "totalBills",
                totalBills
        );


        // =====================================================
        // BILLING
        // =====================================================

        List<Bill> bills = billRepository.findAll();

        long paidBills = bills.stream()
                .filter(bill ->
                        bill.getPaymentStatus() != null &&
                        "PAID".equalsIgnoreCase(
                                bill.getPaymentStatus()
                        )
                )
                .count();

        long pendingBills = bills.stream()
                .filter(bill ->
                        bill.getPaymentStatus() != null &&
                        "PENDING".equalsIgnoreCase(
                                bill.getPaymentStatus()
                        )
                )
                .count();


        double totalRevenue = bills.stream()
                .filter(bill -> bill.getTotalAmount() != null)
                .mapToDouble(Bill::getTotalAmount)
                .sum();


        double paidRevenue = bills.stream()
                .filter(bill ->
                        bill.getPaymentStatus() != null &&
                        "PAID".equalsIgnoreCase(
                                bill.getPaymentStatus()
                        )
                )
                .filter(bill -> bill.getTotalAmount() != null)
                .mapToDouble(Bill::getTotalAmount)
                .sum();


        double pendingRevenue = bills.stream()
                .filter(bill ->
                        bill.getPaymentStatus() != null &&
                        "PENDING".equalsIgnoreCase(
                                bill.getPaymentStatus()
                        )
                )
                .filter(bill -> bill.getTotalAmount() != null)
                .mapToDouble(Bill::getTotalAmount)
                .sum();


        dashboard.put(
                "paidBills",
                paidBills
        );

        dashboard.put(
                "pendingBills",
                pendingBills
        );

        dashboard.put(
                "totalRevenue",
                totalRevenue
        );

        dashboard.put(
                "paidRevenue",
                paidRevenue
        );

        dashboard.put(
                "pendingRevenue",
                pendingRevenue
        );


        // =====================================================
        // BED MANAGEMENT
        // =====================================================

        List<Bed> beds = bedRepository.findAll();

        long totalBeds = beds.size();

        long occupiedBeds = beds.stream()
                .filter(bed ->
                        bed.getStatus() != null &&
                        "OCCUPIED".equalsIgnoreCase(
                                bed.getStatus()
                        )
                )
                .count();

        long availableBeds = beds.stream()
                .filter(bed ->
                        bed.getStatus() != null &&
                        "AVAILABLE".equalsIgnoreCase(
                                bed.getStatus()
                        )
                )
                .count();


        // =====================================================
        // ICU BED COUNT
        // =====================================================

        long icuBeds = beds.stream()
                .filter(bed ->
                        bed.getBedType() != null &&
                        bed.getBedType()
                                .toLowerCase()
                                .contains("icu")
                )
                .count();


        // =====================================================
        // BED OCCUPANCY
        // =====================================================

        double occupancyRate = 0.0;

        if (totalBeds > 0) {

            occupancyRate =
                    ((double) occupiedBeds / totalBeds) * 100;

            occupancyRate =
                    Math.round(occupancyRate * 100.0) / 100.0;
        }


        dashboard.put(
                "totalBeds",
                totalBeds
        );

        dashboard.put(
                "occupiedBeds",
                occupiedBeds
        );

        dashboard.put(
                "availableBeds",
                availableBeds
        );

        dashboard.put(
                "icuBeds",
                icuBeds
        );

        dashboard.put(
                "occupancyRate",
                occupancyRate
        );


        // =====================================================
        // HOSPITAL ALERT COUNTS
        // =====================================================

        long availableIcuBeds = beds.stream()
                .filter(bed ->
                        bed.getBedType() != null &&
                        bed.getBedType()
                                .toLowerCase()
                                .contains("icu")
                )
                .filter(bed ->
                        bed.getStatus() != null &&
                        "AVAILABLE".equalsIgnoreCase(
                                bed.getStatus()
                        )
                )
                .count();


        dashboard.put(
                "availableIcuBeds",
                availableIcuBeds
        );


        // =====================================================
        // RETURN DASHBOARD DATA
        // =====================================================

        return dashboard;
    }
}