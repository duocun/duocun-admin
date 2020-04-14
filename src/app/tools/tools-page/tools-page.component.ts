import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ClientPaymentService } from '../../payment/client-payment.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { DriverPaymentService } from '../../payment/driver-payment.service';
import { DriverBalanceService } from '../../payment/driver-balance.service';
import { MerchantPaymentService } from '../../payment/merchant-payment.service';
import { IDriverPayment, ITransaction, IClientBalance } from '../../payment/payment.model';
import { TransactionService } from '../../transaction/transaction.service';
import * as moment from 'moment';
import { OrderService } from '../../order/order.service';
import { ProductService } from '../../product/product.service';
import { IOrder } from '../../order/order.model';
import { ClientBalanceService } from '../../payment/client-balance.service';


import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-tools-page',
  templateUrl: './tools-page.component.html',
  styleUrls: ['./tools-page.component.scss']
})
export class ToolsPageComponent implements OnInit {

  @ViewChild('donut', { static: true }) donut: ElementRef;

  onDestroy$ = new Subject();
  dps = [];
  mps = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = []; // ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: '' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor(
    private clientPaymentSvc: ClientPaymentService,
    private clientBalanceSvc: ClientBalanceService,
    private merchantPaymentSvc: MerchantPaymentService,
    private driverPaymentSvc: DriverPaymentService,
    private driverBalanceSvc: DriverBalanceService,
    private transactionSvc: TransactionService,
    private orderSvc: OrderService,
    private productSvc: ProductService
  ) { }
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
  }


  ngOnInit() {
    const query = { delivered: { $gt: moment('2019-06-01').toDate() }, status: { $nin: ['bad', 'del', 'tmp'] } };
    this.orderSvc.quickFind(query).pipe(takeUntil(this.onDestroy$)).subscribe(orders => {
      const group = this.groupBy(orders, 'delivered');
      const keys = Object.keys(group);
      const vals = [];
      keys.map(key => {
        vals.push(group[key] ? group[key].length : 0);
      });

      this.barChartLabels = keys;
      this.barChartData = [{ data: vals, label: '订单数' }];

    });
  }

  groupBy(items: any[], key: string) {
    const groups = items.reduce((result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), {});

    Object.keys(groups).map(k => {
      if (k === 'undefined') {
        delete groups[key];
      }
    });

    return groups;
  }

  // step 1
  // patchDriverToMerchantPayment() {
  //   const query = { driverId: { $exists: false }, type: 'debit' };
  //   this.merchantPaymentSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe((mps) => {
  //     const debits = [];
  //     mps.map(debit => {
  //       debits.push({ query: { id: debit._id }, data: { driverId: debit.accountId, driverName: debit.accountName } });
  //     });
  //     this.merchantPaymentSvc.bulkUpdate({ data: debits }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
  //     });
  //   });
  // }

  // step 3
  // rebuildDriverBalances() {
  //   this.merchantPaymentSvc.find({ type: 'debit' }).pipe(takeUntil(this.onDestroy$)).subscribe(mps => {
  //     this.driverPaymentSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(dps => {
  //       this.dps = dps;
  //       this.mps = mps;
  //       this.driverPaymentSvc.find(null, { distinct: 'driverId' }).pipe(takeUntil(this.onDestroy$)).subscribe(driverIds => {
  //         const bs = [];
  //         driverIds.map(id => {
  //           const receivedList = this.dps.filter(p => p.driverId === id);
  //           const paidList = this.mps.filter(m => m.driverId === id);

  //           if (receivedList && receivedList.length > 0) {
  //             let balance = 0;
  //             receivedList.map(p => {
  //               if (p.type === 'credit') { // client payment
  //                 balance += p.amount;
  //               } else {
  //                 balance -= p.amount;
  //               }
  //             });

  //             paidList.map(p => {
  //               balance -= p.amount;
  //             });

  //             bs.push({
  //               driverId: id,
  //               driverName: receivedList[0].driverName,
  //               amount: balance,
  //               created: new Date(),
  //               modified: new Date()
  //             });
  //           }
  //         });

  //         this.driverBalanceSvc.remove({}).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
  //           this.driverBalanceSvc.insertMany(bs).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

  //           });
  //         });
  //       });
  //     });
  //   });
  // }

  // only can be run at 14:00 to 17:00 ?
  // rebuildClientBalances() {
  //   const orderQuery = {
  //     status: { $nin: ['bad', 'del', 'tmp'] },
  //     // delivered: { $lt: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate() } // fix me
  //   };

  //   const transactionQuery = {
  //     type: 'credit',
  //     // created: { $lt: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate() } // fix me
  //   };

  //   this.orderSvc.quickFind(orderQuery).pipe(takeUntil(this.onDestroy$)).subscribe((os: IOrder[]) => {
  //     // 1. get all the clients
  //     const clients = [];
  //     os.map(order => {
  //       const cs = clients.filter(c => c._id === order.client.accountId);
  //       if (!(cs && cs.length > 0)) {
  //         clients.push({ id: order.client.accountId, name: order.client.username });
  //       }
  //     });

  //     this.transactionSvc.find(transactionQuery).pipe(takeUntil(this.onDestroy$)).subscribe(ts => {
  //       this.clientBalanceSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(cbs => {

  //         clients.map(c => {
  //           // 2. get debit and credit
  //           const orders = os.filter(order => order.client.accountId === c._id);
  //           const transactions = ts.filter(t => t.fromId === c._id);
  //           let list = [];
  //           let balance = 0;
  //           transactions.map(t => {
  //             list.push({ date: t.created, type: 'credit', paid: t.amount, consumed: 0 });
  //           });

  //           orders.map(order => {
  //             list.push({ date: order.delivered, type: 'debit', paid: 0, consumed: order.total });
  //           });

  //           list = list.sort((a: any, b: any) => {
  //             const aMoment = moment(a.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  //             const bMoment = moment(b.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  //             if (aMoment.isAfter(bMoment)) {
  //               return 1; // b at top
  //             } else if (bMoment.isAfter(aMoment)) {
  //               return -1;
  //             } else {
  //               if (a.type === 'debit' && b.type === 'credit') {
  //                 return -1;
  //               } else {
  //                 return 1;
  //               }
  //             }
  //           });

  //           // 3. get balance
  //           list.map(item => {
  //             if (item.type === 'debit') {
  //               balance -= (Math.round(item.consumed * 100) / 100);
  //             } else if (item.type === 'credit') {
  //               balance += (Math.round(item.paid * 100) / 100);
  //             }
  //           });

  //           // 4. update db if exist otherwise create a new one
  //           const clientBalance = cbs.find(cb => cb.accountId === c._id);
  //           const amount = (Math.round(balance * 100) / 100);
  //           if (clientBalance) {
  //             this.clientBalanceSvc.update({ accountId: c._id }, { amount: amount, modified: new Date() })
  //               .pipe(takeUntil(this.onDestroy$)).subscribe(() => {

  //               });
  //           } else {
  //             const data: IClientBalance = {
  //               accountId: c._id,
  //               accountName: c.name,
  //               amount: amount,
  //               created: new Date(),
  //               modified: new Date()
  //             };
  //             this.clientBalanceSvc.save(data).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

  //             });
  //           }
  //         }); // end of clients
  //       });
  //     });
  //   });
  // }

}
