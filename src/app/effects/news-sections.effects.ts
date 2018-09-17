import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, take, concatMap, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import * as fromNewsSection from '../reducers';
import * as NewsSectionActions from '../actions/news-section.actions';
import * as NewsActions from '../actions/news.actions';
import { setSelectedNewsSections } from '../shared/utility/news-section.utility';
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
    concatMap(arrayOfNewsSectionIds => this.localStorageService.setSelectedNewsSections(arrayOfNewsSectionIds)
      .pipe(
        map(() => new NewsSectionActions.SavedSelectedNewsSections(new ServiceMessage.LocalStorageSetMessage().successMessage)),
        catchError(() => of(new NewsSectionActions.SavedSelectedNewsSectionsFailed(
          new ServiceMessage.LocalStorageSetMessage().errorMessage)))
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
          return of(new NewsSectionActions.SavedViewedNewsSectionFailed(new ServiceMessage.LocalStorageSetMessage().errorMessage));
        }),
      ),
    ),
  );

  @Effect()
  getNewsSectionViewing$: Observable<Action> = this.actions$.pipe(
    ofType(NewsSectionActionTypes.InitNewsSections),
    switchMap(_ => {
      return this.localStorageService.getNewsSectionViewing();
    }),
    map(viewedNewsSection => new NewsSectionActions.LoadCurrentlyViewingNewsSection(viewedNewsSection)),
    catchError(_ => {
      return of(new NewsSectionActions.LoadCurrentlyViewingNewsSectionDefault(new NewsSectionDefault().getDefaultViewingNewsSection));
    })
  );

@Effect()
  getSelectedNewsSections$: Observable<Action> = this.actions$.pipe(
    ofType(NewsSectionActionTypes.InitNewsSections),
    switchMap(_ => this.localStorageService.getSelectedNewsSections()),
    map( viewedNewsSection => {
      const allNewsSections = new NewsSectionDefault().createAllNewsSections;
      console.log(setSelectedNewsSections(viewedNewsSection, allNewsSections));
      return new NewsSectionActions.LoadAllNewsSections(setSelectedNewsSections(viewedNewsSection, allNewsSections));
    }),
    catchError( _ => {
      const allNewsSections = new NewsSectionDefault().createAllNewsSections;
      const viewedNewsSection = new NewsSectionDefault().getDefaultSelectedNewsSections;
      return of(new NewsSectionActions.LoadAllNewsSectionsDefault(setSelectedNewsSections(viewedNewsSection, allNewsSections)));
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
