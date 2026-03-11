package com.weddingphotography.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "edited_photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditedPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id", nullable = false)
    private Photo photo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "editor_id", nullable = false)
    private User editor;

    @Column(name = "edited_s3_key")
    private String editedS3Key;

    @Column(name = "album_preview_s3_key")
    private String albumPreviewS3Key;

    @Column(name = "editor_notes", columnDefinition = "TEXT")
    private String editorNotes;

    @Builder.Default
    private Integer version = 1;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
