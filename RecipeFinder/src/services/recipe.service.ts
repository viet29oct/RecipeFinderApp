import { apiClient, endpoints } from '@/api';
import type { ApiResponse } from '@/types/api';
import type { CreateRecipeInput, Recipe } from '@/types/recipe';
import { ApiError } from '@/utils/errors';

function unwrapList(payload: Recipe[] | ApiResponse<Recipe[]>): Recipe[] {
  return Array.isArray(payload) ? payload : payload.data;
}

function unwrapOne(payload: Recipe | ApiResponse<Recipe>): Recipe {
  return 'data' in payload && payload.data !== undefined ? payload.data : (payload as Recipe);
}

export const recipeService = {
  // ── Public (admin recipes) ──────────────────────────────────────────────────

  async getAll(): Promise<Recipe[]> {
    const { data } = await apiClient.get<Recipe[] | ApiResponse<Recipe[]>>(endpoints.recipes.list);
    return unwrapList(data);
  },

  async getById(id: string): Promise<Recipe> {
    const { data } = await apiClient.get<Recipe | ApiResponse<Recipe>>(
      endpoints.recipes.detail(id)
    );
    return unwrapOne(data);
  },

  async search(query: string): Promise<Recipe[]> {
    const normalized = query.trim();
    if (!normalized) return this.getAll();

    try {
      const { data } = await apiClient.get<Recipe[] | ApiResponse<Recipe[]>>(
        endpoints.recipes.search,
        { params: { q: normalized } }
      );
      return unwrapList(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return [];
      throw error;
    }
  },

  // ── Authenticated (user-created recipes) ────────────────────────────────────

  async getMyRecipes(): Promise<Recipe[]> {
    const { data } = await apiClient.get<ApiResponse<Recipe[]>>(endpoints.recipes.my);
    return data.data ?? [];
  },

  async createRecipe(input: CreateRecipeInput): Promise<Recipe> {
    const { data } = await apiClient.post<ApiResponse<Recipe>>(endpoints.recipes.list, input);
    return data.data;
  },

  async updateRecipe(id: string, input: CreateRecipeInput): Promise<Recipe> {
    const { data } = await apiClient.put<ApiResponse<Recipe>>(
      endpoints.recipes.detail(id),
      input
    );
    return data.data;
  },

  async deleteRecipe(id: string): Promise<void> {
    await apiClient.delete(endpoints.recipes.detail(id));
  },
};
