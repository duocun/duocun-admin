import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import * as moment from 'moment';
import { OrderService } from '../../order/order.service';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-order-trend',
  templateUrl: './order-trend.component.html',
  styleUrls: ['./order-trend.component.scss']
})
export class OrderTrendComponent  implements OnInit, OnDestroy {

  @ViewChild('donut', { static: true }) donut: ElementRef;

  onDestroy$ = new Subject();
  dps = [];
  mps = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = []; // ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: '' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor(
    private orderSvc: OrderService
  ) { }
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
  }

  groupBy(items, key) {
    return items.reduce((result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), {});
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    const query = {
      // delivered: { $gt: moment('2019-06-01').toDate() },
      status: { $nin: ['bad', 'del', 'tmp'] }
    };

    this.orderSvc.quickFind(query).pipe(takeUntil(this.onDestroy$)).subscribe(orders => {
      const group = this.groupBy(orders, 'delivered');
      const keys = Object.keys(group);
      const vals = [];
      keys.map(key => {
        vals.push(group[key] ? group[key].length : 0);
      });

      this.barChartLabels = keys;
      this.barChartData = [{ data: vals, label: '订单数' }];
    });
  }

}
