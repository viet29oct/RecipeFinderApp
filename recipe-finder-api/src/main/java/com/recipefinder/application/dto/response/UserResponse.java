package com.recipefinder.application.dto.response;

import java.time.Instant;

public record UserResponse(
        String id,
        String email,
        String name,
        String role,
        Instant createdAt
) {}
