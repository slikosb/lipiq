import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CholesterolAnalysis, Product } from '../models/product.models';
import { map, Observable } from 'rxjs';

export interface FavoriteProduct {
  code: string;
  product_name?: string;
  image_url?: string;
  brands?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = 'https://world.openfoodfacts.org/api/v2/product';

  favorites = signal<Product[]>(this.loadFavorites());
  currentProduct = signal<Product | null>(null);
  analysis = signal<CholesterolAnalysis | null>(null);

  private loadFavorites(): Product[] {
    try {
      const saved = localStorage.getItem('lipiq_favorites');
      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return parsed.map((item: any) => {
        if (typeof item === 'string') {
          return { code: item, product_name: `Code : ${item}`, nutriments: {} };
        }
        return {
          ...item,
          nutriments: item.nutriments || {},
        };
      });
    } catch {
      return [];
    }
  }

  isFavorite(barcode: string): boolean {
    if (!barcode) return false;
    return this.favorites().some((p) => p.code === barcode.trim());
  }

  toggleFavorite(product: Product): void {
    if (!product || !product.code) return;
    const cleanCode = product.code.trim();
    const current = this.favorites();
    const exists = current.some((p) => p.code === cleanCode);

    const updated = exists
      ? current.filter((p) => p.code !== cleanCode)
      : [...current, { ...product, code: cleanCode }];

    this.favorites.set(updated);
    localStorage.setItem('lipiq_favorites', JSON.stringify(updated));
  }

  getByBarcode(barcode: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${barcode}.json`).pipe(
      map((response) => {
        if (response.status === 0) {
          throw new Error('Produit non trouvé');
        }

        const product: Product = response.product;
        this.currentProduct.set(product);

        const result = this.analyseCholesterol(product);
        console.log('suis là', result);
        this.analysis.set(result);

        return product;
      }),
    );
  }

  analyseCholesterol(product: Product): CholesterolAnalysis {
    const nutriments = product.nutriments || {};
    const satFat = nutriments['saturated-fat_100g'] ?? nutriments['saturated-fat'] ?? 0;
    const fiber = nutriments.fiber_100g ?? nutriments.fiber ?? 0;
    const sugars = nutriments.sugars_100g ?? nutriments.sugars ?? 0;

    const ingredients = (
      product.ingredients_text_fr ||
      product.ingredients_text ||
      ''
    ).toLowerCase();
    const badIngredients = ['palme', 'coprah', 'coco', 'hydrogénée', 'hydrogenee'];
    const hasBadIngredients = badIngredients.some((ing) => ingredients.includes(ing));

    const reasons: string[] = [];
    let score = 0;

    // Acides Gras Saturés
    if (satFat > 5) {
      score += 3;
      reasons.push("Taux d'acides gras saturés élevé");
    } else if (satFat >= 1.5) {
      score += 1;
      reasons.push("Taux d'acides gras saturés modéré");
    } else {
      reasons.push('Faible en acides gras saturés');
    }

    // Analyse Ingrédients
    if (hasBadIngredients) {
      score += 2;
      reasons.push("Présence d'huiles tropicales ou hydrogénées");
    }

    // Fibres
    if (fiber >= 6) {
      score -= 2;
      reasons.push('Très riche en fibres (effet protecteur)');
    } else if (fiber >= 3) {
      score -= 1;
      reasons.push('Source de fibres');
    }

    // Attribution des statuts
    if (score <= 0) {
      return {
        status: 'EXCELLENT',
        scoreLevel: 'GREEN',
        label: 'Favorable',
        saturatedFat: satFat,
        fiber,
        sugars,
        hasBadIngredients,
        reasons,
      };
    } else if (score <= 2) {
      return {
        status: 'MODERE',
        scoreLevel: 'ORANGE',
        label: 'À limiter',
        saturatedFat: satFat,
        fiber,
        sugars,
        hasBadIngredients,
        reasons,
      };
    } else {
      return {
        status: 'MAUVAIS',
        scoreLevel: 'RED',
        label: 'Déconseillé',
        saturatedFat: satFat,
        fiber,
        sugars,
        hasBadIngredients,
        reasons,
      };
    }
  }
}
