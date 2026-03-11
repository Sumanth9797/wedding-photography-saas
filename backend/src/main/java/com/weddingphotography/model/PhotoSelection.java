package com.weddingphotography.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "photo_selections", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"photo_id", "event_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhotoSelection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id", nullable = false)
    private Photo photo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_by_client")
    private User selectedByClient;

    @Column(name = "is_album_photo")
    @Builder.Default
    private Boolean isAlbumPhoto = false;

    @Column(name = "client_comment", columnDefinition = "TEXT")
    private String clientComment;

    @Column(name = "selected_at")
    private LocalDateTime selectedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        selectedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
