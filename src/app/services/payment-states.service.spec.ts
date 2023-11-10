import { TestBed } from '@angular/core/testing';

import { PaymentStatesService } from './payment-states.service';

describe('PaymentStatesService', () => {
  let service: PaymentStatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
