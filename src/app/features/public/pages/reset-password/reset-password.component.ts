import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from 'src/app/core/services/auth/forgot-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  email: string = '';
  isLoading: boolean = false;
  progress: number = 100;
  currentValue: number = 2;
  maxValue: number = 2;
  isTokenValid: boolean = false;
  validationForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private forgotPasswordService: ForgotPasswordService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.validationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Empty since we no longer need to validate token on init
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  isInvalidAndTouched(field: string): boolean {
    const control = this.resetPasswordForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  async onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const newPassword = this.resetPasswordForm.get('password')?.value;
        const response = await this.forgotPasswordService.resetPassword(
          this.email,
          this.token,
          newPassword
        ).toPromise();

        if (response.status === 'success') {
          // Redirigir al login con mensaje de éxito
          this.router.navigate(['/public/sign-in'], {
            queryParams: { resetSuccess: true }
          });
        } else {
          this.errorMessage = response.message || 'An error occurred during password reset';
        }
      } catch (error: any) {
        console.error('Error resetting password:', error);
        this.errorMessage = error.error?.message || 'An error occurred during password reset';
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        const control = this.resetPasswordForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  hasUppercaseAndNumber(value: string | null | undefined): boolean {
    if (!value) return false;
    return /^(?=.*[A-Z])(?=.*[0-9]).*$/.test(value);
  }

  async validateCredentials() {
    if (this.validationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const emailValue = this.validationForm.get('email')?.value;
        const codeValue = this.validationForm.get('code')?.value;

        if (!emailValue || !codeValue) {
          throw new Error('Email and code are required');
        }

        this.email = emailValue;
        this.token = codeValue;
        
        await this.forgotPasswordService.validateResetToken(this.email, this.token).toPromise();
        this.isTokenValid = true;
      } catch (error: any) {
        console.error('Token validation error:', error);
        this.isTokenValid = false;
        this.errorMessage = error.error?.message || 'An error occurred during validation';
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.validationForm.controls).forEach(key => {
        const control = this.validationForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
