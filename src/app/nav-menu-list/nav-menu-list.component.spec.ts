import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuListComponent } from './nav-menu-list.component';

describe('NavMenuListComponent', () => {
  let component: NavMenuListComponent;
  let fixture: ComponentFixture<NavMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavMenuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
