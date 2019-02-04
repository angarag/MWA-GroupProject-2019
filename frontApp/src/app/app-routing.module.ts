import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AddStaffComponent } from './admin/add-staff/add-staff.component';
import { DisplayStaffComponent } from './admin/display-staff/display-staff.component';

const routes: Routes = [
  { path:'', component: LoginComponent },
  { path:'login', component: LoginComponent },
  { path: 'addstaff', component: AddStaffComponent},
  { path: 'displaystaff', component: DisplayStaffComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
