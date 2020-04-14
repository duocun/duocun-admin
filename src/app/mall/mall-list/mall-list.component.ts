import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { MallService } from '../mall.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { IMall } from '../mall.model';

@Component({
  selector: 'app-mall-list',
  templateUrl: './mall-list.component.html',
  styleUrls: ['./mall-list.component.scss']
})
export class MallListComponent implements OnInit, OnDestroy {
  @Input() malls: IMall[] = [];
  @Output() afterSelect: EventEmitter<any> = new EventEmitter();
  onDestroy$ = new Subject();

  constructor(
    private mallSvc: MallService
  ) {

  }

  ngOnInit() {
    this.mallSvc.find().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(ms => {
      this.malls = ms;
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSelect(m: IMall) {
    this.afterSelect.emit({mall: m});
  }
}
