export interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  ingredients_text?: string;
  ingredients_text_fr?: string;
  ingredients_tags?: string[]; // ajout
  nutriments: {
    'saturated-fat_100g'?: number;
    'trans-fat_100g'?: number; // ajout
    sugars_100g?: number;
    fiber_100g?: number;
    fat_100g?: number;
  };
}

export type CholesterolStatus = 'EXCELLENT' | 'MODERE' | 'MAUVAIS' | 'INCONNU';
export type ScoreLevel = 'GREEN' | 'ORANGE' | 'RED' | 'GRAY';

export interface CholesterolAnalysis {
  status: CholesterolStatus;
  scoreLevel: ScoreLevel;
  label: string;
  saturatedFat?: number | null;
  fiber?: number | null;
  sugars?: number | null;
  hasBadIngredients: boolean;
  reasons: string[];
}
