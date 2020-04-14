import { Component, OnInit, OnDestroy } from '@angular/core';
import { DriverShiftService } from '../driver-shift.service';
import { Subject } from '../../../../node_modules/rxjs';
import { DriverService } from '../driver.service';

@Component({
  selector: 'app-driver-page',
  templateUrl: './driver-page.component.html',
  styleUrls: ['./driver-page.component.scss']
})
export class DriverPageComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  constructor(
    private driverSvc: DriverService,
    private shiftSvc: DriverShiftService
  ) {
    // this.driverSvc
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
