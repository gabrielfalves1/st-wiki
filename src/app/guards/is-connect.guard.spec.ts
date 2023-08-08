import { TestBed } from '@angular/core/testing';

import { IsConnectGuard } from './is-connect.guard';

describe('IsConnectGuard', () => {
  let guard: IsConnectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsConnectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
