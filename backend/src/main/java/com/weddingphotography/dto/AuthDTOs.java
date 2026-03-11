package com.weddingphotography.dto;

import com.weddingphotography.model.User;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDTOs {

    @Data
    public static class SendOtpRequest {
        @NotBlank(message = "Contact (email or phone) is required")
        private String contact;
        private User.UserRole role = User.UserRole.CLIENT;
    }

    @Data
    public static class VerifyOtpRequest {
        @NotBlank(message = "Contact is required")
        private String contact;
        @NotBlank(message = "OTP is required")
        private String otp;
    }

    @Data
    public static class GalleryAccessRequest {
        @NotBlank(message = "PIN is required")
        private String pin;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private Long userId;
        private String role;
        private String name;

        public AuthResponse(String token, Long userId, String role, String name) {
            this.token = token;
            this.userId = userId;
            this.role = role;
            this.name = name;
        }
    }
}
