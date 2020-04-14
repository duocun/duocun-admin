import { Component, OnInit } from '@angular/core';
import { RegionService } from '../../region/region.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { IRegion } from '../../region/region.model';
import { RangeService } from '../../range/range.service';
import { IRange } from '../../range/range.model';
import { IAssignment } from '../../assignment/assignment.model';
import { AssignmentService } from '../../assignment/assignment.service';
import * as moment from 'moment';
import { FormBuilder } from '../../../../node_modules/@angular/forms';
import { MatDatepickerInputEvent } from '../../../../node_modules/@angular/material/datepicker';
import { DistanceService } from '../../distance/distance.service';
import { OrderService } from '../../order/order.service';
import * as uuid from 'uuid';

const Colors = {
  pink: 'http://maps.google.com/mapfiles/ms/icons/pink.png',
  yellow: 'http://maps.google.com/mapfiles/ms/icons/yellow.png',
  purple: 'http://maps.google.com/mapfiles/ms/icons/purple.png',
  blue: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
  green: 'http://maps.google.com/mapfiles/ms/icons/green.png',
  orange: 'http://maps.google.com/mapfiles/ms/icons/orange.png',
  red: 'http://maps.google.com/mapfiles/ms/icons/red.png',
  // aqua: '#00ffff',
  // azure: '#f0ffff',
  // beige: '#f5f5dc',
  // black: '#000000',
  // blue: '#0000ff',
  // brown: '#a52a2a',
  // cyan: '#00ffff',
  // darkblue: '#00008b',
  // darkcyan: '#008b8b',
  // darkgrey: '#a9a9a9',
  // darkgreen: '#006400',
  // darkkhaki: '#bdb76b',
  // darkmagenta: '#8b008b',
  // darkolivegreen: '#556b2f',
  // darkorange: '#ff8c00',
  // darkorchid: '#9932cc',
  // darkred: '#8b0000',
  // darksalmon: '#e9967a',
  // darkviolet: '#9400d3',
  // fuchsia: '#ff00ff',
  // gold: '#ffd700',
  // green: '#008000',
  // indigo: '#4b0082',
  // khaki: '#f0e68c',
  // lightblue: '#add8e6',
  // lightcyan: '#e0ffff',
  // lightgreen: '#90ee90',
  // lightgrey: '#d3d3d3',
  // lightpink: '#ffb6c1',
  // lightyellow: '#ffffe0',
  // lime: '#00ff00',
  // magenta: '#ff00ff',
  // maroon: '#800000',
  // navy: '#000080',
  // olive: '#808000',
  // orange: '#ffa500',
  // pink: '#ffc0cb',
  // purple: '#800080',
  // violet: '#800080',
  // red: '#ff0000',
  // silver: '#c0c0c0',
  // white: '#ffffff',
  // yellow: '#ffff00'
};

@Component({
  selector: 'app-assignment-map',
  templateUrl: './assignment-map.component.html',
  styleUrls: ['./assignment-map.component.scss']
})
export class AssignmentMapComponent implements OnInit {

  location = { lat: 43.8515003, lng: -79.3823725, placeId: 'ChIJsdx07TQrK4gRLx1zHjnKEbg' };
  places = [];
  ranges = [];
  onDestroy$ = new Subject();
  regions: IRegion[];
  assignments: IAssignment[];
  dateForm;
  colors = {};
  mapId = uuid.v4();

  constructor(
    private fb: FormBuilder,
    private regionSvc: RegionService,
    private rangeSvc: RangeService,
    private assignmentSvc: AssignmentService,
    private orderSvc: OrderService,
    private distanceSvc: DistanceService
  ) {
    // const deliveryDate = moment(this.orders[0].delivered);
    this.rangeSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((rs: IRange[]) => {
      this.ranges = rs;
    });
    this.dateForm = this.fb.group({ date: [''] });
    this.loadActiveRegions();
  }

  get date() { return this.dateForm.get('date'); }

  loadActiveRegions() {
    this.regionSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe((rs: IRegion[]) => {
      const colors = {};
      const colorNames = Object.keys(Colors);
      let i = 0;
      rs.map((r: IRegion) => {
        colors[r._id] = Colors[colorNames[i]];
        i++;
        r.radius = 10;
      });
      this.colors = colors;
      this.regions = rs;
    });
  }

  ngOnInit() {
    const deliveryDate = moment().set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    this.date.setValue(deliveryDate);
    this.reloadAssignments(deliveryDate);
  }

  reloadAssignments(deliveryDate) {
    this.assignmentSvc.find({ delivered: deliveryDate }).pipe(takeUntil(this.onDestroy$)).subscribe((rs: IAssignment[]) => {
      const places = [];
      if (rs && rs.length > 0) {
        rs.map(r => {
          places.push({ lat: r.location.lat, lng: r.location.lng, icon: this.colors[r.regionId], name: r.clientName });
        });
        this.places = places;
      } else {
        const q = {delivered: deliveryDate, status: { $nin: ['del', 'bad', 'tmp'] }};
        this.orderSvc.find(q).pipe(takeUntil(this.onDestroy$)).subscribe(os => {
          const redIcon = 'http://maps.google.com/mapfiles/ms/icons/red.png';
          os.map(r => {
            places.push({ lat: r.location.lat, lng: r.location.lng, icon: redIcon, name: r.clientName });
          });
          this.places = places;
        });
      }
    });
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    const deliveryDate = moment(event.value).set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    this.date.setValue(deliveryDate);

    this.reloadAssignments(deliveryDate);
  }
}
