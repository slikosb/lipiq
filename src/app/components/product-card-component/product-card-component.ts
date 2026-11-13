import { Component, inject, input, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { LucideAngularModule, ChevronRight, ChevronDown } from 'lucide-angular';

@Component({
  imports: [LucideAngularModule],
  selector: 'app-product-card-component',
  templateUrl: './product-card-component.html',
})
export class ProductCardComponent {
  barcode = input.required<string>();

  productService = inject(ProductService);

  displayInfos = signal<boolean>(false);

  readonly ChevronRight = ChevronRight;
  readonly ChevronDown = ChevronDown;

  setDisplay(): void {
    this.displayInfos.set(!this.displayInfos());
  }
}
