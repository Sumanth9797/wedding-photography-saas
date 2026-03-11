package com.weddingphotography.controller;

import com.weddingphotography.model.Notification;
import com.weddingphotography.model.User;
import com.weddingphotography.service.AuthService;
import com.weddingphotography.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired private NotificationService notificationService;
    @Autowired private AuthService authService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        User user = authService.getCurrentUser(userId);
        List<Notification> notifications = notificationService.getUserNotifications(user);
        Long unreadCount = notificationService.countUnread(user);

        return ResponseEntity.ok(Map.of(
            "notifications", notifications.stream().map(n -> Map.of(
                "id", (Object) n.getId(),
                "type", (Object) n.getType().name(),
                "message", (Object) n.getMessage(),
                "isRead", (Object) n.getIsRead(),
                "createdAt", (Object) (n.getCreatedAt() != null ? n.getCreatedAt().toString() : ""),
                "eventId", (Object) (n.getEvent() != null ? n.getEvent().getId() : null)
            )).collect(Collectors.toList()),
            "unreadCount", unreadCount
        ));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        User user = authService.getCurrentUser(userId);
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }
}
