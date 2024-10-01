import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { SignUpPageRoutingModule } from "./signup.page-routing.module";
import { SignUpPage } from "./signup.page";
import { PublicModule } from "../../public.module";
import { NgCircleProgressModule } from 'ng-circle-progress';




@NgModule({
  imports: [
    SignUpPageRoutingModule,
    PublicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#E5E8EB",
      innerStrokeColor: "#246FC2",
      animationDuration: 300,
    })
  ],
  declarations: [
    SignUpPage,
  ],

})

export class SignUpPageModule { }
