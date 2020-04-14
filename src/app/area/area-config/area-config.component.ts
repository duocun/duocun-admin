import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { MatSnackBar, MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';
import { AreaService } from '../area.service';
import { IArea } from '../area.model';

@Component({
  selector: 'app-area-config',
  templateUrl: './area-config.component.html',
  styleUrls: ['./area-config.component.scss']
})
export class AreaConfigComponent implements OnInit, OnDestroy {
  form;
  onDestroy$ = new Subject();
  mapId = '';
  center = { lat: 43.8515003, lng: -79.3823725, placeId: 'ChIJsdx07TQrK4gRLx1zHjnKEbg' };
  areas: IArea[];
  bStart = false;
  places;
  selected;
  polygons = [];
  polylines = [];
  points = [
    { lat: 43.7923207, lng: -79.39352138 }, // sw
    { lat: 43.8011998, lng: -79.29650988 }, // nw
    { lat: 43.8884771, lng: -79.31644911 }, // ne
    { lat: 43.8711311, lng: -79.43734244 }, // se
    { lat: 43.7923207, lng: -79.39352138 },
  ];

  selectedArea;
  displayedColumns: string[] = ['name', 'code', 'lat', 'lng', 'id'];
  dataSource: MatTableDataSource<any>;
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  get name() { return this.form.get('name'); }
  get code() { return this.form.get('code'); }
  get lat() { return this.form.get('lat'); }
  get lng() { return this.form.get('lng'); }

  constructor(
    private fb: FormBuilder,
    private areaSvc: AreaService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, Validators.minLength(1)]],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
    });

    const c = { lat: 43.8409572, lng: -79.35569115 };
    const center = [];
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const lat = Math.round((c.lat + p.lat) / 2 * 100000) / 100000;
      const lng = Math.round((c.lng + p.lng) / 2 * 100000) / 100000;
      center.push({ lat: lat, lng: lng });
    }
    this.polygons.push(center);

    const csw = center[0];
    const cnw = center[1];
    const cne = center[2];
    const cse = center[3];

    const sw = this.points[0];
    const nw = this.points[1];
    const ne = this.points[2];
    const se = this.points[3];

    const line1 = [
      this.getMidPoint(csw, cnw),
      this.getMidPoint(sw, nw)
    ];
    const line2 = [
      this.getMidPoint(cnw, cne),
      this.getMidPoint(nw, ne)
    ];
    const line3 = [
      this.getMidPoint(cne, cse),
      this.getMidPoint(ne, se)
    ];
    const line4 = [
      this.getMidPoint(cse, csw),
      this.getMidPoint(se, sw)
    ];
    this.polylines = [line1, line2, line3, line4];
  }

  getMidPoint(p1, p2) {
    return { lat: ( p1.lat + p2.lat ) / 2, lng: (p1.lng + p2.lng) / 2 };
  }

  ngOnInit() {
    // this.areaSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(as => {
    // });
    this.reload();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSave(t) {
    const data: IArea = {
      name: this.name.value,
      code: this.code.value,
      lat: this.lat.value,
      lng: this.lng.value,
      status: 'active'
    };

    if (t._id) {
      this.areaSvc.update({ _id: t._id }, data).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.snackBar.open('', '已更新', { duration: 1000 });
        this.reload((as) => {
          const area = as.find(a => a._id === t._id);
          this.form.patchValue(area);
        });
      });
    } else {

    }
  }

  onSubmit() {
    const a: IArea = {
      name: this.name.value,
      code: this.code.value,
      lat: this.lat.value,
      lng: this.lng.value,
      status: 'active'
    };

    this.areaSvc.save(a).pipe(takeUntil(this.onDestroy$)).subscribe((r) => {
      // this.dataSource = new MatTableDataSource(as);
      // this.dataSource.sort = this.sort;
      this.reload();
    });
  }

  reload(cb?: any) {
    this.areaSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe((as) => {
      this.areas = as;
      this.dataSource = new MatTableDataSource(as);
      this.dataSource.sort = this.sort;

      if (cb) {
        cb(as);
      }
    });
  }

  genRegions() {
    // const v = this.form.value;
    // const lat = 44.0365; // +v.lat;
    // const lng = -79.5665; // +v.lng;
    // const step_w = 0.06; // +v.step;
    // const step_h = 0.07; //
    // const h = 6;
    // const ha = ['a', 'b', 'c', 'd', 'e', 'f'];
    // const points = [];

    // if (lat && lng && step_w && step_h) {
    //   for (let i = 0; i < ha.length; i++) {
    //     const rowName = ha[i];
    //     for (let j = 0; j < h; j++) {
    //       const p: IRegion = {
    //         lat: lat - i * step_w,
    //         lng: lng + j * step_h,
    //         name: rowName + j.toString(),
    //         code: rowName + j.toString(),
    //         status: 'active'
    //       };
    //       points.push(p);
    //     }
    //   }

    //   this.regionSvc.insertMany(points).pipe(takeUntil(this.onDestroy$)).subscribe(xs => {
    //     this.snackBar.open('', '区域已生成', { duration: 1000 });
    //   });
    // }
  }

  onStartPoint() {
    this.bStart = true;
  }

  onEndPoint() {
    this.bStart = false;
  }

  onSelectRow(row) {
    this.selected = row;
    this.name.patchValue(row.name);
    this.code.patchValue(row.code);
    this.lat.patchValue(+row.lat);
    this.lng.patchValue(+row.lng);
  }

  onClickMap(e) {
    if (this.bStart) {
      if (!(this.selected && this.selected._id)) {
        this.name.patchValue('');
        this.code.patchValue('');
      }
      this.form.get('lat').patchValue(+e.lat);
      this.form.get('lng').patchValue(+e.lng);
    }

    // const id = uuid.v4();
    // const idx = this.index;
    // this.forms[id] = this.fb.group({
    //   name: ['Region' + this.index],
    //   code: ['CODE' + this.index]
    // });
    // const region = { id: id, name: 'Region' + idx, code: 'CODE' + idx, lat: e.lat, lng: e.lng, radius: 8, status: 'new' };
    // this.regions.push(region);

    // const r1 = this.regions.map(x => {
    //   x.color = (x._id === id) ? 'red' : 'green';
    // });

    // this.activeRegions = this.regions.filter(r => r.status === 'active' || r.status === 'new');
    // this.index++;
  }
}
