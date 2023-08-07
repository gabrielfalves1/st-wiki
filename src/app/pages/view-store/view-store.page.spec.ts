import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewStorePage } from './view-store.page';

describe('ViewStorePage', () => {
  let component: ViewStorePage;
  let fixture: ComponentFixture<ViewStorePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewStorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
