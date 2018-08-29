import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import * as fromNewsSection from '../reducers';
import * as NewsSectionActions from '../actions/news-section.actions';
import * as NewsActions from '../actions/news.actions';

import { NewsSectionActionTypes } from '../actions/news-section.actions';
import { LocalStorageService } from '../services/local-storage.service';
import * as ServiceMessage from '../messages/service.messages';
import { NewsSection } from '../enums/news-section.enum';
import { NewsSectionDefault } from '../shared/defaults/news-section.default';
import { stringToNewsSection } from '../shared/utility/news-section.utility';


@Injectable()
export class NewsSectionEffects {

  @Effect()
  saveSelectedNewsSections$: Observable<Action> = this.actions$.pipe(
    ofType<NewsSectionActions.AddNewsSection>(NewsSectionActionTypes.AddNewsSection, NewsSectionActionTypes.RemoveNewsSection),
    withLatestFrom(this.store, ( action , state) => state),
    select(fromNewsSection.getAllNewsSections),
    map(allNewsSections => Array.from(allNewsSections.values()).filter(result => result.selected).map(newsSelection => newsSelection.id)),
    tap(allNewsSections => {
      if ( allNewsSections.length === 0 ) {
        this.store.dispatch( new NewsSectionActions.AddNewsSection(NewsSection.General));
      }
    }),
    switchMap(arrayOfNewsSectionIds => this.localStorageService.setSelectedNewsSections(arrayOfNewsSectionIds)
      .pipe(
        map(() => new NewsSectionActions.SavedSelectedNewsSections(new ServiceMessage.LocalStorageMessage().successMessage)),
        catchError(() => of(new NewsSectionActions.SavedSelectedNewsSectionsFailed(new ServiceMessage.LocalStorageMessage().errorMessage)))
      )
    )
  );


  @Effect()
  addNewNewsSectionApiData$: Observable<Action> = this.actions$.pipe(
    ofType<NewsSectionActions.AddNewsSection>(NewsSectionActionTypes.AddNewsSection),
    map(result => new NewsActions.GetAdditionalNewsFromApi(result.payload)),
  );


  @Effect()
  switchNewsSectionViewed$: Observable<Action> = this.actions$.pipe(
    ofType<NewsSectionActions.AddNewsSection>(NewsSectionActionTypes.AddNewsSection),
    map(result => new NewsSectionActions.SetCurrentlyViewingNewsSection(result.payload)),
  );


  @Effect()
  newsSelectionSetView$: Observable<Action> = this.actions$.pipe(
    ofType<NewsSectionActions.SetCurrentlyViewingNewsSection>(NewsSectionActionTypes.SetCurrentlyViewingNewsSection),
    switchMap(results => this.localStorageService.setNewsSectionViewing(results.payload)
      .pipe(
        map( sucessMessage => new NewsSectionActions.SavedViewedNewsSection(sucessMessage)),
        catchError(() => {
          return of(new NewsSectionActions.SavedViewedNewsSectionFailed(new ServiceMessage.LocalStorageMessage().errorMessage));
        }),
      ),
    ),
  );

  @Effect()
  loadInitialValues$: Observable<Action> = this.actions$.pipe(
    ofType(NewsSectionActionTypes.InitNewsSections),
    withLatestFrom(
      of(new NewsSectionDefault().createAllNewsSections),
      this.localStorageService.getNewsSectionViewing(),
      this.localStorageService.getSelectedNewsSections(),
      ( _ , allNewsSections, viewedNewsSection, savedSelectedNewsSections) => {
        const selectedNewsSections = savedSelectedNewsSections
            ? savedSelectedNewsSections
            : new NewsSectionDefault().getDefaultSelectedNewsSections;

        allNewsSections.forEach(newsSelectionItem => {
            selectedNewsSections.has(stringToNewsSection(newsSelectionItem.id))
                ? newsSelectionItem.selected = true
                : newsSelectionItem.selected = false;
        });
        return  new NewsSectionActions.LoadNewsSections({currentlyViewingNewsSection: viewedNewsSection, allNewsSections});

      }),
      catchError( _ => {
        const currentlyViewingNewsSection = new NewsSectionDefault().getDefaultViewingNewsSection;
        const allNewsSections = new NewsSectionDefault().createAllNewsSections;
        const defaultSelected = new NewsSectionDefault().getDefaultSelectedNewsSections;

        allNewsSections.forEach(newsSelectionItem => {
          defaultSelected.has(stringToNewsSection(newsSelectionItem.id))
              ? newsSelectionItem.selected = true
              : newsSelectionItem.selected = false;
        });
        return of(new NewsSectionActions.LoadNewsSectionsFailed({currentlyViewingNewsSection, allNewsSections}));
      })

  );

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(result => new NewsSectionActions.InitNewsSections())

  );

  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private store: Store<fromNewsSection.State>,
  ) {}
}
