import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { AnalyticsPageRoutingModule } from "./analytics-routing.module";
import { AnalyticsPage } from "./analytics.page";



@NgModule({
  imports:[
    AnalyticsPageRoutingModule,
    PrivateModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations:[
    AnalyticsPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AnalyticsPageModule{}
