import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '@/services/recipe.service';
import { recipeKeys } from './recipe.keys';

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recipeService.deleteRecipe(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.myRecipes() });
      queryClient.removeQueries({ queryKey: recipeKeys.detail(id) });
    },
  });
}
