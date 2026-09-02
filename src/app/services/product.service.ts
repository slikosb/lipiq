import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CholesterolAnalysis, Product } from '../models/product.models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = 'https://world.openfoodfacts.org/api/v2/product';

  currentProduct = signal<Product | null>(null);
  analysis = signal<CholesterolAnalysis | null>(null);

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
