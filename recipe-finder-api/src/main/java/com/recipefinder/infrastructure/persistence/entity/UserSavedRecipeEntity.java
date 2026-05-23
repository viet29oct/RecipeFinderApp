package com.recipefinder.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "user_saved_recipes")
public class UserSavedRecipeEntity {

    @EmbeddedId
    private UserSavedRecipeId id;

    @Column(name = "saved_at", nullable = false)
    private Instant savedAt = Instant.now();

    protected UserSavedRecipeEntity() {}

    public UserSavedRecipeEntity(UserSavedRecipeId id) {
        this.id = id;
    }

    public UserSavedRecipeId getId() {
        return id;
    }

    public Instant getSavedAt() {
        return savedAt;
    }
}
