import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CATS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cat-detail/cat-detail.component').then(m => m.CatDetailComponent),
    canActivate: [authGuard]
  },

];