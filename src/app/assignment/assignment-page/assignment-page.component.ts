import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IOrder } from '../../order/order.model';
import { Subject } from '../../../../node_modules/rxjs';
import { LocationService } from '../../location/location.service';
import { MallService } from '../../mall/mall.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { IMall } from '../../mall/mall.model';
import * as moment from 'moment';
import { FormBuilder } from '../../../../node_modules/@angular/forms';
import { MatDatepickerInputEvent } from '../../../../node_modules/@angular/material';
import { OrderService } from '../../order/order.service';
import { MerchantService } from '../../merchant/merchant.service';
import { IRestaurant } from '../../merchant/restaurant.model';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-assignment-page',
  templateUrl: './assignment-page.component.html',
  styleUrls: ['./assignment-page.component.scss']
})
export class AssignmentPageComponent implements OnInit, OnDestroy {

  @Input() orders: IOrder[];
  onDestroy$ = new Subject();
  groupedAssignments = [];

  malls;
  dateForm;
  delivered;

  pickup;
  pickups = [];
  merchants = [];

  get date() { return this.dateForm.get('date'); }

  constructor(
    private fb: FormBuilder,
    private orderSvc: OrderService,
    private mallSvc: MallService,
    private merchantSvc: MerchantService,
    private sharedSvc: SharedService
  ) {
    this.dateForm = this.fb.group({ date: [''] });

    this.date.setValue(moment());
  }

  ngOnInit() {
    this.merchantSvc.quickFind().pipe(takeUntil(this.onDestroy$)).subscribe((rs: IRestaurant[]) => {
      this.merchants = rs;
      this.pickups = this.getPhases(rs);
      this.pickup = this.pickups[0];
      this.reload(rs);
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getPhases(rs: IRestaurant[]) {
    const pickups = [];
    rs.map(r => {
      r.phases.map(ph => {
        if (pickups.indexOf(ph.pickup) === -1) {
          pickups.push(ph.pickup);
        }
      });
    });

    return pickups;
  }


  getMerchantIds(rs: IRestaurant[], mall: IMall) {
    const merchants = rs.filter((r: any) => r.mallId === mall._id);
    if (merchants && merchants.length > 0) {
      return merchants.map(m => m._id);
    } else {
      return [];
    }
  }


  reload(rs: IRestaurant[]) {
    const self = this;
    const qMall = { status: 'active' };

    const delivered = this.sharedSvc.getTime(moment(this.date.value), this.pickup);
    const query = { delivered: delivered.toISOString(), status: { $nin: ['bad', 'del', 'tmp'] } };

    this.orderSvc.quickFind(query).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
      self.orders = orders;
      self.mallSvc.quickFind(qMall).pipe(takeUntil(this.onDestroy$)).subscribe((ms: IMall[]) => {

        ms.map(mall => {
          mall.merchantIds = this.getMerchantIds(rs, mall);
          mall.orders = orders.filter(order => mall.merchantIds.indexOf(order.merchantId) !== -1);
        });

        // reload the page
        self.malls = ms;
        self.delivered = delivered;
      });
    });
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    const startDate = moment(event.value);
    this.date.setValue(startDate);
    this.reload(this.merchants);
  }

  onSelectTime(e) {
    this.pickup = e.value;
    this.reload(this.merchants);
  }
}
