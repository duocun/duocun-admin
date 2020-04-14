import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';
import { DriverHourService } from '../driver-hour.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { IAssignment } from '../../assignment/assignment.model';
import { AssignmentService } from '../../assignment/assignment.service';

@Component({
  selector: 'app-driver-hour-form',
  templateUrl: './driver-hour-form.component.html',
  styleUrls: ['./driver-hour-form.component.scss']
})
export class DriverHourFormComponent implements OnInit, OnDestroy {
  form;
  onDestroy$ = new Subject();
  drivers;
  selectedDriver;
  selectedDriverId;

  constructor(
    private fb: FormBuilder,
    private driverHourSvc: DriverHourService,
    private assignmentSvc: AssignmentService
  ) {
    this.form = this.fb.group({
      hours: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  get hours() { return this.form.get('hours'); }
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
    this.selectedDriverId = this.selectedDriver.driverId;
    // this.reload();
  }

  // reload(driverId) {
  //   const driver = this.drivers.find(d => d.driverId === driverId);
  //   const salaryItems = [];
  //   const dates = Object.keys(driver.assignments);
  //   let balance = 0;
  //   dates.map(date => {
  //     const assignments = driver.assignments[date];
  //     if (assignments && assignments.length > 0) {
  //       balance += 2 * 30;
  //       const a = assignments[0];
  //       salaryItems.push({ date: a.delivered, driverId: a.driverId, driverName: a.driverName,
  //         nOrders: assignments.length, hours: 2, balance: balance });
  //     }
  //   });
  //   this.selectedDriver = driver;
  //   this.dataSource = new MatTableDataSource(salaryItems);
  // }
  onSubmit() {
    let hours = this.form.value.hours;
    const date = this.form.value.date;

    if (hours) {
      hours = parseFloat(hours);
    }

    const updates = {
      driverId: this.selectedDriver.driverId,
      driverName: this.selectedDriver.driverName,
      created: date.toDate(), hours: hours
    };

    this.driverHourSvc.update({created: date.toDate(), driverId: this.selectedDriver.driverId},
      updates, {upsert: true}).pipe(takeUntil(this.onDestroy$)).subscribe(x => {

    });
  }
}
