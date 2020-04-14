import { Component, OnInit, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { LocationService } from '../../location/location.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil, take } from '../../../../node_modules/rxjs/operators';
import { RegionService } from '../../region/region.service';
import { IRegion } from '../../region/region.model';
import { IAssignment } from '../../assignment/assignment.model';
import * as moment from 'moment';
import { AssignmentService } from '../../assignment/assignment.service';
import { FormBuilder, FormArray } from '../../../../node_modules/@angular/forms';
import { DriverService } from '../../driver/driver.service';
import { Status } from '../../driver/driver.model';
import { MatTableDataSource, MatSort, MatSnackBar } from '../../../../node_modules/@angular/material';
import { ILocation } from '../../location/location.model';
import { OrderService } from '../../order/order.service';
import { IOrder } from '../../order/order.model';
import { MerchantService } from '../../merchant/merchant.service';
import { IRestaurant } from '../../merchant/restaurant.model';

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
  selector: 'app-driver-assignment',
  templateUrl: './driver-assignment.component.html',
  styleUrls: ['./driver-assignment.component.scss']
})
export class DriverAssignmentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mall;
  @Input() delivered; // moment object

  orders;

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
  merchantIds: string[] = [];

  displayedColumns: string[] = ['code', 'driverName', 'clientName', 'merchantName', 'id'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private driverSvc: DriverService,
    private locationSvc: LocationService,
    private regionSvc: RegionService,
    private merchantSvc: MerchantService,
    private orderSvc: OrderService,
    private assignmentSvc: AssignmentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.regionSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(regions => {
      this.regions = regions;
    });

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnChanges(v) {
    if (this.mall && this.delivered) { // v.mall && v.mall.currentValue
      this.driverSvc.find({ status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe((drivers) => {
        this.loadDrivers(drivers);
        this.merchantIds = this.mall.merchantIds;

        if (this.delivered) {
          this.reload(this.delivered, this.drivers, this.merchantIds);
        }
      });
    }
  }

  getAddress(loc: ILocation) {
    return loc.streetNumber + ' ' + loc.streetName + ', ' + loc.subLocality ? loc.subLocality : loc.city;
  }

  onSave(t: IAssignment) {
    // const assingment = this.assignments.find(x => x._id === t._id);
    const data = { driverId: t.driverId, driverName: t.driverName };
    const assignmentId = t._id;
    if (assignmentId) {
      this.assignmentSvc.update({ _id: assignmentId }, data).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.snackBar.open('', '分配已更新', { duration: 1000 });
        // this.reload(this.delivered, this.drivers, this.merchantIds);
      });
    } else {
      const assignment: IAssignment = {
        code: t.code,
        status: 'active',
        orderId: t.orderId,
        clientId: t.clientId,
        merchantId: t.merchantId,
        driverId: t.driverId,
        delivered: t.delivered,
        created: new Date(),
        modified: new Date()
      };
      this.assignmentSvc.save(assignment).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
        this.snackBar.open('', '分配已保存', { duration: 1000 });
        // this.reload(this.delivered, this.drivers, this.merchantIds);
      });
    }
  }

  onDriverChanged($event, row) {
    const driverId = $event.value;
    const driver = this.drivers.find(x => x.accountId === driverId);
    row.dirverId = driver.accountId;
    row.driverName = driver.accountName;
  }

  onSelectRow(row) {
    this.selected = row;
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

  reload(delivered: any, drivers: any[], merchantIds: string[]) {
    const self = this;
    const dt = delivered.toISOString();
    const query = {
      delivered: dt,
      merchantId: { $in: merchantIds },
      status: { $nin: ['bad', 'del', 'tmp'] }
    };

    this.reloadColor(drivers);

    self.assignmentSvc.quickFind(query).pipe(takeUntil(this.onDestroy$)).subscribe(ass => {
      const assignments = [];
      this.mall.orders.map((order: IOrder) => {
        const assignment: IAssignment = ass.find(a => a.orderId === order._id);
        assignments.push({ // display in table
          _id: assignment ? assignment._id : '',
          status: 'new',
          orderId: order._id,
          code: order.code,
          clientId: order.clientId,
          clientName: order.clientName,
          merchantId: order.merchantId,
          merchantName: order.merchantName,
          driverId: assignment ? assignment.driverId : '',
          delivered: order.delivered
        });
      });
      this.dataSource = new MatTableDataSource(assignments);
      this.dataSource.sort = this.sort;

      // update maps
      this.orders = this.mall.orders;
      this.showAssignmentMarkers(this.orders, assignments, this.colors);
    });
  }

  groupByRegions(orders: IOrder[], regions: IRegion[]) {
    const assignments: IAssignment[] = [];
    const lat = regions[0].lat;
    const lng = regions[0].lng;

    orders.map((order: IOrder) => {
      let selected: IRegion = regions[0];
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
        clientId: order.clientId,
        merchantId: order.merchantId,
        driverId: '',
        delivered: order.delivered,
        created: new Date(),
        modified: new Date(),

        regionId: selected._id, // special !!!
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
  }

  reassignMulti() {
    const self = this;
    const merchantIds = this.merchantIds;
    const drivers = this.drivers;

    if (drivers && drivers.length > 0) {
      const dt = this.delivered.toISOString();
      const query = { delivered: dt, merchantId: { $in: merchantIds }, status: { $nin: ['bad', 'del', 'tmp'] } };
      const assignmentQuery = { delivered: dt, merchantId: { $in: merchantIds } };

      this.orderSvc.quickFind(query).pipe(takeUntil(this.onDestroy$)).subscribe((os: IOrder[]) => {
        this.orders = os;
        this.assignmentSvc.quickFind(assignmentQuery).pipe(takeUntil(this.onDestroy$)).subscribe(as => {
          const updates = this.setDrivers(as, this.drivers);
          const datas = updates.map((a: IAssignment) => {
            return {
              query: { id: a._id },
              data: { driverId: a.driverId, driverName: a.driverName }
            };
          });
          const assignedOrderIds = as.map(a => a.orderId);
          const unassignedOrders = os.filter(order => !assignedOrderIds.find(id => id === order._id));
          let assignments = this.groupByRegions(unassignedOrders, this.regions);
          assignments = this.setDrivers(assignments, drivers);

          if (assignments && assignments.length > 0) {
            self.assignmentSvc.insertMany(assignments).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
              if (datas && datas.length > 0) {
                self.assignmentSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(y => {
                  alert('Reassign Sucessful!');
                  this.reload(this.delivered, this.drivers, this.merchantIds);
                });
              } else {
                alert('Reassign Sucessful!');
                this.reload(this.delivered, this.drivers, this.merchantIds);
              }
            });
          } else {
            if (datas && datas.length > 0) {
              self.assignmentSvc.bulkUpdate({ data: datas }).pipe(takeUntil(this.onDestroy$)).subscribe(y => {
                alert('Reassign Sucessful!');
                this.reload(this.delivered, this.drivers, this.merchantIds);
              });
            } else {
              alert('Reassign Sucessful!');
              this.reload(this.delivered, this.drivers, this.merchantIds);
            }
          }
        });
      });
    } else {
      alert('Require drivers for assignment');
    }
  }

  showAssignmentMarkers(orders: IOrder[], assignments, colors) {
    const places = [];

    orders.map(order => {
      const assignment = (assignments && assignments.length > 0) ? assignments.find(a => a.orderId === order._id) : null;
      const location = order.location;
      const clientName = order.clientName;

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


}
