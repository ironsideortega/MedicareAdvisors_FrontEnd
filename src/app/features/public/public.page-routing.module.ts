
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicPage } from './public.page';
// import { RoleGuard } from 'src/app/core/guards/role/role.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PublicPage,
    children: [
      {
        path: 'sign-in',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/sign-in/signin.module').then(m => m.SignInPageModule)
      },
      {
        path: 'sign-up',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/sign-up/signup.module').then(m => m.SignUpPageModule)
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
