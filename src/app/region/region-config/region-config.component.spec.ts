import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionConfigComponent } from './region-config.component';

describe('RegionConfigComponent', () => {
  let component: RegionConfigComponent;
  let fixture: ComponentFixture<RegionConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
