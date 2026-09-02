package com.example.demo.repository;

import com.example.demo.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a " +
           "LEFT JOIN a.patient p " +
           "LEFT JOIN a.doctor d " +
           "WHERE LOWER(a.reason) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(a.status) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(p.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(d.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Appointment> searchAppointments(@Param("keyword") String keyword);
}