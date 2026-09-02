import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ProductService } from './services/product.service';
import { BarcodeFormat } from '@zxing/library';

@Component({
  imports: [FormsModule, ZXingScannerModule],
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  productService: ProductService = inject(ProductService);

  barcodeInput = '';
  isScannerOpen = signal(false);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Formats de code-barres supportés en supermarché
  allowedFormats = [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ];

  searchByBarcode(code?: string): void {
    const targetCode: string = code || this.barcodeInput.trim();
    if (!targetCode) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.isScannerOpen.set(false);

    this.productService.getByBarcode(targetCode).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Produit introuvable ou problème réseau.');
      },
    });
  }

  toggleScanner(): void {
    this.isScannerOpen.update((v) => !v);
  }

  onScanSuccess(result: string): void {
    if (result) {
      this.barcodeInput = result;
      this.searchByBarcode(result);
    }
  }

  onPermissionResponse(hasPermission: boolean): void {
    if (!hasPermission) {
      this.errorMessage.set('Accès à la caméra refusé dans votre navigateur.');
    }
  }
}
