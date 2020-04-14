import { Injectable } from '@angular/core';
import { EntityService } from '../entity.service';
import { CookieService } from '../cookie.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
// import { LocationService } from '../location/location.service';

@Injectable({
  providedIn: 'root'
})
export class RegionService extends EntityService {
  url;

  constructor(
    public cookieSvc: CookieService,
    public http: HttpClient,
    // public locationSvc: LocationService
  ) {
    super(cookieSvc, http);
    this.url = super.getBaseUrl() + 'Regions';
  }
}
