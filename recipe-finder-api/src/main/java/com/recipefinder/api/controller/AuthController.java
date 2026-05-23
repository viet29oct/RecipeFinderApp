package com.recipefinder.api.controller;

import com.recipefinder.application.dto.request.LoginRequest;
import com.recipefinder.application.dto.request.LogoutRequest;
import com.recipefinder.application.dto.request.RefreshTokenRequest;
import com.recipefinder.application.dto.request.RegisterRequest;
import com.recipefinder.application.dto.response.ApiResponse;
import com.recipefinder.application.dto.response.AuthResponse;
import com.recipefinder.application.dto.response.UserResponse;
import com.recipefinder.application.service.AuthService;
import com.recipefinder.infrastructure.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${app.api.base-path}/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.of(authService.register(request), "Đăng ký thành công");
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.of(authService.login(request), "Đăng nhập thành công");
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.of(authService.refresh(request), "Làm mới token thành công");
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
    }

    @PostMapping("/logout-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutAll(@AuthenticationPrincipal UserPrincipal principal) {
        authService.logoutAll(principal);
    }

    /** @deprecated Prefer {@code GET /users/profile} */
    @GetMapping("/me")
    public ApiResponse<UserResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.of(authService.getProfile(principal));
    }
}
