import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitQuestionComponent } from './suit-question.component';

describe('SuitQuestionComponent', () => {
  let component: SuitQuestionComponent;
  let fixture: ComponentFixture<SuitQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuitQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
