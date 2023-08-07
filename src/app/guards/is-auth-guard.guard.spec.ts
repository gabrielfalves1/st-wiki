import { TestBed } from '@angular/core/testing';

import { IsAuthGuardGuard } from './is-auth-guard.guard';

describe('IsAuthGuardGuard', () => {
  let guard: IsAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
