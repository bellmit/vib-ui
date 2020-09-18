import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchFundComponent } from './switch-fund.component';

describe('SwitchFundComponent', () => {
  let component: SwitchFundComponent;
  let fixture: ComponentFixture<SwitchFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
