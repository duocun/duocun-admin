import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantPageComponent } from './merchant-page/merchant-page.component';
import { MerchantPaymentComponent } from './merchant-payment/merchant-payment.component';
import { MerchantSettingComponent } from './merchant-setting/merchant-setting.component';
import { OrderService } from '../order/order.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MerchantScheduleComponent } from './merchant-schedule/merchant-schedule.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatTabsModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MerchantRoutingModule,
    ReactiveFormsModule,
    MatButtonToggleModule
  ],
  declarations: [
    MerchantPageComponent,
    MerchantPaymentComponent,
    MerchantSettingComponent,
    MerchantScheduleComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    OrderService
  ]
})
export class MerchantModule { }
