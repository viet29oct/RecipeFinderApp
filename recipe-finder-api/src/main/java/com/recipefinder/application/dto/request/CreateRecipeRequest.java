package com.recipefinder.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateRecipeRequest(
        @NotBlank @Size(max = 255) String name,

        @Size(max = 2000) String description,

        @Size(max = 1024) String imageUrl,

        @NotBlank @Size(max = 100) String category,

        @NotBlank @Size(max = 50) String timeLabel,

        @NotNull @NotEmpty List<@NotBlank String> ingredients,

        @NotNull @NotEmpty List<@NotBlank String> steps
) {}
