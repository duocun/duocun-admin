import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Role } from '../../account/account.model';
import { DriverService } from '../driver.service';
import { Status } from '../driver.model';
import { MatSnackBar, MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { RegionService } from '../../region/region.service';

@Component({
  selector: 'app-driver-summary',
  templateUrl: './driver-summary.component.html',
  styleUrls: ['./driver-summary.component.scss']
})
export class DriverSummaryComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  form;
  regionList = [];
  selected;
  displayedColumns: string[] = ['rank', 'accountName', 'region1s', 'dow', 'status', 'id'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  get dow() { return this.form.get('dow'); }
  get rank() { return this.form.get('rank'); }
  get regions() { return this.form.get('regions'); }

  constructor(
    private accountSvc: AccountService,
    private driverSvc: DriverService,
    private regionSvc: RegionService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      dow: ['1,2,3,4,5,6,7'],
      rank: ['5'], // start from 5
      regions: ['']
    });

    this.regionSvc.find({ status: 'active' }).pipe(takeUntil(this.onDestroy$)).subscribe(rs => {
      this.regionList = rs;
    });
  }

  ngOnInit() {
    this.reload();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  init() {
    this.accountSvc.find({ roles: Role.DRIVER }).pipe(takeUntil(this.onDestroy$)).subscribe((accounts) => {
      this.driverSvc.quickFind().pipe(takeUntil(this.onDestroy$)).subscribe((drivers) => {
        const ds = [];
        accounts.map(account => {
          const driver = drivers.find(x => x.accountId === account._id);
          if (!driver) {
            ds.push({
              accountId: account._id,
              accountName: account.username,
              balance: 0,
              dow: [1, 2, 3, 4, 5, 6, 7],
              status: Status.ACTIVE,
              created: new Date(),
              modified: new Date()
            });
          }
        });

        // this.driverSvc.remove({}).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        //   this.driverSvc.insertMany(ds).pipe(takeUntil(this.onDestroy$)).subscribe(r => {
        //     this.snackBar.open('', '司机数据已创建', { duration: 1000 });
        //   });
        // });
      });
    });
  }

  reload() {
    this.driverSvc.quickFind().pipe(takeUntil(this.onDestroy$)).subscribe((drivers) => {
      const ds = drivers.sort((a, b) => {
        if (a.status === Status.ACTIVE && b.status !== Status.ACTIVE) {
          return -1; // b at top
        } else if (a.status !== Status.ACTIVE && b.status === Status.ACTIVE) {
          return 1;
        } else {
          if (a.rank < b.rank) {
            return -1;
          } else {
            return 1;
          }
        }
      });

      this.dataSource = new MatTableDataSource(ds);
      this.dataSource.sort = this.sort;
    });
  }

  onActivate(r) {
    this.driverSvc.update({ _id: r._id }, { status: Status.ACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      // this.activeRegions = this.regions.filter(y => y.status === 'active' || y.status === 'new');
      r.status = Status.ACTIVE;
      this.reload();
      this.snackBar.open('', '司机已激活', { duration: 1000 });
    });
  }

  onDeactivate(r) {
    this.driverSvc.update({ _id: r._id }, { status: Status.INACTIVE }).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      // this.activeRegions = this.regions.filter(y => y.status === 'active' || y.status === 'new');
      r.status = Status.INACTIVE;
      this.reload();
      this.snackBar.open('', '司机已停用', { duration: 1000 });
    });
  }

  onSave(r) {
    const dow = this.dow.value.split(',').map(x => +x);
    const rank = +this.rank.value;
    const regions = this.regions.value;
    const updates = { dow: dow, rank: rank, regions: regions };
    this.driverSvc.update({ _id: r._id }, updates).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      r.dow = dow;
      r.rank = rank;
      r.regions = regions;
      this.reload();
      this.snackBar.open('', '司机已更新', { duration: 1000 });
    });
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

  onSelectRow(row) {
    this.selected = row;
  }
}
