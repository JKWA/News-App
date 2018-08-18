import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { FilterEffects } from './filter.effects';
import { StoreModule } from '@ngrx/store';
import * as fromFilter from './../reducers';

describe('FilterEffects', () => {
  // tslint:disable-next-line
  let actions$: Observable<any>;
  let effects: FilterEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({...fromFilter.reducers}),
      ],
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
