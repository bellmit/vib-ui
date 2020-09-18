import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemFundComponent } from './redeem-fund.component';

describe('RedeemFundComponent', () => {
  let component: RedeemFundComponent;
  let fixture: ComponentFixture<RedeemFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
