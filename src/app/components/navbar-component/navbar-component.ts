import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, ScanSearch, Heart, ChefHat } from 'lucide-angular';

@Component({
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  selector: 'app-navbar-component',
  host: { class: 'block' },
  templateUrl: './navbar-component.html',
})
export class NavbarComponent {
  productService = inject(ProductService);
  readonly ScanSearch = ScanSearch;
  readonly Heart = Heart;
  readonly ChefHat = ChefHat;
}
