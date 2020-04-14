import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { AreaRoutingModule } from './area-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AreaConfigComponent } from './area-config/area-config.component';
import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';


@NgModule({
  declarations: [AreaConfigComponent],
  imports: [
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    CommonModule,
    ReactiveFormsModule,
    AreaRoutingModule,
    SharedModule
  ],
  exports: [
    AreaConfigComponent
  ]
})
export class AreaModule { }
