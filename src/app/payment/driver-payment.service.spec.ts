import { TestBed, inject } from '@angular/core/testing';

import { DriverPaymentService } from './driver-payment.service';

describe('DriverPaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DriverPaymentService]
    });
  });

  it('should be created', inject([DriverPaymentService], (service: DriverPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
