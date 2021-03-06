import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../../account/account.service';
// import { SharedService } from '../../shared/shared.service';
import { IAccount, Role } from '../../account/account.model';
import { Router } from '../../../../node_modules/@angular/router';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import * as moment from 'moment';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit, OnDestroy {
  account: IAccount;
  range;
  deliverTime;
  onDestroy$ = new Subject();

  constructor(
    private sharedSvc: SharedService,
    private accountSvc: AccountService,
    private router: Router
  ) {
    const now = moment();
    const dayEnd = this.sharedSvc.getStartOf('day').set({ hour: 19, minute: 30, second: 0, millisecond: 0 });

    if (now.isAfter(dayEnd)) {
      this.deliverTime = this.sharedSvc.getStartOf('day').add(1, 'days')
        .set({ hour: 11, minute: 45, second: 0, millisecond: 0 })
        .format('YYYY-MM-DD HH:mm:ss');

      const tomorrowStart = this.sharedSvc.getStartOf('day').add(1, 'days').toDate();
      const tomorrowEnd = this.sharedSvc.getEndOf('day').add(1, 'days').toDate();
      this.range = { $lt: tomorrowEnd, $gt: tomorrowStart };
    } else {
      this.deliverTime = this.sharedSvc.getStartOf('day')
        .set({ hour: 11, minute: 45, second: 0, millisecond: 0 })
        .format('YYYY-MM-DD HH:mm:ss');

      const todayStart = this.sharedSvc.getStartOf('day').toDate();
      const todayEnd = this.sharedSvc.getEndOf('day').toDate();
      this.range = { $lt: todayEnd, $gt: todayStart };
    }
  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
        const roles = account.roles;
        if (roles && roles.length > 0 && roles.indexOf(Role.SUPER) !== -1) {

        } else {
          this.router.navigate(['account/login']);
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

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }
}
