import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { takeUntil } from '../../../node_modules/rxjs/operators';
import { Subject } from '../../../node_modules/rxjs';

import { Account, IAccount } from '../account/account.model';
import { IAppState } from '../store';
import { AccountService } from '../account/account.service';

// import { CommandActions } from '../shared/command.actions';
// import { ContactService } from '../contact/contact.service';
// import { LocationService } from '../location/location.service';
// import { IContact } from '../contact/contact.model';
// import { ContactActions } from '../contact/contact.actions';
// import { IContactAction } from '../contact/contact.reducer';
// import { ICommand } from '../shared/command.reducers';
// import { ICart } from '../cart/cart.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  account: IAccount;
  bHide = false;
  page;

  private onDestroy$ = new Subject<void>();

  constructor(
    private accountSvc: AccountService,
    private router: Router,
    private rx: NgRedux<IAppState>
  ) {

  }

  ngOnInit() {
    const self = this;
    this.rx.select('account').pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => { // must be redux
      if (account) {
        self.account = account;
      } else {
        self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe((account1: IAccount) => {
          self.account = account1;
        });
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  toMall() {
    if (this.account) {
      this.router.navigate(['mall/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toOrder() {
    if (this.account) {
      this.router.navigate(['order/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toAssignment() {
    if (this.account) {
      this.router.navigate(['assignment/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toMap() {
    this.router.navigate(['cart']);
  }

  toAccount() {
    if (this.account) {
      this.router.navigate(['account/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toRegion() {
    if (this.account) {
      this.router.navigate(['region/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toSettlement() {
    if (this.account) {
      this.router.navigate(['payment/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toProduct() {
    if (this.account) {
      this.router.navigate(['product/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toPicture() {
    if (this.account) {
      this.router.navigate(['picture/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toAdmin() {
    if (this.account) {
      this.router.navigate(['admin']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toClient() {
    if (this.account) {
      this.router.navigate(['client/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toDriver() {
    if (this.account) {
      this.router.navigate(['driver/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toMerchant() {
    if (this.account) {
      this.router.navigate(['merchant/main']);
    } else {
      this.router.navigate(['account/login']);
    }
  }
}
