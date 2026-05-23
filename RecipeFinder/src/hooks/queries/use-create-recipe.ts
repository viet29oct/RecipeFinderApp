import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '@/services/recipe.service';
import type { CreateRecipeInput } from '@/types/recipe';
import { recipeKeys } from './recipe.keys';

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRecipeInput) => recipeService.createRecipe(input),
    onSuccess: () => {
      // Refresh the my-recipes list
      queryClient.invalidateQueries({ queryKey: recipeKeys.myRecipes() });
    },
  });
}
