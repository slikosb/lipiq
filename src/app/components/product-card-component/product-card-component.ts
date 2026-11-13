import { Component, inject, input } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  imports: [],
  selector: 'app-product-card-component',
  templateUrl: './product-card-component.html',
})
export class ProductCardComponent {
  productService = inject(ProductService);

  barcode = input.required<string>();
}
