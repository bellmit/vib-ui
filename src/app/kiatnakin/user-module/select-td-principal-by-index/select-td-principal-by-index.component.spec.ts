import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTdPrincipalByIndexComponent } from './select-td-principal-by-index.component';

describe('SelectTdPrincipalByIndexComponent', () => {
  let component: SelectTdPrincipalByIndexComponent;
  let fixture: ComponentFixture<SelectTdPrincipalByIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTdPrincipalByIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTdPrincipalByIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
