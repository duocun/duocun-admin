import { DistanceModule } from './distance.module';

describe('DistanceModule', () => {
  let distanceModule: DistanceModule;

  beforeEach(() => {
    distanceModule = new DistanceModule();
  });

  it('should create an instance', () => {
    expect(distanceModule).toBeTruthy();
  });
});
