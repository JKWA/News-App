import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap, concatMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import * as fromCategory from './../reducers';
import * as CategoryActions from '../actions/category.actions';
import { CategoryActionTypes } from '../actions/category.actions';
import { LocalStorageService } from '../services/local-storage.service';
import { LocalStorageMessage } from '../messages/service.messages';


@Injectable()
export class CategoryEffects {

  @Effect() saveSelectedCategories$: Observable<Action> = this.actions$.pipe(
    ofType<CategoryActions.AddCategory>(CategoryActionTypes.AddCategory, CategoryActionTypes.RemoveCategory),
    withLatestFrom(this.store, ( _ , state) => {
      return of(state).pipe(
        select(fromCategory.getAllCategories),
        map(allCategories => Array.from(allCategories.values()).filter(result => result.selected).map(category => category.id)),
        tap(arrayOfSelectedCategoryIds => {
          // if none, add General
          if (!arrayOfSelectedCategoryIds.length) {
            this.store.dispatch(new CategoryActions.AddGeneralCategory());
          }
        }),
        switchMap(arrayOfCategoryIds => this.localStorageService.setSelectedCategories(arrayOfCategoryIds)
          .pipe(
            // map(() => new CategoryActions.SavedSelectedCategories(new LocalStorageMessage().successMessage)),
            // catchError(() => of(new CategoryActions.SavedSelectedCategoriesFailed(new LocalStorageMessage().errorMessage)))
          )
        )
      ).subscribe(); // need to subscribe to dispatch local storage
    }),
    map(() => new CategoryActions.SavedSelectedCategories(new LocalStorageMessage().successMessage)),
    catchError(() => of(new CategoryActions.SavedSelectedCategoriesFailed(new LocalStorageMessage().errorMessage)))
  );

  @Effect()
  categorySetView$: Observable<Action> = this.actions$.pipe(
    ofType<CategoryActions.SetCategory>(CategoryActionTypes.SetCategory),
    switchMap(results => this.localStorageService.setCategoryViewed(results.payload)
      .pipe(
        map( sucessMessage => new CategoryActions.SavedViewedCategory(sucessMessage)),
        catchError(() => {
          return of(new CategoryActions.SavedViewedCategoryFailed(new LocalStorageMessage().errorMessage));
        }),
      ),
    ),
  );

  @Effect()
  loadCategory$ = this.actions$.pipe(ofType(CategoryActionTypes.LoadCategorys));

  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private store: Store<fromCategory.State>,
  ) {}
}
