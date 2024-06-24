import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit():void {
    this.buildFormCreate();
  }

  buildFormCreate(){
    this.profileForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      UserPassword: ['', Validators.required],
      CreatedDate: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Title: [''],
      Address: [''],
      City: [''],
      StateID: [''],
      Zip: [''],
      PhoneNumber: [''],
      Picture: [''],
      NationalProducerNumber: [''],
      LanguagePreferences: [false],
      LogOut: [''],
      SecurityPin: ['']
    });
  }
}
