import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTrendComponent } from './order-trend.component';

describe('OrderTrendComponent', () => {
  let component: OrderTrendComponent;
  let fixture: ComponentFixture<OrderTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
