package com.weddingphotography.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final String DIGITS = "0123456789";
    private final SecureRandom random = new SecureRandom();

    @Value("${otp.expiry-minutes:10}")
    private int expiryMinutes;

    @Value("${otp.length:6}")
    private int otpLength;

    public String generateOtp() {
        return random.ints(otpLength, 0, DIGITS.length())
            .mapToObj(i -> String.valueOf(DIGITS.charAt(i)))
            .collect(Collectors.joining());
    }

    public LocalDateTime generateExpiry() {
        return LocalDateTime.now().plusMinutes(expiryMinutes);
    }

    public boolean isOtpValid(String storedOtp, String providedOtp, LocalDateTime expiresAt) {
        if (storedOtp == null || providedOtp == null || expiresAt == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(expiresAt)) {
            logger.warn("OTP has expired");
            return false;
        }
        return storedOtp.equals(providedOtp);
    }
}
