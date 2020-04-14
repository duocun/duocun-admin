import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTransferComponent } from './driver-transfer.component';

describe('DriverTransferComponent', () => {
  let component: DriverTransferComponent;
  let fixture: ComponentFixture<DriverTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
