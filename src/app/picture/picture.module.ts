import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PictureRoutingModule } from './picture-routing.module';
import { PicturePageComponent } from './picture-page/picture-page.component';
import { ImageUploaderModule } from '../image-uploader/image-uploader.module';

@NgModule({
  imports: [
    CommonModule,
    PictureRoutingModule,
    ImageUploaderModule
  ],
  declarations: [PicturePageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [PicturePageComponent]
})
export class PictureModule { }
