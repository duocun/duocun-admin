import { Injectable } from '@angular/core';
import { EntityService } from '../entity.service';
import { CookieService } from '../cookie.service';
import { HttpClient } from '@angular/common/http';
import { IAccount } from '../account/account.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends EntityService {
  public url;

  constructor(
    public cookieSvc: CookieService,
    public http: HttpClient
  ) {
    super(cookieSvc, http);
    this.url = this.getBaseUrl() + 'Assignments';
  }

  assignOrder(orderId: string, to: IAccount) {

  }
}
