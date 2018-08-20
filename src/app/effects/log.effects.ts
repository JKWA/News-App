import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { UserActionTypes } from '../actions/user.actions';
import * as LogActions from '../actions/log.actions';
import { LogActionTypes } from '../actions/log.actions';
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
