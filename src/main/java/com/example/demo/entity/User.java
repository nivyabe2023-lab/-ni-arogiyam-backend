package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(
        nullable = false,
        unique = true
    )
    private String username;


    @Column(nullable = false)
    private String password;


    @Column(nullable = false)
    private String role;


    @Column(name = "full_name")
    private String fullName;


    @Column
    private String email;


    public User() {
    }


    public User(
            String username,
            String password,
            String fullName,
            String email,
            String role
    ) {

        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }


    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }


    public String getUsername() {
        return username;
    }


    public String getPassword() {
        return password;
    }


    public String getFullName() {
        return fullName;
    }


    public String getEmail() {
        return email;
    }


    public String getRole() {
        return role;
    }


    // =========================================================
    // SETTERS
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }


    public void setUsername(String username) {
        this.username = username;
    }


    public void setPassword(String password) {
        this.password = password;
    }


    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public void setRole(String role) {
        this.role = role;
    }
}