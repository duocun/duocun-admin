import { Injectable } from '@angular/core';
import { CookieService } from '../cookie.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { EntityService } from '../entity.service';

@Injectable({
  providedIn: 'root'
})
export class ClientBalanceService extends EntityService {
  url;

  constructor(
    public authSvc: CookieService,
    public http: HttpClient,
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'ClientBalances';
  }
}
