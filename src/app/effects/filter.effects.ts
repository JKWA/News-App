import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
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

  @Effect()
  setFilters$: Observable<Action> = this.actions$.pipe(
    ofType<FilterActions.AddFilter>(FilterActionTypes.AddFilter, FilterActionTypes.RemoveFilter),
    withLatestFrom(this.store, ( action , state) => state),
    select(fromFilter.getAllFilters),
    switchMap(filters => {
      const setFilters = filters.size
        ? filters
        : filters.add('$none$');
      return this.localStorageService.setFilters(setFilters)
      .pipe(
        map(() => new FilterActions.SavedFilterToClient(new ServiceMessage.LocalStorageMessage().successMessage)),
        catchError(() => of(new FilterActions.SavedFilterToClientFailed(new ServiceMessage.LocalStorageMessage().errorMessage)))
      );
    })
  );

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    withLatestFrom(
      of(new FilterDefault().getDefaultFilters),
      this.localStorageService.getFilters(),
      ( _ , defaultFilters, savedFilters ) => {

        const selectFilters: Set<Filter> = savedFilters.size
          ? savedFilters
          : defaultFilters;

        selectFilters.delete('$none$');

        return  new FilterActions.LoadFilters(selectFilters);

      }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromFilter.State>,
    private localStorageService: LocalStorageService
  ) {}
}
