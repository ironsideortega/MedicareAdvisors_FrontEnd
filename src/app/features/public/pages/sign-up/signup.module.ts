import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { SignUpPageRoutingModule } from "./signup.page-routing.module";
import { SignUpPage } from "./signup.page";
import { PublicModule } from "../../public.module";




@NgModule({
  imports:[
    SignUpPageRoutingModule,
    PublicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations:[
    SignUpPage,
  ],

})

export class SignUpPageModule{}
