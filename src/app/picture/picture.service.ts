import { Injectable } from '@angular/core';
import { CookieService } from '../cookie.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { EntityService } from '../entity.service';

@Injectable({
  providedIn: 'root'
})
export class PictureService extends EntityService {
  url;
  constructor(
    public cookieSvc: CookieService,
    public http: HttpClient,
    // private pictureApi: PictureApi,
    // private categoryApi: CategoryApi,
    // private productApi: ProductApi
  ) {
    super(cookieSvc, http);
    this.url = super.getBaseUrl() + 'Pictures';
  }
}
