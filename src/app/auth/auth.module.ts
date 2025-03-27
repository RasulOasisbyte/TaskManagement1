import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
],
  imports: [
    CommonModule,
ReactiveFormsModule,
FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    CardModule,
    RouterModule,
    AuthRoutingModule
  ],

})
export class AuthModule { }
