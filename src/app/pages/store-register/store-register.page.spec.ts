import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreRegisterPage } from './store-register.page';

describe('StoreRegisterPage', () => {
  let component: StoreRegisterPage;
  let fixture: ComponentFixture<StoreRegisterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StoreRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
