import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsPageComponent } from './tools-page/tools-page.component';

const routes: Routes = [{
  path: 'main', component: ToolsPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
