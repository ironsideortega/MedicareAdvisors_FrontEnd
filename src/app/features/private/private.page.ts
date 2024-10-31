import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { HttpInvokeService } from 'src/app/core/services/http-invoke.service';
import { ContactData, ContactDataResponse } from 'src/app/core/services/prospect/models';
import { ProspectService } from 'src/app/core/services/prospect/prospect.service';
import { IsChangeTableService } from './services/ejecutor.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
declare var $: any;

@Component({
  selector: 'app-private',
  templateUrl: './private.page.html',
  styleUrls: ['./private.page.scss']
})
export class PrivatePage implements OnInit {
  title = '';
  searchField = new FormControl();
  searchResults: ContactData[] = [];
  myForm!: FormGroup;
  myFormCreate!: FormGroup;
  submittedPhone = false;
  isLoading: boolean = false;

  initials: string = '';
  completeName: string = '';
  userName: string = '';



  constructor(
    private readonly router: Router,
    private http: HttpInvokeService,
    private formBuilder: FormBuilder,
    private prospectService: ProspectService,
    private isChangeTableService: IsChangeTableService,
    private authService: AuthService,
  ) {
    this.buildForm();
    this.buildFormCreate();
  }

  ngOnInit() {
    this.searchField.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.searchResults = [];
      }),
      filter((query: string) => query !== ''),
      switchMap((query: string) => this.http.GetRequest<ContactDataResponse>(`api/contact/prospect/name/${query}`))
    ).subscribe((results: ContactDataResponse) => {
      if (results.data) {
        console.log(results.data);
        if (Array.isArray(results.data)) {
          this.searchResults = results.data;
        }
      } else {
        this.searchResults = [];
      }

    });

    this.initials = this.getInitialsFromName();

  }

  getInitialsFromName(): string {
    const name = localStorage.getItem('name');
    this.userName = localStorage.getItem('username')!;
    this.completeName = name!;
    if (!name) {
      return '';
    }

    const nameParts = name.split(' ');
    let initials = '';
    for (let i = 0; i < nameParts.length; i++) {
      if (nameParts[i]) {
        initials += nameParts[i].charAt(0).toUpperCase();
      }
    }

    return initials || '';
  }

  buildForm() {
    this.myForm = this.formBuilder.group({
      searchField: [''],
    });
  }

  // public canViewModule(moduleName: string): boolean {
  //   const routeConfiguration = routesConfigurations.find(x => x.moduleName === moduleName);
  //   if (!routeConfiguration) return false;

  //   const rolesAllowed = routeConfiguration.roles;
  //   return rolesAllowed.filter(x => x === this.userData?.role.toLowerCase()).length > 0;
  // }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/public/sign-in']);
  }

  navigateToDetail(contactID: number) {
    this.searchResults = [];
    this.searchField.reset();
    this.buildForm();
    this.router.navigate(['/private/detail', contactID], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }

  buildFormCreate() {
    this.myFormCreate = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.submittedPhone = true;
    if (this.myFormCreate.valid) {
      this.isLoading = true;
      this.prospectService.saveNewProspect(this.myFormCreate.value).subscribe(response => {

        this.myFormCreate.reset();
        this.isLoading = false;
        this.buildForm();
        this.submittedPhone = false;
        $('#exampleModalNewProspect').modal('hide');
        this.isChangeTableService.isChange$.next(true);
        this.router.navigate(['/private/detail', response.data.contactId], { replaceUrl: true }).then(() => {
          window.location.reload();
        });
      });

    }
  }

  closeModalProspect() {
    this.myFormCreate.reset();
    this.buildForm();
    this.submittedPhone = false;
    $('#exampleModalNewProspect').modal('hide');
  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.myFormCreate.get(controlName);
    const pattern = /^\(\d{3}\) \d{3}-\d{4}$/;
    return control!.invalid && (control!.touched || this.submittedPhone) && !pattern.test(control!.value);
  }

  isInvalid(controlName: string): boolean {
    const control = this.myFormCreate.get(controlName);
    return control!.invalid;
  }



}
