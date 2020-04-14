import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBalanceComponent } from './client-balance.component';

describe('ClientBalanceComponent', () => {
  let component: ClientBalanceComponent;
  let fixture: ComponentFixture<ClientBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
