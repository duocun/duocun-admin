import { Component, OnInit, OnChanges } from '@angular/core';
import { RegionService } from '../region.service';
import { IRegion } from '../region.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { FormBuilder } from '../../../../node_modules/@angular/forms';
import * as uuid from 'uuid';
import { AssignmentService } from '../../assignment/assignment.service';
import { OrderService } from '../../order/order.service';
import { IAssignment } from '../../assignment/assignment.model';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material';
import { Status } from '../../driver/driver.model';
import { DriverService } from '../../driver/driver.service';

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
  selector: 'app-region-config',
  templateUrl: './region-config.component.html',
  styleUrls: ['./region-config.component.scss']
})
export class RegionConfigComponent implements OnInit {
  center = { lat: 43.8515003, lng: -79.3823725, placeId: 'ChIJsdx07TQrK4gRLx1zHjnKEbg' };
  regions: IRegion[];
  activeRegions: IRegion[];
  forms = {};
  onDestroy$ = new Subject();
  index = 0;
  selected;
  places;
  colors = {};
  dateForm;
  drivers;

  constructor(
    private regionSvc: RegionService,
    private assignmentSvc: AssignmentService,
    private orderSvc: OrderService,
    private driverSvc: DriverService,
    private fb: FormBuilder
  ) {
    this.dateForm = this.fb.group({ date: [''] });
  }

  get date() { return this.dateForm.get('date'); }

  ngOnInit() {
    const deliveryDate = moment().set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    this.driverSvc.find({ status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe((drivers) => {
      const ds = drivers.sort((a, b) => {
        return (a.order < b.order) ? -1 : 1;
      });
      this.drivers = ds;
      this.reload(deliveryDate);
    });
  }

  reload(deliveryDate) {
    // All the regions
    this.regionSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(rs => {

      rs.map(r => {
        r.radius = 10;
        r.color = 'green';
        this.forms[r._id] = this.fb.group({
          name: [r.name],
          code: [r.code]
        });
      });

      this.regions = rs.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') {
          return -1; // b at top
        } else if (a.status !== 'active' && b.status === 'active') {
          return 1;
        } else {
          if (a.rank < b.rank) {
            return -1;
          } else {
            return 1;
          }
        }
      });

      this.activeRegions = this.getActiveRegions(rs);
      this.reloadAssignments(deliveryDate, this.colors);
    });
  }

  loadDrivers() {
    this.driverSvc.find({ status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe((drivers) => {
      const ds = drivers.sort((a, b) => {
        return (a.order < b.order) ? -1 : 1;
      });
      this.drivers = ds;
    });
  }

  getActiveRegions(rs: IRegion[]) {
    const colors = {};
    const colorNames = Object.keys(Colors);
    let i = 0;
    const a: IRegion[] = rs.filter(r => r.status === 'active');
    // a.map((r: IRegion) => {
    //   colors[r._id] = Colors[colorNames[i]];
    //   i++;
    // });

    this.drivers.map(r => {
      colors[r.accountId] = Colors[colorNames[i]];
      i++;
    });

    this.colors = colors;
    return a;
  }

  reloadAssignments(delivered: any, colors) {
    const self = this;
    const q = { delivered: delivered.toISOString(), status: { $nin: ['del', 'bad', 'tmp'] } };
    this.orderSvc.find(q).pipe(takeUntil(this.onDestroy$)).subscribe(os => {
      self.assignmentSvc.find({ delivered: delivered.toISOString() }).pipe(takeUntil(this.onDestroy$)).subscribe((rs: IAssignment[]) => {
        const places = [];
        if (rs && rs.length > 0) {
          rs.map(r => {
            const order = os.find(o => o._id === r.orderId);
            const location = order.location;
            places.push({ lat: location.lat, lng: location.lng, icon: colors[r.driverId], name: order.clientName });
          });
          this.places = places;
        } else { // if no assignment, show all the orders in red on map
          const redIcon = 'http://labs.google.com/ridefinder/images/mm_20_red.png';
          os.map(r => {
            places.push({ lat: r.location.lat, lng: r.location.lng, icon: redIcon, name: r.clientName });
          });
          this.places = places;
        }
      });
    });
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    const deliveryDate = moment(event.value).set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    this.date.setValue(deliveryDate);

    this.reloadAssignments(deliveryDate, this.colors);
  }

  onClickMap(e) {
    const id = uuid.v4();
    const idx = this.index;
    this.forms[id] = this.fb.group({
      name: ['Region' + this.index],
      code: ['CODE' + this.index]
    });
    const region = { id: id, name: 'Region' + idx, code: 'CODE' + idx, lat: e.lat, lng: e.lng, radius: 8, status: 'new' };
    this.regions.push(region);

    const r1 = this.regions.map(x => {
      x.color = (x._id === id) ? 'red' : 'green';
    });

    this.activeRegions = this.regions.filter(r => r.status === 'active' || r.status === 'new');
    this.index++;
  }

  onSave(r: IRegion) {
    const name = this.forms[r._id].get('name').value;
    const code = this.forms[r._id].get('code').value;
    const region: IRegion = { name: name, code: code, lat: r.lat, lng: r.lng, status: 'active' };
    this.regionSvc.save(region).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      r.status = 'active';
      const deliveryDate = moment().set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
      this.reload(deliveryDate);
      // this.activeRegions = this.regions.filter(y => y.status === 'active' || y.status === 'new');
    });
  }

  onActivate(r: IRegion) {
    this.regionSvc.update({ _id: r._id }, { status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      r.status = 'active';
      r.color = 'green';
      const deliveryDate = moment().set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
      this.reload(deliveryDate);
      this.activeRegions = this.regions.filter(y => y.status === 'active' || y.status === 'new');
    });
  }

  onDeactivate(r: IRegion) {
    this.regionSvc.update({ _id: r._id }, { status: 'inactive' }).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      r.status = 'inactive';
      const deliveryDate = moment().set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
      this.reload(deliveryDate);
      this.activeRegions = this.regions.filter(y => y.status === 'active' || y.status === 'new');
    });
  }

  onUpdate(r: IRegion) {
    const name = this.forms[r._id].get('name').value;
    const code = this.forms[r._id].get('code').value;
    this.regionSvc.update({ _id: r._id }, { name: name, code: code }).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
    });
  }

  onSelect(r: IRegion) {
    this.selected = r;

    const r1 = this.regions.map(x => {
      x.color = (x._id === r._id) ? 'red' : 'green';
    });
    this.activeRegions = this.regions.filter(x => x.status === 'active' || x.status === 'new');
  }

  onRemove(r: IRegion) {
    this.selected = r;
    this.regionSvc.remove({ id: r._id }).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      this.regions = this.regions.filter(y => y._id !== r._id);
      this.activeRegions = this.regions.filter(y => y.status === 'active' || y.status === 'new');
    });
  }
}
