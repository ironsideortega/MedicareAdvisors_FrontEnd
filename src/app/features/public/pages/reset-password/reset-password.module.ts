import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
const routes = [
  { path: '', component: ResetPasswordComponent }
];

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ResetPasswordModule { } 