# RecipeFinder — Production Architecture

## 1. Folder structure

```
RecipeFinder/
├── app/                          # Expo Router only (screens, layouts)
│   ├── (app)/                    # Authenticated tab group
│   ├── (auth)/                   # Login / register
│   ├── _layout.tsx               # Root: QueryProvider + Stack
│   └── index.tsx
├── src/
│   ├── api/                      # Axios client, endpoints
│   ├── components/
│   │   ├── recipe/               # Domain UI (RecipeCard)
│   │   └── ui/                   # LoadingView, ErrorView, AsyncState
│   ├── constants/                # theme, app constants
│   ├── data/                     # MOCK_RECIPES (dev only)
│   ├── hooks/
│   │   ├── queries/              # TanStack Query hooks
│   │   └── use-saved-recipes.ts  # Zustand selectors
│   ├── providers/                # QueryProvider
│   ├── services/                 # Business / API orchestration
│   ├── store/                    # Zustand stores
│   ├── types/                    # Shared TS types
│   └── utils/                    # env, errors
├── assets/
├── .env.example
└── app.json
```

**Layer rules**

| Layer | Responsibility | May import |
|-------|----------------|------------|
| `app/` | Navigation, screen composition | hooks, components, constants |
| `hooks/queries` | Server state (cache, refetch) | services, types |
| `services` | API calls, mapping, errors | api, types, utils, data (mock gate) |
| `api` | HTTP transport | utils |
| `store` | Client state (favorites, auth later) | types |
| `components` | Presentational UI | hooks (selectors only), types, constants |

Screens must **not** import `api` or `data` directly.

---

## 2. Required dependencies

```bash
npm install zustand @tanstack/react-query axios @react-native-async-storage/async-storage
```

| Package | Role |
|---------|------|
| `zustand` | Client state (saved recipes); `persist` + AsyncStorage |
| `@tanstack/react-query` | Server state, caching, retries |
| `axios` | HTTP client |
| `@react-native-async-storage/async-storage` | Persist Zustand |

Already in project: Expo Router, React 19, RN, TypeScript (strict).

---

## 3. Migration plan

### Phase 1 — Foundation (done)
- [x] Add `src/` layers: `api`, `types`, `utils`, `services`, `store`, `providers`
- [x] `tsconfig` path `@/*` → `./src/*`
- [x] `.env.example` + `src/utils/env.ts`
- [x] Axios `apiClient` + `recipeService`
- [x] Zustand `useSavedRecipesStore` (persisted)
- [x] TanStack `QueryProvider` in `app/_layout.tsx`
- [x] Query hooks: `useRecipes`, `useRecipe`, `useRecipeSearch`
- [x] UI: `AsyncState`, `LoadingView`, `ErrorView`
- [x] Move theme, RecipeCard, mock data into `src/`
- [x] Wire screens to hooks + store

### Phase 2 — Backend integration
- [ ] Set `EXPO_PUBLIC_USE_MOCK_DATA=false`
- [ ] Point `EXPO_PUBLIC_API_URL` to real API
- [ ] Align `ApiResponse<T>` / routes with backend contract
- [ ] Add `auth.service.ts` + secure token storage
- [ ] Axios request interceptor: `Authorization` header

### Phase 3 — Auth & guards
- [ ] `auth.store.ts` (session)
- [ ] Protected `(app)` group redirect in `app/_layout` or `(app)/_layout`
- [ ] Remove fake `router.replace('/home')` on login

### Phase 4 — Hardening
- [ ] React Query devtools (dev only)
- [ ] Offline / focus refetch policy per feature
- [ ] E2E smoke tests on critical flows
- [ ] Remove `src/data/recipes.mock.ts` when API stable

---

## 4. Base implementation map

| File | Purpose |
|------|---------|
| `src/utils/env.ts` | `EXPO_PUBLIC_*` config |
| `src/utils/errors.ts` | `ApiError`, `normalizeError`, `getErrorMessage` |
| `src/api/client.ts` | Axios instance + response interceptor |
| `src/api/endpoints.ts` | Route constants |
| `src/services/recipe.service.ts` | `getAll`, `getById`, `search` |
| `src/store/saved-recipes.store.ts` | Persisted favorites |
| `src/hooks/queries/*` | TanStack Query + `recipeKeys` |
| `src/providers/query-provider.tsx` | App-wide `QueryClient` |
| `src/components/ui/AsyncState.tsx` | Loading / error / empty wrapper |

**Data flow (recipes)**

```
Screen → useRecipes() → recipeService.getAll() → apiClient | MOCK_RECIPES
Screen → useSavedRecipes() → useSavedRecipesStore (Zustand + AsyncStorage)
```

---

## 5. Coding conventions

### Naming
- Files: `kebab-case` for hooks/utils (`use-recipe.ts`), `PascalCase` for components (`RecipeCard.tsx`)
- Services: `*.service.ts`, single exported object (`recipeService`)
- Stores: `*.store.ts`, hook `useXxxStore`
- Query keys: factory object (`recipeKeys.detail(id)`)

### TypeScript
- `interface` for models and props; `type` for unions
- No `any`; unknown + type guards at boundaries
- Domain types live in `src/types/`, not in screens

### React Query
- One hook per query in `src/hooks/queries/`
- `queryKey` always from `recipeKeys` (or domain keys file)
- Screens use `isLoading`, `error`, `refetch` — wrap lists with `AsyncState`

### Zustand
- Store holds state + actions; `use-saved-recipes.ts` exposes selectors for components
- Persist only serializable slices (`partialize`)

### Services
- All HTTP goes through `services/*`; never call `apiClient` from components
- Throw `ApiError` for domain failures (`NOT_FOUND`)

### Styling
- `StyleSheet.create` + `constants/theme.ts` only
- No inline magic numbers for colors/spacing

### Imports
```typescript
// 1. react / react-native
// 2. expo / third-party
// 3. @/ alias (src)
```

### Environment
- Copy `.env.example` → `.env`
- Only `EXPO_PUBLIC_*` for client secrets-safe config
- Restart Expo after env changes
