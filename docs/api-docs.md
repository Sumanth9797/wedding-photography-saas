# API Documentation — Wedding Photography SaaS

## Base URL
```
https://api.yourdomain.com/api
```

## Authentication
Most endpoints require a JWT Bearer token:
```
Authorization: Bearer <jwt_token>
```

Gallery endpoints use a gallery-scoped JWT obtained via `POST /auth/gallery-access`.

---

## Auth APIs

### POST /auth/send-otp
Send OTP to user's phone or email.

**Request Body:**
```json
{
  "contact": "user@example.com",
  "role": "PHOTOGRAPHER"
}
```
- `contact`: Email address or phone number (E.164 format for phone)
- `role`: `PHOTOGRAPHER` | `EDITOR` | `CLIENT`

**Response `200 OK`:**
```json
{ "message": "OTP sent successfully" }
```

**Error Responses:**
- `400`: Invalid contact or role
- `404`: User not found

---

### POST /auth/verify-otp
Verify OTP and receive JWT token.

**Request Body:**
```json
{
  "contact": "user@example.com",
  "otp": "123456"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 42,
  "role": "PHOTOGRAPHER",
  "name": "John Smith"
}
```

**Error Responses:**
- `400`: Invalid or expired OTP
- `401`: OTP verification failed

---

### POST /auth/gallery-access
Client accesses gallery using token + PIN. Returns a gallery-scoped JWT.

**URL:** `/auth/gallery-access/{token}`

**Request Body:**
```json
{ "pin": "123456" }
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "eventId": 15,
  "eventTitle": "Sarah & John's Wedding"
}
```

**Error Responses:**
- `401`: Invalid PIN
- `404`: Gallery not found

---

## Event APIs (Photographer)

All require `Authorization: Bearer <token>` with `PHOTOGRAPHER` role.

### POST /events
Create a new wedding event.

**Request Body:**
```json
{
  "title": "Sarah & John's Wedding",
  "weddingDate": "2025-06-15",
  "venue": "Grand Ballroom, NYC",
  "description": "Optional notes",
  "brideName": "Sarah Johnson",
  "bridePhone": "+12125551234",
  "brideEmail": "sarah@example.com",
  "groomName": "John Smith",
  "groomPhone": "+12125555678",
  "groomEmail": "john@example.com"
}
```

**Response `201 Created`:**
```json
{
  "id": 42,
  "title": "Sarah & John's Wedding",
  "weddingDate": "2025-06-15",
  "galleryToken": "a3f8c2d1-e4b5-4f6a-8c9d-0e1f2a3b4c5d",
  "galleryUrl": "https://app.yourdomain.com/gallery/a3f8c2d1-...",
  "pinCode": "847291",
  "status": "DRAFT",
  "createdAt": "2025-03-10T14:30:00Z"
}
```

---

### GET /events
List all events for the authenticated photographer.

**Response `200 OK`:**
```json
[
  {
    "id": 42,
    "title": "Sarah & John's Wedding",
    "weddingDate": "2025-06-15",
    "brideName": "Sarah Johnson",
    "groomName": "John Smith",
    "status": "ACTIVE",
    "photoCount": 450,
    "selectionCount": 127
  }
]
```

---

### GET /events/{id}
Get full event details.

**Response `200 OK`:** Full event object including all fields.

---

### PUT /events/{id}
Update event details.

**Request Body:** Any subset of event fields (same as POST /events).

**Response `200 OK`:** Updated event object.

---

### DELETE /events/{id}
Delete an event and all associated data.

**Response `204 No Content`**

---

### POST /events/{id}/send-gallery-link
Send gallery access link to the couple.

**Request Body:**
```json
{ "method": "EMAIL" }
```
- `method`: `EMAIL` | `SMS` | `WHATSAPP`

**Response `200 OK`:**
```json
{ "message": "Gallery link sent via EMAIL" }
```

---

### POST /events/{id}/assign-editor
Assign an editor to this event.

**Request Body:**
```json
{
  "editorId": 17,
  "notes": "Focus on color correction and skin tones"
}
```

**Response `201 Created`:**
```json
{
  "id": 3,
  "eventId": 42,
  "editorId": 17,
  "editorName": "Jane Doe",
  "notes": "Focus on color correction...",
  "status": "PENDING",
  "assignedAt": "2025-03-10T15:00:00Z"
}
```

---

### PUT /events/{id}/enable-download
Enable client download for this event.

**Request Body:**
```json
{
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

**Response `200 OK`:**
```json
{ "message": "Download enabled for event 42" }
```

---

## Photo APIs

### POST /events/{eventId}/photos/upload-preview
Upload a compressed preview image to S3.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file`: Image file (JPEG/PNG/WebP, max 5MB)

**Response `201 Created`:**
```json
{
  "id": 501,
  "fileName": "photo_001.jpg",
  "previewUrl": "https://cdn.yourdomain.com/events/42/previews/501_preview.jpg",
  "thumbnailUrl": "https://cdn.yourdomain.com/events/42/previews/501_thumb.jpg",
  "status": "PREVIEW"
}
```

---

### GET /events/{eventId}/photos
List all photos for an event.

**Response `200 OK`:**
```json
[
  {
    "id": 501,
    "fileName": "photo_001.jpg",
    "previewUrl": "https://cdn.yourdomain.com/...",
    "thumbnailUrl": "https://cdn.yourdomain.com/...",
    "status": "SELECTED",
    "isSelected": true,
    "isAlbumPhoto": false,
    "clientComment": "Love this one!"
  }
]
```

