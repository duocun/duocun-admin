import { TestBed, inject } from '@angular/core/testing';

import { DriverHourService } from './driver-hour.service';

describe('DriverHourService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DriverHourService]
    });
  });

  it('should be created', inject([DriverHourService], (service: DriverHourService) => {
    expect(service).toBeTruthy();
  }));
});
