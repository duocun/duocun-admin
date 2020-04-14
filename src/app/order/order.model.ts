import { Address, IAccount } from '../account/account.model';
import { ILocation } from '../location/location.model';
import { IMall } from '../mall/mall.model';
import { IProduct } from '../product/product.model';
import { IRestaurant } from '../merchant/restaurant.model';
// import { ILocation } from '../location/location.model';

export interface IContact {
  _id?: string;
  accountId?: string;
  username?: string;
  phone?: string;
  // account: IAccount;
  placeId?: string;
  location?: ILocation;
  address?: string;
  unit?: string;
  buzzCode?: string;
  verificationCode?: string;
  created?: Date;
  modified?: Date;
}

export interface IOrder {
  _id?: string;
  id?: string;
  code?: string;
  client ?: IContact;
  merchant?: IRestaurant;
  driver?: IAccount;
  cost?: number;
  price?: number;
  clientId?: string;
  clientName?: string;
  // clientPhoneNumber?: string;
  merchantId?: string;
  merchantName?: string;
  // stuffId?: string;   // deprecated since 2019-05-15, replaced with driverId
  // stuffName?: string; // deprecated since 2019-05-15, replaced with driverName
  // driverId?: string;
  // driverName?: string;
  // driverPhoneNumber?: string;
  status?: string;
  note?: string;
  address?: string;
  location?: ILocation;
  delivered?: Date;
  created?: Date;
  modified?: Date;
  items?: IOrderItem[];
  deliveryAddress?: Address;
  deliveryCost?: number;
  deliveryDiscount?: number;
  overRangeCharge?: number;
  groupDiscount?: number;
  productTotal?: number;
  subtotal1?: number;
  subtotal2?: number;
  tips?: number;
  tax?: number;
  total?: number;
  quantity?: number;
  paymentMethod?: string;
}

export class Order implements IOrder {
  id: string;
  clientId: string;
  clientName: string;
  clientPhoneNumber?: string;
  merchantId: string;
  merchantName: string;
  stuffId: string;
  status: string;
  note: string;
  address: string;
  location?: ILocation;
  delivered: Date;
  created: Date;
  modified: Date;
  items: OrderItem[];
  deliveryAddress: Address;
  deliveryCost: number;
  deliveryDiscount: number;
  overRangeCharge?: number;
  groupDiscount?: number;
  productTotal?: number;
  subtotal1?: number;
  subtotal2?: number;
  tips?: number;
  tax?: number;
  total?: number;
  paymentMethod?: string;
  constructor(data?: IOrder) {
    Object.assign(this, data);
  }
}

export interface IOrderItem {
  // id?: number;
  // productId: string;
  // productName: string;
  // merchantId: string;
  // merchantName: string;
  // price: number;
  // cost?: number;

  quantity: number;
  product?: IProduct;
  merchant?: IRestaurant; // for order summary list
}

export class OrderItem implements IOrderItem {
  id: number;
  productId: string;
  productName: string;
  merchantId: string;
  merchantName: string;
  price: number;
  quantity: number;
  cost: number;
  constructor(data?: IOrderItem) {
    Object.assign(this, data);
  }
}
