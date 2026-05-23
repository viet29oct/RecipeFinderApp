export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (filters?: { query?: string }) => [...recipeKeys.lists(), filters ?? {}] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  savedIds: () => [...recipeKeys.all, 'saved'] as const,
  myRecipes: () => [...recipeKeys.all, 'my'] as const,
};
