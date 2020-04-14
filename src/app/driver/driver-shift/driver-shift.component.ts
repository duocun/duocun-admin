import { Component, OnInit } from '@angular/core';
import { DriverService } from '../driver.service';
import { MatTableDataSource } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-driver-shift',
  templateUrl: './driver-shift.component.html',
  styleUrls: ['./driver-shift.component.scss']
})
export class DriverShiftComponent implements OnInit {
  displayedColumns: string[] = ['date', 'driverName', 'hours', 'nOrders', 'paid', 'balance'];
  dataSource: MatTableDataSource<any>;
  constructor(
    private accountSvc: DriverService
  ) { }



  onDateChange(type, $event) {

  }

  ngOnInit() {
    // this.loadDrivers();
  }

}
