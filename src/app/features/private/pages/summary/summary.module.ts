import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { SummaryPage } from "./summary.page";
import { SummaryPageRoutingModule } from "./summary.page-routing.module";
import { NgChartjsModule } from 'ng-chartjs';
import { PhoneNumberMaskDirective } from "src/app/core/directive/phonemask.directive";



@NgModule({
  imports:[
    SummaryPageRoutingModule,
    PrivateModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartjsModule,
  ],
  declarations:[
    SummaryPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SummaryPageModule{}
