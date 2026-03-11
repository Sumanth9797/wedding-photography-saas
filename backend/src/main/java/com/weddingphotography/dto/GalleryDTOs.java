package com.weddingphotography.dto;

import com.weddingphotography.model.ClientReview;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.util.List;
import java.util.Map;

public class GalleryDTOs {

    @Data
    public static class GalleryInfoResponse {
        private Long eventId;
        private String title;
        private String brideName;
        private String groomName;
        private String weddingDate;
        private String status;
        private String coverUrl;
    }

    @Data
    public static class PhotoSelectionItem {
        private Long photoId;
        private Boolean isAlbumPhoto;
        private String comment;
    }

    @Data
    public static class SubmitSelectionsRequest {
        private List<PhotoSelectionItem> selections;
    }

    @Data
    public static class ReviewRequest {
        private Long photoId;
        @Min(1) @Max(5)
        private Integer rating;
        private String comment;
        private ClientReview.ReviewStatus status;
    }

    @Data
    public static class DownloadResponse {
        private List<String> downloadUrls;
        private String expiresAt;
        private String downloadType;
    }
}
