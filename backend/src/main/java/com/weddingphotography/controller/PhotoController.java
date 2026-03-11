package com.weddingphotography.controller;

import com.weddingphotography.dto.PhotoDTOs;
import com.weddingphotography.model.Photo;
import com.weddingphotography.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events/{eventId}/photos")
public class PhotoController {

    @Autowired private PhotoService photoService;

    @PostMapping("/upload-preview")
    @PreAuthorize("hasRole('PHOTOGRAPHER')")
    public ResponseEntity<PhotoDTOs.PhotoResponse> uploadPreview(
            @PathVariable Long eventId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "originalLocalPath", required = false) String originalLocalPath,
            Authentication auth) throws IOException {
        Long photographerId = (Long) auth.getPrincipal();
        Photo photo = photoService.uploadPreview(eventId, photographerId, file, originalLocalPath);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(photo));
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('PHOTOGRAPHER')")
    public ResponseEntity<List<PhotoDTOs.PhotoResponse>> uploadMultiple(
            @PathVariable Long eventId,
            @RequestParam("photos") List<MultipartFile> photos,
            Authentication auth) throws IOException {
        Long photographerId = (Long) auth.getPrincipal();
        List<PhotoDTOs.PhotoResponse> responses = new java.util.ArrayList<>();
        for (MultipartFile file : photos) {
            Photo photo = photoService.uploadPreview(eventId, photographerId, file, null);
            responses.add(toResponse(photo));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }

    @GetMapping
    public ResponseEntity<List<PhotoDTOs.PhotoResponse>> getPhotos(
            @PathVariable Long eventId, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        List<Photo> photos = photoService.getEventPhotos(eventId, userId);
        return ResponseEntity.ok(photos.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @DeleteMapping("/{photoId}")
    @PreAuthorize("hasRole('PHOTOGRAPHER')")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long eventId,
            @PathVariable Long photoId,
            Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        photoService.deletePhoto(eventId, photoId, photographerId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{photoId}/status")
    @PreAuthorize("hasRole('PHOTOGRAPHER')")
    public ResponseEntity<PhotoDTOs.PhotoResponse> updatePhotoStatus(
            @PathVariable Long eventId,
            @PathVariable Long photoId,
            @RequestBody PhotoDTOs.UpdatePhotoStatusRequest request,
            Authentication auth) {
        Long photographerId = (Long) auth.getPrincipal();
        Photo photo = photoService.updatePhotoStatus(
            eventId, photoId, photographerId,
            Photo.PhotoStatus.valueOf(request.getStatus())
        );
        return ResponseEntity.ok(toResponse(photo));
    }

    @GetMapping("/presign-upload")
    @PreAuthorize("hasRole('PHOTOGRAPHER')")
    public ResponseEntity<Map<String, String>> getPresignedUploadUrl(
            @PathVariable Long eventId,
            @RequestParam String filename,
            @RequestParam(defaultValue = "image/jpeg") String contentType,
            Authentication auth) {
        // Returns a pre-signed URL for direct browser-to-S3 upload
        return ResponseEntity.ok(Map.of(
            "message", "Use POST /upload-preview with multipart form data"
        ));
    }

    private PhotoDTOs.PhotoResponse toResponse(Photo photo) {
        PhotoDTOs.PhotoResponse response = new PhotoDTOs.PhotoResponse();
        response.setId(photo.getId());
        response.setFileName(photo.getFileName());
        response.setPreviewUrl(photoService.getPhotoUrl(photo));
        response.setThumbnailUrl(photoService.getThumbnailUrl(photo));
        response.setStatus(photo.getStatus().name());
        response.setFileSize(photo.getFileSize());
        response.setWidth(photo.getWidth());
        response.setHeight(photo.getHeight());
        if (photo.getCreatedAt() != null) {
            response.setCreatedAt(photo.getCreatedAt().toString());
        }
        return response;
    }
}
