import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CookieService } from './cookie.service';

export interface IEntity {
  id?: string;
  _id?: string;
}

@Injectable()
export class EntityService {
  authPrefix = environment.AUTH_PREFIX;
  public url = environment.API_URL;

  constructor(
    public cookieSvc: CookieService,
    public http: HttpClient
  ) {
  }

  getBaseUrl() {
    return environment.API_URL;
  }

  // without database join
  quickFind(filter?: any, distinct?: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
      // httpParams = httpParams.append('access_token', LoopBackConfig.getAuthPrefix() + accessTokenId);
    }
    if (filter) {
      headers = headers.append('filter', JSON.stringify(filter));
    }
    if (distinct) {
      headers = headers.append('distinct', JSON.stringify(distinct));
    }
    return this.http.get(this.url + '/qFind', { headers: headers });
  }

  // with database join
  find(filter?: any, distinct?: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
      // httpParams = httpParams.append('access_token', LoopBackConfig.getAuthPrefix() + accessTokenId);
    }
    if (filter) {
      headers = headers.append('filter', JSON.stringify(filter));
    }
    if (distinct) {
      headers = headers.append('distinct', JSON.stringify(distinct));
    }
    return this.http.get(this.url, { headers: headers });
  }

  findById(id: string, filter?: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    if (filter) {
      headers = headers.append('filter', JSON.stringify(filter));
    }
    return this.http.get(this.url + '/' + id, { headers: headers });
  }

  doGet(url: string, filter?: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    if (filter) {
      headers = headers.append('filter', JSON.stringify(filter));
    }
    return this.http.get(url, {headers: headers});
  }

  doPost(url: string, entity: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    return this.http.post(url, entity, {headers: headers});
  }

  save(entity: IEntity): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    return this.http.post(this.url, entity, {headers: headers});
  }

  replace(entity: IEntity): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    return this.http.put(this.url, entity, {headers: headers});
  }

  update(filter: any, data: any, options?: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    return this.http.patch(this.url, {filter: filter, data: data, options: options}, {headers: headers});
  }

  remove(filter?: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    if (filter) {
      headers = headers.append('filter', JSON.stringify(filter));
    }
    return this.http.delete(this.url, {headers: headers});
  }
  removeById(id: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    return this.http.delete(this.url + '/' + id, { headers: headers });
  }

  // data --- { data: any[], options }
  bulkUpdate(data: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    return this.http.patch(this.url, data, { headers: headers });
  }

  insertMany(entities: IEntity[]): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    return this.http.post(this.url, entities, { headers: headers });
  }

  doPatch(url: string, data: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const accessTokenId = this.cookieSvc.getAccessToken();
    if (accessTokenId) {
      headers = headers.append('Authorization', this.authPrefix + accessTokenId);
    }
    return this.http.patch(url, data, {headers: headers});
  }
}
