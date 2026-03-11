package com.weddingphotography.service;

import com.weddingphotography.model.Event;
import com.weddingphotography.model.User;
import com.weddingphotography.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    @Autowired private EventRepository eventRepository;
    @Autowired private PhotoRepository photoRepository;
    @Autowired private PhotoSelectionRepository selectionRepository;
    @Autowired private ClientReviewRepository reviewRepository;
    @Autowired private UserRepository userRepository;

    public Map<String, Object> getPhotographerOverview(Long photographerId) {
        User photographer = userRepository.findById(photographerId)
            .orElseThrow(() -> new IllegalArgumentException("Photographer not found"));

        Map<String, Object> stats = new HashMap<>();

        // Total events
        Long totalEvents = eventRepository.countByPhotographer(photographer);
        stats.put("totalEvents", totalEvents);

        // Events by status
        Map<String, Long> eventsByStatus = new HashMap<>();
        for (Event.EventStatus status : Event.EventStatus.values()) {
            eventsByStatus.put(status.name(),
                eventRepository.findByPhotographerAndStatus(photographer, status).size());
        }
        stats.put("eventsByStatus", eventsByStatus);

        // Total photos uploaded
        Long totalPhotos = photoRepository.countByPhotographerId(photographerId);
        stats.put("totalPhotos", totalPhotos);

        // Total selections
        Long totalSelections = selectionRepository.countByPhotographerId(photographerId);
        stats.put("totalSelections", totalSelections);

        // Average rating
        Double avgRating = reviewRepository.avgRatingByPhotographerId(photographerId);
        stats.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);

        // Recent events (last 5)
        List<Event> recentEvents = eventRepository.findByPhotographerOrderByCreatedAtDesc(photographer)
            .stream().limit(5).toList();
        stats.put("recentEvents", recentEvents.stream().map(e -> Map.of(
            "id", e.getId(),
            "title", e.getTitle(),
            "status", e.getStatus().name(),
            "weddingDate", e.getWeddingDate().toString()
        )).toList());

        return stats;
    }

    public Map<String, Object> getEventAnalytics(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("eventId", event.getId());
        stats.put("title", event.getTitle());
        stats.put("status", event.getStatus().name());
        stats.put("weddingDate", event.getWeddingDate().toString());

        // Photo counts by status
        Map<String, Long> photosByStatus = new HashMap<>();
        for (com.weddingphotography.model.Photo.PhotoStatus status :
                com.weddingphotography.model.Photo.PhotoStatus.values()) {
            photosByStatus.put(status.name(),
                photoRepository.countByEventAndStatus(event, status));
        }
        stats.put("photosByStatus", photosByStatus);
        stats.put("totalPhotos", photoRepository.countByEvent(event));

        // Selections
        stats.put("totalSelections", selectionRepository.countByEvent(event));
        stats.put("albumPhotos",
            selectionRepository.findByEventAndIsAlbumPhoto(event, true).size());

        // Reviews
        Double avgRating = reviewRepository.avgRatingByEvent(event);
        stats.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);

        return stats;
    }
}
