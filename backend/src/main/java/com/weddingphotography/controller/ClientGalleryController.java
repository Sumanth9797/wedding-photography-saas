package com.weddingphotography.controller;

import com.weddingphotography.dto.GalleryDTOs;
import com.weddingphotography.model.*;
import com.weddingphotography.service.ClientGalleryService;
import com.weddingphotography.service.PhotoService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/gallery")
public class ClientGalleryController {

    @Autowired private ClientGalleryService galleryService;
    @Autowired private PhotoService photoService;

    @GetMapping("/{token}")
    public ResponseEntity<GalleryDTOs.GalleryInfoResponse> getGalleryInfo(
            @PathVariable String token) {
        Event event = galleryService.getGalleryInfo(token);
        GalleryDTOs.GalleryInfoResponse response = new GalleryDTOs.GalleryInfoResponse();
        response.setEventId(event.getId());
        response.setTitle(event.getTitle());
        response.setBrideName(event.getBrideName());
        response.setGroomName(event.getGroomName());
        response.setWeddingDate(event.getWeddingDate().toString());
        response.setStatus(event.getStatus().name());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{token}/photos")
    public ResponseEntity<List<Map<String, Object>>> getGalleryPhotos(
            @PathVariable String token, Authentication auth) {
        Long clientId = (Long) auth.getPrincipal();
        List<Photo> photos = galleryService.getGalleryPhotos(token, clientId);
        List<Map<String, Object>> response = photos.stream().map(photo -> Map.of(
            "id", (Object) photo.getId(),
            "fileName", (Object) photo.getFileName(),
            "previewUrl", (Object) (photoService.getPhotoUrl(photo) != null
                ? photoService.getPhotoUrl(photo) : ""),
            "thumbnailUrl", (Object) (photoService.getThumbnailUrl(photo) != null
                ? photoService.getThumbnailUrl(photo) : ""),
            "status", (Object) photo.getStatus().name()
        )).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{token}/selections")
    public ResponseEntity<Map<String, Object>> submitSelections(
            @PathVariable String token,
            @RequestBody GalleryDTOs.SubmitSelectionsRequest request,
            Authentication auth) {
        Long clientId = (Long) auth.getPrincipal();
        List<Map<String, Object>> selections = request.getSelections().stream()
            .map(sel -> Map.<String, Object>of(
                "photoId", sel.getPhotoId(),
                "isAlbumPhoto", sel.getIsAlbumPhoto() != null ? sel.getIsAlbumPhoto() : false,
                "comment", sel.getComment() != null ? sel.getComment() : ""
            ))
            .collect(Collectors.toList());

        galleryService.submitSelections(token, clientId, selections);
        return ResponseEntity.ok(Map.of(
            "message", "Selections submitted successfully",
            "count", selections.size()
        ));
    }

    @PutMapping("/{token}/review")
    public ResponseEntity<Map<String, String>> submitReview(
            @PathVariable String token,
            @Valid @RequestBody GalleryDTOs.ReviewRequest request,
            Authentication auth) {
        Long clientId = (Long) auth.getPrincipal();
        galleryService.submitReview(token, clientId,
            request.getPhotoId(), request.getRating(),
            request.getComment(), request.getStatus());
        return ResponseEntity.ok(Map.of("message", "Review submitted successfully"));
    }

    @GetMapping("/{token}/downloads")
    public ResponseEntity<GalleryDTOs.DownloadResponse> getDownloadLinks(
            @PathVariable String token, Authentication auth) {
        Long clientId = (Long) auth.getPrincipal();
        List<String> urls = galleryService.getDownloadLinks(token, clientId);
        GalleryDTOs.DownloadResponse response = new GalleryDTOs.DownloadResponse();
        response.setDownloadUrls(urls);
        response.setDownloadType("ALL");
        return ResponseEntity.ok(response);
    }
}
