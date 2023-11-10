import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContributionComponent } from './modal-contribution.component';

describe('ModalContributionComponent', () => {
  let component: ModalContributionComponent;
  let fixture: ComponentFixture<ModalContributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalContributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
