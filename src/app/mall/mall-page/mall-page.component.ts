import { Component, OnInit } from '@angular/core';
import { IMall } from '../mall.model';
import { MallService } from '../mall.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-mall-page',
  templateUrl: './mall-page.component.html',
  styleUrls: ['./mall-page.component.scss']
})
export class MallPageComponent implements OnInit {

  mall: IMall;
  malls: IMall[];
  onDestroy$ = new Subject();

  constructor(
    private mallSvc: MallService
  ) { }

  ngOnInit() {
    this.mallSvc.find().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((malls: IMall[]) => {
      this.malls = malls;
    });
  }

  onAfterSelect(e) {
    this.mall = e.mall;
  }
}
