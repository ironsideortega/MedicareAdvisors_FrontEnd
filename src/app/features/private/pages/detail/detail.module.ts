import { NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { NgChartjsModule } from 'ng-chartjs';
import { DetailPageRoutingModule } from "./detail.page-routing.module";
import { DetailPage } from "./detail.page";
import { PhoneNumberMaskDirective } from "src/app/core/directive/phonemask.directive";




@NgModule({
  imports:[
    DetailPageRoutingModule,
    PrivateModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartjsModule,
  ],
  declarations:[
    DetailPage,
  ],

})

export class DetailPageModule{}
