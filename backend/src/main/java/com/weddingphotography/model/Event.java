package com.weddingphotography.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photographer_id", nullable = false)
    private User photographer;

    @Column(nullable = false)
    private String title;

    @Column(name = "wedding_date", nullable = false)
    private LocalDate weddingDate;

    @Column(name = "bride_name", nullable = false)
    private String brideName;

    @Column(name = "bride_phone")
    private String bridePhone;

    @Column(name = "bride_email")
    private String brideEmail;

    @Column(name = "groom_name", nullable = false)
    private String groomName;

    @Column(name = "groom_phone")
    private String groomPhone;

    @Column(name = "groom_email")
    private String groomEmail;

    @Column(name = "gallery_token", unique = true, nullable = false)
    private String galleryToken;

    @Column(name = "pin_code")
    private String pinCode;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EventStatus status = EventStatus.DRAFT;

    @Column(name = "cover_s3_key")
    private String coverS3Key;

    private String description;
    private String venue;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum EventStatus {
        DRAFT, ACTIVE, EDITING, REVIEW, COMPLETED
    }
}
