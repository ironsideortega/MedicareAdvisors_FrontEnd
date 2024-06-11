import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';


import { SettingsPageRoutingModule } from "./settings.page-routing.module";
import { SettingsPage } from "./settings.page";



@NgModule({
  imports:[
    SettingsPageRoutingModule,
    PrivateModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations:[
    SettingsPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SettingsPageModule{}
