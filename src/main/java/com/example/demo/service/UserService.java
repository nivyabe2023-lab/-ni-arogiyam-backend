package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================================================
    // LOGIN
    // =========================================================

    public LoginResponse login(LoginRequest request) {

        if (request == null ||
                request.getUsername() == null ||
                request.getPassword() == null) {

            return new LoginResponse(
                    false,
                    "Username and password are required.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        String username = request.getUsername().trim();
        String password = request.getPassword();

        User user = userRepository
                .findByUsername(username)
                .orElse(null);

        if (user == null) {

            return new LoginResponse(
                    false,
                    "Invalid username or password.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        if (!user.getPassword().equals(password)) {

            return new LoginResponse(
                    false,
                    "Invalid username or password.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        return new LoginResponse(
                true,
                "Login successful.",
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getFullName(),
                user.getEmail()
        );
    }


    // =========================================================
    // REGISTER
    // =========================================================

    public LoginResponse register(RegisterRequest request) {

        // -----------------------------------------------------
        // CHECK REQUEST
        // -----------------------------------------------------

        if (request == null) {

            return new LoginResponse(
                    false,
                    "Invalid registration request.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        // -----------------------------------------------------
        // CHECK REQUIRED FIELDS
        // -----------------------------------------------------

        if (request.getFullName() == null ||
                request.getFullName().trim().isEmpty()) {

            return new LoginResponse(
                    false,
                    "Full name is required.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            return new LoginResponse(
                    false,
                    "Email is required.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        if (request.getUsername() == null ||
                request.getUsername().trim().isEmpty()) {

            return new LoginResponse(
                    false,
                    "Username is required.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        if (request.getPassword() == null ||
                request.getPassword().isEmpty()) {

            return new LoginResponse(
                    false,
                    "Password is required.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        // -----------------------------------------------------
        // CHECK PASSWORD CONFIRMATION
        // -----------------------------------------------------

        if (request.getConfirmPassword() == null ||
                !request.getPassword()
                        .equals(request.getConfirmPassword())) {

            return new LoginResponse(
                    false,
                    "Passwords do not match.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        // -----------------------------------------------------
        // PASSWORD LENGTH
        // -----------------------------------------------------

        if (request.getPassword().length() < 6) {

            return new LoginResponse(
                    false,
                    "Password must contain at least 6 characters.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        String username =
                request.getUsername().trim();

        String email =
                request.getEmail().trim();

        String fullName =
                request.getFullName().trim();


        // -----------------------------------------------------
        // CHECK USERNAME ALREADY EXISTS
        // -----------------------------------------------------

        if (userRepository.existsByUsername(username)) {

            return new LoginResponse(
                    false,
                    "Username already exists. Please choose another username.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        // -----------------------------------------------------
        // CHECK EMAIL ALREADY EXISTS
        // -----------------------------------------------------

        if (userRepository.findByEmail(email).isPresent()) {

            return new LoginResponse(
                    false,
                    "Email is already registered.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        // -----------------------------------------------------
        // CREATE NEW USER
        // -----------------------------------------------------

        User user = new User();

        user.setUsername(username);

        user.setPassword(
                request.getPassword()
        );

        user.setFullName(fullName);

        user.setEmail(email);

        /*
         * Normal registered users will have USER role.
         *
         * Your existing admin remains:
         *
         * ADMIN
         */

        user.setRole("USER");


        // -----------------------------------------------------
        // SAVE TO MYSQL
        // -----------------------------------------------------

        User savedUser =
                userRepository.save(user);


        // -----------------------------------------------------
        // REGISTRATION SUCCESS
        // -----------------------------------------------------

        return new LoginResponse(
                true,
                "Account created successfully.",
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getRole(),
                savedUser.getFullName(),
                savedUser.getEmail()
        );
    }

    // =========================================================
    // GET ALL REGISTERED USERS
    // =========================================================

    public java.util.List<java.util.Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("fullName", u.getFullName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            return map;
        }).toList();
    }
}