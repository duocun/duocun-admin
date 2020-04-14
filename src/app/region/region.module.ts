import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';

import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';

import { RegionRoutingModule } from './region-routing.module';
import { RegionPageComponent } from './region-page/region-page.component';
import { SharedModule } from '../shared/shared.module';
import { RegionMapComponent } from './region-map/region-map.component';
import { RegionFormComponent } from './region-form/region-form.component';
import { RegionConfigComponent } from './region-config/region-config.component';
import { AssignmentModule } from '../assignment/assignment.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatMomentDateModule,
    MatDatepickerModule,
    RegionRoutingModule,
    SharedModule,
    AssignmentModule
  ],
  declarations: [
    RegionPageComponent,
    RegionMapComponent,
    RegionFormComponent,
    RegionConfigComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegionModule { }
