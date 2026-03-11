package com.weddingphotography.repository;

import com.weddingphotography.model.Event;
import com.weddingphotography.model.Photo;
import com.weddingphotography.model.PhotoSelection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoSelectionRepository extends JpaRepository<PhotoSelection, Long> {
    List<PhotoSelection> findByEvent(Event event);
    List<PhotoSelection> findByEventAndIsAlbumPhoto(Event event, Boolean isAlbumPhoto);
    Optional<PhotoSelection> findByPhotoAndEvent(Photo photo, Event event);

    @Query("SELECT COUNT(ps) FROM PhotoSelection ps WHERE ps.event = :event")
    Long countByEvent(Event event);

    @Query("SELECT COUNT(ps) FROM PhotoSelection ps WHERE ps.event.photographer.id = :photographerId")
    Long countByPhotographerId(Long photographerId);
}
