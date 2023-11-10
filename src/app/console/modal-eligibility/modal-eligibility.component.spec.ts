import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEligibilityComponent } from './modal-eligibility.component';

describe('ModalEligibilityComponent', () => {
  let component: ModalEligibilityComponent;
  let fixture: ComponentFixture<ModalEligibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEligibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
