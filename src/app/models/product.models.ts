export interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  ingredients_text?: string;
  ingredients_text_fr?: string;
  nutriments: {
    'saturated-fat_100g'?: number;
    'saturated-fat'?: number;
    sugars_100g?: number;
    sugars?: number;
    fiber_100g?: number;
    fiber?: number;
    fat_100g?: number;
    fat?: number;
  };
}

export type CholesterolStatus = 'EXCELLENT' | 'MODERE' | 'MAUVAIS';
export type ScoreLevel = 'GREEN' | 'ORANGE' | 'RED';

export interface CholesterolAnalysis {
  status: CholesterolStatus;
  scoreLevel: ScoreLevel;
  label: string;
  saturatedFat: number;
  fiber: number;
  sugars: number;
  hasBadIngredients: boolean;
  reasons: string[];
}
