import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverPageComponent } from './driver-page/driver-page.component';

const routes: Routes = [
  { path: 'main', component: DriverPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
