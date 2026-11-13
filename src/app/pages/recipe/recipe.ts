import { Component } from '@angular/core';
import { ChefHat, LucideAngularModule } from 'lucide-angular';

@Component({
  imports: [LucideAngularModule],
  selector: 'app-recipe',
  templateUrl: './recipe.html',
})
export class RecipeComponent {
  readonly ChefHat = ChefHat;
}
