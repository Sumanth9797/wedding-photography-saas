package com.weddingphotography.repository;

import com.weddingphotography.model.Event;
import com.weddingphotography.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByEventOrderByCreatedAtDesc(Event event);
    List<Photo> findByEventAndStatus(Event event, Photo.PhotoStatus status);

    @Query("SELECT COUNT(p) FROM Photo p WHERE p.event = :event")
    Long countByEvent(Event event);

    @Query("SELECT COUNT(p) FROM Photo p WHERE p.event.photographer.id = :photographerId")
    Long countByPhotographerId(Long photographerId);

    @Query("SELECT COUNT(p) FROM Photo p WHERE p.event = :event AND p.status = :status")
    Long countByEventAndStatus(Event event, Photo.PhotoStatus status);
}
