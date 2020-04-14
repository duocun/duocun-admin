import { MerchantModule } from './merchant.module';

describe('MerchantModule', () => {
  let merchantModule: MerchantModule;

  beforeEach(() => {
    merchantModule = new MerchantModule();
  });

  it('should create an instance', () => {
    expect(merchantModule).toBeTruthy();
  });
});
