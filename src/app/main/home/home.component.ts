import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAccount, Account, Role } from '../../account/account.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from '../../account/account.service';
import { CookieService } from '../../cookie.service';
import { AccountActions } from '../../account/account.actions';
import { NgRedux } from '../../../../node_modules/@angular-redux/store';
import { IAppState } from '../../store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  account;
  loading;
  loggedIn = false;
  costList;

  constructor(
    private accountSvc: AccountService,
    private cookieSvc: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private rx: NgRedux<IAppState>,
    private snackBar: MatSnackBar
  ) {
    const self = this;
    self.loggedIn = true;
    self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      if (account) {
        if (account.roles && account.roles.includes(Role.SUPER)) {
          self.loggedIn = true;
          self.init(account);
          self.router.navigate(['order/main']);
        } else {
          self.router.navigate(['account/login']);
        }
      } else {
        self.router.navigate(['account/login']);
      }
    });

  }

  wechatLoginHandler(data: any) {
    const self = this;
    self.cookieSvc.setUserId(data.userId);
    self.cookieSvc.setAccessToken(data._id);
    self.accountSvc.getCurrentUser().pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => {
      if (account) {
        this.snackBar.open('', '微信登录成功。', { duration: 1000 });
        self.loading = false;
        if (account.roles.includes(Role.SUPER)) {
          self.account = account;
          self.init(account);
        } else {
          this.router.navigate(['account/login']);
        }
      } else {
        this.snackBar.open('', '微信登录失败。', { duration: 1000 });
        self.loading = false;
      }
    });
  }

  init(account: IAccount) {
    const self = this;
    self.rx.dispatch({ type: AccountActions.UPDATE, payload: account });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }



}
