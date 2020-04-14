import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil, take } from '../../../../node_modules/rxjs/operators';
import { Role } from '../../account/account.model';
import { IMerchantPayment, IMerchantPaymentData, IMerchantBalance } from '../../payment/payment.model';
import { MatPaginator, MatSort } from '../../../../node_modules/@angular/material';
import { Restaurant, IRestaurant } from '../../merchant/restaurant.model';
import { RestaurantService } from '../../merchant/restaurant.service';
import * as moment from 'moment';

import { MatTableDataSource } from '@angular/material/table';
import { TransactionService } from '../../transaction/transaction.service';
import { OrderService } from '../../order/order.service';
import { IOrder } from '../../order/order.model';

@Component({
  selector: 'app-merchant-payment',
  templateUrl: './merchant-payment.component.html',
  styleUrls: ['./merchant-payment.component.scss']
})
export class MerchantPaymentComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  credits: IMerchantPayment[];
  account;
  debits: IMerchantPayment[];
  selectedMerchant: IRestaurant;
  alexcredits;

  receivables = [];
  merchants = [];

  displayedColumns: string[] = ['date', 'merchantName', 'driverName', 'receivable', 'paid', 'balance'];

  payments: IMerchantPaymentData[];
  selectedPayments: IMerchantPaymentData[];
  balances: IMerchantBalance[] = [];

  dataSource: MatTableDataSource<IMerchantPaymentData>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Input() restaurant: Restaurant;

  constructor(
    private accountSvc: AccountService,
    private transactionSvc: TransactionService,
    private restaurantSvc: RestaurantService,
    private orderSvc: OrderService
  ) {
  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      this.account = account;
      if (account && account.roles) {
        const roles = account.roles;
        if (roles && roles.length > 0 && roles.indexOf(Role.SUPER) !== -1) {
          self.loadMerchants();
        }
      } else {

      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loadMerchants() {
    this.restaurantSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(rs => {
      const ms = [];
      rs.map((r: IRestaurant) => {
        ms.push({ merchantId: r._id, merchantName: r.name });
      });
      this.merchants = ms;
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

  reload(merchantId: string) {
    const merchant = this.merchants.find(m => m.merchantId === merchantId);
    const debitQuery = { type: 'debit', toId: merchantId };
    this.transactionSvc.quickFind(debitQuery).pipe(takeUntil(this.onDestroy$)).subscribe(ts => {
      const orderQuery = {merchantId: merchantId, status: {$nin: ['del', 'tmp']}};
      this.orderSvc.quickFind(orderQuery).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
        const receivables = this.groupBy(orders, 'delivered');
        const payments: IMerchantPaymentData[] = [];
        Object.keys(receivables).map(date => {
          const os = receivables[date];
          let amount = 0;
          os.map(order => { amount += order.cost; });
          payments.push({
            date: date, receivable: amount, paid: 0, balance: 0, type: 'credit',
            merchantId: merchantId, merchantName: merchant.merchantName, driverName: ''
          });
        });

        ts.map(t => {
          payments.push({
            date: t.created, receivable: 0, paid: t.amount, balance: 0, type: 'debit',
            merchantId: t.toId, merchantName: t.toName, driverName: t.fromName
          });
        });

        const ps = payments.sort((a: IMerchantPaymentData, b: IMerchantPaymentData) => {
          const aMoment = moment(a.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          const bMoment = moment(b.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          if (aMoment.isAfter(bMoment)) {
            return 1;
          } else if (bMoment.isAfter(aMoment)) {
            return -1;
          } else {
            if (a.type === 'debit') {
              return 1;
            } else {
              return -1;
            }
          }
        });

        let balance = 0;
        ps.map(p => {
          if (p.type === 'credit') {
            balance += p.receivable;
          } else {
            balance -= p.paid;
          }
          p.balance = balance;
        });

        this.payments = ps.sort((a: IMerchantPaymentData, b: IMerchantPaymentData) => {
          const aMoment = moment(a.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          const bMoment = moment(b.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          if (aMoment.isAfter(bMoment)) {
            return -1;
          } else if (bMoment.isAfter(aMoment)) {
            return 1;
          } else {
            if (a.type === 'debit') {
              return -1;
            } else {
              return 1;
            }
          }
        });

        this.dataSource = new MatTableDataSource(payments);
        this.dataSource.sort = this.sort;
      });
    });
  }

  onMerchantSelectionChanged(e) {
    const merchantId = e.value;
    this.reload(merchantId);
  }
}

