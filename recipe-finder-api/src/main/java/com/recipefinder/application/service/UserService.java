package com.recipefinder.application.service;

import com.recipefinder.domain.exception.ApiException;
import com.recipefinder.infrastructure.persistence.entity.UserSavedRecipeEntity;
import com.recipefinder.infrastructure.persistence.entity.UserSavedRecipeId;
import com.recipefinder.infrastructure.persistence.repository.RecipeJpaRepository;
import com.recipefinder.infrastructure.persistence.repository.UserSavedRecipeJpaRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserSavedRecipeJpaRepository savedRecipeRepository;
    private final RecipeJpaRepository recipeRepository;

    public UserService(
            UserSavedRecipeJpaRepository savedRecipeRepository,
            RecipeJpaRepository recipeRepository) {
        this.savedRecipeRepository = savedRecipeRepository;
        this.recipeRepository = recipeRepository;
    }

    /** Returns all recipe IDs saved by the user (as String for JSON serialization). */
    @Transactional(readOnly = true)
    public List<String> getSavedRecipeIds(UUID userId) {
        return savedRecipeRepository.findSavedRecipeIdsByUserId(userId).stream()
                .map(UUID::toString)
                .toList();
    }

    /** Saves a recipe for the user — idempotent (no-op if already saved). */
    @Transactional
    public void saveRecipe(UUID userId, UUID recipeId) {
        if (!recipeRepository.existsById(recipeId)) {
            throw ApiException.notFound("Công thức không tồn tại");
        }
        UserSavedRecipeId pk = new UserSavedRecipeId(userId, recipeId);
        if (!savedRecipeRepository.existsById(pk)) {
            savedRecipeRepository.save(new UserSavedRecipeEntity(pk));
        }
    }

    /** Removes a saved recipe — idempotent (no-op if not saved). */
    @Transactional
    public void unsaveRecipe(UUID userId, UUID recipeId) {
        savedRecipeRepository.deleteById(new UserSavedRecipeId(userId, recipeId));
    }
}
