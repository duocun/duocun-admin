import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentMapComponent } from './assignment-map.component';

describe('AssignmentMapComponent', () => {
  let component: AssignmentMapComponent;
  let fixture: ComponentFixture<AssignmentMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
