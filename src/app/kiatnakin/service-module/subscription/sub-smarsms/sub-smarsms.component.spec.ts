import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSmarsmsComponent } from './sub-smarsms.component';

describe('SubSmarsmsComponent', () => {
  let component: SubSmarsmsComponent;
  let fixture: ComponentFixture<SubSmarsmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSmarsmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSmarsmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
