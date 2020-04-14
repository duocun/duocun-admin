import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AccountService } from '../account.service';

import { Account, Role } from '../account.model';
import { CookieService } from '../../cookie.service';
import { NgRedux } from '../../../../node_modules/@angular-redux/store';
import { IAppState } from '../../store';
import { AccountActions } from '../account.actions';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  public user;
  // public account = '';
  // public password = '';

  token = '';
  errMsg = '';
  auth2: any;
  form: FormGroup;
  private onDestroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cookieSvc: CookieService,
    private router: Router,
    private accountSvc: AccountService,
    private rx: NgRedux<IAppState>,
  ) {
    this.form = this.fb.group({
      account: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get account() { return this.form.get('account'); }
  get password() { return this.form.get('password'); }

  ngOnInit() {
    // this.rx.dispatch({
    //   type: PageActions.UPDATE_URL,
    //   payload: 'login'
    // });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onLogin() {
    const self = this;
    const v = this.form.value;
    // this.cookieSvc.removeCookies();
    if (this.form.valid) {
      this.accountSvc.login(v.account, v.password).subscribe((data: any) => {
        if (data) {
          self.cookieSvc.setUserId(data.userId);
          self.cookieSvc.setAccessToken(data.id);
          self.accountSvc.getCurrentUser().subscribe((account: Account) => {
            if (account) {
              self.rx.dispatch({ type: AccountActions.UPDATE, payload: account }); // update header, footer icons
              if (account.roles && account.roles.includes(Role.SUPER) ) {
                this.router.navigate(['order/main']);
              } else {
                this.router.navigate(['account/login']);
              }
            } else {
              this.errMsg = 'Wrong username or password';
              // this.router.navigate(['account/login']);
            }
          },
            (error) => {
              this.errMsg = error.message || 'login failed.';
              console.error('An error occurred', error);
            });
        } else {
          console.log('anonymous try to login ... ');
        }
      });
    } else {
      this.errMsg = 'Wrong username or password';
    }
  }
  onForgetPassword() {
    // this.router.navigate(["/forget-password"]);;
    // return false;
  }

  onChangeAccount(e) {
    this.errMsg = '';
  }

  onChangePassword(e) {
    this.errMsg = '';
  }

  onFocusAccount(e) {
    this.errMsg = '';
  }

  onFocusPassword(e) {
    this.errMsg = '';
  }

  toPage(page: string) {
    this.router.navigate(['account/' + page]);
  }

}

