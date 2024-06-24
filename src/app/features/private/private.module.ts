import { NgModule } from '@angular/core';
import { PrivatePage } from './private.page';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleCustom } from 'src/app/material/material.module';
import { PhoneNumberMaskDirective } from 'src/app/core/directive/phonemask.directive';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrivateRoutingModule,
    MaterialModuleCustom,

  ],
  declarations: [
    PrivatePage,
    PhoneNumberMaskDirective,
  ],
  exports:[
    PhoneNumberMaskDirective
  ]

})
export class PrivateModule { }
