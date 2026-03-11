package com.weddingphotography.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "downloads", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "client_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Download {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enabled_by", nullable = false)
    private User enabledBy;

    @Column(name = "enabled_at")
    private LocalDateTime enabledAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "download_type")
    @Builder.Default
    private DownloadType downloadType = DownloadType.ALL;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "download_count")
    @Builder.Default
    private Integer downloadCount = 0;

    @PrePersist
    protected void onCreate() {
        enabledAt = LocalDateTime.now();
    }

    public enum DownloadType {
        PHOTOS, ALBUM, ALL
    }
}
