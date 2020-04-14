import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '../../../../node_modules/@angular/material/datepicker';
import * as moment from 'moment';
import { OrderService } from '../order.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { IOrder, IOrderItem } from '../order.model';
import { FormBuilder } from '../../../../node_modules/@angular/forms';

import { ProductService } from '../../product/product.service';
import { MerchantPaymentService } from '../../payment/merchant-payment.service';
import { MerchantBalanceService } from '../../payment/merchant-balance.service';
import { RestaurantService } from '../../merchant/restaurant.service';
import { IMerchantPayment } from '../../payment/payment.model';
import { MatSnackBar } from '../../../../node_modules/@angular/material/snack-bar';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit {
  deliverTime;
  onDestroy$ = new Subject();
  orders: IOrder[] = [];
  dateForm;
  location = { lat: 43.8515003, lng: -79.3823725, placeId: 'ChIJsdx07TQrK4gRLx1zHjnKEbg' };
  places = [];
  delivered; // moment object

  constructor(
    private productSvc: ProductService,
    private orderSvc: OrderService,
    private restaurantSvc: RestaurantService,
    private merchantPaymentSvc: MerchantPaymentService,
    private merchantBalanceSvc: MerchantBalanceService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dateForm = this.fb.group({ date: [''] });
  }

  get date() { return this.dateForm.get('date'); }

  // set defaut date to today, reload orders and build merchant receivables
  ngOnInit() {
    const now = moment();
    this.delivered = now.set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    this.deliverTime = now.set({ hour: 11, minute: 45, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
    this.reload(this.delivered);
    this.updateMerchantReceivables(this.delivered);

    this.date.setValue(now);
    // this.delivered = now.set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    const startDate = moment(event.value);
    this.date.setValue(startDate);
    this.delivered = startDate.set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    this.reload(this.delivered);
    this.updateMerchantReceivables(startDate);
  }

  getDeliveryTimeRange(start) {
    const deliveryStart = moment(start.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
    const deliveryEnd = moment(start.set({ hour: 23, minute: 59, second: 59, millisecond: 999 }));

    return { $lt: deliveryEnd.toDate(), $gt: deliveryStart.toDate() };
  }

  // -----------------------------------------------------------------------
  // Notice: 'bad' order should be load for getting cost and pay merchant
  // delivered --- moment object
  reload(delivered) {
    const self = this;
    // const range = { $gt: dt.startOf('day').toDate(), $lt: dt.endOf('day').toDate() };
    const q = { delivered: delivered.toISOString(), status: { $nin: ['del', 'bad', 'tmp'] } };
    this.orderSvc.find(q).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
      orders.map(order => {
        order.productTotal = order.price;
        order.subtotal1 = order.productTotal + order.deliveryDiscount;
        order.tax = Math.ceil(order.subtotal1 * 13) / 100;
        order.subtotal2 = order.subtotal1 + order.tax;
        order.total = order.subtotal2 - order.deliveryDiscount + order.tips;

        order.code = order.code ? order.code : 'N/A';
      });
      self.orders = orders;
    });
  }

  initCreditList(orders: IOrder[]) {
    const credits = [];
    orders.map(order => {
      const credit = credits.find(c => c.merchantId === order.merchant._id);
      if (!credit) {
        const merchant = order.merchant;
        credits.push({ merchantId: merchant._id, merchantName: merchant.name, amount: 0, delivered: order.delivered });
      }
    });
    return credits;
  }

  // -----------------------------------------------------------------------
  // Notice: 'bad' order should be load for getting cost and pay merchant
  // date --- moment object
  updateMerchantReceivables(date) {
    const self = this;
    const dt = moment(date).set({ hour: 11, minute: 45, second: 0, millisecond: 0 }); // fix me
    // const range = { $gt: dt.startOf('day').toDate(), $lt: dt.endOf('day').toDate() };
    const q = { delivered: dt.toISOString(), status: { $nin: ['del', 'tmp'] } };
    this.orderSvc.find(q).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
      const receivables = [];

      // group orders by merchant
      orders.map(order => {
        const merchant = order.merchant;
        const receivable = receivables.find(c => c.merchantId === merchant._id);
        if (!receivable) {
          receivables.push({ merchantId: merchant._id, merchantName: merchant.name, amount: order.cost, delivered: order.delivered });
        } else {
          receivable.amount += order.cost;
        }
      });

      self.merchantPaymentSvc.find({ delivered: dt.toISOString(), type: 'credit' }).pipe(takeUntil(this.onDestroy$)).subscribe(mps => {
        const payments: IMerchantPayment[] = [];

        receivables.map(c => {
          const merchantPayment = mps.find(mp => mp.merchantId === c.merchantId);
          if (merchantPayment) {
            const query = { _id: merchantPayment._id };
            self.merchantPaymentSvc.update(query, { amount: c.amount }).pipe(takeUntil(this.onDestroy$)).subscribe(xs => {
              this.snackBar.open('', '更新商家应收成功', { duration: 1000 });
            });
          } else {
            if (c.amount > 0) {
              payments.push({
                merchantId: c.merchantId,
                merchantName: c.merchantName,
                type: 'credit',
                amount: c.amount,
                delivered: c.delivered,
                status: 'new',
                created: new Date(),
                modified: new Date()
              });
            }
          }
        });

        // create the rest new ones
        if (payments && payments.length > 0) {
          self.merchantPaymentSvc.insertMany(payments).pipe(takeUntil(this.onDestroy$)).subscribe(xs => {
            this.snackBar.open('', '创建商家应收成功', { duration: 1000 });
          });
        }
      });
    });
  }
}
