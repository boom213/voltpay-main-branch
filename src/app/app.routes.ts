import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './services/auth.service';

const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.parseUrl('/login');
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'bills', loadComponent: () => import('./placeholders/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Bills' }, canActivate: [authGuard] },
  { path: 'complaints', loadComponent: () => import('./placeholders/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Complaints' }, canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./placeholders/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Profile' }, canActivate: [authGuard] },
  { path: 'help', loadComponent: () => import('./placeholders/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Help Chat' }, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
