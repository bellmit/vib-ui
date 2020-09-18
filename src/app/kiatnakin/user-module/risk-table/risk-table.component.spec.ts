import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTableComponent } from './risk-table.component';

describe('RiskTableComponent', () => {
  let component: RiskTableComponent;
  let fixture: ComponentFixture<RiskTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
