package com.weddingphotography.repository;

import com.weddingphotography.model.Download;
import com.weddingphotography.model.Event;
import com.weddingphotography.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DownloadRepository extends JpaRepository<Download, Long> {
    Optional<Download> findByEventAndClient(Event event, User client);
    Optional<Download> findByEventAndClientAndIsActive(Event event, User client, Boolean isActive);
}
