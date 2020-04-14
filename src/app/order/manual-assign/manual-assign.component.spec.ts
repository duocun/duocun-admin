import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAssignComponent } from './manual-assign.component';

describe('ManualAssignComponent', () => {
  let component: ManualAssignComponent;
  let fixture: ComponentFixture<ManualAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
