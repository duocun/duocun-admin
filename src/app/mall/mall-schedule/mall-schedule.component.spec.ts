import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MallScheduleComponent } from './mall-schedule.component';

describe('MallScheduleComponent', () => {
  let component: MallScheduleComponent;
  let fixture: ComponentFixture<MallScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MallScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MallScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
