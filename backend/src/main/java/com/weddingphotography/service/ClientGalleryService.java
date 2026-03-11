package com.weddingphotography.service;

import com.weddingphotography.exception.ResourceNotFoundException;
import com.weddingphotography.exception.UnauthorizedException;
import com.weddingphotography.model.*;
import com.weddingphotography.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ClientGalleryService {

    @Autowired private EventRepository eventRepository;
    @Autowired private PhotoRepository photoRepository;
    @Autowired private PhotoSelectionRepository selectionRepository;
    @Autowired private ClientReviewRepository reviewRepository;
    @Autowired private DownloadRepository downloadRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private S3Service s3Service;
    @Autowired private NotificationService notificationService;

    public Event getGalleryInfo(String token) {
        return eventRepository.findByGalleryToken(token)
            .orElseThrow(() -> new ResourceNotFoundException("Gallery not found"));
    }

    public List<Photo> getGalleryPhotos(String token, Long clientId) {
        Event event = getGalleryInfo(token);
        return photoRepository.findByEventOrderByCreatedAtDesc(event);
    }

    public List<PhotoSelection> submitSelections(String token, Long clientId,
                                                  List<Map<String, Object>> selections) {
        Event event = getGalleryInfo(token);
        User client = userRepository.findById(clientId)
            .orElseThrow(() -> new ResourceNotFoundException("User", clientId));

        for (Map<String, Object> sel : selections) {
            Long photoId = Long.valueOf(sel.get("photoId").toString());
            Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo", photoId));

            if (!photo.getEvent().getId().equals(event.getId())) {
                throw new UnauthorizedException("Photo does not belong to this gallery");
            }

            PhotoSelection existing = selectionRepository.findByPhotoAndEvent(photo, event)
                .orElse(PhotoSelection.builder()
                    .photo(photo)
                    .event(event)
                    .selectedByClient(client)
                    .build());

            existing.setIsAlbumPhoto(Boolean.valueOf(sel.getOrDefault("isAlbumPhoto", false).toString()));
            existing.setClientComment((String) sel.getOrDefault("comment", null));
            selectionRepository.save(existing);

            photo.setStatus(Photo.PhotoStatus.SELECTED);
            photoRepository.save(photo);
        }

        // Notify photographer
        notificationService.createNotification(
            event.getPhotographer(), event,
            Notification.NotificationType.SELECTION_SUBMITTED,
            "Client has submitted photo selections for: " + event.getTitle()
        );

        return selectionRepository.findByEvent(event);
    }

    public ClientReview submitReview(String token, Long clientId, Long photoId,
                                      Integer rating, String comment,
                                      ClientReview.ReviewStatus status) {
        Event event = getGalleryInfo(token);
        User client = userRepository.findById(clientId)
            .orElseThrow(() -> new ResourceNotFoundException("User", clientId));

        Photo photo = null;
        if (photoId != null) {
            photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo", photoId));
        }

        ClientReview review = ClientReview.builder()
            .event(event)
            .photo(photo)
            .client(client)
            .rating(rating)
            .comment(comment)
            .status(status != null ? status : ClientReview.ReviewStatus.PENDING)
            .build();

        ClientReview saved = reviewRepository.save(review);

        // Notify photographer
        String notifMessage = status == ClientReview.ReviewStatus.APPROVED
            ? "Client approved edits for: " + event.getTitle()
            : "Client requested changes for: " + event.getTitle();

        notificationService.createNotification(
            event.getPhotographer(), event,
            status == ClientReview.ReviewStatus.APPROVED
                ? Notification.NotificationType.APPROVED
                : Notification.NotificationType.CHANGES_REQUESTED,
            notifMessage
        );

        return saved;
    }

    public List<String> getDownloadLinks(String token, Long clientId) {
        Event event = getGalleryInfo(token);
        User client = userRepository.findById(clientId)
            .orElseThrow(() -> new ResourceNotFoundException("User", clientId));

        Download download = downloadRepository.findByEventAndClientAndIsActive(event, client, true)
            .orElseThrow(() -> new UnauthorizedException("Download not enabled for this gallery"));

        // Increment download count
        download.setDownloadCount(download.getDownloadCount() + 1);
        downloadRepository.save(download);

        // Return approved/edited photo URLs
        List<Photo> photos = photoRepository.findByEventAndStatus(event, Photo.PhotoStatus.APPROVED);
        return photos.stream()
            .filter(p -> p.getPreviewS3Key() != null)
            .map(p -> s3Service.generatePresignedDownloadUrl(p.getPreviewS3Key()))
            .toList();
    }
}
