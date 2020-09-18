import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMyPinComponent } from './card-my-pin.component';

describe('CardMyPinComponent', () => {
  let component: CardMyPinComponent;
  let fixture: ComponentFixture<CardMyPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardMyPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMyPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
