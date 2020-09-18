import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInvestmentPrincipalComponent } from './select-investment-principal.component';

describe('SelectInvestmentPrincipalComponent', () => {
  let component: SelectInvestmentPrincipalComponent;
  let fixture: ComponentFixture<SelectInvestmentPrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectInvestmentPrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectInvestmentPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
