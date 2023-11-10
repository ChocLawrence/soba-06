import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentStateComponent } from './modal-payment-state.component';

describe('ModalPaymentStateComponent', () => {
  let component: ModalPaymentStateComponent;
  let fixture: ComponentFixture<ModalPaymentStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPaymentStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaymentStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
