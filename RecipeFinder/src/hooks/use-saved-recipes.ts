import { useSavedIds, useToggleSaved } from '@/hooks/queries';

/**
 * Unified hook for saved-recipe state.
 *
 * Backed by the backend API (GET/POST/DELETE /users/saved).
 * Optimistic updates mean the heart icon flips instantly even before
 * the server responds.
 *
 * Components import only this hook — they are unaware of the
 * underlying query/mutation implementation.
 */
export function useSavedRecipes() {
  const { data: savedIds = [], isLoading } = useSavedIds();
  const { mutate } = useToggleSaved();

  const isSaved = (recipeId: string) => savedIds.includes(recipeId);

  const toggleSaved = (recipeId: string) =>
    mutate({ recipeId, currentlySaved: isSaved(recipeId) });

  return { savedIds, isSaved, toggleSaved, isLoading };
}
