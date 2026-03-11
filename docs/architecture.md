# System Architecture: Wedding Photography SaaS Platform

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   React Web App  │  │  Flutter Mobile  │  │  Client Browser  │  │
│  │  (Photographer / │  │   (All Roles)    │  │  (Gallery Link)  │  │
│  │   Editor Portal) │  │                  │  │                  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│           │                     │                       │            │
└───────────┼─────────────────────┼───────────────────────┼────────────┘
            │  HTTPS/REST          │  HTTPS/REST           │  HTTPS/REST
┌───────────▼─────────────────────▼───────────────────────▼────────────┐
│                       API GATEWAY (AWS API GW / Nginx)                │
└──────────────────────────────────┬────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼────────────────────────────────────┐
│                  BACKEND — Java Spring Boot                            │
│                                                                        │
│   ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌────────────────┐  │
│   │  Auth      │ │  Event     │ │  Gallery     │ │  Editor        │  │
│   │  Controller│ │  Controller│ │  Controller  │ │  Controller    │  │
│   └────────────┘ └────────────┘ └──────────────┘ └────────────────┘  │
│                                                                        │
│   ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌────────────────┐  │
│   │  AuthSvc   │ │  EventSvc  │ │  GallerySvc  │ │  S3Service     │  │
│   │  OtpSvc    │ │  PhotoSvc  │ │  EditorSvc   │ │  AnalyticsSvc  │  │
│   └────────────┘ └────────────┘ └──────────────┘ └────────────────┘  │
└───────────┬─────────────────┬──────────────────────────┬──────────────┘
            │                 │                            │
┌───────────▼──┐   ┌──────────▼──────────┐   ┌───────────▼──────────────┐
│  MySQL DB    │   │  AWS S3             │   │  Notification Services   │
│              │   │  (Preview images,   │   │  - Twilio SMS            │
│  - users     │   │   edited photos,    │   │  - Twilio WhatsApp       │
│  - events    │   │   album files)      │   │  - AWS SES Email         │
│  - photos    │   │                     │   └──────────────────────────┘
│  - selections│   │  CloudFront CDN     │
│  - reviews   │   │  (Fast delivery)    │
│  - etc.      │   └─────────────────────┘
└──────────────┘
```

## Component Interaction Flow

### 1. Photographer Creates Event
```
Photographer → POST /api/events → EventService → MySQL
                                              → Generate UUID gallery token
                                              → Generate 6-digit PIN
                                              → Return event with galleryUrl
```

### 2. Photographer Uploads Preview Photos
```
Photographer → Browser compresses image (Canvas API, max 1920px)
             → POST /api/events/{id}/photos/upload-preview
             → PhotoService → S3Service.uploadPreview()
             → Store preview_s3_key, thumbnail_s3_key in DB
             → Return CloudFront CDN URL
```

### 3. Client Accesses Gallery
```
Client opens gallery URL → GET /api/gallery/{token} → return event info
Client enters PIN → POST /api/auth/gallery-access → verify PIN
                  → AuthService.generateGalleryJWT()
                  → JWT scoped to specific event only
                  → GET /api/gallery/{token}/photos
```

### 4. Client Selects Photos
```
Client taps photos → local state updates (instant UI response)
Client submits → POST /api/gallery/{token}/selections
               → ClientGalleryService.saveSelections()
               → Update photo status to SELECTED
               → Create PhotoSelection records
               → Notification → Photographer dashboard (polling every 5s)
```

### 5. Editor Workflow
```
Photographer assigns editor → POST /api/events/{id}/assign-editor
                            → Create EventAssignment
                            → Notify editor (Email/SMS)
Editor opens assignment → GET /api/editor/assignments/{eventId}/photos
                        → Returns selected photos with preview URLs
Editor uploads edited → POST /api/editor/assignments/{eventId}/upload-edited
                      → S3Service.uploadEdited()
                      → Update photo status to EDITED
                      → Notify client to review
