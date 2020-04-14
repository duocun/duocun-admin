import { Component, OnInit, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { OrderService } from '../../order/order.service';
import { SharedService } from '../../shared/shared.service';
import { IOrderItem, IOrder } from '../order.model';
// import { SocketService } from '../../shared/socket.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { ProductService } from '../../product/product.service';
import { IProduct } from '../../product/product.model';
import { MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() orders: IOrder[];
  ordersWithNote = [];
  productListByMerchants = [];
  onDestroy$ = new Subject();
  total: number;
  costTotal: number;
  profit: number;
  quantity: number;
  nOrders: number;
  nDrinks: number;
  overRangeCharge: number;
  selected;

  displayedColumns: string[] = ['merchantName', 'nOrders', 'nProducts', 'cost', 'overRangeCharge', 'total'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private productSvc: ProductService,
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
  ) {

  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    const self = this;
    this.productSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      self.regroup(x);
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

  // group by products, group by notes. then group by merchants
  regroup(products: IProduct[]) {
    const self = this;
    const productList = [];
    this.orders.map((order: IOrder) => {
      order.items.map((item: IOrderItem) => {
        const p = productList.find(x => {
          if (x && x.product) {
            return x.product._id === item.product._id;
          } else {
            return false;
          }
        });
        if (p) {
          p.quantity = p.quantity + item.quantity;
        } else {
          productList.push(Object.assign({ merchant: order.merchant }, item));
        }
      });
    });

    const productListByMerchants = [];
    productList.map((it: IOrderItem) => {
      const p = productListByMerchants.find(x => x.merchantId === it.product.merchantId);
      if (p) {
        p.items.push(it);
      } else {
        productListByMerchants.push({
          merchantId: it.product.merchantId,
          merchantName: it.merchant.name,
          nProducts: 0,
          nOrders: 0,
          cost: 0,
          total: 0,
          overRangeCharge: 0,
          items: [it]
        });
      }
    });

    self.total = 0;
    self.quantity = 0;
    self.nDrinks = 0;
    self.overRangeCharge = 0;

    productListByMerchants.map(m => {
      m.summary = self.getSummary(m.merchantId, self.orders, products);
      self.total += m.summary.total;
      self.quantity += m.summary.quantity;
      self.nDrinks += m.summary.nDrinks;
      self.overRangeCharge += m.summary.overRangeCharge;

      m.nProducts = m.summary.quantity;
      m.nOrders = m.summary.nOrders;
      m.cost = m.summary.cost;
      m.total = m.summary.total;
      m.nDrinks = m.summary.nDrinks;
      m.overRangeCharge = m.summary.overRangeCharge;
    });
    // console.log('Total:' + self.total);
    // console.log('Over Range Charge:' + self.overRangeCharge);
    if (productListByMerchants && productListByMerchants.length > 0) {
      this.loadCostList(productListByMerchants);
    }
    // console.log('Total:' + self.total);
    // console.log('Over Range Charge:' + self.overRangeCharge);
    self.productListByMerchants = productListByMerchants;
    this.dataSource = new MatTableDataSource(productListByMerchants);
    this.dataSource.sort = this.sort;
  }

  loadCostList(productListByMerchants) {
    const self = this;
    const merchantIds = [];

    productListByMerchants.map(m => {
      merchantIds.push(m.merchantId);
    });

    self.total = 0;
    self.costTotal = 0;
    self.profit = 0;
    self.nOrders = 0;
    self.overRangeCharge = 0;

    productListByMerchants.map(m => {

      // m.items.map((item: IOrderItem) => {
      //   const product = ps.find(p => p._id === item.productId);
      //   if (product) {
      //     cost += product.cost * item.quantity;
      //   }

      //   switch (item.productId) {

      //     case "5cbc5e3c1f85de03fd9e1f13": { // coca cola
      //       m.summary.productName = item.productName;
      //       m.summary.quantity = item.quantity;
      //       break;
      //     }

      //     case "5cbc671f1f85de03fd9e1f14": {
      //       m.summary.productName = item.productName;
      //       m.summary.quantity = item.quantity;
      //       break;
      //     }

      //     case "5cc788c233ea660321f48aef": {
      //       m.summary.productName = item.productName;
      //       m.summary.quantity = item.quantity;
      //       break;
      //     }

      //     case "5cdf480ccb30c11f7baae6a5": {
      //       m.summary.productName = item.productName;
      //       m.summary.quantity = item.quantity;
      //       break;
      //     }

      //     case "5ce5b593a9ea770e6fdfcc83": {
      //       m.summary.productName = item.productName;
      //       m.summary.quantity = item.quantity;
      //       break;
      //     }
      //   }

      // });

      m.summary.profit = m.summary.total - m.summary.cost;
      self.total += m.summary.total;
      self.costTotal += m.summary.cost;
      self.overRangeCharge += m.summary.overRangeCharge;
      self.nOrders += m.summary.nOrders;
    });

    self.profit = self.total - self.costTotal;
  }

  getOrderWithNoteByMerchantId(merchantId: string) {
    const noteByMerchants = [];
    this.ordersWithNote.map((order: IOrder) => {
      if (merchantId === order.merchant._id) {
        noteByMerchants.push(order);
      }
    });
    return noteByMerchants;
  }





  getSummary(merchantId: string, orders: IOrder[], products: IProduct[]) {
    const self = this;
    let productTotal = 0;
    let tax = 0;
    let tips = 0;
    let total = 0;
    let quantity = 0;
    let nDrinks = 0;
    let cost = 0;
    let nOrders = 0;
    let overRangeCharge = 0;

    orders.filter(x => x.merchant._id === merchantId).map((order: IOrder) => {
      order.productTotal = order.price;
      order.subtotal1 = order.productTotal + order.deliveryCost;
      order.tax = Math.ceil(order.subtotal1 * 13) / 100;
      order.subtotal2 = order.subtotal1 + order.tax;
      order.total = order.subtotal2 - order.deliveryDiscount - order.groupDiscount + order.tips
        + (order.overRangeCharge ? order.overRangeCharge : 0);
      const q = self.orderSvc.getQuantity(order.items);
      cost += order.cost;

      overRangeCharge += order.overRangeCharge ? order.overRangeCharge : 0;
      productTotal += order.productTotal;
      tax += order.tax;
      tips += order.tips;
      total += order.total;
      quantity += q.quantity;
      nDrinks += q.nDrinks;
      nOrders += 1;
    });

    return {
      productTotal: productTotal, tax: tax, tips: tips, total: total, overRangeCharge: overRangeCharge,
      quantity: quantity, nDrinks: nDrinks, cost: cost, nOrders: nOrders
    };
  }

  ngOnChanges(v) {
    if (v.orders && v.orders.currentValue) {
      this.orders = v.orders.currentValue;
      // const dateRange = v.dateRange.currentValue;
      this.productSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(x => {
        this.regroup(x);
      });
    }
  }

  onSelectRow(row) {
    this.selected = row;
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }
}
