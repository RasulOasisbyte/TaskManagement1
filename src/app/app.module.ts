import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

// Bootstrap Module //
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// PrimeNG Modules
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';

// Routing
import { AppRoutingModule } from './app-routing.module';
import { Route } from '@angular/router';




// Components
import { AppComponent } from './app.component';

import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SupportPageComponent } from './support/support-page.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskFilter'
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: any[], searchQuery: string): any[] {
    if (!tasks || !searchQuery) {
      return tasks;
    }
    return tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
  AddTaskDialogComponent,
  ForgotPasswordComponent,
  DashboardComponent,
SidebarComponent,
  SupportPageComponent,


  ],
  imports: [
    // Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    // Material Modules
    DragDropModule,
    //Bootstrap Modules//
    NgbModule,
    // PrimeNG Modules
    DialogModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
    TableModule,
    ChartModule,
    CalendarModule,
    TaskFilterPipe
],
  exports: [

],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
