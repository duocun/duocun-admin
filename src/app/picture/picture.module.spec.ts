import { PictureModule } from './picture.module';

describe('PictureModule', () => {
  let pictureModule: PictureModule;

  beforeEach(() => {
    pictureModule = new PictureModule();
  });

  it('should create an instance', () => {
    expect(pictureModule).toBeTruthy();
  });
});
