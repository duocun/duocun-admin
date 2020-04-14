import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverHourFormComponent } from './driver-hour-form.component';

describe('DriverHourFormComponent', () => {
  let component: DriverHourFormComponent;
  let fixture: ComponentFixture<DriverHourFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverHourFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverHourFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
