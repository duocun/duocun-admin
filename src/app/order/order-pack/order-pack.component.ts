import { Component, OnInit, Input, OnChanges, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { IOrder, IOrderItem } from '../order.model';
import { SharedService } from '../../shared/shared.service';
import { Subject } from '../../../../node_modules/rxjs';
import { AssignmentService } from '../../assignment/assignment.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormBuilder } from '../../../../node_modules/@angular/forms';
import * as moment from 'moment';
import { DriverService } from '../../driver/driver.service';
import { Status } from '../../driver/driver.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-pack',
  templateUrl: './order-pack.component.html',
  styleUrls: ['./order-pack.component.scss']
})
export class OrderPackComponent implements OnInit, OnChanges, OnDestroy {
  @Input() orders: IOrder[] = [];
  @Input() delivered;

  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];
  onDestroy$ = new Subject();
  clientAddressList = [];
  checkClientAddressList = [];
  nOrders: number;
  nDrinks: number;
  selected;
  bMobile = false;
  searchForm;
  assignments;
  drivers;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() value;
  @ViewChild('search', { static: true }) addressInput: ElementRef;

  constructor(
    private sharedSvc: SharedService,
    private assignmentSvc: AssignmentService,
    private deviceSvc: DeviceDetectorService,
    private driverSvc: DriverService,
    private orderSvc: OrderService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      keyword: ['']
    });

    this.bMobile = this.deviceSvc.isMobile();
    if (!this.bMobile) {
      this.displayedColumns = ['code', 'merchantName', 'clientName', 'clientPhoneNumber', 'note'];
    } else {
      this.displayedColumns = ['code'];
    }
  }

  ngOnInit() {
    const self = this;
    this.driverSvc.find({ status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe(drivers => {
      this.drivers = drivers;
      this.assignmentSvc.find({ delivered: this.delivered }).pipe(takeUntil(this.onDestroy$)).subscribe(xs => {
        self.assignments = xs;
        self.reload(this.orders, xs, drivers);
        const client = this.getClientWithMultiOrders(self.clientAddressList);
        if (client) {
          alert('A client ' + client.clientName + ' has same orders!');
        }
      });
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

  reload(orders, assignments, drivers) {
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
      order.total = order.subtotal2 - order.deliveryDiscount + order.tips - order.groupDiscount + order.overRangeCharge;

      self.clientAddressList.push({ clientId: order.client.accountId, clientName: order.client.username, address: order.address });

      if (assignment) {
        order.code = assignment.code;
        const driver = drivers.find(d => d.accountId === assignment.driverId);
        if (driver) {
          // order.driverName = driver.accountName;
          // order.driverPhoneNumber = driver.phone;
          order.driver = driver;
        } else {
          // order.driver = { accountName: '', phone: '' };
        }
      }
    });

    this.dataSource = new MatTableDataSource(orders);
    this.dataSource.sort = this.sort;
    this.selected = orders[0];
  }


  getClientWithMultiOrders(clientAddressList: any[]) {
    for (let i = 0; i < clientAddressList.length; i++) {
      for (let j = 0; j < clientAddressList.length; j++) {
        if (i === j) {
          // skip
        } else {
          if (clientAddressList[i].clientId === clientAddressList[j].clientId &&
            clientAddressList[i].address === clientAddressList[j].address
          ) {
            return clientAddressList[i];
          }
        }
      }
    }
    return null;
  }


  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

  ngOnChanges(v) {
    if (v.orders && v.orders.currentValue) {
      this.orders = v.orders.currentValue;
      const dt = moment(this.delivered);
      if (this.delivered) {
        this.driverSvc.find({ status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe(drivers => {
          this.drivers = drivers;
          const q = { delivered: dt.toDate() };
          this.assignmentSvc.find(q).pipe(takeUntil(this.onDestroy$)).subscribe(xs => {
            this.reload(this.orders, xs, drivers);
          });
        });
      }
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSelectRow(row) {
    this.selected = row;
  }


  onValueChange(e) {
    const self = this;
    const v = e.target.value;
    // if (v && v.length > 0) {
    //   this.bClearBtn = true;
    // } else {
    //   this.bClearBtn = false;
    // }
    if (v && v.length > 0) {
      const os = self.orders.filter(order => {
        const keywordRegex = new RegExp(v, 'i');
        if (keywordRegex.test(order.client.username) || keywordRegex.test(order.merchant.name) || keywordRegex.test(order.code)
          || keywordRegex.test(order.address) || keywordRegex.test(order.client.phone)) {
          return true;
        } else {
          return false;
        }
      });
      this.reload(os, this.assignments, this.drivers);
    } else {
      this.reload(this.orders, this.assignments, this.drivers);
    }


    // if (v && v.length >= 3) { // start search
    //   // this.addrChange.emit({ 'input': v });
    // } else if (!v || v.length === 0) {
    //   // this.inputFocus.emit(); // used for show location list
    //   // self.addrClear.emit();
    //   // setTimeout(() => { // this will make the execution after the above boolean has changed
    //   //   self.addressInput.nativeElement.focus();
    //   // }, 0);
    // }
  }

  onFocus(e) {
    // this.inputFocus.emit({ 'input': e.target.value });
  }
}
