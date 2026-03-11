package com.weddingphotography.controller;

import com.weddingphotography.dto.EventDTOs;
import com.weddingphotography.model.Event;
import com.weddingphotography.model.EventAssignment;
import com.weddingphotography.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@PreAuthorize("hasRole('PHOTOGRAPHER')")
public class EventController {

    @Autowired private EventService eventService;

    @Value("${app.gallery-url:http://localhost:3000/gallery}")
    private String galleryUrl;

    @PostMapping
    public ResponseEntity<EventDTOs.EventResponse> createEvent(
            @Valid @RequestBody EventDTOs.CreateEventRequest request,
            Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        Event event = eventService.createEvent(
            photographerId, request.getTitle(), request.getWeddingDate(),
            request.getBrideName(), request.getBridePhone(), request.getBrideEmail(),
            request.getGroomName(), request.getGroomPhone(), request.getGroomEmail(),
            request.getDescription(), request.getVenue()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(event));
    }

    @GetMapping
    public ResponseEntity<List<EventDTOs.EventResponse>> getEvents(Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        List<Event> events = eventService.getPhotographerEvents(photographerId);
        return ResponseEntity.ok(events.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTOs.EventResponse> getEvent(
            @PathVariable Long id, Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        Event event = eventService.getEventById(id, photographerId);
        return ResponseEntity.ok(toResponse(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTOs.EventResponse> updateEvent(
            @PathVariable Long id,
            @RequestBody EventDTOs.UpdateEventRequest request,
            Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        Event event = eventService.updateEvent(
            id, photographerId, request.getTitle(), request.getWeddingDate(),
            request.getBrideName(), request.getBridePhone(), request.getBrideEmail(),
            request.getGroomName(), request.getGroomPhone(), request.getGroomEmail(),
            request.getDescription(), request.getVenue(), request.getStatus()
        );
        return ResponseEntity.ok(toResponse(event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id, Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        eventService.deleteEvent(id, photographerId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/send-gallery-link")
    public ResponseEntity<Map<String, String>> sendGalleryLink(
            @PathVariable Long id,
            @Valid @RequestBody EventDTOs.SendGalleryLinkRequest request,
            Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        eventService.sendGalleryLink(id, photographerId, request.getMethod());
        return ResponseEntity.ok(Map.of("message", "Gallery link sent successfully"));
    }

    @PostMapping("/{id}/assign-editor")
    public ResponseEntity<Map<String, Object>> assignEditor(
            @PathVariable Long id,
            @Valid @RequestBody EventDTOs.AssignEditorRequest request,
            Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        EventAssignment assignment = eventService.assignEditor(
            id, photographerId, request.getEditorId(), request.getNotes()
        );
        return ResponseEntity.ok(Map.of(
            "assignmentId", assignment.getId(),
            "message", "Editor assigned successfully"
        ));
    }

    @PutMapping("/{id}/enable-download")
    public ResponseEntity<Map<String, String>> enableDownload(
            @PathVariable Long id,
            @Valid @RequestBody EventDTOs.EnableDownloadRequest request,
            Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        eventService.enableDownload(id, photographerId, request.getClientId());
        return ResponseEntity.ok(Map.of("message", "Download enabled successfully"));
    }

    private EventDTOs.EventResponse toResponse(Event event) {
        EventDTOs.EventResponse response = new EventDTOs.EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setWeddingDate(event.getWeddingDate());
        response.setBrideName(event.getBrideName());
        response.setBridePhone(event.getBridePhone());
        response.setBrideEmail(event.getBrideEmail());
        response.setGroomName(event.getGroomName());
        response.setGroomPhone(event.getGroomPhone());
        response.setGroomEmail(event.getGroomEmail());
        response.setGalleryToken(event.getGalleryToken());
        response.setGalleryUrl(galleryUrl + "/" + event.getGalleryToken());
        response.setPinCode(event.getPinCode());
        response.setStatus(event.getStatus().name());
        response.setVenue(event.getVenue());
        response.setDescription(event.getDescription());
        response.setCreatedAt(event.getCreatedAt());
        return response;
    }
}
