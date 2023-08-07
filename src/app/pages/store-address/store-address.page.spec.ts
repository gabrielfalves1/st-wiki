import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreAddressPage } from './store-address.page';

describe('StoreAddressPage', () => {
  let component: StoreAddressPage;
  let fixture: ComponentFixture<StoreAddressPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StoreAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
