import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPaymentComponent } from './driver-payment.component';

describe('DriverPaymentComponent', () => {
  let component: DriverPaymentComponent;
  let fixture: ComponentFixture<DriverPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
