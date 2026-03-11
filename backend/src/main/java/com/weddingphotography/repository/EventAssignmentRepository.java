package com.weddingphotography.repository;

import com.weddingphotography.model.Event;
import com.weddingphotography.model.EventAssignment;
import com.weddingphotography.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventAssignmentRepository extends JpaRepository<EventAssignment, Long> {
    List<EventAssignment> findByEditor(User editor);
    List<EventAssignment> findByEditorOrderByAssignedAtDesc(User editor);
    Optional<EventAssignment> findByEventAndEditor(Event event, User editor);
    List<EventAssignment> findByEvent(Event event);
    boolean existsByEventAndEditor(Event event, User editor);
}
