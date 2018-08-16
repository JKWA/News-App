import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FilterEffects } from './filter.effects';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: FilterEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(FilterEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
