import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '@/services/recipe.service';
import type { CreateRecipeInput } from '@/types/recipe';
import { recipeKeys } from './recipe.keys';

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateRecipeInput }) =>
      recipeService.updateRecipe(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.myRecipes() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(variables.id) });
    },
  });
}
