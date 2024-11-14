import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ForgotPasswordComponent }
    ]),
    MatProgressSpinnerModule
  ]
})
export class ForgotPasswordModule { } 