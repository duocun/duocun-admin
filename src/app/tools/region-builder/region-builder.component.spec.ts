import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionBuilderComponent } from './region-builder.component';

describe('RegionBuilderComponent', () => {
  let component: RegionBuilderComponent;
  let fixture: ComponentFixture<RegionBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
