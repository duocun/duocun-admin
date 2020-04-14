import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { IClientBalance } from '../../payment/payment.model';
import { TransactionService } from '../../transaction/transaction.service';
import * as moment from 'moment';
import { OrderService } from '../../order/order.service';
import { IOrder } from '../../order/order.model';
import { ClientBalanceService } from '../../payment/client-balance.service';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { CategoryService } from '../../category/category.service';
import { ProductService } from '../../product/product.service';
import { ContactService } from '../../contact/contact.service';
import { MallSchedule } from '../../mall/mall.model';
import { MallScheduleService } from '../../mall/mall-schedule.service';
import { MerchantService } from '../../merchant/merchant.service';
import { AssignmentService } from '../../assignment/assignment.service';
import { DriverService } from '../../driver/driver.service';
import { AccountService } from '../../account/account.service';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { query } from '../../../../node_modules/@angular/animations';
import { DistanceService } from '../../distance/distance.service';
import { DriverHourService } from '../../driver/driver-hour.service';

@Component({
  selector: 'app-client-balance',
  templateUrl: './client-balance.component.html',
  styleUrls: ['./client-balance.component.scss']
})
export class ClientBalanceComponent implements OnInit, OnDestroy {

  @ViewChild('donut', { static: true }) donut: ElementRef;

  onDestroy$ = new Subject();
  dps = [];
  mps = [];

