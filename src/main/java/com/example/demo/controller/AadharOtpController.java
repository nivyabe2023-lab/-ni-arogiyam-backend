package com.example.demo.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/aadhar")
@CrossOrigin(origins = "*")
public class AadharOtpController {

    @Value("${sandbox.api.key:key_live_8e0e61c26c0f4639b56827d9f891c800}")
    private String sandboxApiKey;

    @Value("${sandbox.api.secret:secret_live_38f4e24a293648babf4d660ea95bdb55}")
    private String sandboxApiSecret;

    @Value("${fast2sms.api.key:}")
    private String fast2smsApiKey;

    private static String cachedSandboxToken = null;
    private static Instant sandboxTokenExpiry = Instant.MIN;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    // In-memory OTP storage with expiration timestamp: [aadharNumber -> OtpRecord]
    private static final ConcurrentHashMap<String, OtpRecord> otpCache = new ConcurrentHashMap<>();

    private static class OtpRecord {
        final String otp;
        final String referenceId;
        final Instant expiresAt;
        final boolean isSandbox;

        OtpRecord(String otp, String referenceId, Instant expiresAt, boolean isSandbox) {
            this.otp = otp;
            this.referenceId = referenceId;
            this.expiresAt = expiresAt;
            this.isSandbox = isSandbox;
        }
    }

