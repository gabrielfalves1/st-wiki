import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOptionsPage } from './user-options.page';

describe('UserOptionsPage', () => {
  let component: UserOptionsPage;
  let fixture: ComponentFixture<UserOptionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
