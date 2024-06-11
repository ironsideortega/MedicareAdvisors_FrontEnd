import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';


import { ProfilePage } from "./profile.page";
import { ProfilePageRoutingModule } from "./profile.page-routing.module";



@NgModule({
  imports:[
    ProfilePageRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations:[
    ProfilePage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ProfilePageModule{}
