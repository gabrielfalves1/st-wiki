import { TestBed } from '@angular/core/testing';

import { ConnectivityGuard } from './connectivity.guard';

describe('ConnectivityGuard', () => {
  let guard: ConnectivityGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConnectivityGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
