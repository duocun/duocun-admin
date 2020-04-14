import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantScheduleComponent } from './merchant-schedule.component';

describe('MerchantScheduleComponent', () => {
  let component: MerchantScheduleComponent;
  let fixture: ComponentFixture<MerchantScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
