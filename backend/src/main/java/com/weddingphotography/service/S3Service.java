package com.weddingphotography.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.UUID;

@Service
public class S3Service {

    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);

    @Autowired(required = false)
    private S3Client s3Client;

    @Autowired(required = false)
    private S3Presigner s3Presigner;

    @Value("${storage.local.enabled:false}")
    private boolean localEnabled;

    @Value("${storage.local.path:./uploads}")
    private String localStoragePath;

    @Value("${aws.s3.bucket-name:wedding-photography-bucket}")
    private String bucketName;

    @Value("${aws.cloudfront.domain:}")
    private String cloudfrontDomain;

    @Value("${aws.s3.presigned-url-expiry-minutes:60}")
    private int presignedUrlExpiry;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Upload a file and return a storage key.
     * Uses local filesystem when storage.local.enabled=true, otherwise S3.
     */
    public String uploadFile(MultipartFile file, String keyPrefix) throws IOException {
        String extension = getFileExtension(file.getOriginalFilename());
        String key = keyPrefix + "/" + UUID.randomUUID() + extension;

        if (localEnabled) {
            Path filePath = Paths.get(localStoragePath, key);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            logger.info("Saved file locally: {}", filePath);
            return key;
        }

        PutObjectRequest putRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .contentType(file.getContentType())
            .contentLength(file.getSize())
            .build();

        s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));
        logger.info("Uploaded file to S3: {}", key);
        return key;
    }

    /**
     * Generate a pre-signed URL for direct client upload.
     */
    public String generatePresignedUploadUrl(String key, String contentType) {
        if (localEnabled) {
            return baseUrl + "/api/files/" + key;
        }

        PutObjectRequest putRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .contentType(contentType)
            .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(presignedUrlExpiry))
            .putObjectRequest(putRequest)
            .build();

        return s3Presigner.presignPutObject(presignRequest).url().toString();
    }

    /**
     * Generate a download URL.
     * Returns local serve URL when storage.local.enabled=true, otherwise S3 presigned URL.
     */
    public String generatePresignedDownloadUrl(String key) {
        if (localEnabled) {
            return baseUrl + "/api/files/" + key;
        }

        if (cloudfrontDomain != null && !cloudfrontDomain.isEmpty()) {
            return "https://" + cloudfrontDomain + "/" + key;
        }

        GetObjectRequest getRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(presignedUrlExpiry))
            .getObjectRequest(getRequest)
            .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    /**
     * Delete a file from storage.
     */
    public void deleteFile(String key) {
        if (localEnabled) {
            try {
                Path filePath = Paths.get(localStoragePath, key);
                Files.deleteIfExists(filePath);
                logger.info("Deleted local file: {}", filePath);
            } catch (IOException e) {
                logger.error("Failed to delete local file: {}", key, e);
            }
            return;
        }

        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
            s3Client.deleteObject(deleteRequest);
            logger.info("Deleted file from S3: {}", key);
        } catch (Exception e) {
            logger.error("Failed to delete S3 file: {}", key, e);
        }
    }

    public String buildPreviewKey(Long eventId, Long photoId) {
        return "events/" + eventId + "/previews/" + photoId + "_preview.jpg";
    }

    /** Build event thumbnail storage key path. */
    public String buildThumbnailKey(Long eventId, Long photoId) {
        return "events/" + eventId + "/previews/" + photoId + "_thumb.jpg";
    }

    /** Build edited photo storage key path. */
    public String buildEditedKey(Long eventId, Long photoId) {
        return "events/" + eventId + "/edited/" + photoId + "_edited.jpg";
    }

    /** Build album preview storage key path. */
    public String buildAlbumKey(Long eventId, String filename) {
        return "events/" + eventId + "/album/" + filename;
    }

    public boolean isLocalEnabled() {
        return localEnabled;
    }

    public String getLocalStoragePath() {
        return localStoragePath;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}
