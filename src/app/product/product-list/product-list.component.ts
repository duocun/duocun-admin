import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { environment } from '../../../environments/environment';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { Product, IProduct, Category } from '../../product/product.model';

import { takeUntil } from '../../../../node_modules/rxjs/operators';
// import { ICart } from '../../cart/cart.model';
// import { CartActions } from '../../cart/cart.actions';
import { Subject } from '../../../../node_modules/rxjs';
import { CategoryService } from '../../category/category.service';
import * as moment from 'moment';
import { MerchantService } from '../../merchant/merchant.service';
// import { IDelivery } from '../../delivery/delivery.model';
import { RangeService } from '../../range/range.service';
import { MallService } from '../../mall/mall.service';
// import { IRestaurant } from '../../restaurant/restaurant.model';
import { IRange } from '../../range/range.model';
import { IMall } from '../../mall/mall.model';
import { IRestaurant } from '../../merchant/restaurant.model';

const ADD_IMAGE = 'add_photo.png';

@Component({
  providers: [ProductService],
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  MEDIA_URL: string = environment.MEDIA_URL;

  @Input() merchant: IRestaurant;
  @Input() items: any[]; // {product:x, quantity: y}
  @Input() mode: string;
  @Output() select = new EventEmitter();
  @Output() afterDelete = new EventEmitter();

  selected = null;
  onDestroy$ = new Subject();
  cart;
  deliveryDate; // moment object
  // delivery: IDelivery;
  ranges: IRange[];
  malls: IMall[];

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  constructor(
    private mallSvc: MallService,
    private rangeSvc: RangeService,
    private productSvc: ProductService,
    private merchantSvc: MerchantService,
    private categorySvc: CategoryService,
    private router: Router,
    private rx: NgRedux<IAppState>
  ) {
    const self = this;

    // this.rx.select<ICart>('cart').pipe(takeUntil(this.onDestroy$)).subscribe((cart: ICart) => {
    //   this.cart = cart;
    //   // if (this.products) {
    //   //   self.categorySvc.find().pipe(takeUntil(self.onDestroy$)).subscribe(categories => {
    //   //     self.groups = self.groupByCategory(this.products, categories);
    //   //     self.groups.map(group => {
    //   //       group.items.map(groupItem => {
    //   //         const cartItem: ICartItem = cart.items.find(item => item.productId === groupItem.product._id);
    //   //         groupItem.quantity = cartItem ? cartItem.quantity : 0;
    //   //       });
    //   //     });
    //   //   });
    //   // }
    // });

    // this.rx.select('delivery').pipe(takeUntil(this.onDestroy$)).subscribe((x: IDelivery) => {
    //   this.delivery = x;
    //   this.deliveryDate = x.date; // moment object
    // });

    // this.rangeSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(ranges => {
    //   this.ranges = ranges;
    //   const origin = this.delivery.origin;
    //   const rs = this.rangeSvc.getAvailableRanges({ lat: origin.lat, lng: origin.lng }, ranges);
    // });

    // this.mallSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(malls => {
    //   this.malls = malls;
    // });
  }

  isNotOpening(restaurant) {
    // if (moment().isSame(this.deliveryDate, 'day')) {
    //   return this.merchantSvc.isNotOpening(restaurant);
    // } else {
    //   return false;
    // }
  }

  addToCart(p: any) {
    const item = this.items.find(it => it.productId === p.productId);
    item.quantity += 1;
    // if (this.merchantSvc.isClosed(this.restaurant, this.deliveryDate)) {
    //   alert('该商家休息，暂时无法配送');
    //   return;
    // }

    // if (this.isNotOpening(this.restaurant)) {
    //   alert('已过下单时间，该商家下单截止到' + this.restaurant.endTime + 'am');
    //   return;
    // }

    // const origin = this.delivery.origin;
    // if (origin) {
    //   const rs = this.rangeSvc.getAvailableRanges({ lat: origin.lat, lng: origin.lng }, this.ranges);
    //   const mall = this.malls.find(m => m._id === this.restaurant.malls[0]);

    //   if (!this.mallSvc.isInRange(mall, rs)) {
    //     alert('该商家不在配送范围内，暂时无法配送');
    //     return;
    //   }
    // }

    // this.rx.dispatch({
    //   type: CartActions.ADD_TO_CART,
    //   payload: {
    //     items: [{
    //       productId: p._id, productName: p.name, price: p.price, quantity: 1, pictures: p.pictures, cost: p.cost,
    //       merchantId: p.merchantId, merchantName: this.restaurant.name
    //     }]
    //   }
    // });
  }

  removeFromCart(p: any) {
    const item = this.items.find(it => it.productId === p.productId);
    item.quantity -= 1;
    // this.rx.dispatch({
    //   type: CartActions.REMOVE_FROM_CART,
    //   payload: {
    //     items: [{
    //       productId: p._id, productName: p.name, price: p.price, quantity: 1, pictures: p.pictures,
    //       merchantId: p.merchantId, merchantName: this.restaurant.name
    //     }]
    //   }
    // });
  }

  getProductImage(p: Product) {
    if (p.pictures && p.pictures[0] && p.pictures[0].url) {
      return environment.MEDIA_URL + p.pictures[0].url;
    } else {
      return null;
    }
  }

  onQuantityChanged(v, item) {
    // const p = item.product;
    // const quantity = v ? v : 0;
    // this.rx.dispatch({
    //   type: CartActions.UPDATE_QUANTITY,
    //   payload: {
    //     items: [{
    //       productId: p._id, productName: p.name, price: p.price, quantity: quantity, pictures: p.pictures,
    //       merchantId: p.merchantId, merchantName: this.restaurant.name
    //     }]
    //   }
    // });
  }

  getImageSrc(p) {
    if (p.fpath) {
      return this.MEDIA_URL + p.fpath;
    } else {
      return this.MEDIA_URL + ADD_IMAGE;
    }
  }

  onSelect(p) {
    this.selected = p;
    this.select.emit({ 'product': p });
  }

  change(p: IProduct) {
    this.router.navigate(['admin/products/' + p._id]);
  }

  add() {
    // this.router.navigate(['admin/product']);
    // this.router.navigate(['admin/product'], { queryParams: { restaurant_id: this.restaurant._id } });
  }

  delete(p) {
    const self = this;
    // this.productSvc.deleteById(p._id).subscribe(x => {
    //   self.selected = null;
    //   self.afterDelete.emit({ product: p });
    // });
  }
}



