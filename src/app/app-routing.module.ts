
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  NoAuthGuardService } from './core/guards/no-auth/no-auth.guard';
import {  AuthGuardService } from './core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'private',
    canActivate: [ AuthGuardService],
    loadChildren: () => import('./features/private/private.module').then(m => m.PrivateModule)
  },
  {
    path: 'public',
    canActivate: [NoAuthGuardService],
    loadChildren: () => import('./features/public/public.module').then(m => m.PublicModule)
  },

  { path: '', redirectTo: 'private', pathMatch: 'full' },
  // { path: '404', component: NotFoundComponent },
  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
