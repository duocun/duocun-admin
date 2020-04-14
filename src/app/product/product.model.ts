
export interface IProduct {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  merchantId: string;
  categoryId: string;
  created?: Date;
  modified?: Date;
  openDays?: number[];
  // restaurant?: Restaurant;
  category?: Category;
  pictures?: IPicture[];
  dow?: string[];
}

export class Product implements IProduct {
  name: string;
  description: string;
  price: number;
  cost?: number;
  categoryId: string;
  merchantId: string;
  created: Date;
  modified: Date;
  id: string;
  // owner: Restaurant;
  // restaurant: Restaurant;
  category: Category;
  pictures: IPicture[];
  dow?: string[];
  constructor(data?: IProduct) {
    Object.assign(this, data);
  }
}

export interface IPicture {
  id?: number;
  fname: string;
  url: string;
  created?: Date;
  modified?: Date;
}

export class Picture implements IPicture {
  id: number;
  fname: string;
  url: string;
  created: Date;
  modified: Date;
  constructor(data?: IPicture) {
    Object.assign(this, data);
  }
}

export interface ICategory {
  id?: string;
  name: string;
  description?: string;
  created?: Date;
  modified?: Date;
}

export class Category implements ICategory {
  id: string;
  name: string;
  description: string;
  created: Date;
  modified: Date;
  constructor(data?: ICategory) {
    Object.assign(this, data);
  }
}
