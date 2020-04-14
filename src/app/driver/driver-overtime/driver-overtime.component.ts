import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as moment from 'moment';
import { DriverHourService } from '../driver-hour.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { IAssignment } from '../../assignment/assignment.model';
import { AssignmentService } from '../../assignment/assignment.service';
import { ISalaryData } from '../../payment/payment.model';
import { IDriverHour } from '../driver.model';

@Component({
  selector: 'app-driver-overtime',
  templateUrl: './driver-overtime.component.html',
  styleUrls: ['./driver-overtime.component.scss']
})
export class DriverOvertimeComponent implements OnInit, OnDestroy {
  form;
  onDestroy$ = new Subject();
  drivers;
  selectedDriver;
  selectedDriverId;
  rows;

  displayedColumns: string[] = ['delivered', 'accountName', 'amount', 'hours'];
  dataSource: MatTableDataSource<IDriverHour>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private driverHourSvc: DriverHourService,
    private assignmentSvc: AssignmentService
  ) {
    this.form = this.fb.group({
      hours: ['', Validators.required],
      amount: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  get hours() { return this.form.get('hours'); }
  get amount() { return this.form.get('amount'); }
  get date() { return this.form.get('date'); }

  ngOnInit() {
    const drivers = [];
    this.assignmentSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((assignments) => {
      assignments.map((a: IAssignment) => {
        const driver = drivers.find(d => d.driverId === a.driverId);
        if (driver) {
          driver.assignments.push(a);
        } else {
          drivers.push({ driverId: a.driverId, driverName: a.driverName, hours: 2, assignments: [a] });
        }
      });
      this.drivers = drivers;
    });

    this.reload();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    // const deliveryDate = moment(event.value).set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    // this.date.setValue(deliveryDate);

    // this.reloadAssignments(deliveryDate);
  }

  onDriverSelectionChanged(e) {
    const driverId = e.value;
    this.selectedDriver = this.drivers.find(d => d.driverId === driverId);
    this.selectedDriverId = driverId;
    this.reload();
  }

  reload() {
    this.driverHourSvc.quickFind().pipe(takeUntil(this.onDestroy$)).subscribe((hours: IDriverHour[]) => {
      this.rows = hours;

      const salaryList = hours.sort((a, b) => {
        const aMoment = moment(a.delivered).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const bMoment = moment(b.delivered).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        if (aMoment.isAfter(bMoment)) {
          return -1;
        }
      });

      this.dataSource = new MatTableDataSource(salaryList);
    });
  }

  onSubmit() {
    let amount = this.form.value.amount;
    let hours = this.form.value.hours;
    const date = this.form.value.date;

    if (amount) {
      amount = amount ? +amount : 0;
    }

    if (hours) {
      hours = hours ? +hours : 0;
    }

    const updates = {
      accountId: this.selectedDriver.driverId,
      accountName: this.selectedDriver.driverName,
      delivered: date.set({ hour: 11, minute: 45, second: 0, millisecond: 0 }).toDate(),
      created: date.toDate(),
      hours: Math.round(hours * 100) / 100,
      amount: Math.round(amount * 100) / 100
    };

    this.driverHourSvc.update({created: date.toDate()}, updates, {upsert: true}).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      this.reload();
    });
  }
}
