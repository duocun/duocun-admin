import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AssignmentService } from '../../assignment/assignment.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { IAssignment } from '../../assignment/assignment.model';
import * as moment from 'moment';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '../../../../node_modules/@angular/material';
import { ISalaryData, ITransaction } from '../../payment/payment.model';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { TransactionService } from '../../transaction/transaction.service';
import { DriverHourService } from '../driver-hour.service';
import { AccountService } from '../../account/account.service';
import { Role } from '../../account/account.model';
import { typeSourceSpan } from '../../../../node_modules/@angular/compiler';
import { IDriverHour } from '../driver.model';

@Component({
  selector: 'app-driver-salary',
  templateUrl: './driver-salary.component.html',
  styleUrls: ['./driver-salary.component.scss']
})
export class DriverSalaryComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  drivers;
  fromDriverId;
  toDriverId;
  payForm;
  overtimes;
  payments;

  displayedColumns: string[] = ['date', 'driverName', 'hours', 'nOrders', 'paid', 'current', 'balance'];
  dataSource: MatTableDataSource<ISalaryData>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private assignmentSvc: AssignmentService,
    private driverHourSvc: DriverHourService,
    private transactionSvc: TransactionService,
    private accountSvc: AccountService,
    private snackBar: MatSnackBar
  ) {
    this.payForm = this.fb.group({ amount: ['', Validators.required] });
  }

  get amount() { return this.payForm.get('amount'); }

  ngOnInit() {
    this.loadDrivers();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loadDrivers() {
    this.accountSvc.find({roles: Role.DRIVER}).pipe(takeUntil(this.onDestroy$)).subscribe((accounts) => {
      const drivers = [];
      accounts.map(account => {
        drivers.push({ id: account._id, username: account.username, assignments: [] });
      });
      this.drivers = drivers;
    });
  }

  groupBy(items, key) {
    return items.reduce((result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), {});
  }

  onFromDriverChanged(e) {
    this.fromDriverId = e.value;
  }

  onToDriverChanged(e) {
    this.toDriverId = e.value;
    const q = {accountId: this.toDriverId};
    const qTransaction = { toId: this.toDriverId, type: 'salary' };
    this.transactionSvc.quickFind(qTransaction).pipe(takeUntil(this.onDestroy$)).subscribe((ts) => {
      this.payments = ts;
      this.driverHourSvc.quickFind(q).pipe(takeUntil(this.onDestroy$)).subscribe((overtimes: IDriverHour[]) => {
        this.overtimes = overtimes;
        const q1 = {driverId: this.toDriverId};
        this.assignmentSvc.quickFind(q1).pipe(takeUntil(this.onDestroy$)).subscribe((assignments: IAssignment[]) => {
          const driver = this.drivers.find(d => d.id === this.toDriverId);
          // driver.assignments = assignments;
          driver.assignments = this.groupBy(assignments, 'delivered');
          this.reload(driver, overtimes, ts);
        });
      });
    });
  }

  reload(driver, overtimes: IDriverHour[], payments) {
    const salaryItems = [];
    const dates = Object.keys(driver.assignments);
    let balance = 0;
    const m = moment('2019-07-21');
    // load debit
    dates.map(date => {
      const assignments = driver.assignments[date];
      if (assignments && assignments.length > 0) {
        const overtime = overtimes.find(ot => ot.delivered === date); // fix me! one day pay twice
        const a = assignments[0];

        const hours = moment(a.delivered).isAfter(m) ? 1.5 : 2;

        const item = {
          date: a.delivered,
          driverId: a.driverId,
          driverName: a.driverName,
          nOrders: assignments.length,
          hours: overtime ? overtime.hours : hours,
          exception: overtime ? overtime.amount : 0,
          type: 'debit',
          extra: (moment(a.delivered).isAfter(moment('2019-08-28')) && a.code.charAt(0) === 'V') ? 10 : 0,
          paid: 0,
          balance: 0
        };
        salaryItems.push(item);
      }
    });

    // load credit
    const ps = payments.filter(t => t.toId === driver.id);
    if (ps && ps.length > 0) {
      ps.map((t: ITransaction) => {
        const item = {
          date: t.created, driverId: t.toId, driverName: t.toName,
          nOrders: 0, hours: 0,
          type: 'credit', paid: t.amount, balance: 0
        };
        salaryItems.push(item);
      });
    }

    // sort then balance
    const salaryList = salaryItems.sort((a, b) => {
      const aMoment = moment(a.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      const bMoment = moment(b.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      if (aMoment.isAfter(bMoment)) {
        return 1;
      } else if (bMoment.isAfter(aMoment)) {
        return -1;
      } else {
        if (a.type === 'debit' && b.type === 'credit') {
          return -1;
        } else {
          return 1;
        }
      }
    });

    salaryList.map(item => {
      if (item.type === 'debit') {
        const amount = (item.exception ? item.exception : item.hours * 30) + item.extra;
        item.current = amount;
        balance += amount;
      } else {
        item.current = 0;
        balance -= item.paid;
      }
      item.balance = balance;
    });

    const s = salaryList.sort((a, b) => {
      const aMoment = moment(a.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      const bMoment = moment(b.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      if (aMoment.isAfter(bMoment)) {
        return -1;
      } else if (bMoment.isAfter(aMoment)) {
        return 1;
      } else {
        if (a.type === 'debit' && b.type === 'credit') {
          return 1;
        } else {
          return -1;
        }
      }
    });

    this.toDriverId = driver.id;
    this.dataSource = new MatTableDataSource(s);
  }

  paySalary() {
    const fromDriver = this.drivers.find(d => d.id === this.fromDriverId);
    const toDriver = this.drivers.find(d => d.id === this.toDriverId);
    const amount = parseFloat(this.payForm.get('amount').value);
    const t: ITransaction = {
      fromId: fromDriver.id,
      fromName: fromDriver.username,
      toId: toDriver.id,
      toName: toDriver.username,
      amount: amount,
      type: 'salary',
      created: new Date(),
      modified: new Date()
    };

    this.transactionSvc.save(t).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      const driver = this.drivers.find(d => d.id === this.toDriverId);
      this.transactionSvc.find({ toId: this.toDriverId, type: 'salary' }).pipe(takeUntil(this.onDestroy$)).subscribe((ts) => {
        this.payments = ts;
        this.reload(driver, this.overtimes, ts);
        this.snackBar.open('', '交易已保存', { duration: 1000 });
      });
    });
  }
}
