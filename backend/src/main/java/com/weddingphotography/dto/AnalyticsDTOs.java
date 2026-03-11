package com.weddingphotography.dto;

import lombok.Data;

import java.util.Map;

public class AnalyticsDTOs {

    @Data
    public static class OverviewResponse {
        private Long totalEvents;
        private Long totalPhotos;
        private Long totalSelections;
        private Double averageRating;
        private Map<String, Long> eventsByStatus;
        private Object recentEvents;
    }

    @Data
    public static class EventAnalyticsResponse {
        private Long eventId;
        private String title;
        private String status;
        private String weddingDate;
        private Long totalPhotos;
        private Long totalSelections;
        private Integer albumPhotos;
        private Double averageRating;
        private Map<String, Long> photosByStatus;
    }
}
