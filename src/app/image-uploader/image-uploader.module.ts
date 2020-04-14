import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderComponent } from './image-uploader.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  exports: [ImageUploaderComponent],
  declarations: [ImageUploaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageUploaderModule { }
