import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './home/home.component';
import { ProductModule } from '../product/product.module';
import { PictureModule } from '../picture/picture.module';
import { OrderModule } from '../order/order.module';
import { MallModule } from '../mall/mall.module';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    MatTabsModule,
    MatSnackBarModule,
    ProductModule,
    PictureModule,
    OrderModule,
    MallModule
  ],
  declarations: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule { }
