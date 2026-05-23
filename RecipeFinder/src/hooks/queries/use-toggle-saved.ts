import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { recipeKeys } from './recipe.keys';

/**
 * Mutation to save / unsave a recipe with optimistic updates.
 * Handles the edge case where the TQ cache hasn't been populated yet
 * (previous === undefined) by treating it as an empty list.
 */
export function useToggleSaved() {
  const queryClient = useQueryClient();
  const key = recipeKeys.savedIds();

  return useMutation({
    mutationFn: ({ recipeId, currentlySaved }: { recipeId: string; currentlySaved: boolean }) =>
      currentlySaved
        ? userService.unsaveRecipe(recipeId)
        : userService.saveRecipe(recipeId),

    // ── Optimistic update ─────────────────────────────────────────────────────
    onMutate: async ({ recipeId, currentlySaved }) => {
      // Cancel any in-flight refetch so it doesn't overwrite our optimistic data
      await queryClient.cancelQueries({ queryKey: key });

      // Snapshot BEFORE update — treat undefined cache as empty array
      const previous: string[] = queryClient.getQueryData<string[]>(key) ?? [];

      queryClient.setQueryData<string[]>(key, (old = []) =>
        currentlySaved ? old.filter((id) => id !== recipeId) : [...old, recipeId]
      );

      return { previous };
    },

    // ── Rollback on network/server error ──────────────────────────────────────
    onError: (_err, _vars, context) => {
      // Always rollback — context.previous is now always a string[] (never undefined)
      queryClient.setQueryData(key, context?.previous ?? []);
    },

    // ── Re-sync with server after settle (success or error) ──────────────────
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
