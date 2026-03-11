package com.weddingphotography.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_assignments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "editor_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "editor_id", nullable = false)
    private User editor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by", nullable = false)
    private User assignedBy;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
    }

    public enum AssignmentStatus {
        PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, REJECTED
    }
}
