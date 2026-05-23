package com.recipefinder.application.service;

import com.recipefinder.application.dto.request.CreateRecipeRequest;
import com.recipefinder.application.dto.response.RecipeResponse;
import com.recipefinder.application.mapper.RecipeMapper;
import com.recipefinder.domain.exception.ApiException;
import com.recipefinder.infrastructure.persistence.entity.RecipeEntity;
import com.recipefinder.infrastructure.persistence.repository.RecipeJpaRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class RecipeService {

    private final RecipeJpaRepository recipeRepository;

    public RecipeService(RecipeJpaRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    // ── Public (admin recipes only) ───────────────────────────────────────────────

    /** Returns only admin/seed recipes (created_by IS NULL). */
    public List<RecipeResponse> findAll() {
        return RecipeMapper.toResponseList(recipeRepository.findAllByCreatedByIsNull());
    }

    /** Full-text search limited to admin recipes. */
    public List<RecipeResponse> search(String query) {
        String normalized = query == null ? "" : query.trim();
        if (normalized.isEmpty()) return findAll();
        return RecipeMapper.toResponseList(recipeRepository.searchAdminRecipes(normalized));
    }

    /** Returns any recipe by ID (admin or user-created). */
    public RecipeResponse findById(UUID id) {
        RecipeEntity entity = recipeRepository
                .findById(id)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy công thức"));
        return RecipeMapper.toResponse(entity);
    }

    // ── User recipe CRUD ──────────────────────────────────────────────────────────

    /** Returns all recipes created by the authenticated user. */
    public List<RecipeResponse> findUserRecipes(UUID userId) {
        return RecipeMapper.toResponseList(
                recipeRepository.findAllByCreatedByOrderByCreatedAtDesc(userId));
    }

    @Transactional
    public RecipeResponse createRecipe(UUID userId, CreateRecipeRequest req) {
        RecipeEntity entity = new RecipeEntity(
                UUID.randomUUID(),
                req.name().trim(),
                req.imageUrl(),
                req.description(),
                req.category().trim(),
                req.timeLabel().trim(),
                req.ingredients(),
                req.steps(),
                userId);
        return RecipeMapper.toResponse(recipeRepository.save(entity));
    }

    @Transactional
    public RecipeResponse updateRecipe(UUID recipeId, UUID userId, CreateRecipeRequest req) {
        RecipeEntity entity = recipeRepository
                .findByIdAndCreatedBy(recipeId, userId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy công thức hoặc bạn không có quyền chỉnh sửa"));
        entity.update(
                req.name().trim(),
                req.imageUrl(),
                req.description(),
                req.category().trim(),
                req.timeLabel().trim(),
                req.ingredients(),
                req.steps());
        return RecipeMapper.toResponse(entity);
    }

    @Transactional
    public void deleteRecipe(UUID recipeId, UUID userId) {
        RecipeEntity entity = recipeRepository
                .findByIdAndCreatedBy(recipeId, userId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy công thức hoặc bạn không có quyền xóa"));
        recipeRepository.delete(entity);
    }
}
