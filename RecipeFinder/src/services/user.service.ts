import { apiClient, endpoints } from '@/api';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/auth';

export const userService = {
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(endpoints.users.profile);
    return data.data;
  },

  async getSavedIds(): Promise<string[]> {
    const { data } = await apiClient.get<ApiResponse<string[]>>(endpoints.users.saved);
    return data.data ?? [];
  },

  /** Idempotent — backend ignores duplicate saves */
  async saveRecipe(recipeId: string): Promise<void> {
    await apiClient.post(endpoints.users.savedItem(recipeId));
  },

  /** Idempotent — backend ignores missing saves */
  async unsaveRecipe(recipeId: string): Promise<void> {
    await apiClient.delete(endpoints.users.savedItem(recipeId));
  },
};
