import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from 'src/app/core/services/auth/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  stepsForm: number = 1;
  progress: number = 50;
  currentValue: number = 1;
  maxValue: number = 2;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  isInvalidAndTouched(field: string): boolean {
    const control = this.forgotPasswordForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isSubmitting = true;
      try {
        const email = this.forgotPasswordForm.get('email')?.value;
        const response = await this.forgotPasswordService.requestPasswordReset(email).toPromise();
        this.stepsForm = 2;
      } catch (error) {
        console.error('Error sending reset email:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        const control = this.forgotPasswordForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
