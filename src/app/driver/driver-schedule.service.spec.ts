import { TestBed } from '@angular/core/testing';

import { DriverScheduleService } from './driver-schedule.service';

describe('DriverScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DriverScheduleService = TestBed.get(DriverScheduleService);
    expect(service).toBeTruthy();
  });
});
