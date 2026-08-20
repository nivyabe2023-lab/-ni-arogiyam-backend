package com.example.demo.service;

import com.example.demo.entity.Bill;
import com.example.demo.entity.Patient;
import com.example.demo.repository.BillRepository;
import com.example.demo.repository.PatientRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    public BillService(
            BillRepository billRepository,
            PatientRepository patientRepository) {

        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
    }


    // GET ALL BILLS
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }


    // GET BILL BY ID
    public Bill getBillById(Long id) {

        return billRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Bill not found with id: " + id)
                );
    }


    // CREATE BILL
    public Bill createBill(Bill bill) {

        // Make sure fee fields are not NULL
        if (bill.getConsultationFee() == null) {
            bill.setConsultationFee(0.0);
        }

        if (bill.getMedicineFee() == null) {
            bill.setMedicineFee(0.0);
        }

        if (bill.getOtherCharges() == null) {
            bill.setOtherCharges(0.0);
        }

        if (bill.getLaboratoryFee() == null) {
            bill.setLaboratoryFee(0.0);
        }

        if (bill.getRoomFee() == null) {
            bill.setRoomFee(0.0);
        }

        if (bill.getTotalAmount() == null) {
            bill.setTotalAmount(
                    bill.getConsultationFee()
                    + bill.getMedicineFee()
                    + bill.getOtherCharges()
                    + bill.getLaboratoryFee()
                    + bill.getRoomFee()
            );
        }

        // Default payment status
        if (bill.getPaymentStatus() == null ||
                bill.getPaymentStatus().trim().isEmpty()) {

            bill.setPaymentStatus("PENDING");
        }

        // Default status
        if (bill.getStatus() == null ||
                bill.getStatus().trim().isEmpty()) {

            bill.setStatus(bill.getPaymentStatus());
        }

        // Patient must exist
        if (bill.getPatient() == null ||
                bill.getPatient().getPatientId() == null) {

            throw new RuntimeException("Patient is required");
        }

        Long patientId = bill.getPatient().getPatientId();

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with id: " + patientId
                        )
                );

        bill.setPatient(patient);

        return billRepository.save(bill);
    }


    // UPDATE BILL
    public Bill updateBill(Long id, Bill updatedBill) {

        Bill existingBill = billRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Bill not found with id: " + id)
                );


        existingBill.setBillDate(updatedBill.getBillDate());

        existingBill.setConsultationFee(
                updatedBill.getConsultationFee() != null
                        ? updatedBill.getConsultationFee()
                        : 0.0
        );

        existingBill.setMedicineFee(
                updatedBill.getMedicineFee() != null
                        ? updatedBill.getMedicineFee()
                        : 0.0
        );

        existingBill.setOtherCharges(
                updatedBill.getOtherCharges() != null
                        ? updatedBill.getOtherCharges()
                        : 0.0
        );

        existingBill.setLaboratoryFee(
                updatedBill.getLaboratoryFee() != null
                        ? updatedBill.getLaboratoryFee()
                        : 0.0
        );

        existingBill.setRoomFee(
                updatedBill.getRoomFee() != null
                        ? updatedBill.getRoomFee()
                        : 0.0
        );


        // Calculate total
        double total =
                existingBill.getConsultationFee()
                + existingBill.getMedicineFee()
                + existingBill.getOtherCharges()
                + existingBill.getLaboratoryFee()
                + existingBill.getRoomFee();

        existingBill.setTotalAmount(total);


        existingBill.setPaymentMethod(
                updatedBill.getPaymentMethod()
        );

        existingBill.setPaymentStatus(
                updatedBill.getPaymentStatus()
        );

        existingBill.setStatus(
                updatedBill.getStatus()
        );

        existingBill.setMedicationDetails(
                updatedBill.getMedicationDetails()
        );

        if (updatedBill.getDoctorName() != null) {
            existingBill.setDoctorName(updatedBill.getDoctorName());
        }

        if (updatedBill.getVerifiedBy() != null) {
            existingBill.setVerifiedBy(updatedBill.getVerifiedBy());
        }

        if (updatedBill.getPatient() != null &&
                updatedBill.getPatient().getPatientId() != null) {

            Patient patient = patientRepository
                    .findById(
                            updatedBill.getPatient().getPatientId()
                    )
                    .orElseThrow(() ->
                            new RuntimeException("Patient not found")
                    );

            existingBill.setPatient(patient);
        }


        return billRepository.save(existingBill);
    }


    // DELETE BILL
    public void deleteBill(Long id) {

        if (!billRepository.existsById(id)) {
            throw new RuntimeException(
                    "Bill not found with id: " + id
            );
        }

        billRepository.deleteById(id);
    }
}