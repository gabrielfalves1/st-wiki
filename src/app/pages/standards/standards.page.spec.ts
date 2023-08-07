import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardsPage } from './standards.page';

describe('StandardsPage', () => {
  let component: StandardsPage;
  let fixture: ComponentFixture<StandardsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StandardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
