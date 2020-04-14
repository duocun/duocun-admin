import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAdjustComponent } from './payment-adjust.component';

describe('PaymentAdjustComponent', () => {
  let component: PaymentAdjustComponent;
  let fixture: ComponentFixture<PaymentAdjustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAdjustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAdjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
