package com.recipefinder.application.service;

import com.recipefinder.application.dto.request.LoginRequest;
import com.recipefinder.application.dto.request.LogoutRequest;
import com.recipefinder.application.dto.request.RefreshTokenRequest;
import com.recipefinder.application.dto.request.RegisterRequest;
import com.recipefinder.application.dto.response.AuthResponse;
import com.recipefinder.application.dto.response.UserResponse;
import com.recipefinder.application.mapper.UserMapper;
import com.recipefinder.domain.exception.ApiException;
import com.recipefinder.domain.model.Role;
import com.recipefinder.infrastructure.persistence.entity.UserEntity;
import com.recipefinder.infrastructure.persistence.repository.UserJpaRepository;
import com.recipefinder.infrastructure.security.JwtTokenProvider;
import com.recipefinder.infrastructure.security.RefreshTokenService;
import com.recipefinder.infrastructure.security.UserPrincipal;
import java.util.UUID;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserJpaRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserJpaRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            RefreshTokenService refreshTokenService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenService = refreshTokenService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("Email đã được sử dụng");
        }

        UserEntity user = new UserEntity(
                UUID.randomUUID(),
                email,
                passwordEncoder.encode(request.password()),
                request.name().trim(),
                Role.USER);

        userRepository.save(user);
        return issueTokenPair(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password()));

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        UserEntity user = userRepository
                .findById(principal.getId())
                .orElseThrow(() -> ApiException.unauthorized("Không thể xác thực người dùng"));

        refreshTokenService.revokeAllForUser(user.getId());
        return issueTokenPair(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        UserEntity user = refreshTokenService.validateAndConsume(request.refreshToken());
        if (!user.isEnabled()) {
            throw ApiException.unauthorized("Tài khoản đã bị vô hiệu hóa");
        }
        return issueTokenPair(user);
    }

    @Transactional
    public void logout(LogoutRequest request) {
        refreshTokenService.revoke(request.refreshToken());
    }

    @Transactional
    public void logoutAll(UserPrincipal principal) {
        refreshTokenService.revokeAllForUser(principal.getId());
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(UserPrincipal principal) {
        UserEntity user = userRepository
                .findById(principal.getId())
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy người dùng"));
        return UserMapper.toResponse(user);
    }

    private AuthResponse issueTokenPair(UserEntity user) {
        String accessToken =
                jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = refreshTokenService.createRefreshToken(user);
        return AuthResponse.of(
                accessToken,
                refreshToken,
                jwtTokenProvider.accessExpirationSeconds(),
                UserMapper.toResponse(user));
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
