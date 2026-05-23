package com.recipefinder.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class UserSavedRecipeId implements Serializable {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "recipe_id", nullable = false)
    private UUID recipeId;

    protected UserSavedRecipeId() {}

    public UserSavedRecipeId(UUID userId, UUID recipeId) {
        this.userId = userId;
        this.recipeId = recipeId;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getRecipeId() {
        return recipeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserSavedRecipeId that)) return false;
        return Objects.equals(userId, that.userId) && Objects.equals(recipeId, that.recipeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, recipeId);
    }
}
