package com.weddingphotography.repository;

import com.weddingphotography.model.Event;
import com.weddingphotography.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByPhotographerOrderByCreatedAtDesc(User photographer);
    Optional<Event> findByGalleryToken(String galleryToken);
    boolean existsByGalleryToken(String galleryToken);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.photographer = :photographer")
    Long countByPhotographer(User photographer);

    @Query("SELECT e FROM Event e WHERE e.photographer = :photographer AND e.status = :status")
    List<Event> findByPhotographerAndStatus(User photographer, Event.EventStatus status);
}
