import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { AccountService } from '../../account/account.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { IAccount, Role } from '../../account/account.model';
import { OrderService } from '../../order/order.service';

@Component({
  selector: 'app-driver-shift',
  templateUrl: './driver-shift.component.html',
  styleUrls: ['./driver-shift.component.scss']
})
export class DriverShiftComponent implements OnInit, OnDestroy {
  drivers;
  account;
  onDestroy$ = new Subject();

  constructor(
    private accountSvc: AccountService,
    private orderSvc: OrderService
  ) { }

  ngOnInit() {
    this.accountSvc.find({where: {roles: { '$in' : [Role.DRIVER]}}})
      .pipe(takeUntil(this.onDestroy$)).subscribe((accounts: IAccount[]) => {
      // this.orderSvc.find({})
      this.drivers = accounts;
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
