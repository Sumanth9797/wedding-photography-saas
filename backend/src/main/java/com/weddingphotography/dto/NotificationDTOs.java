package com.weddingphotography.dto;

import lombok.Data;

public class NotificationDTOs {

    @Data
    public static class NotificationResponse {
        private Long id;
        private String type;
        private String message;
        private Boolean isRead;
        private String createdAt;
        private Long eventId;
        private String eventTitle;
    }
}
