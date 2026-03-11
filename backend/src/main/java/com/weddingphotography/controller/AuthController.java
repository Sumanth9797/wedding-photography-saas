package com.weddingphotography.controller;

import com.weddingphotography.dto.AuthDTOs;
import com.weddingphotography.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(
            @Valid @RequestBody AuthDTOs.SendOtpRequest request) {
        authService.sendOtp(request.getContact(), request.getRole());
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @Valid @RequestBody AuthDTOs.VerifyOtpRequest request) {
        Map<String, Object> result = authService.verifyOtp(request.getContact(), request.getOtp());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/gallery-access/{token}")
    public ResponseEntity<Map<String, Object>> galleryAccess(
            @PathVariable String token,
            @Valid @RequestBody AuthDTOs.GalleryAccessRequest request) {
        Map<String, Object> result = authService.galleryAccess(token, request.getPin());
        return ResponseEntity.ok(result);
    }
}
