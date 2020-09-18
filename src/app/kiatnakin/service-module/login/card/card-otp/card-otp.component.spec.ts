import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOtpComponent } from './card-otp.component';

describe('CardOtpComponent', () => {
  let component: CardOtpComponent;
  let fixture: ComponentFixture<CardOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
