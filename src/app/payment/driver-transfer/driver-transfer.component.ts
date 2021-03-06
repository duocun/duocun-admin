import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { takeUntil, map, startWith } from '../../../../node_modules/rxjs/operators';
import { Subject, Observable } from '../../../../node_modules/rxjs';
import { Role, IAccount } from '../../account/account.model';
import { FormBuilder, Validators, FormControl } from '../../../../node_modules/@angular/forms';
import { TransactionService } from '../../transaction/transaction.service';
import { now } from '../../../../node_modules/moment';
import { ITransaction, ITransactionData } from '../payment.model';
import { MatTableDataSource, MatSort, MatSnackBar } from '../../../../node_modules/@angular/material';
import * as moment from 'moment';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-driver-transfer',
  templateUrl: './driver-transfer.component.html',
  styleUrls: ['./driver-transfer.component.scss']
})
export class DriverTransferComponent implements OnInit {
  onDestroy$ = new Subject();
  accounts;
  fromId;
  toId;
  form;
  filteredFromOptions: Observable<IAccount[]>;
  filteredToOptions: Observable<IAccount[]>;
  fromCtrl;
  toCtrl;

  displayedColumns: string[] = ['created', 'fromName', 'toName', 'amount', 'id'];
  dataSource: MatTableDataSource<ITransaction>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private accountSvc: AccountService,
    private transactionSvc: TransactionService,
    private snackBar: MatSnackBar
  ) {
    this.fromCtrl = new FormControl();
    this.toCtrl = new FormControl();

    this.form = this.fb.group({
      amount: ['', Validators.required]
    });
  }

  ngOnInit() {
    const query = { roles: Role.DRIVER };
    this.accountSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe(accounts => {
      this.accounts = accounts;
      this.reload();

      this.filteredFromOptions = this.fromCtrl.valueChanges.pipe(
        startWith(''),
        map((username: string) => username ? this._filter(username) : accounts.slice())
      );

      this.filteredToOptions = this.toCtrl.valueChanges.pipe(
        startWith(''),
        map((username: string) => username ? this._filter(username) : accounts.slice())
      );
    });
  }

  private _filter(v: any): IAccount[] {
    if (v) {
      const filterValue = typeof v === 'string' ? v.toLowerCase() : v.username.toLowerCase();

      return this.accounts.filter(option => option.username.toLowerCase().indexOf(filterValue) !== -1);
    } else {
      return [];
    }
  }

  displayFromFn = (c?: IAccount) => {
    if (c) {
      this.fromId = c._id;
    }
    return c ? c.username : undefined;
  }

  displayToFn = (c?: IAccount) => {
    if (c) {
      this.toId = c._id;
    }
    return c ? c.username : undefined;
  }

  get amount() { return this.form.get('amount'); }

  onSubmit() {
    const today = new Date();
    const from = this.accounts.find(d => d._id === this.fromId);
    const to = this.accounts.find(d => d._id === this.toId);
    const amount = Math.round((+this.amount.value) * 100) / 100;
    const t: ITransaction = {
      fromId: this.fromId,
      fromName: from.username,
      toId: this.toId,
      toName: to.username,
      amount: amount,
      type: 'transfer',
      created: today,
      modified: today
    };

    this.transactionSvc.save(t).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      this.snackBar.open('', '交易已添加', { duration: 1300 });
      this.reload();
    });
  }

  onRemove(t) {
    this.transactionSvc.remove({ id: t._id }).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      this.snackBar.open('', '交易已删除', { duration: 1300 });
      this.reload();
    });
  }

  onFromDriverChanged(e) {
    this.fromId = e.value;
  }

  onToDriverChanged(e) {
    this.toId = e.value;
  }

  // date: Date;
  // received: number;
  // paid: number;
  // balance: number;
  // type: string; // credit is from, debit is to
  // id?: string;
  // name?: string;
  reload() {
    this.transactionSvc.find({ type: 'transfer' }).pipe(takeUntil(this.onDestroy$)).subscribe(ts => {
      ts.sort((a, b) => {
        const aMoment = moment(a.created);
        const bMoment = moment(b.created);
        if (aMoment.isAfter(bMoment)) {
          return -1;
        } else {
          return 1;
        }
      });

      this.dataSource = new MatTableDataSource(ts);
    });
  }
}
