import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubUsernamepasswordComponent } from './sub-usernamepassword.component';

describe('SubUsernamepasswordComponent', () => {
  let component: SubUsernamepasswordComponent;
  let fixture: ComponentFixture<SubUsernamepasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubUsernamepasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubUsernamepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
