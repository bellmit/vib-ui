import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMutualfundAccountComponent } from './select-mutualfund-account.component';

describe('SelectMutualfundAccountComponent', () => {
  let component: SelectMutualfundAccountComponent;
  let fixture: ComponentFixture<SelectMutualfundAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMutualfundAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMutualfundAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
