import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressProfilePage } from './address-profile.page';

describe('AddressProfilePage', () => {
  let component: AddressProfilePage;
  let fixture: ComponentFixture<AddressProfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddressProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
