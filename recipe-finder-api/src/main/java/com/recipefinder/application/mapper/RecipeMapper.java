package com.recipefinder.application.mapper;

import com.recipefinder.application.dto.response.RecipeResponse;
import com.recipefinder.infrastructure.persistence.entity.RecipeEntity;
import java.util.List;

public final class RecipeMapper {

    private RecipeMapper() {}

    public static RecipeResponse toResponse(RecipeEntity entity) {
        return new RecipeResponse(
                entity.getId().toString(),
                entity.getName(),
                entity.getImageUrl(),
                entity.getDescription(),
                List.copyOf(entity.getIngredients()),
                List.copyOf(entity.getSteps()),
                entity.getCategory(),
                entity.getTimeLabel());
    }

    public static List<RecipeResponse> toResponseList(List<RecipeEntity> entities) {
        return entities.stream().map(RecipeMapper::toResponse).toList();
    }
}
