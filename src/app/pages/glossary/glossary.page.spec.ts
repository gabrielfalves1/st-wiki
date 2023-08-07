import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlossaryPage } from './glossary.page';

describe('GlossaryPage', () => {
  let component: GlossaryPage;
  let fixture: ComponentFixture<GlossaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GlossaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
