import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { NgRedux, NgReduxModule } from '../../node_modules/@angular-redux/store';
import { rootReducer, INITIAL_STATE } from './store';
import { NavMenuListComponent } from './nav-menu-list/nav-menu-list.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AccountService } from './account/account.service';

const appRoutes: Routes = [
  // {
  //   path: 'contact',
  //   loadChildren: './contact/contact.module#ContactModule'
  // },
  {
    path: 'image-uploader',
    loadChildren: './image-uploader/image-uploader.module#ImageUploaderModule'
  },
  {
    path: 'account',
    loadChildren: './account/account.module#AccountModule'
  },
  {
    path: 'shared',
    loadChildren: './shared/shared.module#SharedModule'
  },
  {
    path: 'area',
    loadChildren: './area/area.module#AreaModule'
  },
  {
    path: 'assignment',
    loadChildren: './assignment/assignment.module#AssignmentModule'
  },
  {
    path: 'driver',
    loadChildren: './driver/driver.module#DriverModule'
  },
  {
    path: 'picture',
    loadChildren: './picture/picture.module#PictureModule'
  },
  {
    path: 'category',
    loadChildren: './category/category.module#CategoryModule'
  },
  {
    path: 'product',
    loadChildren: './product/product.module#ProductModule'
  },
  {
    path: 'mall',
    loadChildren: './mall/mall.module#MallModule'
  },
  {
    path: 'main',
    loadChildren: './main/main.module#MainModule'
  },
  {
    path: 'order',
    loadChildren: './order/order.module#OrderModule'
  },
  {
    path: 'region',
    loadChildren: './region/region.module#RegionModule'
  },
  {
    path: 'payment',
    loadChildren: './payment/payment.module#PaymentModule'
  },
  {
    path: 'client',
    loadChildren: './client/client.module#ClientModule'
  },
  {
    path: 'merchant',
    loadChildren: './merchant/merchant.module#MerchantModule'
  },
  {
    path: 'tools',
    loadChildren: './tools/tools.module#ToolsModule'
  },
  {
    path: '',
    loadChildren: './main/main.module#MainModule'
  },
];


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavMenuListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserAnimationsModule,
    NgReduxModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [AccountService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<any>) {
      ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
