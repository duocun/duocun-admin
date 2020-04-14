import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { Subject } from '../../../../node_modules/rxjs';
import { RegionService } from '../../region/region.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { IRegion } from '../../region/region.model';
import { MatSnackBar } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-region-builder',
  templateUrl: './region-builder.component.html',
  styleUrls: ['./region-builder.component.scss']
})
export class RegionBuilderComponent implements OnInit, OnDestroy {
  form;
  onDestroy$ = new Subject();

  get step() { return this.form.get('step'); }
  get lat() { return this.form.get('lat'); }
  get lng() { return this.form.get('lng'); }

  constructor(
    private fb: FormBuilder,
    private regionSvc: RegionService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      // name: ['', [Validators.required, Validators.minLength(3)]],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      step: ['', Validators.required],
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  genRegions() {
    const v = this.form.value;
    const lat = 43.937065; // 44.0365; // +v.lat;
    const lng = -79.496222; // -79.5665; // +v.lng;
    const step_w = 0.06; // +v.step;
    const step_h = 0.07; //
    const h = 4;
    const ha = ['a', 'b', 'c', 'd'];
    const points = [];

    if (lat && lng && step_w && step_h) {
      for (let i = 0; i < ha.length; i++) {
        const rowName = ha[i];
        for (let j = 0; j < h; j++) {
          const p: IRegion = {
            lat: lat - i * step_w,
            lng: lng + j * step_h,
            name: rowName + j.toString(),
            code: rowName + j.toString(),
            status: 'active'
          };
          points.push(p);
        }
      }

      this.regionSvc.insertMany(points).pipe(takeUntil(this.onDestroy$)).subscribe(xs => {
        this.snackBar.open('', '区域已生成', { duration: 1000 });
      });
    }
  }
}
