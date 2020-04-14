import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '../../../node_modules/@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { PaymentRoutingModule } from './payment-routing.module';
import { DriverBalanceComponent } from './driver-balance/driver-balance.component';
import { DriverShiftComponent } from './driver-shift/driver-shift.component';
import { OrderService } from '../order/order.service';
import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { MerchantPaymentService } from './merchant-payment.service';
import { DriverPaymentService } from './driver-payment.service';
import { ClientPaymentService } from './client-payment.service';
import { TransferComponent } from './transfer/transfer.component';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { DriverTransferComponent } from './driver-transfer/driver-transfer.component';
import { PaymentAdjustComponent } from './payment-adjust/payment-adjust.component';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatSelectModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSnackBarModule,
    PaymentRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    OrderService,
    ClientPaymentService,
    MerchantPaymentService,
    DriverPaymentService,
  ],
  declarations: [
    DriverBalanceComponent,
    DriverShiftComponent,
    TransferComponent,
    PaymentPageComponent,
    DriverTransferComponent,
    PaymentAdjustComponent,
  ],
  exports: [
  ]
})
export class PaymentModule { }
