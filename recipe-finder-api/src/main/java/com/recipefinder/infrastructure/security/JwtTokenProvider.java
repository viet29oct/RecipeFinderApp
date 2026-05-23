package com.recipefinder.infrastructure.security;

import com.recipefinder.config.AppProperties;
import com.recipefinder.domain.exception.ApiException;
import com.recipefinder.domain.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    public static final String CLAIM_TYPE = "typ";
    public static final String CLAIM_EMAIL = "email";
    public static final String CLAIM_ROLES = "roles";

    private final AppProperties.Jwt jwt;
    private final SecretKey secretKey;

    public JwtTokenProvider(AppProperties properties) {
        this.jwt = properties.jwt();
        byte[] keyBytes = jwt.secret().getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters");
        }
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(UUID userId, String email, Role role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .issuer(jwt.issuer())
                .subject(userId.toString())
                .claim(CLAIM_TYPE, TokenType.ACCESS.name())
                .claim(CLAIM_EMAIL, email)
                .claim(CLAIM_ROLES, List.of(role.name()))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(jwt.accessExpirationMs())))
                .signWith(secretKey)
                .compact();
    }

    public Claims parseAndValidateAccessToken(String token) {
        Claims claims = parseClaims(token);
        String type = claims.get(CLAIM_TYPE, String.class);
        if (!TokenType.ACCESS.name().equals(type)) {
            throw ApiException.unauthorized("Token không hợp lệ");
        }
        return claims;
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(parseAndValidateAccessToken(token).getSubject());
    }

    public long accessExpirationSeconds() {
        return jwt.accessExpirationMs() / 1000;
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .requireIssuer(jwt.issuer())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException ex) {
            throw ApiException.unauthorized("Token hết hạn hoặc không hợp lệ");
        }
    }
}
