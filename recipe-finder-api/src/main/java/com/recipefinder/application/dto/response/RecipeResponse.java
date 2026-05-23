package com.recipefinder.application.dto.response;

import java.util.List;

/** Matches RecipeFinder mobile client contract (field `time` maps from DB time_label). */
public record RecipeResponse(
        String id,
        String name,
        String image,
        String description,
        List<String> ingredients,
        List<String> steps,
        String category,
        String time
) {}
