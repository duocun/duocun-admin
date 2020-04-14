import { Product } from '../product/product.model';
// import { Picture } from '../picture.model';
// import { Address } from '../entity.model';
import { GeoPoint } from '../location/location.model';
import { Order } from '../order/order.model';

export interface IPhase {
  orderEnd: string;
  pickup: string;
}

export interface IRestaurant {
  _id?: string;
  id?: string; // obsoleted
  name?: string;
  description?: string;
  location?: GeoPoint;
  ownerId?: string;
  mallId?: string;
  created?: string;
  modified?: string;
  distance?: number;
  deliveryCost?: number;
  fullDeliveryFee?: number;

  products?: Product[]; // do not save to db
  orders?: Order[];     // do not save to db

  pickupTime?: string;    // obsoleted
  orderDeadline?: string; // obsoleted
  startTime?: string;     // obsoleted
  endTime?: string;       // obsoleted
  rank?: number;

  phases: IPhase[];
}

// For database
export class Restaurant implements IRestaurant {
  name: string;
  description: string;
  location: GeoPoint;
  ownerId: string;
  mallId: string;
  created: string;
  modified: string;
  id: string;
  products: Product[];
  pickupTime?: string;
  orderDeadline?: string;
  startTime?: string;
  endTime?: string;
  rank?: number;

  phases: IPhase[];

  constructor(data?: IRestaurant) {
    Object.assign(this, data);
  }
}
