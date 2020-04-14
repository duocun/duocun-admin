import { Component, OnInit } from '@angular/core';
import { ClientPaymentService } from '../client-payment.service';
import { IClientPayment } from '../payment.model';
import { IEntity } from '../../entity.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {

  constructor(
    private clientPaymentSvc: ClientPaymentService
  ) {
    this.clientPaymentSvc.find({ type: { $exists: false } }).subscribe(xs => {
      xs.map((x: IClientPayment) => {
        if (x.credit > 0) { // create debit
          this.clientPaymentSvc.update({ _id: x._id }, { type: 'credit', amount: x.credit }).subscribe(() => { });
          const debit: IClientPayment = {
            clientId: x.clientId,
            clientName: x.clientName,
            driverId: x.driverId,
            driverName: x.driverName,
            amount: x.debit,
            type: 'debit',
            orderId: '',
            created: x.created,
            modified: x.modified
          };
          this.clientPaymentSvc.save(debit).subscribe(() => { });
        } else {
          this.clientPaymentSvc.update({ _id: x._id }, { type: 'debit', amount: x.debit }).subscribe(() => { });
        }
      });
    });
  }

  ngOnInit() {
  }

}
