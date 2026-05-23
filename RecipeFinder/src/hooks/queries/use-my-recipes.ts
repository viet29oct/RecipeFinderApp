import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/services/recipe.service';
import { useAuthStore } from '@/store';
import { recipeKeys } from './recipe.keys';

/** Fetches recipes created by the currently authenticated user. */
export function useMyRecipes() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: recipeKeys.myRecipes(),
    queryFn: () => recipeService.getMyRecipes(),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}
