package com.weddingphotography.controller;

import com.weddingphotography.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasRole('PHOTOGRAPHER')")
public class AnalyticsController {

    @Autowired private AnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview(Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        Map<String, Object> overview = analyticsService.getPhotographerOverview(photographerId);
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<Map<String, Object>> getEventAnalytics(
            @PathVariable Long eventId, Authentication auth) {
        Map<String, Object> analytics = analyticsService.getEventAnalytics(eventId);
        return ResponseEntity.ok(analytics);
    }
}
