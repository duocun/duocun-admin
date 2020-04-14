import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantPageComponent } from './merchant-page/merchant-page.component';

const routes: Routes = [
  { path: 'main', component: MerchantPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
