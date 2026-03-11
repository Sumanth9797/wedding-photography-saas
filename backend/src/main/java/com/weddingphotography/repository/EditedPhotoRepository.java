package com.weddingphotography.repository;

import com.weddingphotography.model.EditedPhoto;
import com.weddingphotography.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EditedPhotoRepository extends JpaRepository<EditedPhoto, Long> {
    List<EditedPhoto> findByPhotoOrderByVersionDesc(Photo photo);
    Optional<EditedPhoto> findTopByPhotoOrderByVersionDesc(Photo photo);
    List<EditedPhoto> findByEditorId(Long editorId);
}
