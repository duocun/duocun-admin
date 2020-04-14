import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IOrder, IOrderItem } from '../order/order.model';
import { EntityService } from '../entity.service';
import { CookieService } from '../cookie.service';
import { IProduct } from '../product/product.model';
import { Observable } from 'rxjs';


@Injectable()
export class OrderService extends EntityService {
  url;

  constructor(
    public authSvc: CookieService,
    public http: HttpClient
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'Orders';
  }

  getQuantity(items: IOrderItem[]) {
    let quantity = 0;
    let nDrinks = 0;
    items.map(it => {
      const product = it.product;
      if (product) {
        if (product.categoryId === '5cbc5df61f85de03fd9e1f12') { // drink
          nDrinks += it.quantity;
        } else {
          quantity += it.quantity;
        }
      }
    });
    return { quantity: quantity, nDrinks: nDrinks };
  }

  // pickup --- has to be '11:20' or '12:00' for now
  updateDeliveryTime( orderId: string, pickup: string ): Observable<IOrder> {
    const url = this.url + '/updateDelivered';
    return this.doPatch(url, { orderId: orderId, pickup: pickup });
  }

}
