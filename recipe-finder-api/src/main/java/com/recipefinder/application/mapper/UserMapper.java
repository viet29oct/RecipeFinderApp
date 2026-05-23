package com.recipefinder.application.mapper;

import com.recipefinder.application.dto.response.UserResponse;
import com.recipefinder.infrastructure.persistence.entity.UserEntity;

public final class UserMapper {

    private UserMapper() {}

    public static UserResponse toResponse(UserEntity entity) {
        return new UserResponse(
                entity.getId().toString(),
                entity.getEmail(),
                entity.getName(),
                entity.getRole().name(),
                entity.getCreatedAt());
    }
}
