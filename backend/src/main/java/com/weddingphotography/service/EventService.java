package com.weddingphotography.service;

import com.weddingphotography.exception.ResourceNotFoundException;
import com.weddingphotography.exception.UnauthorizedException;
import com.weddingphotography.model.*;
import com.weddingphotography.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EventService {

    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EventAssignmentRepository assignmentRepository;
    @Autowired private NotificationService notificationService;
    @Autowired private DownloadRepository downloadRepository;

    @Value("${app.gallery-url:http://localhost:3000/gallery}")
    private String galleryUrl;

    public Event createEvent(Long photographerId, String title, LocalDate weddingDate,
                              String brideName, String bridePhone, String brideEmail,
                              String groomName, String groomPhone, String groomEmail,
                              String description, String venue) {
        User photographer = userRepository.findById(photographerId)
            .orElseThrow(() -> new ResourceNotFoundException("User", photographerId));

        String galleryToken = UUID.randomUUID().toString();
        String pinCode = generatePin();

        Event event = Event.builder()
            .photographer(photographer)
            .title(title)
            .weddingDate(weddingDate)
            .brideName(brideName)
            .bridePhone(bridePhone)
            .brideEmail(brideEmail)
            .groomName(groomName)
            .groomPhone(groomPhone)
            .groomEmail(groomEmail)
            .galleryToken(galleryToken)
            .pinCode(pinCode)
            .status(Event.EventStatus.DRAFT)
            .description(description)
            .venue(venue)
            .build();

        return eventRepository.save(event);
    }

    public List<Event> getPhotographerEvents(Long photographerId) {
        User photographer = userRepository.findById(photographerId)
            .orElseThrow(() -> new ResourceNotFoundException("User", photographerId));
        return eventRepository.findByPhotographerOrderByCreatedAtDesc(photographer);
    }

    public Event getEventById(Long eventId, Long photographerId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));
        if (!event.getPhotographer().getId().equals(photographerId)) {
            throw new UnauthorizedException("Access denied to this event");
        }
        return event;
    }

    public Event updateEvent(Long eventId, Long photographerId, String title, LocalDate weddingDate,
                              String brideName, String bridePhone, String brideEmail,
                              String groomName, String groomPhone, String groomEmail,
                              String description, String venue, Event.EventStatus status) {
        Event event = getEventById(eventId, photographerId);

        if (title != null) event.setTitle(title);
        if (weddingDate != null) event.setWeddingDate(weddingDate);
        if (brideName != null) event.setBrideName(brideName);
        if (bridePhone != null) event.setBridePhone(bridePhone);
        if (brideEmail != null) event.setBrideEmail(brideEmail);
        if (groomName != null) event.setGroomName(groomName);
        if (groomPhone != null) event.setGroomPhone(groomPhone);
        if (groomEmail != null) event.setGroomEmail(groomEmail);
        if (description != null) event.setDescription(description);
        if (venue != null) event.setVenue(venue);
        if (status != null) event.setStatus(status);

        return eventRepository.save(event);
    }

    public void deleteEvent(Long eventId, Long photographerId) {
        Event event = getEventById(eventId, photographerId);
        eventRepository.delete(event);
    }

    public void sendGalleryLink(Long eventId, Long photographerId, String method) {
        Event event = getEventById(eventId, photographerId);
        event.setStatus(Event.EventStatus.ACTIVE);
        eventRepository.save(event);
        notificationService.sendGalleryLink(event, method);
    }

    public EventAssignment assignEditor(Long eventId, Long photographerId, Long editorId, String notes) {
        Event event = getEventById(eventId, photographerId);
        User editor = userRepository.findById(editorId)
            .orElseThrow(() -> new ResourceNotFoundException("Editor", editorId));
        User photographer = userRepository.findById(photographerId)
            .orElseThrow(() -> new ResourceNotFoundException("User", photographerId));

        if (editor.getRole() != User.UserRole.EDITOR) {
            throw new IllegalArgumentException("User is not an editor");
        }

        EventAssignment assignment = EventAssignment.builder()
            .event(event)
            .editor(editor)
            .assignedBy(photographer)
            .status(EventAssignment.AssignmentStatus.PENDING)
            .notes(notes)
            .build();

        event.setStatus(Event.EventStatus.EDITING);
        eventRepository.save(event);

        EventAssignment saved = assignmentRepository.save(assignment);

        notificationService.createNotification(editor, event,
            Notification.NotificationType.ASSIGNMENT,
            "You have been assigned to edit photos for: " + event.getTitle());

        return saved;
    }

    public void enableDownload(Long eventId, Long photographerId, Long clientId) {
        Event event = getEventById(eventId, photographerId);
        User photographer = userRepository.findById(photographerId)
            .orElseThrow(() -> new ResourceNotFoundException("User", photographerId));
        User client = userRepository.findById(clientId)
            .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));

        Download download = downloadRepository.findByEventAndClient(event, client)
            .orElse(Download.builder()
                .event(event)
                .client(client)
                .enabledBy(photographer)
                .isActive(true)
                .build());

        download.setIsActive(true);
        download.setEnabledBy(photographer);
        downloadRepository.save(download);

        event.setStatus(Event.EventStatus.COMPLETED);
        eventRepository.save(event);

        notificationService.createNotification(client, event,
            Notification.NotificationType.DOWNLOAD_ENABLED,
            "Your photos are ready for download: " + event.getTitle());
    }

    private String generatePin() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(1000000));
    }
}
