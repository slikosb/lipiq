import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { CholesterolAnalysis, Product } from '../models/product.models';
import { map, Observable, tap } from 'rxjs';

export interface FavoriteProduct {
  code: string;
  product_name?: string;
  image_url?: string;
  brands?: string;
}

const T = {
  satHigh: 5,
  satLow: 1.5,
  fiberHigh: 6,
  fiberSource: 3,
  sugarHigh: 22.5,
  transHigh: 0.5,
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = 'https://world.openfoodfacts.org/api/v2/product';

  favorites = signal<Product[]>(this.loadFavorites());
  currentProduct = signal<Product | null>(null);
  analysis = computed<CholesterolAnalysis | null>(() => {
    const p = this.currentProduct();
    return p ? this.analyseCholesterol(p) : null;
  });

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
    this.currentProduct.set(null); // pas d'ancien produit en cas d'erreur

    return this.http.get<any>(`${this.apiUrl}/${barcode}.json`).pipe(
      tap((response) => {
        if (response.status === 0) throw new Error('Produit non trouvé');
        this.currentProduct.set(response.product);
      }),
      map((response) => response.product as Product),
    );
  }

  analyseCholesterol(product: Product): CholesterolAnalysis {
    const n = product.nutriments ?? {};
    const satFat: number | null = n['saturated-fat_100g'] ?? null;
    const fiber: number | null = n['fiber_100g'] ?? null;
    const sugars: number | null = n['sugars_100g'] ?? null;
    const transFat: number = n['trans-fat_100g'] ?? 0;

    const tags: string[] = product.ingredients_tags ?? [];
    const hasBadIngredients =
      tags.some((t) => /palm|coconut|hydrogenated/.test(t)) ||
      /\b(palme|palmiste|coprah|noix de coco|huile de coco|hydrogén)/i.test(
        product.ingredients_text_fr ?? '',
      );

    // Donnée clé absente : on ne conclut pas
    if (satFat == null) {
      return {
        status: 'INCONNU',
        scoreLevel: 'GRAY',
        label: 'Données insuffisantes',
        saturatedFat: null,
        fiber,
        sugars,
        hasBadIngredients,
        reasons: ['Les graisses saturées ne sont pas renseignées pour ce produit'],
      };
    }

    const reasons: string[] = [];
    let score = 0;

    // Graisses saturées
    if (satFat > T.satHigh) {
      score += 3;
      reasons.push("Taux d'acides gras saturés élevé");
    } else if (satFat >= T.satLow) {
      score += 1;
      reasons.push("Taux d'acides gras saturés modéré");
    } else {
      reasons.push('Faible en acides gras saturés');
    }

    // Ingrédients
    if (hasBadIngredients) {
      score += 2;
      reasons.push("Présence d'huiles tropicales ou hydrogénées");
    }

    // Gras trans
    if (transFat > T.transHigh) {
      score += 2;
      reasons.push('Présence de gras trans');
    }

    // Sucres
    if ((sugars ?? 0) > T.sugarHigh) {
      score += 1;
      reasons.push('Teneur élevée en sucres');
    }

    // Fibres
    if ((fiber ?? 0) >= T.fiberHigh) {
      score -= 2;
      reasons.push('Très riche en fibres (effet protecteur)');
    } else if ((fiber ?? 0) >= T.fiberSource) {
      score -= 1;
      reasons.push('Source de fibres');
    }

    // Les fibres ne doivent pas masquer un taux de saturés non faible
    if (satFat >= T.satLow) score = Math.max(score, 1);

    const base = { saturatedFat: satFat, fiber, sugars, hasBadIngredients, reasons };

    if (score <= 0) {
      return { status: 'EXCELLENT', scoreLevel: 'GREEN', label: 'Favorable', ...base };
    }
    if (score <= 2) {
      return { status: 'MODERE', scoreLevel: 'ORANGE', label: 'À limiter', ...base };
    }
    return { status: 'MAUVAIS', scoreLevel: 'RED', label: 'Déconseillé', ...base };
  }
}
