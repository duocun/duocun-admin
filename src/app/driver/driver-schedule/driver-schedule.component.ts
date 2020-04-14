import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { FormBuilder } from '../../../../node_modules/@angular/forms';
import { MallService } from '../../mall/mall.service';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '../../../../node_modules/@angular/material';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { IMall } from '../../mall/mall.model';
import { MerchantService } from '../../merchant/merchant.service';
import { IRestaurant } from '../../merchant/restaurant.model';

@Component({
  selector: 'app-driver-schedule',
  templateUrl: './driver-schedule.component.html',
  styleUrls: ['./driver-schedule.component.scss']
})
export class DriverScheduleComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  groupedAssignments = [];
  malls;
  dateForm;
  delivered;


  constructor(
    private fb: FormBuilder,
    private mallSvc: MallService,
    private merchantSvc: MerchantService
  ) {

  }

  get date() { return this.dateForm.get('date'); }

  ngOnInit() {
    this.dateForm = this.fb.group({ date: [''] });
    // this.delivered = moment().set({ hour: 11, minute: 45, second: 0, millisecond: 0 }); //  default time
    // this.phase = 'p1';
    this.reloadMalls();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  reloadMalls() {
    this.mallSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((ms: IMall[]) => {
      this.malls = ms;
    });
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    const startDate = moment(event.value);
    this.date.setValue(startDate);
    this.delivered = startDate.set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    // if (this.phase === 'p2') {
    //   this.delivered = this.delivered.set({ hour: 14, minute: 0, second: 0, millisecond: 0 });
    // } else {
    //   this.delivered = this.delivered.set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    // }
  }

  onSelectTime(e) {
    // this.phase = e.value;
    // if (this.phase) {
    //   if (this.phase === 'p2') {
    //     this.delivered = this.delivered.set({ hour: 14, minute: 0, second: 0, millisecond: 0 });
    //   } else {
    //     this.delivered = this.delivered.set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    //   }
    //   this.reloadMalls(this.phase);
    // } else {
    //   this.phase = 'p1';
    //   this.delivered = this.delivered.set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    //   this.reloadMalls(this.phase);
    // }
  }
}
