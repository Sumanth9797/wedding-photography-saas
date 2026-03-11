package com.weddingphotography.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class PhotoDTOs {

    @Data
    public static class UpdatePhotoStatusRequest {
        @NotNull(message = "Status is required")
        private String status;
    }

    @Data
    public static class PhotoResponse {
        private Long id;
        private String fileName;
        private String previewUrl;
        private String thumbnailUrl;
        private String status;
        private Long fileSize;
        private Integer width;
        private Integer height;
        private String createdAt;
        private Boolean isSelected;
        private Boolean isAlbumPhoto;
        private String clientComment;
    }
}
