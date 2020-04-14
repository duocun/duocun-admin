import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../order.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IOrder } from '../order.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-order-phase',
  templateUrl: './order-phase.component.html',
  styleUrls: ['./order-phase.component.scss']
})
export class OrderPhaseComponent implements OnInit {
  
  onDestroy$ = new Subject();
  displayedColumns: string[] = ['clientName', 'merchantName', 'delivered'];
  dataSource: MatTableDataSource<any>;
  orders: IOrder[] = [];

  timetable = { '15:45': '11:20', '16:25': '12:00' };

  constructor(
    private orderSvc: OrderService,
  ) { }

  ngOnInit() {
    const q = { delivered: { $gt: new Date().toISOString() }, status: { $nin: ['del', 'bad', 'tmp'] } };
    this.orderSvc.find(q).pipe(takeUntil(this.onDestroy$)).subscribe((orders: any[]) => {
      orders.map(o => {
        o.phase = this.timetable[o.delivered.substring(11, 16)];
      })
      this.orders = orders;
      this.dataSource = new MatTableDataSource(this.orders);
    });
  }

  onPhaseChanged(order, event) {
    this.orderSvc.updateDeliveryTime(order._id, event.value).subscribe(order => {
      console.log(order);
    });
  }
}
