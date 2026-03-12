package com.weddingphotography.service;

import com.twilio.Twilio;
import com.twilio.exception.ApiConnectionException;
import com.twilio.exception.ApiException;
import com.twilio.exception.TwilioException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.weddingphotography.exception.OtpDeliveryException;
import com.weddingphotography.model.Event;
import com.weddingphotography.model.Notification;
import com.weddingphotography.model.User;
import com.weddingphotography.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
@Transactional
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired private NotificationRepository notificationRepository;
    @Autowired(required = false) private JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@weddingphotography.com}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    @Value("${app.gallery-url:http://localhost:3000/gallery}")
    private String galleryUrl;

    @Value("${notification.console.enabled:false}")
    private boolean consoleEnabled;

    @Value("${twilio.account-sid:}")
    private String twilioAccountSid;

    @Value("${twilio.auth-token:}")
    private String twilioAuthToken;

    @Value("${twilio.phone-number:}")
    private String twilioPhoneNumber;

    @Value("${twilio.whatsapp-number:whatsapp:+14155238886}")
    private String twilioWhatsAppNumber;

    private boolean twilioEnabled = false;

    @PostConstruct
    public void initTwilio() {
        if (twilioAccountSid != null && !twilioAccountSid.isBlank()
                && twilioAuthToken != null && !twilioAuthToken.isBlank()) {
            try {
                Twilio.init(twilioAccountSid, twilioAuthToken);
                twilioEnabled = true;
                logger.info("Twilio initialized successfully.");
            } catch (Exception e) {
                logger.warn("Failed to initialize Twilio: {}. SMS/WhatsApp delivery will be disabled.", e.getMessage());
            }
        } else {
            logger.info("Twilio credentials not configured. SMS/WhatsApp will use console output in dev mode.");
        }
    }

    public Notification createNotification(User user, Event event,
                                           Notification.NotificationType type, String message) {
        Notification notification = Notification.builder()
            .user(user)
            .event(event)
            .type(type)
            .message(message)
            .isRead(false)
            .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long notificationId, User user) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            if (notification.getUser().getId().equals(user.getId())) {
                notification.setIsRead(true);
                notificationRepository.save(notification);
            }
        });
    }

    public Long countUnread(User user) {
        return notificationRepository.countUnreadByUser(user);
    }

    @Async
    public void sendEmail(String to, String subject, String body) {
        if (consoleEnabled) {
            logger.info("=== DEV EMAIL ===\nTo: {}\nSubject: {}\n{}\n================", to, subject, body);
            return;
        }
        if (mailSender == null) {
            logger.warn("Mail sender not configured. Skipping email to: {}", to);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            logger.info("Email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}", to, e);
        }
    }

    @Async
    public void sendSms(String phone, String message) {
        if (consoleEnabled) {
            logger.info("=== DEV SMS ===\nTo: {}\n{}\n===============", phone, message);
            return;
        }
        if (twilioEnabled && twilioPhoneNumber != null && !twilioPhoneNumber.isBlank()) {
            try {
                Message.creator(
                    new PhoneNumber(phone),
                    new PhoneNumber(twilioPhoneNumber),
                    message
                ).create();
                logger.info("SMS sent via Twilio to: {}", phone);
            } catch (Exception e) {
                logger.error("Failed to send SMS via Twilio to: {}", phone, e);
            }
        } else {
            logger.warn("Twilio not configured. Cannot send SMS to: {}. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.", phone);
        }
    }

    /**
     * Synchronous OTP SMS delivery — throws {@link OtpDeliveryException} on failure so the
     * caller (and ultimately the HTTP client) receives an actionable error message.
     * <p>
     * All exceptions are caught and re-thrown as {@link OtpDeliveryException} to guarantee
     * an HTTP 503 response (not 500) for any delivery failure.
     */
    public void sendOtpSms(String phone, String message) {
        if (consoleEnabled) {
            logger.info("=== DEV SMS ===\nTo: {}\n{}\n===============", phone, message);
            return;
        }
        if (!twilioEnabled || twilioPhoneNumber == null || twilioPhoneNumber.isBlank()) {
            logger.error("Twilio not configured (TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_PHONE_NUMBER missing). Cannot send OTP SMS to: {}", phone);
            throw new OtpDeliveryException(
                "SMS delivery is not configured on this server. Please use an email address to receive your OTP, or contact support");
        }
        try {
            Message.creator(
                new PhoneNumber(phone),
                new PhoneNumber(twilioPhoneNumber),
                message
            ).create();
            logger.info("OTP SMS sent via Twilio to: {}", phone);
        } catch (ApiException e) {
            logger.error("Twilio API error sending OTP SMS to {}: [code={}] {}", phone, e.getCode(), e.getMessage());
            throw new OtpDeliveryException(
                "Failed to deliver OTP via SMS (Twilio error " + e.getCode() + "). Please verify your phone number is correct, try again, or use an email address", e);
        } catch (ApiConnectionException e) {
            logger.error("Twilio connection error sending OTP SMS to {}: {}", phone, e.getMessage());
            throw new OtpDeliveryException(
                "Could not reach the SMS service. Please check your network connection and try again, or use an email address.", e);
        } catch (TwilioException e) {
            logger.error("Twilio error sending OTP SMS to {}: {}", phone, e.getMessage());
            throw new OtpDeliveryException(
                "Failed to deliver OTP via SMS. Please try again or use an email address.", e);
        } catch (Exception e) {
            logger.error("Unexpected error sending OTP SMS to {}: {}", phone, e.getMessage(), e);
            throw new OtpDeliveryException(
                "An unexpected error occurred while sending the OTP. Please try again or use an email address.", e);
        }
    }

    @Async
    public void sendWhatsApp(String phone, String message) {
        if (consoleEnabled) {
            logger.info("=== DEV WHATSAPP ===\nTo: {}\n{}\n====================", phone, message);
            return;
        }
        if (twilioEnabled && twilioWhatsAppNumber != null && !twilioWhatsAppNumber.isBlank()) {
            try {
                String whatsappTo = phone.startsWith("whatsapp:") ? phone : "whatsapp:" + phone;
                Message.creator(
                    new PhoneNumber(whatsappTo),
                    new PhoneNumber(twilioWhatsAppNumber),
                    message
                ).create();
                logger.info("WhatsApp message sent via Twilio to: {}", phone);
            } catch (Exception e) {
                logger.error("Failed to send WhatsApp message via Twilio to: {}", phone, e);
            }
        } else {
            logger.warn("Twilio not configured. Cannot send WhatsApp to: {}. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER.", phone);
        }
    }

    public void sendGalleryLink(Event event, String method) {
        String link = galleryUrl + "/" + event.getGalleryToken();
        String message = String.format(
            "Hello %s & %s! Your wedding gallery is ready. Access it here: %s\nPIN: %s",
            event.getBrideName(), event.getGroomName(), link, event.getPinCode()
        );

        switch (method.toUpperCase()) {
            case "EMAIL":
                if (event.getBrideEmail() != null) {
                    sendEmail(event.getBrideEmail(), "Your Wedding Gallery is Ready!", message);
                }
                if (event.getGroomEmail() != null) {
                    sendEmail(event.getGroomEmail(), "Your Wedding Gallery is Ready!", message);
                }
                break;
            case "SMS":
                if (event.getBridePhone() != null) sendSms(event.getBridePhone(), message);
                if (event.getGroomPhone() != null) sendSms(event.getGroomPhone(), message);
                break;
            case "WHATSAPP":
                if (event.getBridePhone() != null) sendWhatsApp(event.getBridePhone(), message);
                if (event.getGroomPhone() != null) sendWhatsApp(event.getGroomPhone(), message);
                break;
            default:
                logger.warn("Unknown notification method: {}", method);
        }
    }
}

