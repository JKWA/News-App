import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CategoryActionTypes } from '../actions/category.actions';
import { Category } from '../enums/category.enum';
import { Observable, defer, of } from 'rxjs';
import { LocalStorageService } from '../service/local-storage.service';
import { Store, select } from '@ngrx/store';
import * as fromCategory from './../reducers';
import * as CategoryActions from '../actions/category.actions';
import * as LogActions from '../actions/log.actions';

import { Action } from '@ngrx/store';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';


@Injectable()
export class CategoryEffects {

  @Effect()
  saveSelectedCategories$: Observable<Action> = this.actions$.pipe(
      ofType<CategoryActions.AddCategory>(CategoryActionTypes.AddCategory, CategoryActionTypes.RemoveCategory),
      withLatestFrom(this.store, ( _ , state) => {
        of(state).pipe(
          select(fromCategory.getAllCategories),
          map(results => Array.from(results.values()).filter(result => result.selected).map(category => category.id)),
          tap(results => {
            if (!results.length) {
              this.store.dispatch(new CategoryActions.AddGeneralCategory());
            }
          }),
          switchMap(results => this.localStorageService.setSelectedCategories(results)
            .pipe(
              catchError(error => {
                return of(new CategoryActions.SavedSelectedCategoriesFailed());
              })
            )
          ),
          tap(results => {
            this.store.dispatch(new LogActions.AddLogFromCategoryEffect({location: 'Category Effect', message: results.statusText}));
          }),
        ).subscribe();
      }),
      map( _ => new CategoryActions.SavedSelectedCategories()),
  );

  @Effect()
  categorySetView$: Observable<Action> = this.actions$.pipe(
    ofType<CategoryActions.SetCategory>(CategoryActionTypes.SetCategory),
    // tap(console.log),
    switchMap(results => this.localStorageService.setCategoryViewed(results.payload)),
    map( _ => new CategoryActions.SavedViewedCategory()),
    catchError(error => {
      return of(new CategoryActions.SavedSelectedCategoriesFailed());
    }),
  );


  @Effect()
  loadFoos$ = this.actions$.pipe(ofType(CategoryActionTypes.LoadCategorys));


  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private store: Store<fromCategory.State>,
  ) {}
}
