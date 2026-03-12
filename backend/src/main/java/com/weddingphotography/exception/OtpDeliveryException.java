package com.weddingphotography.exception;

/**
 * Thrown when an OTP cannot be delivered to the user (e.g. Twilio/SMTP failure).
 * Maps to HTTP 503 Service Unavailable so clients can show an actionable message.
 */
public class OtpDeliveryException extends RuntimeException {

    public OtpDeliveryException(String message) {
        super(message);
    }

    public OtpDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
