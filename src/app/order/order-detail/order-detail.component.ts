import { Component, OnInit, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { IOrder, IOrderItem } from '../order.model';
import { SharedService } from '../../shared/shared.service';
import { Subject } from '../../../../node_modules/rxjs';
import { AssignmentService } from '../../assignment/assignment.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { MatTableDataSource, MatSort, MatSnackBar } from '../../../../node_modules/@angular/material';
import { MerchantService } from '../../merchant/merchant.service';
import { IRestaurant } from '../../merchant/restaurant.model';
import { ProductService } from '../../product/product.service';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { OrderService } from '../order.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() orders: IOrder[] = [];
  @Input() delivered;

  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];
  onDestroy$ = new Subject();
  clientAddressList = [];
  checkClientAddressList = [];
  nOrders: number;
  nDrinks: number;

  selectedOrder: IOrder;
  selectedMerchant: IRestaurant;

  merchants: IRestaurant[];
  items: any[];
  form;
  assignments;
  selectedMerchantId;

  displayedColumns: string[] = ['code', 'merchantName', 'clientName', 'clientPhoneNumber', 'note'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private productSvc: ProductService,
    private merchantSvc: MerchantService,
    private assignmentSvc: AssignmentService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      // merchant: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    const self = this;
    this.merchantSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe((ms: IRestaurant[]) => {
      this.merchants = ms;
      if (ms && ms.length) {
        // this.selectedMerchant = ms[0];
        // this.loadProcucts(this.selectedMerchant._id);
      }
    });
    // this.socketSvc.on('updateOrders', x => {
    //   // self.onFilterOrders(this.selectedRange);
    //   if (x.clientId === self.account._id) {
    //     const index = self.orders.findIndex(i => i._id === x._id);
    //     if (index !== -1) {
    //       self.orders[index] = x;
    //     } else {
    //       self.orders.push(x);
    //     }
    //     self.orders.sort((a: Order, b: Order) => {
    //       if (this.sharedSvc.compareDateTime(a.created, b.created)) {
    //         return -1;
    //       } else {
    //         return 1;
    //       }
    //     });
    //   }
    // });
  }

  init(orders, assignments) {
    const self = this;
    self.clientAddressList = [];

    if (!(orders && orders.length > 0)) {
      return;
    }

    orders.map((order: IOrder) => {
      const items = order.items;
      const assignment = assignments.find(x => x.orderId === order._id);
      const productTotal = order.price;

      order.productTotal = productTotal;
      order.subtotal1 = productTotal + order.deliveryDiscount;
      order.tips = 0; // order.subtotal1 * 0.05;
      order.tax = Math.ceil(order.subtotal1 * 13) / 100;
      order.subtotal2 = order.subtotal1 + order.tax;
      order.total = order.subtotal2 - order.deliveryDiscount + order.tips;

      self.clientAddressList.push({ clientId: order.client.accountId, clientName: order.client.username, address: order.address });

      if (assignment) {
        order.code = assignment.code;
      }
    });

    this.dataSource = new MatTableDataSource(orders);
    this.dataSource.sort = this.sort;

    this.selectedOrder = orders[0];
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

  ngOnChanges(v) {
    if (v.orders && v.orders.currentValue) {
      this.orders = v.orders.currentValue;

      if (this.delivered) {
        const dt = moment(this.delivered);
        const q = { delivered: dt.toISOString() };
        this.assignmentSvc.find(q).pipe(takeUntil(this.onDestroy$)).subscribe(xs => {
          this.assignments = xs;
          this.init(this.orders, xs);
        });
      }
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSelectOrder(row) {
    this.selectedOrder = row;
  }

  onMerchantChanged(e) {
    const id = e.value;
    this.selectedMerchant = this.merchants.find(m => m._id === id);
    this.loadProcucts(id, this.selectedMerchant.name);
  }

  loadProcucts(merchantId, merchantName) {
    this.productSvc.find({ merchantId: merchantId }).pipe(takeUntil(this.onDestroy$)).subscribe(ps => {
      const items = [];
      ps.map(p => {
        p.quantity = 0;
        items.push({productId: p._id, productName: p.name, price: p.price, cost: p.cost, quantity: 0,
          merchantId: p.merchantId, merchantName: merchantName});
      });

      this.items = items;
    });
  }

  onSubmit() {
    const orderId = this.selectedOrder._id;
    const merchantId = this.selectedMerchant._id;
    const data = this.recalculate(this.selectedOrder, this.items);
    data['items'] = this.items.filter(x => x.quantity > 0);
    data['merchantId'] = merchantId;
    data['merchantName'] = this.selectedMerchant.name;
    this.orderSvc.update({_id: orderId}, data).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      this.snackBar.open('', '订单已更新', { duration: 1000 });
      const date = this.delivered;
      const range = { $gt: date.startOf('day').toDate(), $lt: date.endOf('day').toDate() };
      const q = { delivered: range, status: { $nin: ['del', 'bad', 'tmp'] } };
      this.orderSvc.find(q).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
        this.orders = orders;
        this.dataSource = new MatTableDataSource(orders);
        this.dataSource.sort = this.sort;
        this.selectedOrder = orders[0];
      });
    });
  }


  recalculate(order, items) {
    let productTotal = 0;

    if (items && items.length > 0) {
      items.map(x => {
        productTotal += x.price * x.quantity;
      });
    }

    const subtotal1 = productTotal + order.deliveryCost;
    order.tips = 0; // order.subtotal1 * 0.05;
    const tax = Math.ceil(subtotal1 * 13) / 100;
    const subtotal2 = order.subtotal1 + order.tax;
    const total = Math.round((subtotal2 - order.deliveryDiscount - order.groupDiscount + order.tips) * 100) / 100;

    return {tax: tax, total: total};
  }
}

