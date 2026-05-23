-- Add created_by to recipes: NULL = admin/seed recipe, NOT NULL = user-created recipe
ALTER TABLE recipes
    ADD COLUMN created_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_recipes_created_by ON recipes(created_by);
