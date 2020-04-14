import { Injectable } from '@angular/core';
import { EntityService } from '../entity.service';
import { Observable, of } from 'rxjs';
import { CookieService } from '../cookie.service';
import { HttpClient } from '@angular/common/http';
import { Account } from './account.model';
import { NgRedux } from '../../../node_modules/@angular-redux/store';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends EntityService {

  constructor(
    private ngRedux: NgRedux<Account>,
    public cookieSvc: CookieService,
    public http: HttpClient
  ) {
    super(cookieSvc, http);
    this.url = super.getBaseUrl() + 'Accounts';
  }

  signup(account: Account): Observable<any> {
    return this.http.post(this.url + '/signup', account);
  }

  // login --- return {id: tokenId, ttl: 10000, userId: r._id}
  login(username: string, password: string, rememberMe: boolean = true): Observable<any> {
    const credentials = {
      username: username,
      password: password
    };
    return this.http.post(this.url + '/login', credentials);
  }

  logout(): Observable<any> {
    // const state = this.ngRedux.getState();
    // if (state && state._id) {
    //   this.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: new Account() });
    // }
    return this.http.post(this.url + '/logout', {});
  }


  // ------------------------------------
  // return Account object or null
  getCurrentUser(): Observable<any> {
    const id: any = this.cookieSvc.getUserId();
    // const url = id ? (this.url + '/' + id) : (this.url + '/__anonymous__');
    if (id) {
      return this.findById(id);
    } else {
      return of(null);
    }
  }

  getCurrent(forceGet: boolean = false): Observable<Account> {
    // const self = this;
    // const state: any = this.ngRedux.getState();
    // if (!state || !state.account || !state.account._id || forceGet) {
    //   return this.getCurrentUser();
    // } else {
    //   return this.ngRedux.select<Account>('account');
    // }
    const id: any = this.cookieSvc.getUserId();
    // const url = id ? (this.url + '/' + id) : (this.url + '/__anonymous__');
    if (id) {
      return this.findById(id);
    } else {
      return of(null);
    }
  }
}
