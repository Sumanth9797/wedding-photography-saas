package com.weddingphotography.repository;

import com.weddingphotography.model.ClientReview;
import com.weddingphotography.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientReviewRepository extends JpaRepository<ClientReview, Long> {
    List<ClientReview> findByEvent(Event event);
    List<ClientReview> findByEventAndStatus(Event event, ClientReview.ReviewStatus status);

    @Query("SELECT AVG(cr.rating) FROM ClientReview cr WHERE cr.event.photographer.id = :photographerId AND cr.rating IS NOT NULL")
    Double avgRatingByPhotographerId(Long photographerId);

    @Query("SELECT AVG(cr.rating) FROM ClientReview cr WHERE cr.event = :event AND cr.rating IS NOT NULL")
    Double avgRatingByEvent(Event event);
}
