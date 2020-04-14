import { Injectable } from '@angular/core';
import { EntityService } from '../entity.service';
import { CookieService } from '../cookie.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MerchantScheduleService extends EntityService {
  url;

  constructor(
    public authSvc: CookieService,
    public http: HttpClient,
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'MerchantSchedules';
  }
}

