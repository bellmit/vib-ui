import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAtmComponent } from './card-atm.component';

describe('CardAtmComponent', () => {
  let component: CardAtmComponent;
  let fixture: ComponentFixture<CardAtmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAtmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
