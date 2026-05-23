import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/services/recipe.service';
import { recipeKeys } from './recipe.keys';

export function useRecipes() {
  return useQuery({
    queryKey: recipeKeys.lists(),
    queryFn: () => recipeService.getAll(),
  });
}

export function useRecipeSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: recipeKeys.list({ query: trimmed }),
    queryFn: () => recipeService.search(trimmed),
  });
}
