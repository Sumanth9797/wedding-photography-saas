package com.weddingphotography.controller;

import com.weddingphotography.dto.EditorDTOs;
import com.weddingphotography.model.EditedPhoto;
import com.weddingphotography.model.EventAssignment;
import com.weddingphotography.model.Photo;
import com.weddingphotography.service.EditorService;
import com.weddingphotography.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/editor")
@PreAuthorize("hasRole('EDITOR')")
public class EditorController {

    @Autowired private EditorService editorService;
    @Autowired private PhotoService photoService;

    @GetMapping("/assignments")
    public ResponseEntity<List<EditorDTOs.AssignmentResponse>> getAssignments(
            Authentication auth) {
        Long editorId = (Long) auth.getPrincipal();
        List<EventAssignment> assignments = editorService.getEditorAssignments(editorId);
        return ResponseEntity.ok(assignments.stream().map(this::toAssignmentResponse)
            .collect(Collectors.toList()));
    }

    @GetMapping("/assignments/{eventId}/photos")
    public ResponseEntity<List<Map<String, Object>>> getAssignmentPhotos(
            @PathVariable Long eventId, Authentication auth) {
        Long editorId = (Long) auth.getPrincipal();
        List<Photo> photos = editorService.getAssignmentPhotos(eventId, editorId);
        return ResponseEntity.ok(photos.stream().map(photo -> Map.of(
            "id", (Object) photo.getId(),
            "fileName", (Object) photo.getFileName(),
            "previewUrl", (Object) (photoService.getPhotoUrl(photo) != null
                ? photoService.getPhotoUrl(photo) : ""),
            "status", (Object) photo.getStatus().name()
        )).collect(Collectors.toList()));
    }

    @PostMapping("/assignments/{eventId}/upload-edited")
    public ResponseEntity<Map<String, Object>> uploadEdited(
            @PathVariable Long eventId,
            @RequestParam("file") MultipartFile file,
            @RequestParam Long photoId,
            @RequestParam(required = false) String editorNotes,
            Authentication auth) throws IOException {
        Long editorId = (Long) auth.getPrincipal();
        EditedPhoto editedPhoto = editorService.uploadEditedPhoto(
            eventId, editorId, photoId, file, editorNotes
        );
        return ResponseEntity.ok(Map.of(
            "id", editedPhoto.getId(),
            "message", "Edited photo uploaded successfully",
            "version", editedPhoto.getVersion()
        ));
    }

    @PostMapping("/assignments/{eventId}/upload-album")
    public ResponseEntity<Map<String, Object>> uploadAlbum(
            @PathVariable Long eventId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String editorNotes,
            Authentication auth) throws IOException {
        Long editorId = (Long) auth.getPrincipal();
        EditedPhoto albumEntry = editorService.uploadAlbumPreview(
            eventId, editorId, file, editorNotes
        );
        return ResponseEntity.ok(Map.of(
            "id", albumEntry.getId(),
            "message", "Album preview uploaded successfully"
        ));
    }

    private EditorDTOs.AssignmentResponse toAssignmentResponse(EventAssignment assignment) {
        EditorDTOs.AssignmentResponse response = new EditorDTOs.AssignmentResponse();
        response.setId(assignment.getId());
        response.setEventId(assignment.getEvent().getId());
        response.setEventTitle(assignment.getEvent().getTitle());
        response.setWeddingDate(assignment.getEvent().getWeddingDate().toString());
        response.setStatus(assignment.getStatus().name());
        if (assignment.getAssignedAt() != null) {
            response.setAssignedAt(assignment.getAssignedAt().toString());
        }
        response.setNotes(assignment.getNotes());
        return response;
    }
}
