# OTP Setup & Configuration Guide

This guide explains how to configure OTP (One-Time Password) delivery for the Wedding Photography SaaS platform.

## How OTP Works

1. User enters their email or phone number on the login page and clicks **Send OTP**.
2. The backend generates a 6-digit OTP, saves it (hashed) to the database with a 10-minute expiry, and sends it to the user.
3. The user enters the OTP on the verification page.
4. On success, a JWT token is issued and the user is redirected to their dashboard.

## Delivery Channels

| Contact type | Provider | Required environment variables |
|---|---|---|
| Email (`@` in contact) | SMTP (e.g. Gmail, SendGrid) | `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` |
| Phone number (digits only) | Twilio SMS | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` |
| WhatsApp (gallery links) | Twilio WhatsApp | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER` |

## Development Mode (No API Keys Required)

Run the backend with the `dev` profile to use console-only notifications:

```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=dev
```

In dev mode (`notification.console.enabled=true`), all OTPs are printed to the server console instead of being delivered. This is the default for local development.

## Production Setup

### 1. Email via SMTP

**Gmail (App Password):**

1. Enable 2-Factor Authentication on your Google account.
2. Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) and generate an App Password for "Mail".
3. Set the following environment variables:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_FROM=noreply@yourdomain.com
```

**SendGrid:**

1. Sign up at [https://sendgrid.com](https://sendgrid.com) and create an API key with "Mail Send" permission.
2. Set the following environment variables:

```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.your-sendgrid-api-key
MAIL_FROM=noreply@yourdomain.com
```

### 2. SMS via Twilio

1. Sign up at [https://www.twilio.com](https://www.twilio.com).
2. From the [Twilio Console](https://console.twilio.com), note your **Account SID** and **Auth Token**.
3. Buy or use a trial phone number from **Phone Numbers → Manage → Buy a Number**.
4. Set the following environment variables:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+15551234567
```

> **Important:** Phone numbers must be in [E.164 format](https://www.twilio.com/docs/glossary/what-e164) (e.g. `+15551234567`).  
> Trial accounts can only send to verified phone numbers. Upgrade to a paid account for production use.

### 3. WhatsApp via Twilio (optional, for gallery link notifications)

For the WhatsApp Sandbox (free testing):

1. In the [Twilio Console](https://console.twilio.com), go to **Messaging → Try it Out → Send a WhatsApp Message**.
2. Follow the instructions to join the sandbox from your phone.
3. Use the default sandbox number:

```env
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

For production WhatsApp, apply for a [Twilio WhatsApp-enabled number](https://www.twilio.com/whatsapp) and update `TWILIO_WHATSAPP_NUMBER`.

## Security Best Practices

- **Never commit API keys** to source control. Always use environment variables or a secrets manager.
- Store secrets in your CI/CD system (GitHub Actions Secrets, AWS Secrets Manager, etc.).
- Rotate credentials regularly and revoke any accidentally exposed keys immediately.
- In production, use a strong, unique `JWT_SECRET` (at least 256 bits / 32 random bytes).

## Setting Environment Variables

**Local development (`.env` file):**

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and fill in the values
```

Then start the backend with the `prod` profile:

```bash
cd backend
export $(cat .env | xargs)
mvn spring-boot:run
```

**Docker / Docker Compose:**

```yaml
environment:
  - TWILIO_ACCOUNT_SID=ACxxxxxxxx
  - TWILIO_AUTH_TOKEN=your_token
  - TWILIO_PHONE_NUMBER=+15551234567
  - MAIL_USERNAME=your@email.com
  - MAIL_PASSWORD=your-app-password
```

**Heroku / Railway / Render:**

Set variables in the platform dashboard or via their CLI (e.g. `heroku config:set TWILIO_ACCOUNT_SID=ACxxx`).

## Troubleshooting

### Root Cause: "Server error. Please try again later."

This generic error used to appear when OTP delivery failed, because the backend was returning HTTP 500 (internal server error) instead of a more specific error code. The fix:

- `NotificationService.sendOtpSms` now wraps **all** exceptions (including unexpected ones) into `OtpDeliveryException`.
- `GlobalExceptionHandler` maps `OtpDeliveryException` → **HTTP 503** with an actionable user message.
- The frontend handles HTTP 503 specifically and shows the descriptive message from the server.

**Most common root causes and fixes:**

| Symptom | Likely cause | Fix |
|---|---|---|
| OTP displayed in console instead of delivered | `notification.console.enabled=true` | Run without `dev` profile and set SMTP/Twilio vars |
| "SMS delivery is not configured on this server" (503) | `TWILIO_PHONE_NUMBER` missing | Buy a Twilio phone number and set the env var (see **SMS via Twilio** section above) |
| "Mail sender not configured" in logs | SMTP env vars not set | Set `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` |
| "Twilio not configured" in logs | `TWILIO_ACCOUNT_SID` or `TWILIO_AUTH_TOKEN` missing | Set all three Twilio env vars |
| Twilio error 21211 (503) | Invalid phone number format | Use E.164 format: `+15551234567` |
| Twilio error 21608 (503) | Trial account: unverified number | Verify the recipient number in Twilio Console, or upgrade account |
| Twilio error 20003 (503) | Invalid Twilio credentials | Rotate and re-enter `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` |
| Email not received | Spam filter or wrong credentials | Check spam folder, verify App Password is correct |
| Still seeing generic "Server error" (500) | Unexpected exception in delivery path | Check backend logs (`ERROR` level) for the full stack trace |

### Security Note

If you accidentally shared your Twilio `TWILIO_AUTH_TOKEN` publicly, **rotate it immediately** in the [Twilio Console](https://console.twilio.com) under Account → API Keys & Tokens → Auth Token → Rotate.
