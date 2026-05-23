# RecipeFinder API — Enterprise Architecture

## 1. Folder structure

```
recipe-finder-api/
├── pom.xml
├── ARCHITECTURE.md
├── .env.example
└── src/main/
    ├── java/com/recipefinder/
    │   ├── RecipeFinderApplication.java
    │   ├── api/                          # Presentation (inbound adapters)
    │   │   ├── controller/
    │   │   └── advice/                   # GlobalExceptionHandler
    │   ├── application/                  # Use cases
    │   │   ├── dto/request|response/
    │   │   ├── mapper/
    │   │   └── service/
    │   ├── domain/                       # Core rules & errors
    │   │   └── exception/
    │   ├── infrastructure/               # Outbound adapters
    │   │   ├── persistence/
    │   │   │   ├── entity/
    │   │   │   └── repository/
    │   │   └── security/
    │   └── config/
    └── resources/
        ├── application.yml
        ├── application-dev.yml
        ├── application-prod.yml
        └── db/migration/                 # Flyway (schema + seed)
```

## 2. `pom.xml` dependencies

| Dependency | Purpose |
|------------|---------|
| `spring-boot-starter-web` | REST, Jackson |
| `spring-boot-starter-data-jpa` | JPA / Hibernate |
| `spring-boot-starter-security` | Security filter chain |
| `spring-boot-starter-validation` | Bean Validation (`@Valid`) |
| `postgresql` + `flyway-*` | PostgreSQL + versioned schema |
| `jjwt-*` | JWT issue/verify (HS256) |
| `springdoc-openapi` | Swagger UI + OpenAPI 3 |

Java **21**, Spring Boot **3.4.x**.

## 3. `application.yml` setup

| File | Role |
|------|------|
| `application.yml` | Shared: app name, JPA `validate`, Flyway, API base path `/api/v1`, JWT, CORS, Springdoc |
| `application-dev.yml` | Local DB credentials, SQL logging |
| `application-prod.yml` | Env-only DB, reduced logging, Swagger off by default |

Key env vars (see `.env.example`):

- `DB_*` — PostgreSQL
- `JWT_SECRET` — min 32 chars for HS256
- `CORS_ALLOWED_ORIGINS` — Expo web / dev clients
- `SPRING_PROFILES_ACTIVE` — `dev` \| `prod`

## 4. Package structure (clean / layered)

```
┌─────────────────────────────────────────────────────────┐
│  api (Presentation)     Controllers, ExceptionHandler   │
├─────────────────────────────────────────────────────────┤
│  application            Services, DTOs, Mappers         │
├─────────────────────────────────────────────────────────┤
│  domain                 ApiException, ErrorCode         │
├─────────────────────────────────────────────────────────┤
│  infrastructure         JPA, Security/JWT, Config       │
└─────────────────────────────────────────────────────────┘
```

**Dependency rule:** dependencies point **inward**. Controllers → application services only. Services → repositories & domain exceptions. No controller → JPA entity.

## 5. Best practices

### API design
- Base path: `/api/v1` (aligned with mobile `EXPO_PUBLIC_API_URL`)
- Success envelope: `ApiResponse<T> { data, message }`
- Error envelope: `ErrorResponse { code, message, timestamp }`
- REST: nouns, plural resources, `GET /recipes/search?q=`

### Security (JWT + refresh)
- **Access token**: JWT (HS256), 15 min default, claim `typ=ACCESS`, roles in `roles`
- **Refresh token**: opaque random token, SHA-256 hash stored in PostgreSQL, rotation on refresh
- Stateless; `SessionCreationPolicy.STATELESS`
- `JwtAuthenticationFilter` validates Bearer access tokens only
- Public: `POST /auth/register|login|refresh|logout`, `GET /recipes/**`
- Protected: `GET /users/profile`, `GET /auth/me`, `POST /auth/logout-all`
- BCrypt passwords; refresh tokens never stored in plain text

### Persistence
- Flyway owns schema (`ddl-auto: validate`)
- JSONB for `ingredients` / `steps` (matches mobile `string[]`)
- `open-in-view: false`

### Code style
- Java records for DTOs
- Constructor injection (no `@Autowired` fields)
- `@Transactional(readOnly = true)` on read services
- Static mappers (no MapStruct unless team standardizes it)
- Domain errors via `ApiException` + centralized `@RestControllerAdvice`

### Validation
- `@Valid` on request bodies
- Jakarta constraints on DTO records (`@Email`, `@Size`, …)

### Operations
- Profile-based config; secrets from environment
- Disable Swagger in production unless `SWAGGER_ENABLED=true`

## 6. Architecture explanation

### Request flow

```
HTTP Request
  → JwtAuthenticationFilter (optional Bearer)
  → SecurityFilterChain
  → Controller (DTO in/out)
  → Application Service (business rules)
  → JpaRepository
  → PostgreSQL
```

### Mobile contract alignment

| Mobile endpoint | Backend |
|-----------------|---------|
| `GET /recipes` | `RecipeController.list()` |
| `GET /recipes/{id}` | `getById(UUID)` — id is UUID string |
| `GET /recipes/search?q=` | `search()` with JSONB ingredient match |
| `POST /auth/login` | Returns `accessToken` + `refreshToken` |
| `POST /auth/register` | Same token pair |
| `POST /auth/refresh` | Rotates refresh token, new pair |
| `POST /auth/logout` | Revokes refresh token (body) |
| `POST /auth/logout-all` | Revokes all refresh tokens (JWT required) |
| `GET /users/profile` | User profile (JWT required) |
| `GET /auth/me` | Alias of profile (deprecated) |

`RecipeResponse.time` maps from DB column `time_label`.

### Run locally

```bash
# PostgreSQL
createdb recipefinder
createuser recipefinder -P

# API
cd recipe-finder-api
mvn spring-boot:run
```

- Swagger: http://localhost:8080/swagger-ui.html
- Health check: `GET http://localhost:8080/api/v1/recipes`

### Next phases (not in base scope)

- Saved recipes per user (`user_saved_recipes`)
- Refresh tokens / token revocation
- Admin CRUD for recipes
- Pagination (`Page<RecipeResponse>`)
- Integration tests (`@SpringBootTest` + Testcontainers)
