export enum Status {
  ACTIVE = 1,
  INACTIVE = 2
}

export interface IDriverSchedule {
  _id?: string;
  driverId: string;
  driverName: string;
  regionIds: string[];
  mallId: string;
  status: Status;
  delivered: string;
  created: Date;
  modified: Date;
}

export interface IDriverHour {
  _id?: string;
  driverId: string;
  driverName: string;
  accountId: string;
  accountName: string;
  amount: number;
  hours: number;
  delivered: string;
  created: Date;
  modified: Date;
}
