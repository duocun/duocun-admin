import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IOrder, IOrderItem } from '../order.model';
import { OrderService } from '../order.service';
import { SharedService } from '../../shared/shared.service';
import { ProductService } from '../../product/product.service';
import { IProduct } from '../../product/product.model';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit, OnChanges, OnDestroy {
  @Input() dateRange;

  list: any[] = [];
  ordersWithNote: IOrder[] = [];
  total = 0;
  onDestroy$ = new Subject();

  constructor(
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private productSvc: ProductService
  ) {

  }
  ngOnInit() {
    const self = this;
    self.reload();

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

  ngOnChanges(v) {
    if (v.dateRange && v.dateRange.currentValue) {
      this.reload();
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  reload() {
    const self = this;
    const q = { delivered: self.dateRange, status: { $nin: ['del', 'tmp'] }};
    self.orderSvc.find(q).pipe(takeUntil(self.onDestroy$)).subscribe(orders => {
      const list = [];
      orders.map((order: IOrder) => {
        order.items.map(item => {
          const it = list.find(x => x.productId === item.product._id);
          if (it) {
            it.quantity = it.quantity + item.quantity;
          } else {
            list.push(item);
          }
        });
      });

      self.list = list;
      self.total = 0;
      self.list.map( it => {
        it.total = it.product.cost * it.quantity;
        self.total += it.total;
      });
    });
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

}
