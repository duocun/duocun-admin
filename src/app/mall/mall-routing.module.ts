import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MallPageComponent } from './mall-page/mall-page.component';

const routes: Routes = [
  { path: 'main', component: MallPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MallRoutingModule { }
