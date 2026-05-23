package com.recipefinder.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "recipes")
public class RecipeEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(name = "time_label", nullable = false)
    private String timeLabel;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> ingredients = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> steps = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    /** NULL = admin/seed recipe; NOT NULL = user-created recipe */
    @Column(name = "created_by")
    private UUID createdBy;

    protected RecipeEntity() {}

    /** Constructor for creating a new recipe (user or admin). */
    public RecipeEntity(
            UUID id,
            String name,
            String imageUrl,
            String description,
            String category,
            String timeLabel,
            List<String> ingredients,
            List<String> steps,
            UUID createdBy) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
        this.category = category;
        this.timeLabel = timeLabel;
        this.ingredients = new ArrayList<>(ingredients);
        this.steps = new ArrayList<>(steps);
        this.createdAt = Instant.now();
        this.createdBy = createdBy;
    }

    /** In-place update — only the owner may call this (enforced at service layer). */
    public void update(
            String name,
            String imageUrl,
            String description,
            String category,
            String timeLabel,
            List<String> ingredients,
            List<String> steps) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
        this.category = category;
        this.timeLabel = timeLabel;
        this.ingredients = new ArrayList<>(ingredients);
        this.steps = new ArrayList<>(steps);
    }

    // ── Getters ──────────────────────────────────────────────────────────────────

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getImageUrl() { return imageUrl; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getTimeLabel() { return timeLabel; }
    public List<String> getIngredients() { return ingredients; }
    public List<String> getSteps() { return steps; }
    public Instant getCreatedAt() { return createdAt; }
    public UUID getCreatedBy() { return createdBy; }
}
