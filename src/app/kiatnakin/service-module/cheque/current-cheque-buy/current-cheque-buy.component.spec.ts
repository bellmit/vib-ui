import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentChequeBuyComponent } from './current-cheque-buy.component';

describe('CurrentChequeBuyComponent', () => {
  let component: CurrentChequeBuyComponent;
  let fixture: ComponentFixture<CurrentChequeBuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentChequeBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentChequeBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
