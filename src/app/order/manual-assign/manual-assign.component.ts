import { Component, OnInit, Input, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { IOrder } from '../order.model';
import { Subject } from '../../../../node_modules/rxjs';
import { IRegion } from '../../region/region.model';
import { IAssignment } from '../../assignment/assignment.model';
import { IAccount, Role } from '../../account/account.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import * as moment from 'moment';
import { AccountService } from '../../account/account.service';
import { MatTableDataSource, MatSort, MatSnackBar } from '../../../../node_modules/@angular/material';
import { AssignmentService } from '../../assignment/assignment.service';
import { OrderService } from '../order.service';
import { ILocation } from '../../location/location.model';

@Component({
  selector: 'app-manual-assign',
  templateUrl: './manual-assign.component.html',
  styleUrls: ['./manual-assign.component.scss']
})
export class ManualAssignComponent implements OnInit, OnDestroy, OnChanges {

  @Input() delivered;
  @Input() orders: IOrder[];
  onDestroy$ = new Subject();
  groupedAssignments = [];
  regions: IRegion[];
  assignments: IAssignment[];
  drivers: IAccount[];
  assignmentForm;
  driverId;
  driver;

  displayedColumns: string[] = ['code', 'clientName', 'driverName', 'id'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private orderSvc: OrderService,
    private accountSvc: AccountService,
    private assignmentSvc: AssignmentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadDrivers();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnChanges(v) {
    if (v.orders && v.orders.currentValue) {
      this.orders = v.orders.currentValue;
      this.reload(this.orders);
    }
  }

  reload(orders: IOrder[]) {
    const self = this;
    const date = moment(this.delivered);
    const assignments = [];
    const range = { $gt: date.startOf('day').toDate(), $lt: date.endOf('day').toDate() };
    this.assignmentSvc.find({ delivered: range }).pipe(takeUntil(this.onDestroy$)).subscribe(as => {
      orders.map(order => {
        const assignment = as.find(x => x.orderId === order._id);
        const data: IAssignment = {
          _id: assignment ? assignment._id : null,
          code: order.code,
          distance: 0, // shortest / selected.coefficient,
          status: 'new',
          created: new Date(),
          modified: new Date(),
          orderId: order._id,
          regionId: '', // selected._id,
          clientId: order.client.accountId,
          merchantId: order.merchant._id,
          note: order.note,
          location: order.location,
          delivered: order.delivered,
          items: order.items,
          total: order.total,
          mallId: '', // selectedMall._id,
          mallName: '', // selectedMall.name,
          driverId: assignment ? assignment.driverId : '',
        };
        assignments.push(data);
        this.dataSource = new MatTableDataSource(assignments);
        this.dataSource.sort = this.sort;
      });

      this.assignments = assignments;
    });
  }

  loadDrivers() {
    let query;
    if (moment(this.delivered).isSame(moment(), 'day')) {
      query = { roles: Role.DRIVER, order: { $exists: true } };
    } else {
      query = { roles: Role.DRIVER };
    }

    this.accountSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe((drivers: IAccount[]) => {
      const ds = drivers.sort((a: IAccount, b: IAccount) => {
        return (a.order < b.order) ? -1 : 1;
      });
      this.drivers = ds;
    });
  }

  loadAssignments() {
    const self = this;
    const date = moment(this.delivered);
    const range = { $gt: date.startOf('day').toDate(), $lt: date.endOf('day').toDate() };
    this.assignmentSvc.find({ delivered: range }).pipe(takeUntil(this.onDestroy$)).subscribe(assignments => {
      self.assignments = assignments;
    });
  }

  onDriverChanged($event) {
    const driverId = $event.value;
    this.driver = this.drivers.find(x => x._id === driverId);
  }

  getAddress(loc: ILocation) {
    return loc.streetNumber + ' ' + loc.streetName + ', ' + loc.subLocality ? loc.subLocality : loc.city;
  }

  onSave(row) {
    if (row._id) {
      const d = this.assignments.find(x => x._id !== null && x._id === row._id);
      const data = {driverId: this.driver._id, driverName: this.driver.username};
      this.assignmentSvc.update({_id: row._id}, data).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.snackBar.open('', '分配已更新', { duration: 1000 });
        this.reload(this.orders);
      });
    } else {
      const d = this.assignments.find(x => x.code === row.code);
      this.assignmentSvc.save(d).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.snackBar.open('', ' 分配已保存', { duration: 1000 });
        this.reload(this.orders);
      });
    }

    // const assignment: IAssignment = {
    //   code: order.code,
    //   distance: 0, // shortest / selected.coefficient,
    //   status: 'new',
    //   created: new Date(),
    //   modified: new Date(),
    //   orderId: order._id,
    //   regionId: '', // selected._id,
    //   clientId: order.clientId,
    //   clientName: order.clientName,
    //   clientPhoneNumber: order.clientPhoneNumber,
    //   merchantId: order.merchantId,
    //   merchantName: order.merchantName,
    //   note: order.note,
    //   location: order.location,
    //   delivered: order.delivered,
    //   items: order.items,
    //   total: order.total,
    //   mallId: '', // selectedMall._id,
    //   mallName: '', // selectedMall.name,
    //   driverId: '',
    //   driverName: ''
    // };
  }
}
