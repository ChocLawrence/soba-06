import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatesComponent } from './payment-states.component';

describe('PaymentStatesComponent', () => {
  let component: PaymentStatesComponent;
  let fixture: ComponentFixture<PaymentStatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentStatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
