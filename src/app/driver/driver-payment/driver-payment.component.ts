

import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil, take } from '../../../../node_modules/rxjs/operators';
import { Role } from '../../account/account.model';
// import { IDriverPayment, IDriverPaymentData, IDriverBalance } from '../../payment/payment.model';
import { MatSnackBar, MatPaginator, MatSort } from '../../../../node_modules/@angular/material';
import * as moment from 'moment';

import { MatTableDataSource } from '@angular/material/table';
import { IDriverPayment, IDriverPaymentData, ITransaction, ITransactionData } from '../../payment/payment.model';
import { TransactionService } from '../../transaction/transaction.service';

@Component({
  selector: 'app-driver-payment',
  templateUrl: './driver-payment.component.html',
  styleUrls: ['./driver-payment.component.scss']
})
export class DriverPaymentComponent implements OnInit, OnDestroy {

  payments: IDriverPayment[];
  paymentDataList: IDriverPaymentData[];
  selectedPayments: IDriverPaymentData[];

  dataSource: MatTableDataSource<ITransactionData>;
  onDestroy$ = new Subject();
  account;
  alexcredits;
  displayedColumns: string[] = ['date', 'name', 'received', 'paid', 'balance'];
  drivers;
  selectedDriverId;
  transactions;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private accountSvc: AccountService,
    private transactionSvc: TransactionService,
  ) {

  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      this.account = account;
      if (account && account.roles) {
        const roles = account.roles;
        if (roles && roles.length > 0 && roles.indexOf(Role.SUPER) !== -1) {
          self.loadDrivers();
        }
      } else {

      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loadDrivers() {
    this.accountSvc.find({ roles: Role.DRIVER }).pipe(takeUntil(this.onDestroy$)).subscribe((accounts) => {
      const drivers = [];
      accounts.map(account => {
        drivers.push({ driverId: account._id, driverName: account.username, transactions: [] });
      });
      this.drivers = drivers;
    });
  }

  reload(driverId) {
    this.transactionSvc.quickFind({
      $or: [
        { fromId: driverId },
        { toId: driverId }
      ]
    }).pipe(takeUntil(this.onDestroy$)).subscribe((ts: ITransaction[]) => {
      const transactions = ts.sort((a: ITransaction, b: ITransaction) => {
        const aMoment = moment(a.created);
        const bMoment = moment(b.created);
        if (aMoment.isAfter(bMoment)) {
          return 1; // b at top
        } else if (bMoment.isAfter(aMoment)) {
          return -1;
        } else {
          if ((a.type === 'debit' || a.type === 'transfer') && b.type === 'credit') {
            return -1;
          } else {
            return 1;
          }
        }
      });

      const dataList: ITransactionData[] = [];
      let balance = 0;
      transactions.map((t: ITransaction) => {
        if (t.type === 'credit') {
          balance += t.amount;
          dataList.push({
            date: t.created, name: t.fromName, type: t.type, received: t.amount, paid: 0, balance: balance
          });
        } else if (t.type === 'debit') {
          balance -= t.amount;
          dataList.push({
            date: t.created, name: t.toName, type: t.type, received: 0, paid: t.amount, balance: balance
          });
        } else if (t.type === 'transfer') {
          if (t.fromId === driverId) {
            balance -= t.amount;
            dataList.push({
              date: t.created, name: t.toName, type: 'transfer to', received: 0, paid: t.amount, balance: balance
            });
          } else if (t.toId === driverId) {
            balance += t.amount;
            dataList.push({
              date: t.created, name: t.fromName, type: 'transfer from', received: t.amount, paid: 0, balance: balance
            });
          }
        } else if (t.type === 'salary') {
          if (t.fromId === driverId) {
            balance -= t.amount;
            dataList.push({
              date: t.created, name: t.toName, type: 'salary', received: 0, paid: t.amount, balance: balance
            });
          }
        }
      });

      dataList.sort((a: ITransactionData, b: ITransactionData) => {
        const aMoment = moment(a.date);
        const bMoment = moment(b.date);
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
      this.dataSource = new MatTableDataSource(dataList);
      this.dataSource.sort = this.sort;
    });
  }

  onDriverSelectionChanged(e) {
    const driverId = e.value;
    const driver = this.drivers.find(d => d.driverId === driverId);
    this.selectedDriverId = driverId;
    this.reload(driverId);
  }

}

