import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store';
import { recipeKeys } from './recipe.keys';

/**
 * Fetches the list of recipe IDs saved by the current user.
 * Only runs when authenticated; returns [] while loading or logged out.
 */
export function useSavedIds() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: recipeKeys.savedIds(),
    queryFn: () => userService.getSavedIds(),
    enabled: isAuthenticated,
    staleTime: 60_000, // 1 min — re-fetch in background when stale
  });
}
