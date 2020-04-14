import { DriverModule } from './driver.module';

describe('DriverModule', () => {
  let driverModule: DriverModule;

  beforeEach(() => {
    driverModule = new DriverModule();
  });

  it('should create an instance', () => {
    expect(driverModule).toBeTruthy();
  });
});
