-- Wedding Photography SaaS Platform - MySQL Database Schema
-- Version: 1.0.0

CREATE DATABASE IF NOT EXISTS wedding_photography;
USE wedding_photography;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    role ENUM('PHOTOGRAPHER', 'EDITOR', 'CLIENT') NOT NULL,
    password_hash VARCHAR(255),
    otp_code VARCHAR(10),
    otp_expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role)
);

-- Events table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    photographer_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    wedding_date DATE NOT NULL,
    bride_name VARCHAR(255) NOT NULL,
    bride_phone VARCHAR(20),
    bride_email VARCHAR(255),
    groom_name VARCHAR(255) NOT NULL,
    groom_phone VARCHAR(20),
    groom_email VARCHAR(255),
    gallery_token VARCHAR(36) UNIQUE NOT NULL,
    pin_code VARCHAR(10),
    status ENUM('DRAFT', 'ACTIVE', 'EDITING', 'REVIEW', 'COMPLETED') DEFAULT 'DRAFT',
    cover_s3_key VARCHAR(500),
    description TEXT,
    venue VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (photographer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_photographer_id (photographer_id),
    INDEX idx_gallery_token (gallery_token),
    INDEX idx_status (status)
);

-- Photos table
CREATE TABLE photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    preview_s3_key VARCHAR(500),
    original_local_path VARCHAR(1000),
    thumbnail_s3_key VARCHAR(500),
    uploaded_by BIGINT NOT NULL,
    status ENUM('PREVIEW', 'SELECTED', 'EDITING', 'EDITED', 'APPROVED') DEFAULT 'PREVIEW',
    file_size BIGINT,
    width INT,
    height INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_event_id (event_id),
    INDEX idx_status (status),
    INDEX idx_uploaded_by (uploaded_by)
);

-- Photo Selections table
CREATE TABLE photo_selections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    photo_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    selected_by_client BIGINT,
    is_album_photo BOOLEAN DEFAULT FALSE,
    client_comment TEXT,
    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_by_client) REFERENCES users(id),
    UNIQUE KEY unique_photo_event (photo_id, event_id),
    INDEX idx_event_id (event_id),
    INDEX idx_is_album (is_album_photo)
);

-- Edited Photos table
CREATE TABLE edited_photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    photo_id BIGINT NOT NULL,
    editor_id BIGINT NOT NULL,
    edited_s3_key VARCHAR(500),
    album_preview_s3_key VARCHAR(500),
    editor_notes TEXT,
    version INT DEFAULT 1,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    FOREIGN KEY (editor_id) REFERENCES users(id),
    INDEX idx_photo_id (photo_id),
    INDEX idx_editor_id (editor_id)
);

-- Client Reviews table
CREATE TABLE client_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    photo_id BIGINT,
    client_id BIGINT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status ENUM('PENDING', 'APPROVED', 'CHANGES_REQUESTED') DEFAULT 'PENDING',
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES users(id),
    INDEX idx_event_id (event_id),
    INDEX idx_client_id (client_id),
    INDEX idx_status (status)
);

-- Event Assignments table (linking editors to events)
CREATE TABLE event_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    editor_id BIGINT NOT NULL,
    assigned_by BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED') DEFAULT 'PENDING',
    notes TEXT,
    due_date DATE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (editor_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    UNIQUE KEY unique_event_editor (event_id, editor_id),
    INDEX idx_event_id (event_id),
    INDEX idx_editor_id (editor_id)
);

-- Notifications table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT,
    type ENUM('GALLERY_READY', 'SELECTION_SUBMITTED', 'EDITING_STARTED', 'EDITING_COMPLETE', 'REVIEW_REQUESTED', 'APPROVED', 'CHANGES_REQUESTED', 'DOWNLOAD_ENABLED', 'ASSIGNMENT', 'GENERAL') NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Downloads table
CREATE TABLE downloads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    enabled_by BIGINT NOT NULL,
    enabled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    download_type ENUM('PHOTOS', 'ALBUM', 'ALL') DEFAULT 'ALL',
    is_active BOOLEAN DEFAULT TRUE,
    download_count INT DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (enabled_by) REFERENCES users(id),
    UNIQUE KEY unique_event_client (event_id, client_id),
    INDEX idx_event_id (event_id),
    INDEX idx_client_id (client_id),
    INDEX idx_expires_at (expires_at)
);

-- Sample data for development
INSERT INTO users (name, email, phone, role, password_hash) VALUES
('Demo Photographer', 'photographer@demo.com', '+1234567890', 'PHOTOGRAPHER', '$2a$12$demo_hash_photographer'),
('Demo Editor', 'editor@demo.com', '+1234567891', 'EDITOR', '$2a$12$demo_hash_editor'),
('Demo Client', 'client@demo.com', '+1234567892', 'CLIENT', '$2a$12$demo_hash_client');
