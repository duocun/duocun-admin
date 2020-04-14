import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPhaseComponent } from './order-phase.component';

describe('OrderPhaseComponent', () => {
  let component: OrderPhaseComponent;
  let fixture: ComponentFixture<OrderPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
