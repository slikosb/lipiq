import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search';
import { FavoritesComponent } from './pages/favorites/favorites';
import { RecipeComponent } from './pages/recipe/recipe';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'recipe', component: RecipeComponent },
  { path: '**', redirectTo: 'search' },
];
