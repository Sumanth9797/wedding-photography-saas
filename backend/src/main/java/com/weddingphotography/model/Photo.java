package com.weddingphotography.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "preview_s3_key")
    private String previewS3Key;

    @Column(name = "original_local_path", length = 1000)
    private String originalLocalPath;

    @Column(name = "thumbnail_s3_key")
    private String thumbnailS3Key;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PhotoStatus status = PhotoStatus.PREVIEW;

    @Column(name = "file_size")
    private Long fileSize;

    private Integer width;
    private Integer height;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PhotoStatus {
        PREVIEW, SELECTED, EDITING, EDITED, APPROVED
    }
}
