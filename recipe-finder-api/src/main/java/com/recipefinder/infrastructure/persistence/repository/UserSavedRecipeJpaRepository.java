package com.recipefinder.infrastructure.persistence.repository;

import com.recipefinder.infrastructure.persistence.entity.UserSavedRecipeEntity;
import com.recipefinder.infrastructure.persistence.entity.UserSavedRecipeId;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserSavedRecipeJpaRepository
        extends JpaRepository<UserSavedRecipeEntity, UserSavedRecipeId> {

    /** Returns the list of recipe UUIDs saved by a given user, newest first. */
    @Query("SELECT r.id.recipeId FROM UserSavedRecipeEntity r WHERE r.id.userId = :userId ORDER BY r.savedAt DESC")
    List<UUID> findSavedRecipeIdsByUserId(@Param("userId") UUID userId);
}
