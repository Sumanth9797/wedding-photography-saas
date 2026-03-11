package com.weddingphotography.service;

import com.weddingphotography.exception.ResourceNotFoundException;
import com.weddingphotography.exception.UnauthorizedException;
import com.weddingphotography.model.*;
import com.weddingphotography.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
public class EditorService {

    @Autowired private EventAssignmentRepository assignmentRepository;
    @Autowired private PhotoRepository photoRepository;
    @Autowired private EditedPhotoRepository editedPhotoRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private S3Service s3Service;
    @Autowired private NotificationService notificationService;

    public List<EventAssignment> getEditorAssignments(Long editorId) {
        User editor = userRepository.findById(editorId)
            .orElseThrow(() -> new ResourceNotFoundException("User", editorId));
        return assignmentRepository.findByEditorOrderByAssignedAtDesc(editor);
    }

    public List<Photo> getAssignmentPhotos(Long eventId, Long editorId) {
        User editor = userRepository.findById(editorId)
            .orElseThrow(() -> new ResourceNotFoundException("User", editorId));
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        // Verify editor is assigned to this event
        assignmentRepository.findByEventAndEditor(event, editor)
            .orElseThrow(() -> new UnauthorizedException("Not assigned to this event"));

        return photoRepository.findByEventAndStatus(event, Photo.PhotoStatus.SELECTED);
    }

    public EditedPhoto uploadEditedPhoto(Long eventId, Long editorId, Long photoId,
                                          MultipartFile file, String editorNotes) throws IOException {
        User editor = userRepository.findById(editorId)
            .orElseThrow(() -> new ResourceNotFoundException("User", editorId));
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));
        Photo photo = photoRepository.findById(photoId)
            .orElseThrow(() -> new ResourceNotFoundException("Photo", photoId));

        // Verify editor is assigned
        assignmentRepository.findByEventAndEditor(event, editor)
            .orElseThrow(() -> new UnauthorizedException("Not assigned to this event"));

        // Upload to S3
        String editedKey = s3Service.uploadFile(file, "events/" + eventId + "/edited");

        // Get current version
        int version = editedPhotoRepository.findTopByPhotoOrderByVersionDesc(photo)
            .map(ep -> ep.getVersion() + 1)
            .orElse(1);

        EditedPhoto editedPhoto = EditedPhoto.builder()
            .photo(photo)
            .editor(editor)
            .editedS3Key(editedKey)
            .editorNotes(editorNotes)
            .version(version)
            .build();

        photo.setStatus(Photo.PhotoStatus.EDITED);
        photoRepository.save(photo);

        EditedPhoto saved = editedPhotoRepository.save(editedPhoto);

        // Notify photographer and client
        notificationService.createNotification(
            event.getPhotographer(), event,
            Notification.NotificationType.EDITING_COMPLETE,
            "Edited photo uploaded for: " + event.getTitle()
        );

        return saved;
    }

    public EditedPhoto uploadAlbumPreview(Long eventId, Long editorId,
                                           MultipartFile file, String editorNotes) throws IOException {
        User editor = userRepository.findById(editorId)
            .orElseThrow(() -> new ResourceNotFoundException("User", editorId));
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        assignmentRepository.findByEventAndEditor(event, editor)
            .orElseThrow(() -> new UnauthorizedException("Not assigned to this event"));

        String albumKey = s3Service.uploadFile(file, "events/" + eventId + "/album");

        EditedPhoto albumEntry = EditedPhoto.builder()
            .editor(editor)
            .albumPreviewS3Key(albumKey)
            .editorNotes(editorNotes)
            .build();

        EditedPhoto saved = editedPhotoRepository.save(albumEntry);

        // Update assignment status
        assignmentRepository.findByEventAndEditor(event, editor).ifPresent(assignment -> {
            assignment.setStatus(EventAssignment.AssignmentStatus.COMPLETED);
            assignmentRepository.save(assignment);
        });

        // Notify
        event.setStatus(Event.EventStatus.REVIEW);
        eventRepository.save(event);

        notificationService.createNotification(
            event.getPhotographer(), event,
            Notification.NotificationType.EDITING_COMPLETE,
            "Album preview uploaded for: " + event.getTitle()
        );

        return saved;
    }
}
