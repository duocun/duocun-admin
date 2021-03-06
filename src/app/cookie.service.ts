import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  setAccessToken(token: string) {
    // localStorage.setItem('token', token);
    Cookies.remove('duocun-token');
    Cookies.set('duocun-token', token);
  }

  getAccessToken(): string {
    // return localStorage.getItem('token');
    return Cookies.get('duocun-token');
  }

  setUserId(id: string) {
    Cookies.remove('duocun-userId');
    Cookies.set('duocun-userId', id);
  }

  getUserId(): string {
    return Cookies.get('duocun-userId');
  }
}
