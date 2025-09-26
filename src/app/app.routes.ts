import { Routes, redirectUnauthorizedTo, withComponentInputBinding } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bills', loadComponent: () => import('./placeholders/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Bills' } },
  { path: 'complaints', loadComponent: () => import('./placeholders/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Complaints' } },
  { path: 'profile', loadComponent: () => import('./placeholders/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Profile' } },
  { path: 'help', loadComponent: () => import('./placeholders/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Help Chat' } },
  { path: '**', redirectTo: 'login' }
];
