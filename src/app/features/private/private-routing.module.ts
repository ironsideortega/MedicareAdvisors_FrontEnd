
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivatePage } from './private.page';
// import { RoleGuard } from 'src/app/core/guards/role/role.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PrivatePage,
    children: [
      {
        path: 'dashboard',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'analytics',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/analytics/analytics.module').then(m => m.AnalyticsPageModule)
      },
      {
        path: 'summary',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryPageModule)
      },
      {
        path: 'detail/:id',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/detail/detail.module').then(m => m.DetailPageModule)
      },
      {
        path: 'settings',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
