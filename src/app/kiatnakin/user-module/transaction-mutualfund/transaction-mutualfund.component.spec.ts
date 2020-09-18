import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMutualfundComponent } from './transaction-mutualfund.component';

describe('TransactionMutualfundComponent', () => {
  let component: TransactionMutualfundComponent;
  let fixture: ComponentFixture<TransactionMutualfundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionMutualfundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionMutualfundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
