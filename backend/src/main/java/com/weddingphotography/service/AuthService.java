package com.weddingphotography.service;

import com.weddingphotography.config.JwtConfig;
import com.weddingphotography.exception.OtpDeliveryException;
import com.weddingphotography.exception.ResourceNotFoundException;
import com.weddingphotography.model.Event;
import com.weddingphotography.model.User;
import com.weddingphotography.repository.EventRepository;
import com.weddingphotography.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired private UserRepository userRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private OtpService otpService;
    @Autowired private JwtConfig jwtConfig;
    @Autowired private NotificationService notificationService;

    /**
     * Send OTP to the given contact (email or phone).
     * Creates user if not exists.
     * <p>
     * {@link OtpDeliveryException} is excluded from rollback so that the user record
     * and OTP are persisted even when delivery fails — the user can retry immediately
     * without losing their account or needing a new sign-up flow.
     */
    @Transactional(noRollbackFor = OtpDeliveryException.class)
    public void sendOtp(String contact, User.UserRole role) {
        Optional<User> existing = userRepository.findByEmailOrPhone(contact, contact);
        User user = existing.orElseGet(() -> {
            User newUser = User.builder()
                .name("User")
                .role(role)
                .isActive(true)
                .build();
            if (contact.contains("@")) {
                newUser.setEmail(contact);
            } else {
                newUser.setPhone(contact);
            }
            return userRepository.save(newUser);
        });

        String otp = otpService.generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiresAt(otpService.generateExpiry());
        userRepository.save(user);

        // Send OTP via email or SMS
        if (contact.contains("@")) {
            notificationService.sendEmail(contact, "Your OTP Code",
                "Your verification code is: " + otp + ". Valid for 10 minutes.");
        } else {
            notificationService.sendOtpSms(contact,
                "Your Wedding Photography verification code is: " + otp + ". Valid for 10 minutes.");
        }

        logger.info("OTP sent to: {}", contact);
        logger.debug(">>> DEV: OTP for {} is: {} <<<", contact, otp);
    }

    /**
     * Verify OTP and return JWT token.
     */
    public Map<String, Object> verifyOtp(String contact, String otp) {
        User user = userRepository.findByEmailOrPhone(contact, contact)
            .orElseThrow(() -> new ResourceNotFoundException("User not found for: " + contact));

        if (!otpService.isOtpValid(user.getOtpCode(), otp, user.getOtpExpiresAt())) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        // Clear OTP after successful verification
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);

        String token = jwtConfig.generateToken(user.getId(), user.getRole().name());
        return Map.of(
            "token", token,
            "userId", user.getId(),
            "role", user.getRole().name(),
            "name", user.getName()
        );
    }

    /**
     * Client accesses gallery via token + PIN/OTP.
     */
    public Map<String, Object> galleryAccess(String galleryToken, String pin) {
        Event event = eventRepository.findByGalleryToken(galleryToken)
            .orElseThrow(() -> new ResourceNotFoundException("Gallery not found"));

        if (event.getPinCode() != null && !event.getPinCode().equals(pin)) {
            throw new IllegalArgumentException("Invalid PIN");
        }

        // Find or create client user based on bride/groom email or create anonymous client
        String clientEmail = event.getBrideEmail() != null ? event.getBrideEmail() :
                             event.getGroomEmail() != null ? event.getGroomEmail() :
                             "client-" + event.getId() + "@gallery.local";
        User client = userRepository.findByEmailOrPhone(clientEmail, clientEmail)
            .orElseGet(() -> {
                User newClient = User.builder()
                    .name(event.getBrideName() + " & " + event.getGroomName())
                    .email(clientEmail)
                    .role(User.UserRole.CLIENT)
                    .isActive(true)
                    .build();
                return userRepository.save(newClient);
            });

        String token = jwtConfig.generateGalleryToken(event.getId(), client.getId(), galleryToken);
        return Map.of(
            "token", token,
            "eventId", event.getId(),
            "clientId", client.getId(),
            "eventTitle", event.getTitle()
        );
    }

    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }
}
