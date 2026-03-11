# AWS S3 Storage Structure

## Bucket Name
```
wedding-photography-bucket
```

## Folder Structure
```
wedding-photography-bucket/
├── events/
│   └── {eventId}/
│       ├── previews/
│       │   ├── {photoId}_preview.jpg       # ~200-300KB compressed preview
│       │   └── {photoId}_thumb.jpg         # ~20-30KB thumbnail
│       ├── edited/
│       │   └── {photoId}_edited.jpg        # Edited photo uploaded by editor
│       ├── album/
│       │   ├── album_preview_v1.pdf        # Album PDF preview
│       │   └── album_preview_v2.pdf        # Revised album
│       └── covers/
│           └── cover.jpg                   # Event cover image
└── temp/
    └── uploads/
        └── {uuid}_{filename}              # Temporary uploads (cleaned up daily)
```

---

## S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudFrontReadAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::wedding-photography-bucket/events/*/previews/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::{account-id}:distribution/{distribution-id}"
        }
      }
    },
    {
      "Sid": "DenyPublicAccess",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::wedding-photography-bucket/*",
      "Condition": {
        "StringNotEquals": {
          "AWS:PrincipalServiceName": "cloudfront.amazonaws.com"
        },
        "BoolIfExists": {
          "aws:ViaAWSService": "false"
        }
      }
    }
  ]
}
```

---

## CORS Configuration

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": [
      "https://app.yourdomain.com",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## CloudFront Distribution Setup

### Distribution Settings
```yaml
Origins:
  - Id: s3-wedding-photography
    DomainName: wedding-photography-bucket.s3.amazonaws.com
    S3OriginConfig:
      OriginAccessIdentity: origin-access-identity/cloudfront/{OAI-ID}

DefaultCacheBehavior:
  ViewerProtocolPolicy: redirect-to-https
  CachePolicyId: CachingOptimized
  AllowedMethods: [GET, HEAD]
  Compress: true

CacheBehaviors:
  - PathPattern: /events/*/previews/*
    TTL:
      DefaultTTL: 86400    # 24 hours
      MaxTTL: 604800        # 7 days
      MinTTL: 0
    ViewerProtocolPolicy: redirect-to-https
    Compress: true

  - PathPattern: /events/*/edited/*
    TTL:
      DefaultTTL: 3600      # 1 hour
      MaxTTL: 86400         # 24 hours
      MinTTL: 0
    ViewerProtocolPolicy: redirect-to-https

PriceClass: PriceClass_100  # US, Canada, Europe
```

### Custom Domain (Optional)
```
cdn.yourdomain.com → CloudFront distribution
```

---

## IAM Policy for Backend Service

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::wedding-photography-bucket/events/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::wedding-photography-bucket/temp/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::wedding-photography-bucket",
      "Condition": {
        "StringLike": {
          "s3:prefix": ["events/*", "temp/*"]
        }
      }
    }
  ]
}
```

---

## S3 Lifecycle Rules

```json
{
  "Rules": [
    {
      "Id": "DeleteTempUploads",
      "Status": "Enabled",
      "Filter": { "Prefix": "temp/uploads/" },
      "Expiration": { "Days": 1 }
    },
    {
      "Id": "TransitionOldPreviewsToIA",
      "Status": "Enabled",
      "Filter": { "Prefix": "events/" },
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

---

## Presigned URL Strategy

### Upload (Client-Side Direct Upload)
```java
// Generate presigned PUT URL for direct browser-to-S3 upload
// Avoids proxying large files through the backend server
GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucket, key)
    .withMethod(HttpMethod.PUT)
    .withExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)); // 15 minutes
URL presignedUrl = s3Client.generatePresignedUrl(request);
```

### Download (Client Downloads)
```java
// Generate presigned GET URL for client photo downloads
// Only generated when photographer enables downloads
GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucket, key)
    .withMethod(HttpMethod.GET)
    .withExpiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000)); // 24 hours
URL presignedUrl = s3Client.generatePresignedUrl(request);
```

---

## Storage Costs Estimate

| Item | Size | Monthly Cost |
|---|---|---|
| 1000 events × 500 preview images × 250KB | ~125GB | ~$2.88 |
| Edited photos (assume 50% events complete) | ~30GB | ~$0.69 |
| CloudFront requests (1M/month) | — | ~$0.10 |
| **Total estimate** | — | **~$4/month** |

This is dramatically lower than storing full-resolution originals (~2500GB = ~$57.50/month).
