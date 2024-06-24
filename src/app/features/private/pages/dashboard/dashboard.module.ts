import { NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { DashboardPage } from "./dashboard.page";
import { DashboardPageRoutingModule } from "./dashboard.page-routing.module";
import { NgApexchartsModule } from "ng-apexcharts";




@NgModule({
  imports:[
    DashboardPageRoutingModule,
    PrivateModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgApexchartsModule
  ],
  declarations:[
    DashboardPage,
  ],

})

export class DashboardPageModule{}
