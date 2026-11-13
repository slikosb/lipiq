import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, FavoriteProduct } from '../../services/product.service';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule],
  templateUrl: './favorites.html',
})
export class FavoritesComponent {
  productService = inject(ProductService);
  router = inject(Router);

  selectFavorite(fav: FavoriteProduct): void {
    this.productService.getByBarcode(fav.code).subscribe();
    this.router.navigate(['/search']);
  }
}
