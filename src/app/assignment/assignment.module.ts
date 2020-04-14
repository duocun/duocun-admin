import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ReactiveFormsModule, FormsModule } from '../../../node_modules/@angular/forms';

import { AssignmentRoutingModule } from './assignment-routing.module';
import { AssignmentPageComponent } from './assignment-page/assignment-page.component';
import { AssignmentMapComponent } from './assignment-map/assignment-map.component';
import { SharedModule } from '../shared/shared.module';
import { OrderService } from '../order/order.service';
import { DriverAssignmentComponent } from './driver-assignment/driver-assignment.component';
import { MallService } from '../mall/mall.service';
import { RegionService } from '../region/region.service';
import { DriverService } from '../driver/driver.service';
import { MerchantService } from '../merchant/merchant.service';
import { SharedService } from '../shared/shared.service';

@NgModule({
  imports: [
    CommonModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    AssignmentRoutingModule,
    SharedModule
  ],
  declarations: [AssignmentPageComponent, AssignmentMapComponent, DriverAssignmentComponent],
  exports: [AssignmentMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    OrderService,
    MallService,
    RegionService,
    DriverService,
    MerchantService,
    SharedService
  ]
})
export class AssignmentModule { }
