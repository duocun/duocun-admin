import { TestBed } from '@angular/core/testing';

import { MallScheduleService } from './mall-schedule.service';

describe('MallScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MallScheduleService = TestBed.get(MallScheduleService);
    expect(service).toBeTruthy();
  });
});
