package com.recipefinder.infrastructure.security;

import com.recipefinder.config.AppProperties;
import com.recipefinder.domain.exception.ApiException;
import com.recipefinder.infrastructure.persistence.entity.RefreshTokenEntity;
import com.recipefinder.infrastructure.persistence.entity.UserEntity;
import com.recipefinder.infrastructure.persistence.repository.RefreshTokenJpaRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final RefreshTokenJpaRepository refreshTokenRepository;
    private final long refreshExpirationMs;

    public RefreshTokenService(RefreshTokenJpaRepository refreshTokenRepository, AppProperties properties) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshExpirationMs = properties.jwt().refreshExpirationMs();
    }

    @Transactional
    public String createRefreshToken(UserEntity user) {
        String rawToken = generateRawToken();
        RefreshTokenEntity entity = new RefreshTokenEntity(
                UUID.randomUUID(),
                user,
                hashToken(rawToken),
                Instant.now().plusMillis(refreshExpirationMs));
        refreshTokenRepository.save(entity);
        return rawToken;
    }

    @Transactional
    public UserEntity validateAndConsume(String rawToken) {
        RefreshTokenEntity entity = refreshTokenRepository
                .findByTokenHashAndRevokedFalse(hashToken(rawToken))
                .orElseThrow(() -> ApiException.unauthorized("Refresh token không hợp lệ"));

        if (entity.isExpired()) {
            entity.revoke();
            refreshTokenRepository.save(entity);
            throw ApiException.unauthorized("Refresh token đã hết hạn");
        }

        entity.revoke();
        refreshTokenRepository.save(entity);
        return entity.getUser();
    }

    @Transactional
    public void revoke(String rawToken) {
        refreshTokenRepository
                .findByTokenHashAndRevokedFalse(hashToken(rawToken))
                .ifPresent(token -> {
                    token.revoke();
                    refreshTokenRepository.save(token);
                });
    }

    @Transactional
    public void revokeAllForUser(UUID userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }

    public static String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 not available", ex);
        }
    }

    private static String generateRawToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
