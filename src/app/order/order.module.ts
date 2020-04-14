import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderPackComponent } from './order-pack/order-pack.component';
import { SettlementComponent } from './settlement/settlement.component';
import { PackagePageComponent } from './package-page/package-page.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { SettlementPageComponent } from './settlement-page/settlement-page.component';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

import { SharedService } from '../shared/shared.service';
import { OrderService } from './order.service';
// import { MatNativeDateModule } from '../../../node_modules/@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OrderPageComponent } from './order-page/order-page.component';
import { OrderAssignmentComponent } from './order-assignment/order-assignment.component';
import { OrderMapComponent } from './order-map/order-map.component';
import { ManualAssignComponent } from './manual-assign/manual-assign.component';
import { AutoAssignComponent } from './auto-assign/auto-assign.component';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { MerchantService } from '../merchant/merchant.service';
import { ProductModule } from '../product/product.module';
import { DriverService } from '../driver/driver.service';
import { OrderPhaseComponent } from './order-phase/order-phase.component';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatExpansionModule,
    MatSnackBarModule,
    // MatNativeDateModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    ProductModule,
    SharedModule
  ],
  declarations: [
    OrderHistoryComponent,
    OrderSummaryComponent,
    OrderPackComponent,
    SettlementComponent,
    SummaryPageComponent,
    PackagePageComponent,
    SettlementPageComponent,
    OrderPageComponent,
    OrderAssignmentComponent,
    OrderMapComponent,
    ManualAssignComponent,
    AutoAssignComponent,
    OrderDetailComponent,
    OrderFormComponent,
    OrderPhaseComponent
  ],
  exports: [
    SummaryPageComponent,
    PackagePageComponent,
    SettlementPageComponent,
    OrderSummaryComponent,
    OrderPackComponent,
    OrderPageComponent
  ],
  providers: [
    SharedService,
    OrderService,
    MerchantService,
    DriverService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderModule { }
