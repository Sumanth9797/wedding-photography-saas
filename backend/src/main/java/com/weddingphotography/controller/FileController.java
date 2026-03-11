package com.weddingphotography.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.io.File;
import java.net.URLConnection;

/**
 * Serves locally stored files when storage.local.enabled=true.
 * Only active in dev profile.
 */
@RestController
@RequestMapping("/api/files")
@ConditionalOnProperty(name = "storage.local.enabled", havingValue = "true")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Value("${storage.local.path:./uploads}")
    private String localStoragePath;

    @GetMapping("/**")
    public ResponseEntity<Resource> serveFile(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        String fileKey = requestURI.substring("/api/files/".length());

        File file = new File(localStoragePath, fileKey);
        if (!file.exists() || !file.isFile()) {
            logger.warn("File not found: {}", file.getAbsolutePath());
            return ResponseEntity.notFound().build();
        }

        // Security: ensure the resolved path is within the uploads directory
        try {
            String canonicalBase = new File(localStoragePath).getCanonicalPath();
            String canonicalFile = file.getCanonicalPath();
            if (!canonicalFile.startsWith(canonicalBase)) {
                logger.warn("Path traversal attempt: {}", fileKey);
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error("Error resolving file path", e);
            return ResponseEntity.internalServerError().build();
        }

        Resource resource = new FileSystemResource(file);
        String contentType = URLConnection.guessContentTypeFromName(file.getName());
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, contentType)
            .body(resource);
    }
}
