package com.recipefinder.api.controller;

import com.recipefinder.application.dto.response.ApiResponse;
import com.recipefinder.application.dto.response.UserResponse;
import com.recipefinder.application.service.AuthService;
import com.recipefinder.application.service.UserService;
import com.recipefinder.infrastructure.security.UserPrincipal;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${app.api.base-path}/users")
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    public UserController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ApiResponse<UserResponse> profile(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.of(authService.getProfile(principal));
    }

    // ── Saved recipes ─────────────────────────────────────────────────────────

    /** Returns all recipe IDs saved by the current user. */
    @GetMapping("/saved")
    public ApiResponse<List<String>> getSaved(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.of(userService.getSavedRecipeIds(principal.getId()));
    }

    /** Saves a recipe for the current user (idempotent). */
    @PostMapping("/saved/{recipeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void save(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID recipeId) {
        userService.saveRecipe(principal.getId(), recipeId);
    }

    /** Removes a saved recipe for the current user (idempotent). */
    @DeleteMapping("/saved/{recipeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unsave(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID recipeId) {
        userService.unsaveRecipe(principal.getId(), recipeId);
    }
}
