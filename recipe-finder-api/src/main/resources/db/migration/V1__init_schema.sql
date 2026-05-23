CREATE TABLE users (
    id         UUID PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    name       VARCHAR(120) NOT NULL,
    enabled    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE recipes (
    id          UUID PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    image_url   VARCHAR(1024),
    description TEXT,
    category    VARCHAR(100) NOT NULL,
    time_label  VARCHAR(50)  NOT NULL,
    ingredients JSONB        NOT NULL DEFAULT '[]',
    steps       JSONB        NOT NULL DEFAULT '[]',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recipes_category ON recipes (category);
CREATE INDEX idx_recipes_name ON recipes (name);
