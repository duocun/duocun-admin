import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../transaction/transaction.service';
import { MatTableDataSource } from '@angular/material';
import { ITransaction } from '../payment.model';
import { FormControl, FormBuilder } from '@angular/forms';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-adjust',
  templateUrl: './payment-adjust.component.html',
  styleUrls: ['./payment-adjust.component.scss']
})
export class PaymentAdjustComponent implements OnInit {

  datalist: Array<any> = [];
  dataSource: MatTableDataSource<ITransaction>;
  onDestroy$ = new Subject();
  form;
  nameCtrl;
  names: string[] = [];
  filteredNameOptions: Observable<string[]>;
  displayedColumns: string[] = ['created', 'fromName', 'toName', 'amount'];

  constructor(
    private fb: FormBuilder,
    private transactionSvc: TransactionService,
  ) {
    this.nameCtrl = new FormControl();
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.reload();
  }

  reload() {
    let d = new Date();
    d.setDate(d.getDate() - 14);  // two weeks

    this.transactionSvc.find({
      type: 'transfer',
      created: { $gte: d.toISOString() }
    }).pipe(takeUntil(this.onDestroy$)).subscribe(ts => {
      ts.sort((a, b) => {
        const aMoment = moment(a.created);
        const bMoment = moment(b.created);
        if (aMoment.isAfter(bMoment)) {
          return -1;
        } else {
          return 1;
        }
      });
      this.datalist = ts;

      let obj = {};
      ts.map(item => {
        item.sum = item.amount;
        obj[item.fromName] = true;
        obj[item.toName] = true;
      });
      this.names = Object.keys(obj);

      this.filteredNameOptions = this.nameCtrl.valueChanges.pipe(
        startWith(''),
        map((value: string) => this._filter(value))
      );

      this.dataSource = new MatTableDataSource(ts);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.names.filter(option => option.toLowerCase().includes(filterValue));
  }

  onFilterChange(val) {
    if (!val)
      this.dataSource = new MatTableDataSource(this.datalist);

    let ts = [];
    this.datalist.map(item => {
      if (item.fromName.indexOf(val) != -1)
        ts.push(item);
      else if (item.toName.indexOf(val) != -1)
        ts.push(item);
    });

    this.dataSource = new MatTableDataSource(ts);
  }

  onInput(event, row) {
    row.sum = event.target.value;
    row.changed = true;
  }

  onModify(row) {
    if (!row.sum) {
      alert('please input the amount.');
      return;
    }
    if (row.amount != row.sum)
      this.transactionSvc.update({ id: row.id }, { amount: row.sum, modified: new Date() })
      .pipe(takeUntil(this.onDestroy$)).subscribe(ts => {
        row.changed = false;
        row.amount = row.sum;
      });
    else
      row.changed = false;
  }
}
