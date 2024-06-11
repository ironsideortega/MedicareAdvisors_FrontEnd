import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleCustom } from 'src/app/material/material.module';
import { PublicRoutingModule } from './public.page-routing.module';
import { PublicPage } from './public.page';
import { PhoneNumberMaskDirective } from 'src/app/core/directive/phonemask.directive';
import { PhoneNumberPublicMaskDirective } from 'src/app/core/directive/phonemask-public.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PublicRoutingModule,
    MaterialModuleCustom,

  ],
  declarations: [
    PublicPage,
    PhoneNumberPublicMaskDirective
  ],
  exports:[
    PhoneNumberPublicMaskDirective,
  ]

})
export class PublicModule { }
