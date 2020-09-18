import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTdPrincipalComponent } from './select-td-principal.component';

describe('SelectTdPrincipalComponent', () => {
  let component: SelectTdPrincipalComponent;
  let fixture: ComponentFixture<SelectTdPrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTdPrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTdPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
