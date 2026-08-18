package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Long billId;

    @Column(name = "bill_date")
    private LocalDate billDate;

    @Column(name = "consultation_fee", nullable = false)
    private Double consultationFee = 0.0;

    @Column(name = "medicine_fee", nullable = false)
    private Double medicineFee = 0.0;

    @Column(name = "other_charges", nullable = false)
    private Double otherCharges = 0.0;

    @Column(name = "laboratory_fee", nullable = false)
    private Double laboratoryFee = 0.0;

    @Column(name = "room_fee", nullable = false)
    private Double roomFee = 0.0;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount = 0.0;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;


    // ---------------- GETTERS ----------------

    public Long getBillId() {
        return billId;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public Double getMedicineFee() {
        return medicineFee;
    }

    public Double getOtherCharges() {
        return otherCharges;
    }

    public Double getLaboratoryFee() {
        return laboratoryFee;
    }

    public Double getRoomFee() {
        return roomFee;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getStatus() {
        return status;
    }

    public Patient getPatient() {
        return patient;
    }


    // ---------------- SETTERS ----------------

    public void setBillId(Long billId) {
        this.billId = billId;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public void setMedicineFee(Double medicineFee) {
        this.medicineFee = medicineFee;
    }

    public void setOtherCharges(Double otherCharges) {
        this.otherCharges = otherCharges;
    }

    public void setLaboratoryFee(Double laboratoryFee) {
        this.laboratoryFee = laboratoryFee;
    }

    public void setRoomFee(Double roomFee) {
        this.roomFee = roomFee;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}