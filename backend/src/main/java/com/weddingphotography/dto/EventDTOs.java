package com.weddingphotography.dto;

import com.weddingphotography.model.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EventDTOs {

    @Data
    public static class CreateEventRequest {
        @NotBlank(message = "Title is required")
        private String title;
        @NotNull(message = "Wedding date is required")
        private LocalDate weddingDate;
        @NotBlank(message = "Bride name is required")
        private String brideName;
        private String bridePhone;
        private String brideEmail;
        @NotBlank(message = "Groom name is required")
        private String groomName;
        private String groomPhone;
        private String groomEmail;
        private String description;
        private String venue;
    }

    @Data
    public static class UpdateEventRequest {
        private String title;
        private LocalDate weddingDate;
        private String brideName;
        private String bridePhone;
        private String brideEmail;
        private String groomName;
        private String groomPhone;
        private String groomEmail;
        private String description;
        private String venue;
        private Event.EventStatus status;
    }

    @Data
    public static class SendGalleryLinkRequest {
        @NotBlank(message = "Method is required (EMAIL, SMS, WHATSAPP)")
        private String method;
    }

    @Data
    public static class AssignEditorRequest {
        @NotNull(message = "Editor ID is required")
        private Long editorId;
        private String notes;
    }

    @Data
    public static class EnableDownloadRequest {
        @NotNull(message = "Client ID is required")
        private Long clientId;
    }

    @Data
    public static class EventResponse {
        private Long id;
        private String title;
        private LocalDate weddingDate;
        private String brideName;
        private String bridePhone;
        private String brideEmail;
        private String groomName;
        private String groomPhone;
        private String groomEmail;
        private String galleryToken;
        private String galleryUrl;
        private String pinCode;
        private String status;
        private String venue;
        private String description;
        private LocalDateTime createdAt;
        private Long photoCount;
        private Long selectionCount;
    }
}
