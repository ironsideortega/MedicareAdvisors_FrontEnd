import { Component, Input, OnInit } from '@angular/core';
import { ProfileStateData } from 'src/app/core/services/profile';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignUpPage implements OnInit {
  profileForm!: FormGroup;
  profileState: ProfileStateData[] = [];
  submittedPhone = false;
  isLoading: boolean = false;

  @Input() currentValue: number = 1;  // Valor actual (numerador)
  @Input() maxValue: number = 3;      // Valor máximo (denominador)
  progress: number = 33;

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.getAllStates();
    this.buildFormCreate();
  }

  stepsForm: number = 1;

  changeStep(value: number) {
    this.stepsForm = value;
    this.currentValue = value;
    if (value == 1) {
      this.progress = 33;
    } else if (value == 2) {
      this.progress = 66;
    } else {
      this.progress = 100;
    }
  }

  getAllStates() {
    this.profileService.getProfileState().subscribe(res => {
      this.profileState = res.data;
    });
  }

  buildFormCreate() {
    this.profileForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Userpassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$') // Mínimo 8 caracteres, 1 mayúscula y 1 número
      ]],
      ConfirmPassword: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Address: ['', Validators.required],
      City: ['', Validators.required],
      StateID: ['',],
      Zip: ['', [Validators.required, Validators.maxLength(5),]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      Picture: [''],
      NationalProducerNumber: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('Userpassword');
    const confirmPassword = control.get('ConfirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'mismatch': true };
    }
    return null;
  }

  onSubmit() {
    this.submittedPhone = true;
    this.isLoading = true;
    if (this.profileForm.valid) {
      this.profileForm.patchValue({
        NationalProducerNumber: this.profileForm.value.NationalProducerNumber.toString(),
      });
      this.profileService.saveProfile(this.profileForm.value).subscribe(response => {
        this.profileForm.reset();
        this.isLoading = false;
        this.buildFormCreate();
        this.submittedPhone = false;
        // $('#exampleModalNewProspect').modal('hide');
        this.router.navigate(['/public/sign-in'], { replaceUrl: true }).then(() => {
          window.location.reload();
        });
      });
    } else {
      this.isLoading = false;
      console.log(this.profileForm.value);

      console.log('form invalid');

    }

  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    const pattern = /^\(\d{3}\) \d{3}-\d{4}$/;
    return control!.invalid && (control!.touched || this.submittedPhone) && !pattern.test(control!.value);
  }

  isInvalid(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    return control!.invalid;
  }


  validateMaxLength(event: any): void {
    if (event.target.value.length > 5) {
      event.target.value = event.target.value.slice(0, 5);
      this.profileForm.get('Zip')?.setValue(event.target.value);  // Actualiza el valor del FormControl
    }
  }


  isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
    const toggleEyeIcon = document.getElementById('toggleEye') as HTMLElement;

    if (this.isPasswordVisible) {
      passwordInput.type = 'text';
      toggleEyeIcon.classList.remove('bi-eye-fill');
      toggleEyeIcon.classList.add('bi-eye-slash-fill');
    } else {
      passwordInput.type = 'password';
      toggleEyeIcon.classList.remove('bi-eye-slash-fill');
      toggleEyeIcon.classList.add('bi-eye-fill');
    }
  }

  isRePasswordVisible: boolean = false;

  toggleRePasswordVisibility() {
    this.isRePasswordVisible = !this.isRePasswordVisible;
    const passwordInput = document.getElementById('passwordReInput') as HTMLInputElement;
    const toggleEyeIcon = document.getElementById('toggleEyeRe') as HTMLElement;

    if (this.isRePasswordVisible) {
      passwordInput.type = 'text';
      toggleEyeIcon.classList.remove('bi-eye-fill');
      toggleEyeIcon.classList.add('bi-eye-slash-fill');
    } else {
      passwordInput.type = 'password';
      toggleEyeIcon.classList.remove('bi-eye-slash-fill');
      toggleEyeIcon.classList.add('bi-eye-fill');
    }
  }
}
