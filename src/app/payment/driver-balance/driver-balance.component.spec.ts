import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverBalanceComponent } from './driver-balance.component';

describe('DriverBalanceComponent', () => {
  let component: DriverBalanceComponent;
  let fixture: ComponentFixture<DriverBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
