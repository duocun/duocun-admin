import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MerchantScheduleService } from '../merchant-schedule.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { MerchantService } from '../merchant.service';
import { MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-merchant-schedule',
  templateUrl: './merchant-schedule.component.html',
  styleUrls: ['./merchant-schedule.component.scss']
})
export class MerchantScheduleComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  displayedColumns: string[] = ['name', 'pickupTime', 'startTime', 'endTime', 'status', 'id'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private merchantScheduleSvc: MerchantScheduleService,
    private merchantSvc: MerchantService
  ) {

  }

  ngOnInit() {
    this.merchantSvc.find({status: 'active'}).pipe(takeUntil(this.onDestroy$)).subscribe(m => {
      // this.merchantScheduleSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(x => {

      // });
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
