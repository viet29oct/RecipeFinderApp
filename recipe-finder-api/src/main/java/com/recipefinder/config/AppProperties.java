package com.recipefinder.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        Api api,
        Cors cors,
        Jwt jwt
) {
    public record Api(String basePath) {}
    public record Cors(String allowedOrigins) {}
    public record Jwt(
            String secret,
            long accessExpirationMs,
            long refreshExpirationMs,
            String issuer
    ) {}
}
