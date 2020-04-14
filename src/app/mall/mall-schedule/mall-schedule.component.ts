import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { MatTableDataSource, MatSort, MatSnackBar } from '../../../../node_modules/@angular/material';
import { MallScheduleService } from '../mall-schedule.service';
import { MallService } from '../mall.service';
import { FormBuilder, FormArray } from '../../../../node_modules/@angular/forms';
import { RegionService } from '../../region/region.service';
import { IMallSchedule, MallSchedule } from '../mall.model';
import { AreaService } from '../../area/area.service';

@Component({
  selector: 'app-mall-schedule',
  templateUrl: './mall-schedule.component.html',
  styleUrls: ['./mall-schedule.component.scss']
})
export class MallScheduleComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  displayedColumns: string[] = ['weekday', 'mall', 'regions', 'id'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  forms = [];
  regionArray;
  regionList;
  malls;
  days = [0, 1, 2, 3, 4, 5, 6];

  areas;

  // get regions() {
  //   return this.form.get('regions') as FormArray;
  // }

  constructor(
    private fb: FormBuilder,
    private mallScheduleSvc: MallScheduleService,
    private mallSvc: MallService,
    private regionSvc: RegionService,
    private areaSvc: AreaService,
    private snackBar: MatSnackBar
  ) {
    // this.form = this.fb.group({
    //   regions: this.fb.array([])
    // });
    // this.regionArray = this.form.get('regions') as FormArray;
  }

  ngOnInit() {
    this.areaSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(as => {
      this.areas = as;
      this.mallScheduleSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(ss => {
        this.mallSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(ms => {
          const a = [];
          ms.map(mall => {
            const schedule: IMallSchedule = ss.find(s => s.mallId === mall._id);
            const form = this.fb.group({
              items: this.fb.array([])
            });
            const items = form.get('items') as FormArray;
            if (schedule) {
              this.days.map(wd => {
                const ids = schedule.areas[wd];
                const codes = [];
                ids.map(id => {
                  const area = this.areas.find(r => r._id === id);
                  if (area) {
                    codes.push(area.code);
                  }
                });
                items.push(this.fb.control(codes.join(',')));
              });
            } else {
              this.days.map(wd => {
                items.push(this.fb.control(''));
                // a.push({ weekday: wd, mall: mall.name, regions: [], id: '1' });
              });
            }
            a.push({ 'form': form, 'data': mall, 'scheduleId': schedule ? schedule._id : null });
          });

          this.malls = a;
        });
      });
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  reload(a) {
    this.dataSource = new MatTableDataSource(a);
    this.dataSource.sort = this.sort;
  }

  onSubmit() {
    // const rs = this.regions.value;
  }

  onSave(mall) {
    const areas = mall.form.get('items').value;
    const areaIds = [];
    areas.map(a => {
      const codes = a.split(',');
      const ids = [];
      codes.map(code => {
        const area = this.areas.find(r => r.code === code.trim());
        if (area) {
          ids.push(area._id);
        }
      });
      areaIds.push(ids);
    });


    if (mall.scheduleId) {
      const q = { _id: mall.scheduleId };

      const data: MallSchedule = {
        areas: areaIds,
        status: 'active',
        modified: new Date()
      };
      this.mallScheduleSvc.update(q, data).pipe(takeUntil(this.onDestroy$)).subscribe(r => {
        this.snackBar.open('', '已更新', { duration: 1000 });
      });
    } else {
      const data: MallSchedule = {
        mallId: mall.data._id,
        mallName: mall.data.name,
        areas: areaIds,
        status: 'active',
        created: new Date(),
        modified: new Date()
      };
      this.mallScheduleSvc.save(data).pipe(takeUntil(this.onDestroy$)).subscribe(r => {
        this.snackBar.open('', '已保存', { duration: 1000 });
      });
    }

  }
}
