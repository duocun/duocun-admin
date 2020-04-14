import { TestBed } from '@angular/core/testing';

import { DriverShiftService } from './driver-shift.service';

describe('DriverShiftService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DriverShiftService = TestBed.get(DriverShiftService);
    expect(service).toBeTruthy();
  });
});
