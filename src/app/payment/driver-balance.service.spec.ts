import { TestBed, inject } from '@angular/core/testing';

import { DriverBalanceService } from './driver-balance.service';

describe('DriverBalanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DriverBalanceService]
    });
  });

  it('should be created', inject([DriverBalanceService], (service: DriverBalanceService) => {
    expect(service).toBeTruthy();
  }));
});
