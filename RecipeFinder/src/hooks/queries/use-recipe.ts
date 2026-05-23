import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/services/recipe.service';
import { recipeKeys } from './recipe.keys';

export function useRecipe(id: string | undefined) {
  return useQuery({
    queryKey: recipeKeys.detail(id ?? ''),
    queryFn: () => recipeService.getById(id!),
    enabled: Boolean(id),
  });
}
