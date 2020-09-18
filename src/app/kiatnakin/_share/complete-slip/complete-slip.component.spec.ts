import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteSlipComponent } from './complete-slip.component';

describe('CompleteSlipComponent', () => {
  let component: CompleteSlipComponent;
  let fixture: ComponentFixture<CompleteSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
