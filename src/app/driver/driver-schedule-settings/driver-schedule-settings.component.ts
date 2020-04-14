import { Component, OnInit, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
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
import { Status, IDriverSchedule } from '../../driver/driver.model';
import { MatTableDataSource, MatSort, MatSnackBar } from '../../../../node_modules/@angular/material';
import { ILocation } from '../../location/location.model';
// import { OrderService } from '../../order/order.service';
import { IOrder } from '../../order/order.model';
import { MerchantService } from '../../merchant/merchant.service';
import { DriverScheduleService } from '../driver-schedule.service';

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
  selector: 'app-driver-schedule-settings',
  templateUrl: './driver-schedule-settings.component.html',
  styleUrls: ['./driver-schedule-settings.component.scss']
})
export class DriverScheduleSettingsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mall;
  @Input() delivered; // moment object

  orders;
  onDestroy$ = new Subject();
  regionList: IRegion[];
  assignments: IAssignment[];
  drivers = [];
  driverId;
  places;
  colors = {};
  center = { lat: 43.8515003, lng: -79.3823725, placeId: 'ChIJsdx07TQrK4gRLx1zHjnKEbg' };
  merchantIds: string[] = [];
  selectedSchedule;
  form;
  polygons = [];


  displayedColumns: string[] = ['delivered', 'driverName', 'regionIds', 'id'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // get driver() { return this.form.get('driver'); }
  // get regions() { return this.form.get('regions'); }

  constructor(
    private driverSvc: DriverService,
    private locationSvc: LocationService,
    private regionSvc: RegionService,
    private merchantSvc: MerchantService,
    private driverScheduleSvc: DriverScheduleService,
    private assignmentSvc: AssignmentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // this.form = this.fb.group({
    //   driver: [''],
    //   regions: ['']
    // });

    this.regionSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(regions => {
      this.regionList = regions;

      this.driverSvc.find({ status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe((drivers) => {
        this.drivers = drivers;
        // this.loadDrivers(drivers);
        // this.reload(this.delivered, this.drivers, this.merchantIds);
      });
    });
  }

  ngOnInit() {
    this.reload(this.delivered, this.drivers);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnChanges(v) {
    if (this.delivered && this.mall) {
      this.driverSvc.find({ status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe((drivers) => {
        this.drivers = drivers;
        this.reload(this.delivered, this.drivers);
      });
    }
  }

  getDate(dt: string) {
    if (dt) {
      return dt.split('T')[0];
    } else {
      return '';
    }
  }

  compareDriverFn(d1: any, d2: any) {
    return d1 && d2 && d1.accountId === d2.accountId;
  }

  getAddress(loc: ILocation) {
    return loc.streetNumber + ' ' + loc.streetName + ', ' + loc.subLocality ? loc.subLocality : loc.city;
  }

  onSelectRow(row) {
    this.selectedSchedule = row;
    // this.driver.patchValue(row.driverId);
    // this.regions.patchValue(row.regionIds);
  }

  onSave(t) {
    // const t = this.selectedSchedule;
    const d = this.drivers.find(x => x.accountId === t.driverId);
    const data: IDriverSchedule = {
      _id: '',
      driverId: d.accountId,
      driverName: d.accountName,
      regionIds: t.regionIds ? t.regionIds : [],
      mallId: this.mall._id,
      status: Status.ACTIVE,
      delivered: this.delivered.toISOString(),
      created: new Date(),
      modified: new Date()
    };

    // this.driver.setValue(data.driverId);
    // this.regions.setValue(data.regionIds);
    if (t && t._id) {
      this.driverScheduleSvc.update({ _id: t._id }, data).pipe(takeUntil(this.onDestroy$)).subscribe((x) => {
        this.snackBar.open('', '已更新', { duration: 1000 });
        this.reload(this.delivered, this.drivers, (schedules) => {
          const s = schedules.find(sc => sc.driverId === this.selectedSchedule.driverId);
          this.onSelectRow(s);
        });
      });
    } else {
      delete data._id;
      this.driverScheduleSvc.save(data).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
        this.snackBar.open('', '已保存', { duration: 1000 });
        this.reload(this.delivered, this.drivers, (schedules) => {
          const s = schedules.find(sc => sc.driverId === this.selectedSchedule.driverId);
          this.onSelectRow(s);
        });
      });
    }
  }

  onDriverChanged($event, row) {
    const driverId = $event.value;
    const driver = this.drivers.find(x => x.accountId === driverId);
    row.dirverId = driver.accountId;
    row.driverName = driver.accountName;
  }

  onActivate(r) {
    if (r && r._id) {
      this.driverScheduleSvc.update({ _id: r._id }, { status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
        r.status = Status.ACTIVE;
        this.reload(this.delivered, this.drivers);
        this.snackBar.open('', '司机已激活', { duration: 1000 });
      });
    }
  }

  onDeactivate(r) {
    if (r && r._id) {
      this.driverScheduleSvc.update({ _id: r._id }, { status: Status.INACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
        r.status = Status.INACTIVE;
        this.reload(this.delivered, this.drivers);
        this.snackBar.open('', '司机已停用', { duration: 1000 });
      });
    }
  }

  getRegionsStr(regionIds, allRegions) {
    const names = [];
    if (regionIds) {
      regionIds.map(rid => {
        const region = allRegions.find(r => r._id === rid);
        if (region) {
          names.push(region.name);
        }
      });
      return names.join(', ');
    } else {
      return '';
    }
  }

  reload(delivered: any, drivers: any[], cb?: any) {
    const dt = delivered.toISOString();
    const query = { delivered: dt, mallId: this.mall._id };

    this.driverScheduleSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe(schedules => {
      const datas = [];
      drivers.map(driver => {
        const schedule = schedules.find(s => s.driverId === driver.accountId);

        if (schedule) {
          datas.push(schedule);
        } else {
          datas.push({
            id: '',
            driverId: driver.accountId,
            driverName: driver.accountName,
            regionIds: [],
            mallId: this.mall._id,
            status: Status.INACTIVE,
            delivered: this.delivered.toISOString(),
            created: new Date(),
            modified: new Date()
          });
        }
      });

      const ds = datas.sort((a, b) => {
        if (a.status === Status.ACTIVE && b.status !== Status.ACTIVE) {
          return -1; // b at top
        } else if (a.status !== Status.ACTIVE && b.status === Status.ACTIVE) {
          return 1;
        } else {
          return (a.driverName < b.driverName) ? -1 : 1;
        }
      });

      this.dataSource = new MatTableDataSource(ds);
      this.dataSource.sort = this.sort;

      if (cb) {
        cb(schedules);
      }
    });
    // this.reloadColor(drivers);

    // this.orderSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
    //   self.orders = orders;
    //   self.assignmentSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe(ass => {
    //     const assignments = [];
    //     orders.map((order: IOrder) => {
    //       const assignment: IAssignment = ass.find(a => a.orderId === order._id);
    //       assignments.push({ // display in table
    //         id: assignment ? assignment._id : '',
    //         status: 'new',
    //         orderId: order._id,
    //         code: order.code,
    //         clientId: order.clientId,
    //         clientName: order.clientName,
    //         merchantId: order.merchantId,
    //         merchantName: order.merchantName,
    //         driverId: assignment ? assignment.driverId : '',
    //         driverName: assignment ? assignment.driverName : '',
    //         delivered: order.delivered
    //       });
    //     });

    //     const sorted = assignments.sort((a, b) => {
    //       return (a.driverName < b.driverName) ? -1 : 1;
    //     });
    //     this.dataSource = new MatTableDataSource(sorted);
    //     this.dataSource.sort = this.sort;

    //     // update maps
    //     // this.orderSvc.find({ delivered: range, status: { $ne: 'del' } })
    //     // .pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
    //     this.orders = orders;
    //     this.showAssignmentMarkers(orders, assignments, this.colors);
    //     // });
    //   });
    // });
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
    this.drivers.map(d => {
      regions = regions.concat(d.regions);
    });

    // if (regions.length > this.regions.length) {
    //   alert('Duplicated regions assign to the driver');
    // } else if (regions.length < this.regions.length) {
    //   alert('Missed assign regions');
    // }
  }

  reassign() {
    const self = this;
    // if (this.drivers && this.drivers.length > 0) {
    //   const dt = this.delivered.toISOString();
    //   const query = { delivered: dt, merchantId: { $in: this.merchantIds }, status: { $nin: ['bad', 'del', 'tmp'] } };
    //   this.orderSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe((os: IOrder[]) => {
    //     this.orders = os;
    //     const assignmentQuery = { delivered: dt, merchantId: { $in: this.merchantIds } };
    //     this.assignmentSvc.find(assignmentQuery).pipe(takeUntil(this.onDestroy$)).subscribe(as => {
    //       const updates = this.setDrivers(as, this.drivers);
    //       const datas = updates.map((a: IAssignment) => {
    //         return {
    //           query: { id: a._id },
    //           data: { driverId: a.driverId, driverName: a.driverName }
    //         };
    //       });
    //       const orderIds = as.map(a => a.orderId);
    //       const remainOrders = os.filter(order => !orderIds.find(id => id === order._id));
    //       let assignments = this.groupByRegions(remainOrders, this.regions);
    //       assignments = this.setDrivers(assignments, this.drivers);

    //       if (assignments && assignments.length > 0) {
    //         self.assignmentSvc.insertMany(assignments).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
    //           if (datas && datas.length > 0) {
    //             self.assignmentSvc.bulkUpdate({data: datas}).pipe(takeUntil(this.onDestroy$)).subscribe(y => {
    //               alert('Reassign Sucessful!');
    //               this.reload(this.delivered, this.drivers, this.merchantIds);
    //             });
    //           } else {
    //             alert('Reassign Sucessful!');
    //             this.reload(this.delivered, this.drivers, this.merchantIds);
    //           }
    //         });
    //       } else {
    //         if (datas && datas.length > 0) {
    //           self.assignmentSvc.bulkUpdate({data: datas}).pipe(takeUntil(this.onDestroy$)).subscribe(y => {
    //             alert('Reassign Sucessful!');
    //             this.reload(this.delivered, this.drivers, this.merchantIds);
    //           });
    //         } else {
    //           alert('Reassign Sucessful!');
    //           this.reload(this.delivered, this.drivers, this.merchantIds);
    //         }
    //       }
    //     });
    //   });
    // } else {
    //   alert('Require drivers for assignment');
    // }
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

  getLngBoundary(points) {
    let north = points[0];
    let south = points[0];
    for (let i = 1; i < points.length; i++) {
      if (points[i].lng < north.lng) {
        north = points[i];
      }
      if (points[i].lng > north.lng) {
        south = points[i];
      }
    }
    return { north: north.lng, south: south.lng };
  }

  getNorthBondary(lng, points) {
    const northPoints = points.filter(p => p.lng === lng);
    let nw = northPoints[0];
    let ne = northPoints[0];
    for (let i = 1; i < northPoints.length; i++) {
      if (northPoints[i].lat < nw.lat) {
        nw = northPoints[i];
      }
      if (northPoints[i].lat > ne.lat) {
        ne = northPoints[i];
      }
    }
    return { nw: nw, ne: ne };
  }

  getLatPoints(lng, points, latStep, lngStep) {
    const ps = points.filter(p => p.lng === lng);
    let w = ps[0];
    let e = ps[0];
    for (let i = 1; i < ps.length; i++) {
      if (ps[i].lat < w.lat) {
        w = ps[i];
      }
      if (ps[i].lat > e.lat) {
        e = ps[i];
      }
    }
    return { w: w, e: e };
  }

  getLatBoundary(w, e, latStep, lngStep) {
    const nw = { lat: w.lat - latStep, lng: w.lng - lngStep };
    const sw = { lat: w.lat - latStep, lng: w.lng + lngStep };
    const ne = { lat: w.lat + latStep, lng: w.lng - lngStep };
    const se = { lat: w.lat + latStep, lng: w.lng + lngStep };

    return [nw, ne, se, sw];
  }

  getBoundary(points) {
    const lngs = [];
    points.map(p => {
      const lng = lngs.find(l => l === p.lng);
      if (!lng) {
        // lngs.push
      }
    });
  }


}
