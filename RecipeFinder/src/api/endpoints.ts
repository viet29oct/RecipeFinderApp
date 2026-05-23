export const endpoints = {
  recipes: {
    list: '/recipes',
    detail: (id: string) => `/recipes/${id}`,
    search: '/recipes/search',
    my: '/recipes/my',
  },
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    logoutAll: '/auth/logout-all',
  },
  users: {
    profile: '/users/profile',
    saved: '/users/saved',
    savedItem: (recipeId: string) => `/users/saved/${recipeId}`,
  },
} as const;
