

import { Component, OnInit, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { IOrder } from '../order.model';
import { IMall } from '../../mall/mall.model';
import { LocationService } from '../../location/location.service';
import { MallService } from '../../mall/mall.service';
import { Subject, iif } from '../../../../node_modules/rxjs';
import { takeUntil, take } from '../../../../node_modules/rxjs/operators';
import { RegionService } from '../../region/region.service';
import { IRegion } from '../../region/region.model';
import { IAssignment } from '../../assignment/assignment.model';
import { MomentDateAdapter } from '../../../../node_modules/@angular/material-moment-adapter';
import * as moment from 'moment';
import { AccountService } from '../../account/account.service';
import { Role, IAccount } from '../../account/account.model';
import { AssignmentService } from '../../assignment/assignment.service';
import { FormBuilder, FormArray } from '../../../../node_modules/@angular/forms';
import { DriverService } from '../../driver/driver.service';
import { Status } from '../../driver/driver.model';
import { MatTableDataSource, MatSort, MatSnackBar } from '../../../../node_modules/@angular/material';
import { ILocation } from '../../location/location.model';
import { OrderService } from '../order.service';

const Colors = {
  green: 'http://labs.google.com/ridefinder/images/mm_20_green.png',
  yellow: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png',
  purple: 'http://labs.google.com/ridefinder/images/mm_20_purple.png',
  blue: 'http://labs.google.com/ridefinder/images/mm_20_blue.png',
  orange: 'http://labs.google.com/ridefinder/images/mm_20_orange.png',
  red: 'http://labs.google.com/ridefinder/images/mm_20_red.png',
  // lightblue: 'http://labs.google.com/ridefinder/images/mm_20_lightblue.png',
  gray: 'http://labs.google.com/ridefinder/images/mm_20_gray.png',
  brown: 'http://labs.google.com/ridefinder/images/mm_20_brown.png',
  white: 'http://labs.google.com/ridefinder/images/mm_20_white.png',
  black: 'http://labs.google.com/ridefinder/images/mm_20_black.png', // pink
  green1: 'http://labs.google.com/ridefinder/images/mm_20_green.png',
  yellow1: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png',
  purple1: 'http://labs.google.com/ridefinder/images/mm_20_purple.png',
  blue1: 'http://labs.google.com/ridefinder/images/mm_20_blue.png',
  orange1: 'http://labs.google.com/ridefinder/images/mm_20_orange.png',
  red1: 'http://labs.google.com/ridefinder/images/mm_20_red.png',
  // lightblue1: 'http://labs.google.com/ridefinder/images/mm_20_lightblue.png',
  gray1: 'http://labs.google.com/ridefinder/images/mm_20_gray.png',
  brown1: 'http://labs.google.com/ridefinder/images/mm_20_brown.png',
  white1: 'http://labs.google.com/ridefinder/images/mm_20_white.png',
  black1: 'http://labs.google.com/ridefinder/images/mm_20_black.png', // pink
};

@Component({
  selector: 'app-auto-assign',
  templateUrl: './auto-assign.component.html',
  styleUrls: ['./auto-assign.component.scss']
})
export class AutoAssignComponent implements OnInit, OnDestroy, OnChanges {
  @Input() delivered; // moment object
  @Input() orders: IOrder[];
  onDestroy$ = new Subject();
  regions: IRegion[];
  assignments: IAssignment[];
  drivers = [];
  driver;
  driverId;
  places;
  selected;
  colors = {};
  center = { lat: 43.8515003, lng: -79.3823725, placeId: 'ChIJsdx07TQrK4gRLx1zHjnKEbg' };

  displayedColumns: string[] = ['code', 'driverName', 'clientName', 'merchantName'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(
    private driverSvc: DriverService,
    private locationSvc: LocationService,
    private regionSvc: RegionService,
    private orderSvc: OrderService,
    private assignmentSvc: AssignmentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.regionSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(regions => {
      this.regions = regions;
      this.driverSvc.find({ status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe((drivers) => {
        this.loadDrivers(drivers);
        this.reload(this.delivered, this.drivers);
      });
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnChanges(v) {
    if (v.orders && v.orders.currentValue && v.orders.currentValue.length > 0) {
      this.orders = v.orders.currentValue;
    }

    if (v.delivered && v.delivered.currentValue) {
      this.regionSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(regions => {
        this.regions = regions;
        this.driverSvc.find({ status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe((drivers) => {
          this.loadDrivers(drivers);
          this.reload(this.delivered, this.drivers);
        });
      });
    }
  }

  getAddress(loc: ILocation) {
    return loc.streetNumber + ' ' + loc.streetName + ', ' + loc.subLocality ? loc.subLocality : loc.city;
  }

  onSave(t: IAssignment) {
    // const assingment = this.assignments.find(x => x._id === t._id);
    const data = { driverId: this.driver.accountId, driverName: this.driver.accountName };

    if (t._id) {
      this.assignmentSvc.update({ _id: t._id }, data).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.snackBar.open('', '分配已更新', { duration: 1000 });
        this.reload(this.delivered, this.drivers);
      });
    } else {
      const assignment: IAssignment = {
        code: t.code,
        status: 'active',
        orderId: t.orderId,
        clientId: t.clientId,
        merchantId: t.merchantId,
        driverId: t.driverId,
        driverName: t.driverName,
        delivered: t.delivered,
        created: new Date(),
        modified: new Date()
        // regionId?: string;
        // clientName: t.clientName,
        // clientPhoneNumber?: string;
        // merchantId?: string;
        // merchantName?: string;
        // note?: string;
        // location?: ILocation;
        // delivered?: Date;
        // items?: IOrderItem[];
        // total?: number;
        // mallId?: string;
        // mallName?: string;
        // driverId?: string;
        // driverName?: string;
      };
      this.assignmentSvc.save(assignment).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
        this.snackBar.open('', '分配已保存', { duration: 1000 });
        this.reload(this.delivered, this.drivers);
      });
    }
  }

  onDriverChanged($event) {
    const driverId = $event.value;
    this.driver = this.drivers.find(x => x.accountId === driverId);
  }

  setDrivers(assignments, drivers) {
    assignments.map(a => {
      const driver = drivers.find(d => {
        return (d.regions && d.regions.length > 0) ? d.regions.includes(a.regionId) : false;
      });

      if (driver) {
        a.driverId = driver.accountId;
        a.driverName = driver.accountName;
      }
    });
    return assignments;
  }

  reload(delivered: any, drivers: any[]) {
    const self = this;
    const date = moment(this.delivered);
    const dt = date.toISOString();
    // const range = { $gt: date.startOf('day').toDate(), $lt: date.endOf('day').toDate() };
    const query = { delivered: dt, status: { $nin: ['bad', 'del', 'tmp'] } };
    this.reloadColor(drivers);

    this.orderSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
      self.orders = orders;
      self.assignmentSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe(ass => {
        const assignments = [];
        orders.map((order: IOrder) => {
          const assignment: IAssignment = ass.find(a => a.orderId === order._id);
          assignments.push({ // display in table
            id: assignment ? assignment._id : '',
            status: 'new',
            orderId: order._id,
            code: order.code,
            clientId: order.client.accountId,
            merchantId: order.merchant._id,
            driverId: assignment ? assignment.driverId : '',
            delivered: order.delivered,
            clientName: order.client.username,
            merchantName: order.merchant.name,
            driverName: assignment ? assignment.driverName : ''
          });
        });

        const sorted = assignments.sort((a, b) => {
          return (a.driverName < b.driverName) ? -1 : 1;
        });
        this.dataSource = new MatTableDataSource(sorted);
        this.dataSource.sort = this.sort;

        // update maps
        // this.orderSvc.find({ delivered: range, status: { $ne: 'del' } })
        // .pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
        this.orders = orders;
        this.showAssignmentMarkers(orders, assignments, this.colors);
        // });
      });
    });
  }

  groupByRegions(orders: IOrder[], regions: IRegion[]) {
    const assignments: IAssignment[] = [];
    const lat = regions[0].lat;
    const lng = regions[0].lng;

    orders.map((order: IOrder) => {
      let selected = regions[0];
      let shortest = this.locationSvc.getDirectDistance(order.location, { lat: lat, lng: lng });
      // console.log(order.clientName + ' ' + selected.code + ': ' + shortest);
      for (let i = 1; i < regions.length; i++) {
        const region = regions[i];
        const distance = this.locationSvc.getDirectDistance(order.location, { lat: region.lat, lng: region.lng });
        // console.log(order.clientName + ' ' + region.code + ': ' + distance);
        if (shortest > distance) {
          selected = region;
          shortest = distance;
        }
      }
      // console.log('Shortest: ' + order.clientName + ' ' + selected.code + ' ' + selected._id + ': ' + shortest);

      const assignment: IAssignment = {
        code: order.code,
        status: 'new',
        orderId: order._id,
        clientId: order.client.accountId,
        merchantId: order.merchant._id,
        driverId: '',
        delivered: order.delivered,
        created: new Date(),
        modified: new Date(),
        // distance: shortest,
        regionId: selected._id, // special !!!
        // clientName: order.clientName,
        // clientPhoneNumber: order.clientPhoneNumber,
        // merchantName: order.merchantName,
        // note: order.note,
        // location: order.location,
        // items: order.items,
        // total: order.total,
        // mallId: '', // selectedMall._id,
        // mallName: '', // selectedMall.name,
        // driverId: '',
        // driverName: ''
      };

      assignments.push(assignment);
    });

    return assignments;
  }

  reloadColor(drivers) {
    const colors = {};
    const colorNames = Object.keys(Colors);
    let i = 0;
    drivers.map(d => {
      colors[d.accountId] = Colors[colorNames[i]];
      i++;
    });
    this.colors = colors;
  }

  loadDrivers(drivers) {
    const ds = drivers.sort((a, b) => {
      return (a.order < b.order) ? -1 : 1;
    });
    this.drivers = ds;

    let regions = [];
    let i = 0;
    this.drivers.map(d => {
      regions = regions.concat(d.regions);
      i++;
    });

    // if (regions.length > this.regions.length) {
    //   alert('Duplicated regions assign to the driver');
    // } else if (regions.length < this.regions.length) {
    //   alert('Missed assign regions');
    // }
  }

  reassign() {
    const self = this;
    if (this.orders && this.orders.length > 0) {
      const deliveryDate = moment(this.orders[0].delivered);

      if (this.drivers && this.drivers.length > 0) {
        const query = { delivered: deliveryDate.toISOString(), status: { $nin: ['bad', 'del', 'tmp'] } };
        this.orderSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
          this.orders = orders;
          let assignments = this.groupByRegions(orders, this.regions);
          assignments = this.setDrivers(assignments, this.drivers);
          this.assignments = assignments;

          this.assignmentSvc.remove({ delivered: deliveryDate }).pipe(takeUntil(this.onDestroy$)).subscribe(r => {
            self.assignmentSvc.insertMany(assignments).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
              alert('Reassign Sucessful!');
              // console.log('Re-Assignment Done!');
              this.reload(this.delivered, this.drivers);
            });
          });
        });
      } else {
        alert('Require drivers for assignment');
      }
    } else {
      alert('No orders for assignment');
    }
  }

  showAssignmentMarkers(orders: IOrder[], assignments, colors) {
    const places = [];

    orders.map(order => {
      const assignment = (assignments && assignments.length > 0) ? assignments.find(a => a.orderId === order._id) : null;
      const location = order.location;
      const clientName = order.client.username;

      if (assignment) {
        const driverId = assignment.driverId;
        const c = colors[driverId] ? colors[driverId] : 'http://labs.google.com/ridefinder/images/mm_20_red.png';
        places.push({ lat: location.lat, lng: location.lng, icon: colors[driverId], name: clientName });
      } else {
        const redIcon = 'http://labs.google.com/ridefinder/images/mm_20_red.png';
        places.push({ lat: location.lat, lng: location.lng, icon: redIcon, name: clientName });
      }
    });
    this.places = places;
  }

  onClickMap(e) {

  }

  onSelectRow(row) {
    this.selected = row;
  }
}
