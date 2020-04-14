import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDatepickerInputEvent } from '../../../../node_modules/@angular/material';
import * as moment from 'moment';
import { AssignmentService } from '../../assignment/assignment.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { IAssignment } from '../../assignment/assignment.model';

@Component({
  selector: 'app-driver-history',
  templateUrl: './driver-history.component.html',
  styleUrls: ['./driver-history.component.scss']
})
export class DriverHistoryComponent implements OnInit, OnDestroy {
  date;
  deliverTime;
  onDestroy$ = new Subject();
  byDeliveryDate;

  constructor(
    private assignmentSvc: AssignmentService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    const startDate = moment(event.value);
    this.date.setValue(startDate);
    this.deliverTime = startDate.set({ hour: 11, minute: 45, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
    // this.range = this.getDeliveryTimeRange(startDate);
    // this.reload(this.range);
    // this.delivered = startDate.set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    // this.updateMerchantCredits(startDate.add(-1, 'days'));

    this.reload();
  }

  reload() {
    this.assignmentSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((assignments: IAssignment[]) => {
      const byDeliveryDate = [];
      assignments.map((a: IAssignment) => {
        const item = byDeliveryDate.find(x => x.delivered === a.delivered);
        if (!item) {
          byDeliveryDate.push({ delivered: a.delivered, drivers: [{ id: a.driverId, name: a.driverName, nOrders: 0 }] });
        } else {
          const driver = item.drivers.find(d => d._id === a.driverId);
          if (driver) {
            driver.nOrders += 1;
          } else {
            item.drivers.push({ id: a.driverId, name: a.driverName, nOrders: 0 });
          }
        }
      });
      this.byDeliveryDate = byDeliveryDate;
    });
  }
}
