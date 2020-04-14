import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Product, Picture, IPicture, ICategory, IProduct } from '../product.model';
import { FormBuilder, Validators, FormControl } from '../../../../node_modules/@angular/forms';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ProductService } from '../product.service';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnChanges, OnDestroy {
  categoryList = [];
  restaurantList = [];
  // colorList:Color[] = [];
  // id: number;
  uploadedPictures: string[] = [];
  uploadUrl: string = environment.API_URL + 'files/upload';
  onDestroy$ = new Subject();
  urls = [];
  file;
  form;
  selectedCategory: ICategory;
  picture;

  MEDIA_URL = environment.MEDIA_URL;

  @Input() merchantId: string;
  @Input() product: Product;
  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  @Output() afterUpload = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private productSvc: ProductService,
    private categorySvc: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.createForm();
  }

  createForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.maxLength(750)],
      price: ['', Validators.required],
      // merchantId: ['', Validators.required],
      categoryId: [''],
      // ownerId: new FormControl(),
    });
  }

  ngOnInit() {
    if (!this.product) {
      this.product = new Product();
      this.product.categoryId = '1'; // default category Id ?
    }

    this.uploadedPictures = (this.product.pictures || []).map(pic => pic.url);
    this.form.get('name').setValue(this.product.name);
    this.form.get('description').setValue(this.product.description);
    this.form.get('price').setValue(this.product.price);
    // this.form.get('merchantId').setValue(this.product.merchantId);
    this.form.get('categoryId').setValue(this.product.categoryId);

    // this.restaurantSvc.find().pipe(
    //   takeUntil(this.onDestroy$)
    // ).subscribe(r => {
    //   this.restaurantList = r;
    // });

    this.loadCategoryList();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnChanges(changes) {
    if (this.form && changes.product && changes.product.currentValue) {
      const p: IProduct = changes.product.currentValue;
      this.form.patchValue(p);
      this.selectedCategory = p.category;
    }
  }

  loadCategoryList() {
    const self = this;
    this.categorySvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((rs: ICategory[]) => {
      self.categoryList = rs;
      if (rs && rs.length > 0) {
        this.selectedCategory = rs[0];
      }
    },
      (err: any) => {
        self.categoryList = [];
      });
  }

  onToggleCategory(c: FormControl) {
    const v = c.value;
    if (c.value.checked) {
      v.checked = false;
    } else {
      v.checked = true;
    }
    c.patchValue(v);
  }

  onSelectRestaurant(id: string) {
    // let obj = this.restaurantList.find( x => { return x._id == id });
    // this.restaurant.setValue(obj);
    // this.restaurant.patchValue(m);
    // this.restaurant._id;
  }

  onSelectColor(id: string) {
    // let obj = this.colorList.find(x => {return x._id == id});
    // this.color.patchValue(obj);
    // this.color.patchValue({'id':id});
  }

  getCheckedCategories() {
    const cs = [];
    for (let i = 0; i < this.categoryList.length; i++) {
      // let c = this.categoryList[i];
      // if (this.categories.get(i.toString()).value) {
      //     cs.push(c);
      // }
    }
    return cs;
  }


  fillForm(event) {
    this.form.get('name').setValue(event.name);
    this.form.get('description').setValue(event.description);
    // this.form.get('ownerId').setValue(event.ownerId);
    // if (event.groups && event.groups.length > 0) {
    //   this.form.get('groupId').setValue(event.groups[0]._id);
    // } else {
    //   this.form.get('groupId').setValue(null);
    // }
    if (event.categories && event.categories.length > 0) {
      this.form.get('categoryId').setValue(event.categories[0]._id);
    } else {
      this.form.get('categoryId').setValue(null);
    }
    // this.form.get('eventDate').setValue(this.sharedSvc.getDate(event.fromDateTime));
    // this.form.get('categories')['controls'][0].setValue(group.categories[0]._id);
  }

  setPictures(restaurant: any) {
    // if (restaurant.pictures && restaurant.pictures.length > 0) {
    //   const picture = restaurant.pictures[0]; // fix me
    //   this.urls = [
    //     this.sharedSvc.getMediaUrl() + picture.url,
    //   ];
    // } else {
    //   this.urls = [''];
    // }
  }

  onAfterPictureUpload(e: any) {
    this.product.pictures = [{ fname: e.fname, url: e.fname }];
    this.file = e.file;
    this.urls = [this.MEDIA_URL + e.fname]; // show image in uploader
    this.afterUpload.emit();
    this.picture = e.fname;
  }

  onRemoved(event) {
    this.product.pictures.splice(this.product.pictures.findIndex(pic => pic.url === event.file.src));
  }

  save() {
    const self = this;
    const newV = this.form.value;
    const p: Product = new Product(newV);
    const merchantId = this.merchantId;

    // p._id = self.product ? self.product._id : null;
    // p.pictures = this.product.pictures;
    // if (this.product && this.product._id) {
    //   this.productSvc.replace(p).pipe(
    //     takeUntil(this.onDestroy$)
    //   ).subscribe(r => { });
    // } else {
    //   this.productSvc.save(p).pipe(
    //     takeUntil(this.onDestroy$)
    //   ).subscribe(r => { });
    // }
    // self.afterSave.emit({ restaurant_id: merchantId });
  }


  onCategoryChanged(e) {
    const catId = e.value;
    this.selectedCategory = this.categoryList.find(d => d._id === catId);
    // this.selectedCategoryId = this.selectedCategory._id;
    // this.reload();
  }
}

