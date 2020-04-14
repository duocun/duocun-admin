import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
import { RestaurantService } from '../../merchant/restaurant.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product = new Product();
  onDestroy$ = new Subject();
  merchants;
  selectedMerchantId;
  products;
  mediaUrl;

  constructor(
    private restaurantSvc: RestaurantService,
    private productSvc: ProductService
  ) {
    this.mediaUrl = environment.MEDIA_URL;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.restaurantSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(rs => {
      this.merchants = rs;
      const merchant = rs[0];
      this.selectedMerchantId = merchant._id;
      this.productSvc.find({ merchantId: merchant._id }).pipe(takeUntil(this.onDestroy$)).subscribe(ps => {
        this.products = ps;
      });
    });
  }

  onAfterSave(event) {
    // const restaurantId = event.restaurant_id;
    // if (this.account.type === 'super') {
    //     this.router.navigate(['admin/products'], { queryParams: { restaurant_id: restaurantId } });
    // } else if (this.account.type === 'business') {
    //     this.router.navigate(['admin']);
    // }
  }

  onAfterUpload(event) {
    this.productSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(ps => {
      this.products = ps;
    });
  }

  onMerchantChanged(e) {
    const merchantId = e.value;
    this.selectedMerchantId = merchantId;
    this.productSvc.find({ merchantId: merchantId }).pipe(takeUntil(this.onDestroy$)).subscribe(ps => {
      this.products = ps;
    });
  }

  onSelectProduct(p) {
    this.product = p;
  }

  newProduct() {
    const product = new Product();
    product.merchantId = this.selectedMerchantId;
    this.product = product;
  }
}
