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
          return { code: item, product_name: `Code : ${item}` };
        }
        return item;
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
          throw new Error('Produit non troivé');
        }

        const product: Product = response.product;
        this.currentProduct.set(product);
        this.analyseCholesterol(product);
        return product;
      }),
    );
  }

  private analyseCholesterol(product: Product): void {
    const satFat = product.nutriments?.['saturated-fat_100g'] ?? 0;
    const fiber = product.nutriments?.['fiber_100g'] ?? 0;

    let result: CholesterolAnalysis;

    if (satFat > 5) {
      result = {
        status: 'MAUVAIS',
        label: 'À éviter (Riche en graisses saturées)',
        colorClass: 'bg-red-500 text-white',
        saturatedFat: satFat,
        fiber,
      };
    } else if (satFat > 1.5) {
      result = {
        status: 'MODERE',
        label: 'À consommer avec modération',
        colorClass: 'bg-orange-400 text-white',
        saturatedFat: satFat,
        fiber,
      };
    } else {
      result = {
        status: 'EXCELLENT',
        label: 'Favorable (Faible en graisses saturées)',
        colorClass: 'bg-emerald-500 text-white',
        saturatedFat: satFat,
        fiber,
      };
    }

    this.analysis.set(result);
  }
}
