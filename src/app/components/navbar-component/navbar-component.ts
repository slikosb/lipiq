import { Component, inject, input, output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar-component',
  templateUrl: './navbar-component.html',
})
export class NavbarComponent {
  productService = inject(ProductService);
}
