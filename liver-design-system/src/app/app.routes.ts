import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  // Authentication Routes (Standalone full-screen layout)
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(
        m => m.ForgotPasswordComponent
      )
  },
  {
    path: 'auth/verify-2fa',
    loadComponent: () =>
      import('./features/auth/verify-2fa/verify-2fa.component').then(
        m => m.Verify2faComponent
      )
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  // Main Admin Layout with Protected Shell
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            m => m.DashboardComponent
          )
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users.component').then(m => m.UsersComponent),
        canActivate: [permissionGuard],
        data: { permissions: ['USER_VIEW', 'ADMIN'] }
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/analytics.component').then(
            m => m.AnalyticsComponent
          ),
        canActivate: [permissionGuard],
        data: { permissions: ['ANALYTICS_VIEW', 'ADMIN'] }
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            m => m.ProfileComponent
          )
      }
    ]
  },

  // Fallback Wildcard
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
