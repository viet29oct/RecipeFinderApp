package com.recipefinder.api.controller;

import com.recipefinder.application.dto.request.CreateRecipeRequest;
import com.recipefinder.application.dto.response.ApiResponse;
import com.recipefinder.application.dto.response.RecipeResponse;
import com.recipefinder.application.service.RecipeService;
import com.recipefinder.infrastructure.security.UserPrincipal;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${app.api.base-path}/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    // ── Public (admin recipes) ────────────────────────────────────────────────────

    @GetMapping
    public ApiResponse<List<RecipeResponse>> list() {
        return ApiResponse.of(recipeService.findAll());
    }

    @GetMapping("/search")
    public ApiResponse<List<RecipeResponse>> search(
            @RequestParam(name = "q", defaultValue = "") String query) {
        return ApiResponse.of(recipeService.search(query));
    }

    @GetMapping("/{id}")
    public ApiResponse<RecipeResponse> getById(@PathVariable UUID id) {
        return ApiResponse.of(recipeService.findById(id));
    }

    // ── Authenticated (user-created recipes) ──────────────────────────────────────

    /** Returns all recipes created by the current user. */
    @GetMapping("/my")
    public ApiResponse<List<RecipeResponse>> getMyRecipes(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.of(recipeService.findUserRecipes(principal.getId()));
    }

    /** Creates a new recipe owned by the current user. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RecipeResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateRecipeRequest request) {
        return ApiResponse.of(recipeService.createRecipe(principal.getId(), request));
    }

    /** Updates an existing recipe — must be owned by the current user. */
    @PutMapping("/{id}")
    public ApiResponse<RecipeResponse> update(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateRecipeRequest request) {
        return ApiResponse.of(recipeService.updateRecipe(id, principal.getId(), request));
    }

    /** Deletes a recipe — must be owned by the current user. */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        recipeService.deleteRecipe(id, principal.getId());
    }
}
