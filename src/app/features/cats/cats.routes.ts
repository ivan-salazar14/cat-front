import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CATS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cat-list/cat-list.component').then(m => m.CatListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/cat-form/cat-form.component').then(m => m.CatFormComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/cat-detail/cat-detail.component').then(m => m.CatDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/cat-form/cat-form.component').then(m => m.CatFormComponent),
    canActivate: [authGuard]
  }
];