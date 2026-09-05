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
        String normalizedUser = username.replaceAll("\\s+", "").toLowerCase();

        // -----------------------------------------------------
        // FIXED SYSTEM ROLE: CHIEF BED WARDEN
        // -----------------------------------------------------
        if ("chiefwarden".equals(normalizedUser) || "chief warden".equalsIgnoreCase(username)) {
            if ("Chiefwarden@123".equals(password)) {
                // Ensure user exists in repository if possible
                User wardenUser = userRepository.findByUsernameIgnoreCase("chief warden")
                        .or(() -> userRepository.findByUsernameIgnoreCase("chiefwarden"))
                        .orElseGet(() -> {
                            User u = new User();
                            u.setUsername("chief warden");
                            u.setPassword("Chiefwarden@123");
                            u.setFullName("Chief Bed Warden");
                            u.setEmail("chiefwarden@hospital.com");
                            u.setRole("CHIEF_WARDEN");
                            try {
                                return userRepository.save(u);
                            } catch (Exception e) {
                                return u;
                            }
                        });

                return new LoginResponse(
                        true,
                        "Login successful as Chief Bed Warden.",
                        wardenUser.getId() != null ? wardenUser.getId() : 999L,
                        "chief warden",
                        "CHIEF_WARDEN",
                        "Chief Bed Warden",
                        "chiefwarden@hospital.com"
                );
            } else {
                return new LoginResponse(
                        false,
                        "Invalid password for Chief Bed Warden.",
                        null,
                        null,
                        null,
                        null,
                        null
                );
            }
        }

        User user = userRepository
                .findByUsernameIgnoreCase(username)
                .or(() -> userRepository.findByEmail(username))
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

        // Match password
        boolean passwordMatches;
        if ("admin".equalsIgnoreCase(username) || "ADMIN".equalsIgnoreCase(user.getRole())) {
            // Strictly enforce Admin@123 as the only valid password for Administrator
            passwordMatches = "Admin@123".equals(password);
        } else if ("CHIEF_WARDEN".equalsIgnoreCase(user.getRole())) {
            passwordMatches = "Chiefwarden@123".equals(password) || (user.getPassword() != null && user.getPassword().equals(password));
        } else {
            passwordMatches = user.getPassword() != null && user.getPassword().equals(password);
        }

        if (!passwordMatches) {
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

        String role = user.getRole() != null ? user.getRole().toUpperCase() : "USER";

        return new LoginResponse(
                true,
                "Login successful.",
                user.getId(),
                user.getUsername(),
                role,
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
        // PROHIBIT ADMIN AND CHIEF WARDEN CREATION VIA REGISTRATION
        // -----------------------------------------------------
        String normUser = username.replaceAll("\\s+", "").toLowerCase();
        if ("admin".equalsIgnoreCase(username) ||
                "chiefwarden".equals(normUser) ||
                "chief warden".equalsIgnoreCase(username) ||
                (request.getRole() != null && ("ADMIN".equalsIgnoreCase(request.getRole().trim()) || "CHIEF_WARDEN".equalsIgnoreCase(request.getRole().trim())))) {

            return new LoginResponse(
                    false,
                    "Administrator and Chief Bed Warden accounts are system-managed. You may only register Doctor, Staff, or User accounts.",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        // -----------------------------------------------------
        // CHECK USERNAME ALREADY EXISTS (CASE-INSENSITIVE)
        // -----------------------------------------------------

        if (userRepository.existsByUsernameIgnoreCase(username) || "chief warden".equalsIgnoreCase(username) || "chiefwarden".equals(normUser)) {

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
        // CREATE NEW USER (DOCTOR, STAFF OR USER)
        // -----------------------------------------------------

        User user = new User();

        user.setUsername(username);

        user.setPassword(
                request.getPassword()
        );

        user.setFullName(fullName);

        user.setEmail(email);

        String assignedRole = "USER";
        if (request.getRole() != null) {
            String requestedRole = request.getRole().trim().toUpperCase();
            if ("DOCTOR".equals(requestedRole)) {
                assignedRole = "DOCTOR";
            } else if ("STAFF".equals(requestedRole)) {
                assignedRole = "STAFF";
            }
        }
        user.setRole(assignedRole);


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
