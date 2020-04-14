import { Injectable } from '@angular/core';
import { EntityService } from '../entity.service';
import { CookieService } from '../cookie.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends EntityService {
  url;
  constructor(
    public cookieSvc: CookieService,
    public http: HttpClient,
  ) {
    super(cookieSvc, http);
    this.url = super.getBaseUrl() + 'Categories';
  }
}
