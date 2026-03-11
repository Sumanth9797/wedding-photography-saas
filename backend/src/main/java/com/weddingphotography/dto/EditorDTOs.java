package com.weddingphotography.dto;

import lombok.Data;

public class EditorDTOs {

    @Data
    public static class UploadEditedRequest {
        private Long photoId;
        private String editorNotes;
    }

    @Data
    public static class AssignmentResponse {
        private Long id;
        private Long eventId;
        private String eventTitle;
        private String weddingDate;
        private String status;
        private String assignedAt;
        private String notes;
        private Long selectedPhotosCount;
    }
}
