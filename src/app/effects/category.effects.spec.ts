import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CategoryEffects } from './category.effects';

describe('CategoryEffects', () => {
  let actions$: Observable<any>;
  let effects: CategoryEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(CategoryEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
