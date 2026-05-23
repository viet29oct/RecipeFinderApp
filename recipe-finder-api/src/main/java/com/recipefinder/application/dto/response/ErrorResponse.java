package com.recipefinder.application.dto.response;

import com.recipefinder.domain.exception.ErrorCode;
import java.time.Instant;

public record ErrorResponse(
        String code,
        String message,
        Instant timestamp
) {
    public static ErrorResponse of(ErrorCode code, String message) {
        return new ErrorResponse(code.name(), message, Instant.now());
    }
}
