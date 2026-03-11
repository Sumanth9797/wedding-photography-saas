# WeddingSnap — Wedding Photography SaaS Platform

A complete, production-ready full-stack SaaS platform for wedding photographers to manage the entire workflow of photo selection, editing, and delivery.

## Features

### Photographer
- Create wedding events with full couple details
- Upload compressed preview images to AWS S3 (originals stay local)
- Generate secure, unique gallery links per event
- Send gallery access via SMS, WhatsApp, or Email
- Assign editors to events
- Enable client photo downloads after final approval
- Analytics dashboard

### Client (Bride & Groom)
- Secure gallery access via unique link + 6-digit PIN
- Modern mobile-friendly photo grid
- Mark favourite album photos
- Rate quality and approve/request changes
- Download approved photos

### Editor
- View assigned events and selected photos
- Upload edited photos and album previews

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Vite |
| Backend | Java 17, Spring Boot 3.2 |
| Database | MySQL 8.0 |
| Mobile | Flutter 3.x, Dart |
| Storage | AWS S3 + CloudFront CDN |
| Auth | JWT + OTP (Twilio SMS / AWS SES) |

## Project Structure

```
wedding-photography-saas/
├── database/schema.sql          # Complete MySQL schema (9 tables)
├── backend/                     # Java Spring Boot API
├── frontend/                    # React + Tailwind CSS web app
├── mobile/                      # Flutter mobile app
└── docs/
    ├── architecture.md          # System architecture
    ├── api-docs.md              # REST API reference
    └── s3-structure.md          # AWS S3 layout
```

## Quick Start (Local Dev — No AWS or MySQL Required)

### Prerequisites
- Java 17+, Maven 3.8+
- Node.js 18+

### Backend (Dev Profile — Uses H2 in-memory DB + local file storage)
```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=dev
# Runs at http://localhost:8080
# H2 console at http://localhost:8080/h2-console
# Demo seed data is created automatically
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

### Demo Login (after starting backend with dev profile)
- **Photographer**: `demo@photographer.com` → send OTP → check backend console for OTP code
- **Editor**: `demo@editor.com` → send OTP → check backend console for OTP code
- **Client Gallery**: http://localhost:5173/gallery/demo-gallery-token-001 → PIN: `1234`

---

## Full Setup (Production)

### Prerequisites
- Java 17+, Maven 3.8+
- Node.js 18+
- Flutter 3.10+
- MySQL 8.0+
- AWS Account (S3)

### Database
```bash
mysql -u root -p
CREATE DATABASE wedding_photography;
EXIT;
mysql -u root -p wedding_photography < database/schema.sql
```

### Backend
```bash
cd backend
# Configure backend/src/main/resources/application.properties
mvn spring-boot:run
# Runs at http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

### Flutter App
```bash
cd mobile
flutter pub get
flutter run
```

## Environment Variables

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/wedding_photography
spring.datasource.username=root
spring.datasource.password=yourpassword
app.jwt.secret=your_256bit_secret
aws.s3.bucket.name=wedding-photography-bucket
aws.s3.region=us-east-1
twilio.account.sid=ACxxxxxxxx
twilio.auth.token=your_token
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_BASE_URL=http://localhost:3000
```

## Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api-docs.md)
- [S3 Storage Structure](docs/s3-structure.md)

## Security

- JWT auth with role claims (PHOTOGRAPHER/EDITOR/CLIENT)
- UUID gallery tokens (unguessable)
- Event-scoped gallery JWTs — clients only access their event
- OTP expiry after 10 minutes
- S3 presigned URLs for direct uploads/downloads

## Docker

```bash
docker-compose up --build
```
