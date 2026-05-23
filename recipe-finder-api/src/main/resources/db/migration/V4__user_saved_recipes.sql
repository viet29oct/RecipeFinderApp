CREATE TABLE user_saved_recipes (
    user_id   UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    recipe_id UUID        NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    saved_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, recipe_id)
);

CREATE INDEX idx_user_saved_user_id ON user_saved_recipes(user_id);
