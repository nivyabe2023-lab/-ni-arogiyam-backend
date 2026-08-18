package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;


    public AuthController(UserService userService) {

        this.userService = userService;
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {

        LoginResponse response =
                userService.login(request);


        if (!response.isSuccess()) {

            return ResponseEntity
                    .status(401)
                    .body(response);
        }


        return ResponseEntity.ok(response);
    }


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(
            @RequestBody RegisterRequest request
    ) {

        LoginResponse response =
                userService.register(request);


        if (!response.isSuccess()) {

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }


        return ResponseEntity.ok(response);
    }
}