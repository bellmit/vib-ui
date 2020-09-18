import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionAccountComponent } from './subscription-account.component';

describe('SubscriptionAccountComponent', () => {
  let component: SubscriptionAccountComponent;
  let fixture: ComponentFixture<SubscriptionAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
