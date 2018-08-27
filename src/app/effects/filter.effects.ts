import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, concatMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Store, select, Action } from '@ngrx/store';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { FilterActionTypes } from '../actions/filter.actions';
import * as FilterActions from '../actions/filter.actions';
import * as fromFilter from './../reducers';
import { LocalStorageService } from '../services/local-storage.service';
import * as ServiceMessage from '../messages/service.messages';
import { FilterDefault } from '../shared/defaults/filter.default';
import { Filter } from '../models/filter';

@Injectable()
export class FilterEffects {
  NONE: string;

  @Effect()
  setFilters$: Observable<Action> = this.actions$.pipe(
    ofType<FilterActions.AddFilter>(FilterActionTypes.AddFilter, FilterActionTypes.RemoveFilter),
    withLatestFrom(this.store, ( action , state) => state),
    select(fromFilter.getAllFilters),
    switchMap(filters => {
      const setFilters = filters.size
        ? filters
        : filters.add(this.NONE);
      return this.localStorageService.setFilters(setFilters)
      .pipe(
        map(() => new FilterActions.SavedFilterToClient(new ServiceMessage.LocalStorageMessage().successMessage)),
        catchError(() => of(new FilterActions.SavedFilterToClientFailed(new ServiceMessage.LocalStorageMessage().errorMessage)))
      );
    })
  );

  @Effect()
  loadInitialFilters$: Observable<Action> = this.actions$.pipe(
    ofType(FilterActionTypes.InitFilters),
    withLatestFrom(
      of(new FilterDefault().getDefaultFilters),
      ( _ , defaultFilters ) => defaultFilters),
      switchMap( defaultFilters => {
        return this.localStorageService.getFilters().pipe(
          map(savedFilters => {
            const selectFilters: Set<Filter> = savedFilters.size
            ? savedFilters
            : defaultFilters;
            return selectFilters;
          }),
          map(filters => new FilterActions.LoadFilters(filters)),
          catchError(_ => of(new FilterActions.LoadFiltersFailed(new FilterDefault().getDefaultFilters)))
        );
      })
  );

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(_ => new FilterActions.InitFilters())
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromFilter.State>,
    private localStorageService: LocalStorageService
  ) { this.NONE = '$none$'; }

}