  constructor(
    private http: HttpClient,
    private clientBalanceSvc: ClientBalanceService,
    private transactionSvc: TransactionService,
    private orderSvc: OrderService,
    private categorySvc: CategoryService,
    private merchantSvc: MerchantService,
    private productSvc: ProductService,
    private contactSvc: ContactService,
    private assignmentSvc: AssignmentService,
    private mallScheduleSvc: MallScheduleService,
    private driverSvc: DriverService,
    private driverHourSvc: DriverHourService,
    private accountSvc: AccountService,
    private distanceSvc: DistanceService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.contactSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((cs: any[]) => {
      const a = [];
      cs.map(c => {
        const b = a.find(x => x && x.accountId === c.accountId);
        if (b) {
          console.log(b.username);
        } else {
          a.push(c);
        }
      });
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

  // patchAllClientBalances() {
  //   const orderQuery = {
  //     status: { $nin: ['bad', 'del', 'tmp'] },
  //   };
  //   this.orderSvc.find(orderQuery).pipe(takeUntil(this.onDestroy$)).subscribe((os: IOrder[]) => {
  //     const groups = this.groupBy(os, 'clientId');
  //     const clients = Object.keys(groups);

  //     this.clientBalanceSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((cbs: IClientBalance[]) => {
  //       const ds: any = [];
  //       cbs.map(cb => {
  //         const cId = clients.find(id => id === cb.accountId);

  //         if (cId) {
  //           if (groups[cId] && groups[cId].length > 0) {
  //             ds.push({ query: { id: cb._id }, data: { ordered: true } });
  //           } else {
  //             ds.push({ query: { id: cb._id }, data: { ordered: false } });
  //           }
  //         }
  //       });

  //       this.clientBalanceSvc.bulkUpdate({ data: ds }).pipe(takeUntil(this.onDestroy$)).subscribe((cb2s: any[]) => {
  //         // this.reload();
  //         this.snackBar.open('', '余额表格已更新', { duration: 1000 });
  //       });

  //     });
  //   });
  // }

  getDistinct(a: any[], field: any) {
    // const ts = [];
    // a.map(it => {
    //   const k = it[field].toString();
    //   const item = ts.find(x => x.key === k);
    //   if (item) {
    //     // pass
    //   } else {
    //     // console.log(k + ': ' + it.clientName);
    //     ts.push({ key: k, val: it });
    //   }
    // });

    // return ts.map(x => x.val);
    const t = {};
    a.map(item => {
      const key = item[field];
      if (key && key !== 'undefined') {
        t[key] = item;
      }
    });
    return Object.keys(t).map(k => t[k]);
  }

  getDistinctFieldValues(a: any[], field) {
    const t = {};
    a.map(item => {
      const key = item[field];
      if (key && key !== 'undefined') {
        t[key] = item;
      }
    });
    return Object.keys(t);
  }

  addFieldToOrders() {
    const orderQuery = {
      // clientName: { $exists: false },
      merchantName: { $exists: false }
      // status: { $nin: ['bad', 'del', 'tmp'] },
      // delivered: { $lt: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate() } // fix me
    };

    this.orderSvc.find(orderQuery).pipe(takeUntil(this.onDestroy$)).subscribe((os: IOrder[]) => {
      // const updates
      const datas = [];
      os.map(order => {
        datas.push({
          query: { _id: order._id },
          data: {
            merchantName: order.merchant.name,
            // clientName: order.client.username,
            modified: new Date()
          }
        });
      });

      this.orderSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.snackBar.open('', '余额表格已更新', { duration: 1000 });
      });
    });
  }

  rmDistanceDuplicated() {
    this.distanceSvc.quickFind().pipe(takeUntil(this.onDestroy$)).subscribe((ds: any[]) => {
      const distances = [];
      const dups = [];

      ds.map((d: any) => {
        const distance = distances.find(x => x && x.originPlaceId === d.originPlaceId && x.destinationPlaceId === d.destinationPlaceId);
        if (distance) {
          // dups.push(distance);
          this.distanceSvc.remove({ _id: distance._id }).pipe(takeUntil(this.onDestroy$)).subscribe(() => { });
        } else {
          distances.push(d);
        }
      });


      // this.distanceSvc.remove({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      //   this.snackBar.open('', '余额表格已更新', { duration: 1000 });
      // });
    });
  }


  rmDupClientBalances() {
    this.clientBalanceSvc.quickFind().pipe(takeUntil(this.onDestroy$)).subscribe((cbs: any[]) => {
      const balances = [];
      const dups = [];

      cbs.map((cb: any) => {
        const b = balances.find(x => x && x.accountId === cb.accountId);
        if (b) {
          this.clientBalanceSvc.remove({ _id: b._id }).pipe(takeUntil(this.onDestroy$)).subscribe(() => { });
        } else {
          balances.push(cb);
        }
      });
    });
  }


  rebuildClientBalances() {
    const orderQuery = { status: { $nin: ['bad', 'del', 'tmp'] } };
    // const transactionQuery = { $or: [{ type: 'credit' }, { type: 'transfer' }] };

    this.orderSvc.quickFind(orderQuery).pipe(takeUntil(this.onDestroy$)).subscribe((os: IOrder[]) => {
      const clients: any[] = [];
      const arr = this.getDistinct(os, 'clientId');
      arr.map(x => { clients.push({ _id: x.clientId, name: x.clientName }); });

      this.transactionSvc.quickFind().pipe(takeUntil(this.onDestroy$)).subscribe(ts => {
        this.clientBalanceSvc.quickFind().pipe(takeUntil(this.onDestroy$)).subscribe((cbs: IClientBalance[]) => {
          const updateDatas = [];
          const newClientBalances = [];

          clients.map((c: any) => {
            // console.log('-----------------' + c.name + '------------------');
            // 2. get debit and credit
            const orders = os.filter(order => order.clientId === c._id);
            const payments = ts.filter(t => t.type === 'credit' && t.fromId === c._id);
            const tOuts = ts.filter(t => t.type === 'transfer' && t.fromId === c._id);
            const tIns = ts.filter(t => t.type === 'transfer' && t.toId === c._id);

            const list = [];
            let balance = 0;
            payments.map(t => {
              list.push({ date: t.created, type: 'credit', paid: t.amount, consumed: 0 });
            });

            tIns.map(t => {
              list.push({ date: t.created, type: 'credit', paid: t.amount, consumed: 0 });
            });

            tOuts.map(t => {
              list.push({ date: t.created, type: 'debit', paid: 0, consumed: t.amount });
            });

            orders.map(order => {
              list.push({ date: order.delivered, type: 'debit', paid: 0, consumed: order.total });
            });

            const list1 = list.sort((a: any, b: any) => {
              const aMoment = moment(a.date);
              const bMoment = moment(b.date);
              if (aMoment.isAfter(bMoment)) {
                return 1; // b at top
              } else if (bMoment.isAfter(aMoment)) {
                return -1;
              } else {
                if (a.type === 'debit' && b.type === 'credit') {
                  return 1;
                } else {
                  return -1;
                }
              }
            });

            // 3. get balance
            list1.map(item => {
              if (item.type === 'debit') {
                balance -= item.consumed;
              } else if (item.type === 'credit') {
                balance += item.paid;
              }
              balance = (Math.round(balance * 100) / 100);
              // console.log(item.date + ', ' + item.type + ', paid:' + item.paid + ', consumed:' + item.consumed + ', balance:' + balance);
            });

            // 4. update db if exist otherwise create a new one
            const clientBalance = cbs.find(cb => cb.accountId === c._id);
            const amount = (Math.round(balance * 100) / 100);
            if (clientBalance) {
              updateDatas.push({
                query: { _id: clientBalance._id },
                data: { accountName: c.name, amount: amount, modified: new Date(), ordered: true }
              });
              // const q1 = { _id: clientBalance._id };
              // const data1 = { amount: amount, modified: new Date() };
              // this.clientBalanceSvc.update(q1, data1).pipe(takeUntil(this.onDestroy$)).subscribe(() => {});
            } else {
              const data: IClientBalance = {
                accountId: c._id,
                accountName: c.name,
                amount: amount,
                ordered: true,
                created: new Date(),
                modified: new Date()
              };
              newClientBalances.push(data);
              // this.clientBalanceSvc.save(data).pipe(takeUntil(this.onDestroy$)).subscribe(() => {});
            }
          }); // end of clients iterate process

          this.clientBalanceSvc.bulkUpdate({ data: updateDatas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            if (newClientBalances && newClientBalances.length > 0) {
              this.clientBalanceSvc.insertMany(newClientBalances).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
                this.snackBar.open('', '余额表格已更新', { duration: 1000 });
              });
            } else {
              this.snackBar.open('', '余额表格已更新', { duration: 1000 });
            }
          });
        });
      });
    });
  }

  rebuildAllProducts() {
    this.productSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((ps) => {
      const datas = [];
      ps.map(c => {
        datas.push({
          query: { id: c._id },
          data: {
            categoryId: c.categoryId,
            merchantId: c.merchantId
          }
        });
      });
      this.productSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      });
    });
  }

  rebuildAllMerchants() {
    // this.accountSvc.find({type: 'merchant'}).pipe(takeUntil(this.onDestroy$)).subscribe((as) => {
    this.merchantSvc.quickFind().pipe(takeUntil(this.onDestroy$)).subscribe((ps) => {
      const datas = [];
      ps.map(c => {
        datas.push({
          query: { _id: c._id },
          data: {
            phases: [ {orderEnd: '10:30', pickup: '11:20'}, {orderEnd: '11:30', pickup: '12:00'}]
          }
        });
      });
      this.merchantSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      });
    });
    // });
  }
  rebuildAllContacts() {
    this.contactSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((cs) => {
      const datas = [];
      cs.map(c => {
        datas.push({
          query: { id: c._id },
          data: { // categoryId: c.categoryId,
            accountId: c.accountId
          }
        });
      });
      this.contactSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      });
    });
  }

  rebuildAllMallSchedules() {
    this.mallScheduleSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((cs) => {
      const datas = [];
      cs.map(c => {
        datas.push({
          query: { id: c._id },
          data: { // categoryId: c.categoryId,
            mallId: c.mallId
          }
        });
      });
      this.mallScheduleSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      });
    });
  }

  rebuildAllOrders() {
    this.orderSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((ps) => {
      const datas = [];
      ps.map(p => {
        const items = [];
        if (p.items && p.items.length > 0) {
          p.items.map(it => {
            items.push({ productId: it.productId, quantity: it.quantity });
          });
        }

        datas.push({
          query: { id: p._id },
          data: {
            clientId: p.clientId,
            merchantId: p.merchantId,
            // items: items
          }
        });
      });

      this.orderSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      });
    });
  }

  rebuildAllAssignments() {
    this.assignmentSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((ps) => {
      const datas = [];
      ps.map(p => {
        // const items = [];
        // if (p.items && p.items.length > 0) {
        //   p.items.map(it => {
        //     items.push({ productId: it.productId, quantity: it.quantity });
        //   });
        // }

        datas.push({
          query: { id: p._id },
          data: {
            // orderId: p.orderId,
            // driverId: p.driverId
            // clientId: p.clientId,
            merchantId: p.merchantId,
            // items: items
          }
        });
      });

      this.assignmentSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      });
    });
  }

  rebuildAllDrivers() {
    this.driverSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((ps) => {
      const datas = [];
      ps.map(p => {
        // const items = [];
        // if (p.items && p.items.length > 0) {
        //   p.items.map(it => {
        //     items.push({ productId: it.productId, quantity: it.quantity });
        //   });
        // }

        datas.push({
          query: { id: p._id },
          data: {
            accountId: p.accountId,
          }
        });
      });

      this.driverSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      });
    });
  }

  rebuildTransactions() {
    this.transactionSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((ps) => {
      const datas = [];
      ps.map(p => {
        datas.push({
          query: { _id: p._id },
          data: {
            // fromId: p.fromId,
            // toId: p.toId
            // fromName: p.from.username
            amount: Math.round(p.amount * 100) / 100,
          }
        });
      });

      if (datas && datas.length > 0) {
        this.transactionSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

        });
      }

    });
  }

  rebuildDriverHoursTable() {
    this.driverHourSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((ps) => {
      const datas = [];
      ps.map(p => {
        datas.push({
          query: { _id: p._id },
          data: {
            accountId: p.driverId,
            accountName: p.driverName,
            amount: Math.round(30 * +p.hours * 100) / 100
          }
        });
        if (!p.accountId) {
          console.log(p._id);
        }
      });

      if (datas && datas.length > 0) {
        this.driverHourSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

        });
      }
    });
  }

  rebuildClientBalanceTable() {
    this.clientBalanceSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((ps) => {
      const datas = [];
      ps.map(p => {
        datas.push({
          query: { _id: p._id },
          data: {
            // accountId: p.accountId
          }
        });
        if (!p.accountId) {
          console.log(p._id);
        }
      });


      this.clientBalanceSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      });
    });
  }

  saveMerchantUsers() {
    const date = new Date();
    this.merchantSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((ms) => {
      const datas = [];
      ms.map(m => {
        datas.push({
          query: { _id: m._id },
          data: {
            username: m.name,
            email: '',
            type: 'merchant',
            created: date,
            modified: date
          }
        });
      });
      this.accountSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      });
    });
  }


  getCost(items: any[]) {
    let cost = 0;
    let price = 0;
    items.map(x => {
      cost += (x.cost * x.quantity);
      price += (x.price * x.quantity);
    });
    return { cost: cost, price: price };
  }

  updateOrders() {
      this.orderSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((orders) => {
        const datas = [];
        orders.map(order => {
          datas.push({
            query: { _id: order._id },
            data: {
              // items: items,
              price: Math.round(order.price * 100) / 100,
              cost: Math.round(order.cost * 100) / 100,
              total: Math.round(order.total * 100) / 100
            }
          });
        });

        this.orderSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(() => {

        });
      });
  }

}
