import { Component, OnInit, ViewChild } from '@angular/core';
import { Restaurant, IRestaurant } from '../restaurant.model';
import { RestaurantService } from '../restaurant.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { MatSnackBar, MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-merchant-setting',
  templateUrl: './merchant-setting.component.html',
  styleUrls: ['./merchant-setting.component.scss']
})
export class MerchantSettingComponent implements OnInit {
  onDestroy$ = new Subject();
  merchants;
  form;
  selectedRowId;
  selectedMerchant: any = { _id: '', name: '' };

  displayedColumns: string[] = ['rank', 'name',
  // 'pickupTime', 'startTime', 'endTime',
  'status', '_id'];
  deliver = 0;
  pickupColumns: string[] = ['orderEndTime', 'pickupTime', '_id'];

  pickupSource: MatTableDataSource<any>;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('picktime', { static: false }) picktime;
  @ViewChild('startime', { static: false }) startime;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private restaurantSvc: RestaurantService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      dow: ['', Validators.required],
      //pickupTime: ['', Validators.required],
      //startTime: ['', Validators.required],
      //endTime: ['', Validators.required],
      rank: ['', Validators.required],
      closeOfBusiness: ['']
    });
  }

  get name() { return this.form.get('name'); }
  get dow() { return this.form.get('dow'); }
  //get pickupTime() { return this.form.get('pickupTime'); }
  //get startTime() { return this.form.get('startTime'); }
  //get endTime() { return this.form.get('endTime'); }
  get rank() { return this.form.get('rank'); }
  get closeOfBusiness() { return this.form.get('closeOfBusiness'); }

  onDateChange(type, $event) {

  }

  ngOnInit() {
    this.reload();
  }

  // onMerchantSelectionChanged(e) {
  //   const merchantId = e.value;
  //   this.selectedMerchant._id = merchantId;
  // }

  onSubmit() {
    //const pickupTime = this.form.value.pickupTime;
    const orderDeadline = this.form.value.endTime;
    //const startTime = this.form.value.startTime;
    //const endTime = this.form.value.endTime;
    const dow = this.form.value.dow;
    const rank = this.form.value.rank;
    const closed = [this.form.value.closeOfBusiness];
    const query = { _id: this.selectedMerchant._id };
    const updates = {
      //pickupTime: pickupTime,
      orderDeadline: orderDeadline,
      //startTime: startTime,
      //endTime: endTime,
      dow: dow,
      closed: closed,
      rank: +rank
    };
    this.restaurantSvc.update(query, updates).pipe(takeUntil(this.onDestroy$)).subscribe(r => {
      this.snackBar.open('', '更新商家成功', { duration: 1000 });
      this.reload();
    });
  }

  reload() {
    this.restaurantSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((rs: any[]) => {
      rs.map(r => {
        //r.endTime = r.orderDeadline;
        // ----------------temporary code--------------------
        r.deliver = '3';
        // --------------------------------------------------
        if (r.closed && r.closed.length > 0) {
          r.closeOfBusiness = r.closed[0];
          this.closeOfBusiness.setValue(r.closed[0]);
        } else {
          r.closeOfBusiness = '';
          this.closeOfBusiness.setValue('');
        }
      });

      this.merchants = rs.sort((a, b) => {
        if (a.status === 'active' && b.status === 'inactive') {
          return -1;
        } else if (a.status === 'inactive' && b.status === 'active') {
          return 1;
        } else {
          if (a.rank < b.rank) {
            return -1;
          } else {
            return 1;
          }
        }
      });

      this.dataSource = new MatTableDataSource(this.merchants);
    });
  }

  onDeactivate(row) {
    const query = { _id: row._id };
    const updates = { status: 'inactive' };
    this.restaurantSvc.update(query, updates).pipe(takeUntil(this.onDestroy$)).subscribe(r => {
      this.snackBar.open('', '停用商家成功', { duration: 1000 });
      this.reload();
    });
  }

  onActivate(row) {
    const query = { _id: row._id };
    const updates = { status: 'active' };
    this.restaurantSvc.update(query, updates).pipe(takeUntil(this.onDestroy$)).subscribe(r => {
      this.snackBar.open('', '启用商家成功', { duration: 1000 });
      this.reload();
    });
  }

  onHighlight(row, me) {
    console.log(me);
    this.selectedRowId = row._id;
    const m = this.merchants.find(x => x._id === row._id);
    this.selectedMerchant = m;
    this.form.setValue({
      name: m.name,
      dow: m.dow,
      //pickupTime: m.pickupTime,
      //startTime: m.startTime ? m.startTime : '',
      //endTime: m.endTime ? m.endTime : '',
      rank: m.rank,
      closeOfBusiness: (m.closed && m.closed.length > 0) ? m.closed[0] : ''
    });
    this.deliver = m.deliver;
    this.pickupSource = new MatTableDataSource(m.phases);
  }

  onSelectDeliver(event) {
    this.deliver = event.value;
    // ???? to do: save deliver type
    this.selectedMerchant.deliver = this.deliver;
  }

  onAdd() {
    let p = this.picktime.nativeElement.value;
    if (!/\d\d:\d\d/.test(p)) {
      alert('Please input a correct pickup time.');
      return;
    }
    let s = this.startime.nativeElement.value;
    if (!/\d\d:\d\d/.test(s)) {
      alert('Please input a correct order start time.');
      return;
    }
    this.selectedMerchant.phases.push({ orderEnd: p, pickup: s });
    // ???? to do: save time slot
    this.pickupSource = new MatTableDataSource(this.selectedMerchant.phases);
    this.picktime.nativeElement.value = '';
    this.startime.nativeElement.value = '';
  }

  onDelete(row) {
    let ind = this.selectedMerchant.phases.findIndex(r => r.orderEndTime == row.orderEndTime && r.pickupTime == row.pickupTime );
    this.selectedMerchant.phases.splice(ind, 1);
    // ???? to do: save time slot
    this.pickupSource = new MatTableDataSource(this.selectedMerchant.phases);
  }
}
