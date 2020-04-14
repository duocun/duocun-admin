import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionPageComponent } from './region-page/region-page.component';

const routes: Routes = [
  {path: 'main', component: RegionPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionRoutingModule { }
