package com.recipefinder.infrastructure.persistence.repository;

import com.recipefinder.infrastructure.persistence.entity.RecipeEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecipeJpaRepository extends JpaRepository<RecipeEntity, UUID> {

    // ── Admin recipes (created_by IS NULL) ───────────────────────────────────────

    List<RecipeEntity> findAllByCreatedByIsNull();

    @Query(
            value = """
                    SELECT * FROM recipes r
                    WHERE r.created_by IS NULL
                      AND (
                            LOWER(r.name) LIKE LOWER(CONCAT('%', :q, '%'))
                         OR LOWER(COALESCE(r.description, '')) LIKE LOWER(CONCAT('%', :q, '%'))
                         OR LOWER(r.category) LIKE LOWER(CONCAT('%', :q, '%'))
                         OR r.ingredients::text ILIKE CONCAT('%', :q, '%')
                          )
                    ORDER BY r.name
                    """,
            nativeQuery = true)
    List<RecipeEntity> searchAdminRecipes(@Param("q") String query);

    // ── User-created recipes ──────────────────────────────────────────────────────

    List<RecipeEntity> findAllByCreatedByOrderByCreatedAtDesc(UUID createdBy);

    /** Ownership-safe lookup: returns the recipe only if it belongs to createdBy. */
    Optional<RecipeEntity> findByIdAndCreatedBy(UUID id, UUID createdBy);
}
