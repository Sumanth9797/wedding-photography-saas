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
public class PhotoService {

    @Autowired private PhotoRepository photoRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private S3Service s3Service;
    @Autowired private NotificationService notificationService;

    public Photo uploadPreview(Long eventId, Long photographerId, MultipartFile file,
                                String originalLocalPath) throws IOException {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));
        User photographer = userRepository.findById(photographerId)
            .orElseThrow(() -> new ResourceNotFoundException("User", photographerId));

        if (!event.getPhotographer().getId().equals(photographerId)) {
            throw new UnauthorizedException("Access denied to this event");
        }

        // Upload preview to S3
        String previewKey = s3Service.uploadFile(file, "events/" + eventId + "/previews");
        String thumbnailKey = previewKey.replace(".jpg", "_thumb.jpg");

        Photo photo = Photo.builder()
            .event(event)
            .fileName(file.getOriginalFilename())
            .previewS3Key(previewKey)
            .thumbnailS3Key(thumbnailKey)
            .originalLocalPath(originalLocalPath)
            .uploadedBy(photographer)
            .status(Photo.PhotoStatus.PREVIEW)
            .fileSize(file.getSize())
            .build();

        return photoRepository.save(photo);
    }

    public List<Photo> getEventPhotos(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));
        return photoRepository.findByEventOrderByCreatedAtDesc(event);
    }

    public void deletePhoto(Long eventId, Long photoId, Long photographerId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        if (!event.getPhotographer().getId().equals(photographerId)) {
            throw new UnauthorizedException("Access denied");
        }

        Photo photo = photoRepository.findById(photoId)
            .orElseThrow(() -> new ResourceNotFoundException("Photo", photoId));

        if (!photo.getEvent().getId().equals(eventId)) {
            throw new IllegalArgumentException("Photo does not belong to this event");
        }

        // Delete from S3
        if (photo.getPreviewS3Key() != null) {
            s3Service.deleteFile(photo.getPreviewS3Key());
        }
        if (photo.getThumbnailS3Key() != null) {
            s3Service.deleteFile(photo.getThumbnailS3Key());
        }

        photoRepository.delete(photo);
    }

    public Photo updatePhotoStatus(Long eventId, Long photoId, Long photographerId,
                                    Photo.PhotoStatus newStatus) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        if (!event.getPhotographer().getId().equals(photographerId)) {
            throw new UnauthorizedException("Access denied");
        }

        Photo photo = photoRepository.findById(photoId)
            .orElseThrow(() -> new ResourceNotFoundException("Photo", photoId));

        photo.setStatus(newStatus);
        return photoRepository.save(photo);
    }

    public String getPhotoUrl(Photo photo) {
        if (photo.getPreviewS3Key() != null) {
            return s3Service.generatePresignedDownloadUrl(photo.getPreviewS3Key());
        }
        return null;
    }

    public String getThumbnailUrl(Photo photo) {
        if (photo.getThumbnailS3Key() != null) {
            return s3Service.generatePresignedDownloadUrl(photo.getThumbnailS3Key());
        }
        return getPhotoUrl(photo);
    }
}
