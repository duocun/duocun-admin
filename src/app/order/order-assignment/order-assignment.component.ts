import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
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
@Component({
  selector: 'app-order-assignment',
  templateUrl: './order-assignment.component.html',
  styleUrls: ['./order-assignment.component.scss']
})
export class OrderAssignmentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() delivered;
  @Input() orders: IOrder[];
  onDestroy$ = new Subject();
  groupedAssignments = [];
  regions: IRegion[];
  assignments: IAssignment[];
  drivers: IAccount[];
  assignmentForm;

  get coefficients() {
    return this.assignmentForm.get('coefficients') as FormArray;
  }

  constructor(
    private locationSvc: LocationService,
    private regionSvc: RegionService,
    private accountSvc: AccountService,
    private assignmentSvc: AssignmentService,
    private fb: FormBuilder
  ) {
    // this.assignmentForm = this.fb.group({
    //   coefficients: this.fb.array([])
    // });
  }

  ngOnInit() {
    // if (this.orders && this.orders.length > 0) {
    //   this.reload();
    // }

    this.loadDrivers();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnChanges(v) {
    if (v.orders && v.orders.currentValue && v.orders.currentValue.length > 0) {
      this.orders = v.orders.currentValue;
      this.reload();
    }
  }

  reload2(date) {
    const self = this;
    const range = { $gt: date.startOf('day').toDate(), $lt: date.endOf('day').toDate() };
    this.assignmentSvc.find({ delivered: range }).pipe(takeUntil(this.onDestroy$)).subscribe(assignments => {
      const groupedAssignments = [];

      // const form = this.fb.group({
      //   coefficients: this.fb.array([])
      // });
      // self.assignmentForm = form;

      // rs.map(r => {
      //   const assignmentList = assignments.filter(x => x.regionId === r._id);
      //   groupedAssignments.push({ regionName: r.name, assignments: assignmentList });

      //   const farray = form.get('coefficients') as FormArray;
      //   farray.push(this.fb.control(1, []));
      // });

      self.assignments = assignments;
      self.groupedAssignments = groupedAssignments;
      // self.regions = rs.sort((a: IRegion, b: IRegion) => {
      //   return (a.order < b.order) ? -1 : 1;
      // });
    });
  }

  reload() {
    const self = this;
    const date = this.delivered;
    const range = { $gt: date.startOf('day').toDate(), $lt: date.endOf('day').toDate() };

    this.regionSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe((rs: IRegion[]) => {
      self.assignmentSvc.find({ delivered: range }).pipe(takeUntil(this.onDestroy$)).subscribe(assignments => {
        const groupedAssignments = [];
        const form = this.fb.group({
          coefficients: this.fb.array([])
        });
        rs.map(r => {
          const assignmentList = assignments.filter(x => x.regionId === r._id);
          groupedAssignments.push({ regionName: r.name, assignments: assignmentList });

          const farray = form.get('coefficients') as FormArray;
          farray.push(this.fb.control(1, []));
        });

        self.assignmentForm = form;
        self.assignments = assignments;
        self.groupedAssignments = groupedAssignments;
        self.regions = rs.sort((a: IRegion, b: IRegion) => {
          return (a.order < b.order) ? -1 : 1;
        });
      });
    });
  }

  partition(orders: IOrder[], regions: IRegion[]) {
    const assignments: IAssignment[] = [];
    orders.map((order: IOrder) => {
      const row = [];
      let shortest = this.locationSvc.getDirectDistance(order.location,
        { lat: regions[0].lat, lng: regions[0].lng }) * regions[0].coefficient;
      let selected = regions[0];

      regions.map((region: IRegion) => {
        const distance = this.locationSvc.getDirectDistance(order.location, { lat: region.lat, lng: region.lng }) * region.coefficient;

        if (shortest > distance) {
          selected = region;
          shortest = distance;
        }
      });

      const assignment: IAssignment = {
        code: order.code,
        distance: shortest / selected.coefficient,
        status: 'new',
        created: new Date(),
        modified: new Date(),
        orderId: order._id,
        regionId: selected._id,
        clientId: order.client.accountId,
        // clientName: order.clientName,
        // clientPhoneNumber: order.clientPhoneNumber,
        merchantId: order.merchant._id,
        // merchantName: order.merchantName,
        note: order.note,
        location: order.location,
        delivered: order.delivered,
        items: order.items,
        total: order.total,
        mallId: '', // selectedMall._id,
        mallName: '', // selectedMall.name,
        driverId: '',
        driverName: ''
      };

      assignments.push(assignment);
    });
    return assignments;
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

  reassign() {
    const cs = this.coefficients.value;

    if (this.orders && this.orders.length > 0) {
      const deliveryDate = moment(this.orders[0].delivered);

      if (this.drivers && this.drivers.length === 1) {
        const region = this.regions[0];
        region.coefficient = +cs[0];
        const regions = [region];
        const drivers = {};
        drivers[region._id] = this.drivers[0];

        const assignments = this.partition(this.orders, regions);
        assignments.map(assignment => {
          const regionId = assignment.regionId;
          assignment.driverId = drivers[regionId]._id;
          assignment.driverName = drivers[regionId].username;
        });
        const groupedAssignments = [{ regionName: region.name, assignments: assignments }];

        this.assignments = assignments;
        this.groupedAssignments = groupedAssignments;

        this.assignmentSvc.remove({ delivered: deliveryDate }).pipe(takeUntil(this.onDestroy$)).subscribe(r => {
          this.assignmentSvc.insertMany(assignments).pipe(
            takeUntil(this.onDestroy$)
          ).subscribe(x => {
            alert('Reassign Sucessful!');
            console.log('Re-Assignment Done!');
          });
        });
      } else {
        const drivers = [];
        let i = 0;
        this.regions.map(r => {
          drivers[r._id] = this.drivers[i];
          r.coefficient = +cs[i];
          i++;
        });

        const assignments = this.partition(this.orders, this.regions);
        assignments.map(assignment => {
          const regionId = assignment.regionId;
          assignment.driverId = drivers[regionId]._id;
          assignment.driverName = drivers[regionId].username;
        });

        const groupedAssignments = [];
        this.regions.map(r => {
          const assignmentList = assignments.filter(x => x.regionId === r._id);
          groupedAssignments.push({ regionName: r.name, assignments: assignmentList });
        });

        this.assignments = assignments;
        this.groupedAssignments = groupedAssignments;

        this.assignmentSvc.remove({ delivered: deliveryDate }).pipe(
          takeUntil(this.onDestroy$)
        ).subscribe(r => {
          this.assignmentSvc.insertMany(this.assignments).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
            // this.reload();
            alert('Reassign Sucessful!');
            console.log('Auto Assignment Done!');
          });
        });
      }

      // });
      // }
    }

  }
}