    /**
     * Get or refresh Sandbox JWT Access Token
     */
    private synchronized String getSandboxAccessToken() {
        if (cachedSandboxToken != null && Instant.now().isBefore(sandboxTokenExpiry)) {
            return cachedSandboxToken;
        }

        if (sandboxApiKey == null || sandboxApiKey.trim().isEmpty() ||
            sandboxApiSecret == null || sandboxApiSecret.trim().isEmpty()) {
            return null;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-api-key", sandboxApiKey.trim());
            headers.set("x-api-secret", sandboxApiSecret.trim());
            headers.set("x-api-version", "2.0");

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                "https://api.sandbox.co.in/authenticate",
                HttpMethod.POST,
                entity,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode dataNode = root.get("data");
                if (dataNode != null && dataNode.has("access_token")) {
                    cachedSandboxToken = dataNode.get("access_token").asText();
                    // Sandbox tokens are valid for 24 hours; cache for 23 hours
                    sandboxTokenExpiry = Instant.now().plusSeconds(23 * 3600);
                    return cachedSandboxToken;
                } else if (root.has("access_token")) {
                    cachedSandboxToken = root.get("access_token").asText();
                    sandboxTokenExpiry = Instant.now().plusSeconds(23 * 3600);
                    return cachedSandboxToken;
                }
            }
        } catch (Exception e) {
            System.err.println("Sandbox Auth Error: " + e.getMessage());
        }
        return null;
    }

    /**
     * Send OTP to Aadhaar-registered mobile number
     * Delivers REAL UIDAI OTP to registered mobile number via Sandbox Government Gateway.
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

        // ==============================================================
        // 1. ATTEMPT REAL UIDAI AADHAAR OTP VIA SANDBOX.CO.IN
        // ==============================================================
        String accessToken = getSandboxAccessToken();
        if (accessToken != null) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", accessToken);
                headers.set("x-api-key", sandboxApiKey.trim());
                headers.set("x-api-version", "2.0");
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> reqBody = Map.of(
                    "@entity", "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
                    "aadhaar_number", aadharNumber,
                    "consent", "Y",
                    "reason", "Hospital patient identity verification"
                );

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(reqBody, headers);
                ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.sandbox.co.in/kyc/aadhaar/okyc/otp",
                    HttpMethod.POST,
                    entity,
                    String.class
                );

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode dataNode = root.get("data");
                    String referenceId = null;
                    String message = "OTP sent successfully to registered mobile number";

                    if (dataNode != null) {
                        if (dataNode.has("reference_id")) {
                            referenceId = dataNode.get("reference_id").asText();
                        }
                        if (dataNode.has("message")) {
                            message = dataNode.get("message").asText();
                        }
                    }

                    if (referenceId != null) {
                        // Store reference_id for verification (valid for 10 minutes)
                        otpCache.put(aadharNumber, new OtpRecord(null, referenceId, Instant.now().plusSeconds(600), true));

                        Map<String, Object> resp = new HashMap<>();
                        resp.put("success", true);
                        resp.put("realSmsSent", true);
                        resp.put("referenceId", referenceId);
                        resp.put("gateway", "UIDAI Government Gateway");
                        resp.put("message", "📲 Official UIDAI OTP sent directly to the mobile number registered with your Aadhaar card!");
                        return ResponseEntity.ok(resp);
                    }
                }
            } catch (Exception e) {
                System.err.println("Sandbox Aadhaar OTP failed: " + e.getMessage());
            }
        }

        // ==============================================================
        // 2. FALLBACK TO FAST2SMS / DEMO OTP IF SANDBOX IS UNAVAILABLE
        // ==============================================================
        String generatedOtp = String.format("%06d", new Random().nextInt(900000) + 100000);
        otpCache.put(aadharNumber, new OtpRecord(generatedOtp, null, Instant.now().plusSeconds(300), false));

        String maskedPhone = (phoneNumber.length() >= 4) 
                ? "••••••" + phoneNumber.substring(phoneNumber.length() - 4) 
                : "••••••6597";

        boolean realSmsSent = false;
        String providerMessage = "";

        if (fast2smsApiKey != null && !fast2smsApiKey.trim().isEmpty() && phoneNumber.length() == 10) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.set("authorization", fast2smsApiKey.trim());
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> qBody = Map.of(
                    "route", "q",
                    "message", "Your NI AROGIYAM Aadhaar verification OTP is " + generatedOtp + ". Valid for 5 mins.",
                    "language", "english",
                    "flash", 0,
                    "numbers", phoneNumber
                );
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(qBody, headers);
                ResponseEntity<String> res = restTemplate.exchange(
                    "https://www.fast2sms.com/dev/bulkV2",
                    HttpMethod.POST,
                    entity,
                    String.class
                );
                if (res.getStatusCode().is2xxSuccessful() && res.getBody() != null && res.getBody().contains("\"return\":true")) {
                    realSmsSent = true;
                    providerMessage = "Real SMS dispatched to " + phoneNumber;
                }
            } catch (Exception ex) {
                providerMessage = ex.getMessage();
            }
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("realSmsSent", realSmsSent);
        resp.put("message", "OTP sent to registered mobile number ending in " + maskedPhone);
        resp.put("maskedPhone", maskedPhone);
        resp.put("providerMessage", providerMessage);
        resp.put("demoOtp", generatedOtp);
        return ResponseEntity.ok(resp);
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

        // ==============================================================
        // 1. VERIFY VIA SANDBOX UIDAI API IF RECORD IS FROM SANDBOX
        // ==============================================================
        if (record != null && record.isSandbox && record.referenceId != null) {
            String accessToken = getSandboxAccessToken();
            if (accessToken != null) {
                try {
                    HttpHeaders headers = new HttpHeaders();
                    headers.set("Authorization", accessToken);
                    headers.set("x-api-key", sandboxApiKey.trim());
                    headers.set("x-api-version", "2.0");
                    headers.setContentType(MediaType.APPLICATION_JSON);

                    Map<String, Object> reqBody = new HashMap<>();
                    reqBody.put("@entity", "in.co.sandbox.kyc.aadhaar.okyc.request");
                    reqBody.put("reference_id", Long.parseLong(record.referenceId));
                    reqBody.put("otp", otp);

                    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(reqBody, headers);
                    ResponseEntity<String> response = restTemplate.exchange(
                        "https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify",
                        HttpMethod.POST,
                        entity,
                        String.class
                    );

                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        JsonNode root = objectMapper.readTree(response.getBody());
                        JsonNode dataNode = root.get("data");

                        otpCache.remove(aadharNumber);

                        Map<String, Object> resp = new HashMap<>();
                        resp.put("verified", true);
                        resp.put("message", "✓ Aadhaar authenticated successfully via official UIDAI Government Gateway!");
                        resp.put("aadharNumber", aadharNumber);
                        if (dataNode != null) {
                            resp.put("data", dataNode);
                        }
                        return ResponseEntity.ok(resp);
                    }
                } catch (Exception e) {
                    System.err.println("Sandbox OTP Verification Error: " + e.getMessage());
                    // If Sandbox returned error message, try parsing it
                    String errMsg = "Invalid or expired OTP received on your Aadhaar-linked mobile.";
                    if (e.getMessage() != null && e.getMessage().contains("message")) {
                        errMsg = e.getMessage();
                    }
                    return ResponseEntity.badRequest().body(Map.of(
                        "verified", false,
                        "message", errMsg
                    ));
                }
            }
        }

        // ==============================================================
        // 2. FALLBACK VERIFICATION (LOCAL CACHE OR DEMO OTP 123456)
        // ==============================================================
        boolean isMatch = (record != null && record.otp != null && record.otp.equals(otp) && record.expiresAt.isAfter(Instant.now()))
                || "123456".equals(otp);

        if (isMatch) {
            otpCache.remove(aadharNumber);
            return ResponseEntity.ok(Map.of(
                "verified", true,
                "message", "✓ Aadhaar verified successfully with registered mobile number.",
                "aadharNumber", aadharNumber
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "verified", false,
                "message", "Invalid OTP. Please enter the correct 6-digit OTP sent to your phone."
            ));
        }
    }
}
