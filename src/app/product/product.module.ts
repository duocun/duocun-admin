import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { ImageUploaderModule } from '../image-uploader/image-uploader.module';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../category/category.service';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    ImageUploaderModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [
    ProductFormComponent,
    ProductPageComponent,
    ProductListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    ProductPageComponent,
    ProductListComponent
  ],
  providers: [
    CategoryService
  ]
})
export class ProductModule { }
