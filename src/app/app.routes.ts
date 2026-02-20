import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth';
import { CATS_ROUTES } from './features/cats';
import { PROFILE_ROUTES } from './features/profile';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/cats',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: AUTH_ROUTES
  },
  {
    path: 'cats',
    children: CATS_ROUTES
  },
  {
    path: 'profile',
    children: PROFILE_ROUTES
  },
  {
    path: '**',
    redirectTo: '/cats'
  }
];