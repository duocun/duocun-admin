import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';

import { DriverRoutingModule } from './driver-routing.module';
import { DriverPageComponent } from './driver-page/driver-page.component';
import { DriverShiftComponent } from './driver-shift/driver-shift.component';
import { DriverHistoryComponent } from './driver-history/driver-history.component';
import { DriverSummaryComponent } from './driver-summary/driver-summary.component';
import { DriverPaymentComponent } from './driver-payment/driver-payment.component';
import { DriverSalaryComponent } from './driver-salary/driver-salary.component';
import { AssignmentService } from '../assignment/assignment.service';
import { AccountService } from '../account/account.service';
import { TransactionService } from '../transaction/transaction.service';
import { DriverHourFormComponent } from './driver-hour-form/driver-hour-form.component';
import { DriverOvertimeComponent } from './driver-overtime/driver-overtime.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegionService } from '../region/region.service';
import { DriverScheduleComponent } from './driver-schedule/driver-schedule.component';
import { MallService } from '../mall/mall.service';
import { DriverScheduleService } from './driver-schedule.service';
import { DriverScheduleSettingsComponent } from './driver-schedule-settings/driver-schedule-settings.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    DriverRoutingModule,
    SharedModule
  ],
  declarations: [DriverPageComponent, DriverShiftComponent, DriverHistoryComponent, DriverSummaryComponent,
    DriverPaymentComponent, DriverSalaryComponent, DriverHourFormComponent,
    DriverOvertimeComponent,
    DriverScheduleComponent,
    DriverScheduleSettingsComponent],
  providers: [
    AssignmentService,
    AccountService,
    TransactionService,
    RegionService,
    MallService,
    DriverScheduleService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DriverModule { }
