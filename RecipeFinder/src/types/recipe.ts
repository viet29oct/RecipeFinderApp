export interface Recipe {
  id: string;
  name: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
  category: string;
  time: string;
}

export interface CreateRecipeInput {
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  timeLabel: string;
  ingredients: string[];
  steps: string[];
}

export type RecipeCategory =
  | 'Tất cả'
  | 'Món nước'
  | 'Cơm'
  | 'Nướng'
  | 'Tráng miệng'
  | string;
