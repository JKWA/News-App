import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { UserActionTypes } from '../actions/user.actions';
import { Action } from '@ngrx/store';
import { Observable, defer, of } from 'rxjs';
import * as LogActions from '../actions/log.actions';
import { LogActionTypes } from '../actions/log.actions';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { isDevMode } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromReducers from './../reducers';


@Injectable()
export class LogEffects {

  @Effect({ dispatch: false })
  init$: Observable<Action> = this.actions$.pipe(
      ofType<LogActions.AddLogFromCategoryEffect>(LogActionTypes.AddLogFromCategoryEffect),
      tap(results => {

        // this.store.dispatch(new LogActions.AddLog({
        //   location: 'here is location',
        //   message: results.type,
        //   time: 'nothing',
        //   type: 'nothing'
        // }));
        if ( isDevMode ) {
          console.log(results);
        }
      })
  );

  @Effect()
  loadFoos$ = this.actions$.pipe(ofType(UserActionTypes.LoadUsers));

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>
  ) {}
}
