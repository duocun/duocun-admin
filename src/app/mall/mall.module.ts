import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MallRoutingModule } from './mall-routing.module';
import { MallListComponent } from './mall-list/mall-list.component';
import { MallFormComponent } from './mall-form/mall-form.component';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { MallPageComponent } from './mall-page/mall-page.component';
import { MallScheduleComponent } from './mall-schedule/mall-schedule.component';
import { MallService } from './mall.service';
import { MallScheduleService } from './mall-schedule.service';
import { RegionService } from '../region/region.service';
import { RegionGroupComponent } from './region-group/region-group.component';
import { AreaModule } from '../area/area.module';
import { OrderService } from '../order/order.service';
import { AreaService } from '../area/area.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MallRoutingModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatTabsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatExpansionModule,
    AreaModule
  ],
  declarations: [
    MallListComponent,
    MallFormComponent,
    MallPageComponent,
    MallScheduleComponent,
    RegionGroupComponent,
  ],
  exports: [
    MallPageComponent
  ],
  providers: [
    MallService,
    MallScheduleService,
    RegionService,
    OrderService,
    AreaService
  ]
})
export class MallModule { }
