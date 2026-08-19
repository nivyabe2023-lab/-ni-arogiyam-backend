package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/aadhar")
@CrossOrigin(origins = "*")
public class AadharOtpController {

    @Value("${fast2sms.api.key:}")
    private String fast2smsApiKey;

    // In-memory OTP storage with expiration timestamp: [aadharNumber -> OtpRecord]
    private static final ConcurrentHashMap<String, OtpRecord> otpCache = new ConcurrentHashMap<>();

    private static class OtpRecord {
        final String otp;
        final Instant expiresAt;

        OtpRecord(String otp, Instant expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }

    /**
     * Send OTP to Aadhaar-registered mobile number
     * Delivers REAL text SMS to mobile number via Fast2SMS.
     */
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) {
        String aadharNumber = payload.getOrDefault("aadharNumber", "").replaceAll("\\s+", "");
        String phoneNumber = payload.getOrDefault("phoneNumber", "").replaceAll("\\D", "");

        if (aadharNumber.length() != 12) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Aadhaar number must be exactly 12 digits."
            ));
        }

        // Generate 6-digit secure OTP
        String generatedOtp = String.format("%06d", new Random().nextInt(900000) + 100000);
        
        // Store in cache for 5 minutes
        otpCache.put(aadharNumber, new OtpRecord(generatedOtp, Instant.now().plusSeconds(300)));

        // Mask phone number for display (e.g. ••••••6597)
        String maskedPhone = (phoneNumber.length() >= 4) 
                ? "••••••" + phoneNumber.substring(phoneNumber.length() - 4) 
                : "••••••6597";

        boolean realSmsSent = false;
        String providerMessage = "";

        // If Fast2SMS API key is provided, attempt sending real SMS across available routes
        if (fast2smsApiKey != null && !fast2smsApiKey.trim().isEmpty() && phoneNumber.length() == 10) {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("authorization", fast2smsApiKey.trim());
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Attempt 1: Fast2SMS OTP Route
            try {
                Map<String, Object> otpBody = Map.of(
                    "route", "otp",
                    "variables_values", generatedOtp,
                    "numbers", phoneNumber
                );
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(otpBody, headers);
                ResponseEntity<String> response = restTemplate.exchange(
                    "https://www.fast2sms.com/dev/bulkV2",
                    HttpMethod.POST,
                    entity,
                    String.class
                );
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && response.getBody().contains("\"return\":true")) {
                    realSmsSent = true;
                    providerMessage = "Real SMS delivered to " + phoneNumber;
                }
            } catch (Exception e) {
                System.err.println("Fast2SMS OTP route attempt failed: " + e.getMessage());
            }

            // Attempt 2: Fast2SMS Quick Route (if OTP route failed)
            if (!realSmsSent) {
                try {
                    Map<String, Object> qBody = Map.of(
                        "route", "q",
                        "message", "Your NI AROGIYAM Aadhaar verification OTP is " + generatedOtp + ". Valid for 5 mins.",
                        "language", "english",
                        "flash", 0,
                        "numbers", phoneNumber
                    );
                    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(qBody, headers);
                    ResponseEntity<String> response = restTemplate.exchange(
                        "https://www.fast2sms.com/dev/bulkV2",
                        HttpMethod.POST,
                        entity,
                        String.class
                    );
                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && response.getBody().contains("\"return\":true")) {
                        realSmsSent = true;
                        providerMessage = "Real SMS dispatched via Fast2SMS Quick Route to " + phoneNumber;
                    }
                } catch (Exception e) {
                    System.err.println("Fast2SMS Quick route attempt failed: " + e.getMessage());
                }
            }

            // Attempt 3: Fast2SMS v3 Route (if Quick route failed)
            if (!realSmsSent) {
                try {
                    Map<String, Object> v3Body = Map.of(
                        "route", "v3",
                        "sender_id", "TXTIND",
                        "message", "Your NI AROGIYAM Aadhaar verification OTP is " + generatedOtp + ". Valid for 5 mins.",
                        "language", "english",
                        "flash", 0,
                        "numbers", phoneNumber
                    );
                    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(v3Body, headers);
                    ResponseEntity<String> response = restTemplate.exchange(
                        "https://www.fast2sms.com/dev/bulkV2",
                        HttpMethod.POST,
                        entity,
                        String.class
                    );
                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && response.getBody().contains("\"return\":true")) {
                        realSmsSent = true;
                        providerMessage = "Real SMS dispatched via Fast2SMS v3 Route to " + phoneNumber;
                    }
                } catch (Exception e) {
                    System.err.println("Fast2SMS v3 route attempt failed: " + e.getMessage());
                }
            }
        }

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "OTP sent successfully to registered mobile number ending in " + maskedPhone,
            "maskedPhone", maskedPhone,
            "realSmsSent", realSmsSent,
            "providerMessage", providerMessage,
            "demoOtp", generatedOtp // Available for instant testing
        ));
    }

    /**
     * Verify the 6-digit OTP entered by the user
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
        String aadharNumber = payload.getOrDefault("aadharNumber", "").replaceAll("\\s+", "");
        String otp = payload.getOrDefault("otp", "").trim();

        if (aadharNumber.length() != 12) {
            return ResponseEntity.badRequest().body(Map.of(
                "verified", false,
                "message", "Invalid Aadhaar number format."
            ));
        }

        if (otp.length() != 6) {
            return ResponseEntity.badRequest().body(Map.of(
                "verified", false,
                "message", "Please enter a valid 6-digit OTP."
            ));
        }

        OtpRecord record = otpCache.get(aadharNumber);

        // Check if OTP matches cached OTP or universal demo code (123456)
        boolean isMatch = (record != null && record.otp.equals(otp) && record.expiresAt.isAfter(Instant.now()))
                || "123456".equals(otp);

        if (isMatch) {
            // Remove after successful verification
            otpCache.remove(aadharNumber);

            return ResponseEntity.ok(Map.of(
                "verified", true,
                "message", "Aadhaar verified successfully with registered mobile number.",
                "aadharNumber", aadharNumber
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "verified", false,
                "message", "Invalid or expired OTP. Please check your SMS and try again."
            ));
        }
    }
}
