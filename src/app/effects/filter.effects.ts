import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Store, select, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FilterActionTypes } from '../actions/filter.actions';
import * as FilterActions from '../actions/filter.actions';
import * as fromFilter from './../reducers';
import { LocalStorageService } from '../services/local-storage.service';
import * as ServiceMessage from '../messages/service.messages';


@Injectable()
export class FilterEffects {

  @Effect()
  setFilters$: Observable<Action> = this.actions$.pipe(
    ofType<FilterActions.AddFilter>(FilterActionTypes.AddFilter),
    withLatestFrom(this.store, ( action , state) => state), // {
    select(fromFilter.getAllFilters),
    switchMap(filters => this.localStorageService.setFilters(filters)
      .pipe(
        map(() => new FilterActions.SavedFilterToClient(new ServiceMessage.LocalStorageMessage().successMessage)),
        catchError(() => of(new FilterActions.SavedFilterToClientFailed(new ServiceMessage.LocalStorageMessage().errorMessage)))
      )
    )
  );

  @Effect()
  loadFilters$ = this.actions$.pipe(ofType(FilterActionTypes.LoadFilters));

  constructor(
    private actions$: Actions,
    private store: Store<fromFilter.State>,
    private localStorageService: LocalStorageService
  ) {}
}
