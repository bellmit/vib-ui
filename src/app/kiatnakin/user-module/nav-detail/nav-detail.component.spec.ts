import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavDetailComponent } from './nav-detail.component';

describe('NavDetailComponent', () => {
  let component: NavDetailComponent;
  let fixture: ComponentFixture<NavDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