```

### 6. Client Download Flow
```
Photographer enables download → PUT /api/events/{id}/enable-download
                               → Create Download record with expiry
Client requests download → GET /api/gallery/{token}/downloads
                         → Verify Download record exists and not expired
                         → S3Service.generatePresignedUrls(expires: 24h)
                         → Return presigned URLs
```

---

## Security Model

### JWT Authentication
- **Structure**: `{ sub: userId, role: PHOTOGRAPHER|EDITOR|CLIENT, eventId?: string, iat, exp }`
- **Expiry**: 24h for staff, 7 days for client gallery tokens
- **Storage**: Browser localStorage (web), SharedPreferences (mobile)

### Gallery Token Security
- UUID v4 (128-bit entropy, effectively unguessable)
- Separate 6-digit PIN for additional verification
- Gallery JWT scoped to a single `eventId` — server validates this on every request

### Role-Based Access Control
| Endpoint | PHOTOGRAPHER | EDITOR | CLIENT |
|---|---|---|---|
| POST /api/events | ✅ Own | ❌ | ❌ |
| GET /api/gallery/{token}/photos | ❌ | ❌ | ✅ Scoped |
| GET /api/editor/assignments | ❌ | ✅ Own | ❌ |
| GET /api/analytics | ✅ Own | ❌ | ❌ |

### OTP Security
- 6-digit numeric OTP
- 10-minute expiry (stored in DB with `otp_expires_at`)
- One-time use (cleared after successful verification)
- Delivery via Twilio (SMS) or AWS SES (Email)

---

## Storage Optimization Strategy

### Why Originals Stay Local
Wedding RAW/JPEG originals are typically 30–100GB per event. Uploading to S3 would:
- Cost ~$2.30/GB/month in S3 storage
- Require hours of upload time
- Create unnecessary cloud bandwidth costs

### What Goes to S3
| File Type | S3 Key | Size Target | CDN Delivered |
|---|---|---|---|
| Preview JPEG | `events/{id}/previews/{photoId}_preview.jpg` | ≤300KB | ✅ |
| Thumbnail | `events/{id}/previews/{photoId}_thumb.jpg` | ≤30KB | ✅ |
| Edited JPEG | `events/{id}/edited/{photoId}_edited.jpg` | ≤2MB | ✅ |
| Album Preview PDF | `events/{id}/album/album_preview_{v}.pdf` | Variable | ✅ |

### Client-Side Compression
Before upload, `imageUtils.js` uses Canvas API:
```js
// Max width 1920px, JPEG quality 0.85
canvas.toBlob(resolve, 'image/jpeg', 0.85)
```

---

## Notification Delivery Flow

```
Event occurs (e.g., client selects photos)
      ↓
NotificationService.createNotification()
      ↓
  ┌───┴───────────┐
  │               │
  ▼               ▼
In-app DB     External delivery
notification  
              ┌───┴───────────────────┐
              │                       │
              ▼                       ▼
     Twilio SMS/WhatsApp        AWS SES Email
     (phone verified)          (email verified)
```

**Events that trigger notifications:**
- Client selects photos → Photographer notified
- Editor uploads edits → Client notified
- Client submits review → Photographer + Editor notified
- Photographer enables download → Client notified

---

## Scalability Considerations

### Database
- Index on `events.photographer_id`, `photos.event_id`, `photo_selections.event_id`
- Use connection pooling (HikariCP — included with Spring Boot)
- Read replicas for gallery photo retrieval (high read:write ratio)

### File Delivery
- CloudFront CDN with 24h cache for preview/thumbnail images
- S3 presigned URLs for direct browser uploads (bypasses server)
- S3 presigned URLs for downloads (avoids proxying large files)

### Real-Time Updates
- Photographer dashboard polls `/api/events/{id}` every 5 seconds for selection updates
- Future: WebSocket or Server-Sent Events for true real-time

### Horizontal Scaling
- Spring Boot stateless (JWT-based auth)
- Session state in DB/Redis
- Multiple instances behind load balancer
