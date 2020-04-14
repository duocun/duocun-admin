import { RegionModule } from './region.module';

describe('RegionModule', () => {
  let regionModule: RegionModule;

  beforeEach(() => {
    regionModule = new RegionModule();
  });

  it('should create an instance', () => {
    expect(regionModule).toBeTruthy();
  });
});