---

### DELETE /events/{eventId}/photos/{photoId}
Delete a photo.

**Response `204 No Content`**

---

### PUT /events/{eventId}/photos/{photoId}/status
Update photo status.

**Request Body:**
```json
{ "status": "EDITING" }
```
- `status`: `PREVIEW` | `SELECTED` | `EDITING` | `EDITED` | `APPROVED`

**Response `200 OK`:** Updated photo object.

---

## Client Gallery APIs

All require gallery-scoped JWT from `POST /auth/gallery-access`.

### GET /gallery/{token}
Get gallery info (public, no auth required).

**Response `200 OK`:**
```json
{
  "eventId": 42,
  "title": "Sarah & John's Wedding",
  "brideName": "Sarah Johnson",
  "groomName": "John Smith",
  "weddingDate": "2025-06-15",
  "status": "ACTIVE"
}
```

---

### POST /gallery/{token}/verify
Verify PIN and get gallery JWT. (Same as `/auth/gallery-access`)

---

### GET /gallery/{token}/photos
Get photos in the gallery (requires gallery JWT).

**Response `200 OK`:** Array of photo objects with CDN URLs.

---

### POST /gallery/{token}/selections
Submit photo selections and comments.

**Request Body:**
```json
{
  "selections": [
    {
      "photoId": 501,
      "isAlbumPhoto": true,
      "comment": "This is my favourite!"
    },
    {
      "photoId": 502,
      "isAlbumPhoto": false,
      "comment": ""
    }
  ]
}
```

**Response `200 OK`:**
```json
{ "message": "2 selections saved", "totalSelected": 47 }
```

---

### PUT /gallery/{token}/review
Submit client review/rating for edited photos.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Absolutely love the editing!",
  "status": "APPROVED"
}
```
- `status`: `APPROVED` | `CHANGES_REQUESTED`

**Response `200 OK`:**
```json
{ "message": "Review submitted" }
```

---

### GET /gallery/{token}/downloads
Get download links (only if photographer enabled downloads).

**Response `200 OK`:**
```json
{
  "downloadUrls": [
    "https://s3.amazonaws.com/bucket/events/42/edited/501_edited.jpg?X-Amz-Signature=...",
    "..."
  ],
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

**Error Responses:**
- `403`: Downloads not yet enabled

---

## Editor APIs

All require `Authorization: Bearer <token>` with `EDITOR` role.

### GET /editor/assignments
Get all events assigned to the authenticated editor.

**Response `200 OK`:**
```json
[
  {
    "id": 3,
    "eventId": 42,
    "eventTitle": "Sarah & John's Wedding",
    "weddingDate": "2025-06-15",
    "status": "PENDING",
    "notes": "Focus on color correction"
  }
]
```

---

### GET /editor/assignments/{eventId}/photos
Get selected photos for an assigned event.

**Response `200 OK`:** Array of photo objects with preview URLs (same as photo list).

---

### POST /editor/assignments/{eventId}/upload-edited
Upload an edited photo.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file`: Edited image file
- `photoId`: Original photo ID
- `editorNotes`: Optional notes

**Response `201 Created`:**
```json
{
  "id": 88,
  "photoId": 501,
  "editedUrl": "https://cdn.yourdomain.com/events/42/edited/501_edited.jpg",
  "editorNotes": "Color corrected + skin smoothing",
  "uploadedAt": "2025-03-10T16:00:00Z"
}
```

---

### POST /editor/assignments/{eventId}/upload-album
Upload album preview file (PDF or image).

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file`: Album file
- `editorNotes`: Optional notes

**Response `201 Created`:** Album file object.

---

## Analytics APIs

Requires `PHOTOGRAPHER` role.

### GET /analytics/overview

**Response `200 OK`:**
```json
{
  "totalEvents": 24,
  "totalPhotos": 10800,
  "totalSelections": 3240,
  "averageRating": 4.7,
  "eventsByStatus": {
    "DRAFT": 2,
    "ACTIVE": 8,
    "EDITING": 5,
    "REVIEW": 4,
    "COMPLETED": 5
  }
}
```

---

### GET /analytics/events/{eventId}

**Response `200 OK`:**
```json
{
  "eventId": 42,
  "title": "Sarah & John's Wedding",
  "totalPhotos": 450,
  "totalSelected": 127,
  "albumPhotos": 48,
  "editedPhotos": 127,
  "approvedPhotos": 120,
  "averageRating": 4.8,
  "status": "COMPLETED"
}
```

---

## Notification APIs

### GET /notifications
Get notifications for the authenticated user.

**Response `200 OK`:**
```json
[
  {
    "id": 12,
    "type": "SELECTION_MADE",
    "message": "Sarah selected 47 photos from her gallery",
    "isRead": false,
    "createdAt": "2025-03-10T12:00:00Z"
  }
]
```

---

### PUT /notifications/{id}/read
Mark a notification as read.

**Response `200 OK`:**
```json
{ "message": "Notification marked as read" }
```

---

## Error Response Format

All errors follow this format:
```json
{
  "timestamp": "2025-03-10T14:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Event not found with id: 999",
  "path": "/api/events/999"
}
```

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content (delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |
