import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { LogEffects } from './log.effects';
import { StoreModule } from '@ngrx/store';
import * as fromReducers from './../reducers';

describe('LogEffects', () => {
  // tslint:disable-next-line
  let actions$: Observable<any>;
  let effects: LogEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({...fromReducers.reducers}),
      ],
      providers: [
        LogEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(LogEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
