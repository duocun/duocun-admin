import { IOrder } from "../order/order.model";

export enum MallRole {
  DISTANCE_CENTER = 1,
}

export interface IEntityBase {
  id?: string;
}

export interface IUserBase {
  id: string;
  username: string;
}

export interface IMall {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  radius?: number; // m
  restaurants?: IEntityBase[];
  workers?: IUserBase[];
  distance?: number; // Dynamic
  deliverFee?: number; // Dynamic
  fullDeliverFee?: number; // Dynamic
  created?: Date;
  modified?: Date;

  merchantIds?: string[]; // don't save to database
  orders?: IOrder[]; // don't save to database
}

// For Database
export class Mall implements IMall {
  id: string;
  name: string;
  description?: string;
  type: string;
  placeId?: string;
  lat: number;
  lng: number;
  radius: number; // m
  restaurants: IEntityBase[];
  workers: IUserBase[];
  created?: Date;
  modified?: Date;

  constructor(data?: IMall) {
    Object.assign(this, data);
  }
}

export interface IMallSchedule {
  _id?: string;
  mallId?: string;
  mallName?: string;
  areas: any;
  status: string;
  created?: Date;
  modified: Date;
}

export class MallSchedule implements IMallSchedule {
  _id?: string;
  mallId?: string;
  mallName?: string;
  areas: any;
  status: string;
  created?: Date;
  modified: Date;

  constructor(data?: IMallSchedule) {
    Object.assign(this, data);
  }
}
