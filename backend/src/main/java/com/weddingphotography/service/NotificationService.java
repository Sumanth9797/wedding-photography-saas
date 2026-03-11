package com.weddingphotography.service;

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
        // Twilio SMS integration - logged when not configured
        logger.info("SMS to {}: {}", phone, message);
    }

    @Async
    public void sendWhatsApp(String phone, String message) {
        // Twilio WhatsApp integration - logged when not configured
        logger.info("WhatsApp to {}: {}", phone, message);
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
