# Recipe Finder - Ứng dụng tìm kiếm công thức nấu ăn

## Project làm gì

Recipe Finder là một ứng dụng di động đa nền tảng giúp người dùng:
- Khám phá các công thức nấu ăn Việt Nam và quốc tế
- Tìm kiếm công thức theo tên hoặc danh mục
- Xem chi tiết công thức (nguyên liệu, các bước thực hiện)
- Lưu công thức yêu thích vào danh sách
- Đăng nhập/Đăng ký tài khoản

Ứng dụng được xây dựng với mục tiêu giúp người dùng dễ dàng tìm kiếm và thực hiện các món ăn ngon.

## Tech Stack

### Core Technologies
- **React 19.1.0** - Thư viện UI chính
- **React Native 0.81.5** - Framework phát triển ứng dụng di động đa nền tảng
- **Expo 54.0.33** - Môi trường phát triển và build cho React Native
- **Expo Router 6.0.23** - File-based routing cho ứng dụng

### Dependencies
- **@react-navigation/native** - Điều hướng màn hình
- **@react-navigation/bottom-tabs** - Bottom tab navigation
- **@expo/vector-icons** - Icon library
- **expo-image** - Component hiển thị hình ảnh tối ưu
- **expo-haptics** - Haptic feedback
- **react-native-reanimated** - Animations mượt
- **react-native-gesture-handler** - Xử lý cử chỉ
- **TypeScript** - Type safety

### Dev Tools
- **ESLint** - Linting code
- **TypeScript 5.9.2** - Type checking

## Cách chạy

### Yêu cầu trước
- Node.js (phiên bản 18+)
- npm hoặc yarn
- Expo Go app (để chạy trên thiết bị thật) hoặc Android Studio/Xcode (để chạy trên emulator)

### Cài đặt

1. Di chuyển vào thư mục dự án:
```bash
cd RecipeFinder
```

2. Cài đặt dependencies:
```bash
npm install
```

### Chạy ứng dụng

#### Chạy trên development server:
```bash
npm start
```

#### Chạy trên các nền tảng cụ thể:
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

#### Linting code:
```bash
npm run lint
```

## Cấu trúc thư mục

```
RecipeFinder/
├── app/                      # Expo Router pages
│   ├── (app)/               # Main app screens (protected)
│   │   ├── food/
│   │   │   └── [id].tsx    # Recipe detail screen
│   │   ├── user/
│   │   │   └── profile.tsx # User profile screen
│   │   ├── _layout.tsx      # App layout (bottom tabs)
│   │   ├── home.tsx         # Home screen
│   │   ├── saved.tsx        # Saved recipes screen
│   │   └── search.tsx       # Search screen
│   ├── (auth)/              # Auth screens
│   │   ├── login.tsx        # Login screen
│   │   └── register.tsx     # Register screen
│   ├── _layout.tsx           # Root layout
│   └── index.tsx             # Initial screen
├── assets/                   # Static assets
│   └── images/              # Images
├── components/              # Reusable components
│   └── RecipeCard.tsx       # Recipe card component
├── constants/               # Constants
│   └── theme.ts             # Theme (colors, spacing, typography)
├── contexts/                # React Contexts
│   └── SavedRecipesContext.tsx # Saved recipes state
├── data/                    # Mock data
│   └── recipes.ts           # Recipes data
├── hooks/                   # Custom hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── scripts/                 # Utility scripts
│   └── reset-project.js
├── app.json                 # Expo configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript config
└── eslint.config.js         # ESLint config
```

## Flow hệ thống

### 1. Authentication Flow
```
index.tsx (Splash)
    ↓
Check authentication status
    ↓
├─→ Chưa đăng nhập → (auth)/login.tsx → (auth)/register.tsx
│                          ↓
│                    Đăng nhập thành công
│                          ↓
└───────────────────────→ (app)/_layout.tsx (Main App)
```

### 2. Main App Navigation
```
(app)/_layout.tsx (Bottom Tabs)
├── home.tsx (Trang chủ)
├── search.tsx (Tìm kiếm)
├── saved.tsx (Đã lưu)
└── user/profile.tsx (Hồ sơ)
```

### 3. Recipe Interaction Flow
```
Xem danh sách công thức (home/search/saved)
    ↓
Nhấn vào RecipeCard
    ↓
food/[id].tsx (Chi tiết công thức)
    ↓
├─→ Xem nguyên liệu
├─→ Xem các bước thực hiện
└─→ Lưu/Xóa khỏi danh sách yêu thích
```

### 4. Saved Recipes Flow
```
useSavedRecipes() Hook
    ↓
SavedRecipesContext (Global State)
    ↓
├─→ RecipeCard (Toggle save)
└─→ saved.tsx (Hiển thị danh sách đã lưu)
```

## Quy ước code

### 1. File Naming
- **Components**: PascalCase (vd: `RecipeCard.tsx`)
- **Screens**: kebab-case hoặc camelCase (vd: `home.tsx`, `search.tsx`)
- **Contexts**: PascalCase với hậu tố Context (vd: `SavedRecipesContext.tsx`)
- **Hooks**: camelCase với tiền tố use (vd: `use-color-scheme.ts`)
- **Constants**: camelCase (vd: `theme.ts`)

### 2. Component Naming
- Sử dụng PascalCase cho component names
- Export default component chính
- Export named cho các component phụ (vd: `RecipeCardWide`)

### 3. Props Interface
- Định nghĩa interface cho props trước component
- Sử dụng `interface` thay vì `type` cho props

```typescript
interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  // ...
}
```

### 4. State Management
- Sử dụng React Context cho global state (vd: `SavedRecipesContext`)
- Sử dụng `useState` cho local state
- Sử dụng `useMemo` cho các giá trị tính toán phức tạp

### 5. Styling
- Sử dụng `StyleSheet.create()` cho styles
- Sử dụng constants từ `theme.ts` (Colors, Spacing, BorderRadius, Typography)
- Không hardcode giá trị màu, spacing

```typescript
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
});
```

### 6. Imports
- Sắp xếp imports theo thứ tự:
  1. React và React Native imports
  2. Expo và third-party library imports
  3. Local imports (components, constants, contexts, data, hooks)
- Sử dụng đường dẫn tương đối

### 7. TypeScript
- Luôn định nghĩa type cho props, state, và dữ liệu
- Sử dụng `interface` cho object types
- Tránh dùng `any`

### 8. Navigation
- Sử dụng `expo-router` cho routing
- Sử dụng `router.push()` cho navigation
- Sử dụng dynamic routes cho chi tiết (vd: `/food/[id]`)

## Tree.text

```
RecipeFinder/
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── app/
│   ├── (app)/
│   │   ├── food/
│   │   │   └── [id].tsx
│   │   ├── user/
│   │   │   └── profile.tsx
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   ├── saved.tsx
│   │   └── search.tsx
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── assets/
│   └── images/
│       ├── android-icon-background.png
│       ├── android-icon-foreground.png
│       ├── android-icon-monochrome.png
│       ├── favicon.png
│       ├── icon.png
│       ├── partial-react-logo.png
│       ├── react-logo.png
│       ├── react-logo@2x.png
│       ├── react-logo@3x.png
│       └── splash-icon.png
├── components/
│   └── RecipeCard.tsx
├── constants/
│   └── theme.ts
├── contexts/
│   └── SavedRecipesContext.tsx
├── data/
│   └── recipes.ts
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── scripts/
│   └── reset-project.js
├── .gitignore
├── app.json
├── eslint.config.js
├── package-lock.json
├── package.json
└── tsconfig.json
```
