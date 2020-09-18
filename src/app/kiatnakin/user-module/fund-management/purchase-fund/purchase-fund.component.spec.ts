import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFundComponent } from './purchase-fund.component';

describe('PurchaseFundComponent', () => {
  let component: PurchaseFundComponent;
  let fixture: ComponentFixture<PurchaseFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
