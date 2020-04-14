import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsPageComponent } from './tools-page/tools-page.component';
import { DriverPaymentService } from '../payment/driver-payment.service';
import { TransactionService } from '../transaction/transaction.service';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { OrderTrendComponent } from './order-trend/order-trend.component';
import { ClientBalanceComponent } from './client-balance/client-balance.component';
import { RegionBuilderComponent } from './region-builder/region-builder.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { CategoryService } from '../category/category.service';
import { Product } from '../product/product.model';
import { ContactService } from '../contact/contact.service';
import { MerchantService } from '../merchant/merchant.service';
import { AccountService } from '../account/account.service';
import { DistanceService } from '../distance/distance.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToolsRoutingModule,
    ChartsModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatTabsModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
  ],
  declarations: [ToolsPageComponent, OrderTrendComponent, ClientBalanceComponent, RegionBuilderComponent],
  providers: [
    DriverPaymentService,
    TransactionService,
    OrderService,
    ProductService,
    CategoryService,
    ContactService,
    MerchantService,
    AccountService,
    DistanceService
  ]
})
export class ToolsModule { }
