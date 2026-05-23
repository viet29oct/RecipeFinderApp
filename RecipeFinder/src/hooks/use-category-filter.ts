import { useMemo, useState } from 'react';
import type { Recipe } from '@/types/recipe';

export const ALL_CATEGORIES = 'Tất cả';

/**
 * Derives a unique category list from `recipes` and filters them
 * based on the currently selected category chip.
 */
export function useCategoryFilter(recipes: Recipe[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);

  /** ['Tất cả', ...sorted unique categories from data] */
  const categories = useMemo(() => {
    const unique = Array.from(new Set(recipes.map((r) => r.category))).sort(
      (a, b) => a.localeCompare(b, 'vi')
    );
    return [ALL_CATEGORIES, ...unique];
  }, [recipes]);

  /** Recipes matching the active category (all if 'Tất cả') */
  const filteredRecipes = useMemo(() => {
    if (selectedCategory === ALL_CATEGORIES) return recipes;
    return recipes.filter((r) => r.category === selectedCategory);
  }, [recipes, selectedCategory]);

  /** Reset to 'Tất cả' — call when the parent search query changes */
  const resetCategory = () => setSelectedCategory(ALL_CATEGORIES);

  return { categories, selectedCategory, setSelectedCategory, filteredRecipes, resetCategory };
}
