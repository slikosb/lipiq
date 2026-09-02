export interface Product {
  code: string;
  product_name: string;
  brands: string;
  image_url: string;
  nutriments: {
    'saturated-fat_100g'?: number;
    sugars_100g?: number;
    fiber_100g?: number;
    fat_100g?: number;
  };
}

export type CholesterolStatus = 'EXCELLENT' | 'MODERE' | 'MAUVAIS';

export interface CholesterolAnalysis {
  status: CholesterolStatus;
  label: string;
  colorClass: string;
  saturatedFat: number;
  fiber: number;
}
