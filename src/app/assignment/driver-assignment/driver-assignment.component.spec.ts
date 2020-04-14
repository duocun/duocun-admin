import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverAssignmentComponent } from './driver-assignment.component';

describe('DriverAssignmentComponent', () => {
  let component: DriverAssignmentComponent;
  let fixture: ComponentFixture<DriverAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
