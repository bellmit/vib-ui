import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFundManagementComponent } from './menu-fund-management.component';

describe('MenuFundManagementComponent', () => {
  let component: MenuFundManagementComponent;
  let fixture: ComponentFixture<MenuFundManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuFundManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuFundManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
