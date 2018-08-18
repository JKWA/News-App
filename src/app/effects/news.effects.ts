import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, defer, of, Scheduler } from 'rxjs';
import { tap, concatMap, flatMap, exhaustMap, take, map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import * as NewsActions from '../actions/news.actions';
import { NewsActionTypes } from '../actions/news.actions';
import { Article } from '../models/article.model';
import { LocalDbService } from '../service/local-db.service';
import { NewsDataService } from '../service/news-data.service';
import { Store, select } from '@ngrx/store';
import * as fromFilter from './../reducers';
import * as fromNews from './../reducers';
import { Category } from '../enums/category.enum';
import { Service } from '../enums/service.enum';
// import { Scheduler } from 'rxjs';


export const DEBOUNCE = new InjectionToken<number>('Test Debounce');
export const SCHEDULER = new InjectionToken<Scheduler>('Test Scheduler');


@Injectable()
export class NewsEffects {

  @Effect()
  loadFoos$ = this.actions$.pipe(ofType(NewsActionTypes.LoadNews));

  @Effect()
  initialApiNews$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.InitiateNews>(NewsActionTypes.InitiateNews),
    concatMap(results => {
      return this.store.pipe(
        select(fromFilter.getAllFilters),
        take(1),
        exhaustMap(allFilters => {
          const category = results.payload;
          return this.newsService.getNews(category, 1, allFilters);
        }),
        map( articles => {
          return new NewsActions.AddInitialArticles({
                        category: results.payload,
                        articles: articles,
                        service: Service.NewsAPI
                  });
        }),
        catchError(error => {
          console.log(error);
          return of( new NewsActions.NewsApiError(error));
        })
      );
    })
  );


  @Effect()
  getClientNewsData$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.InitiateNews>(NewsActionTypes.InitiateNews),
    concatMap(results => {
      const category = results.payload;
      const service = Service.IndexedDb;
      const client$ = this.localDb.getData(results.payload);
        return client$.pipe(
          tap(console.log),
          map(articles => {
              return new NewsActions.AddInitialClientArticles({
                category: category,
                articles: articles,
                service: service
              });
            }),
            catchError(error => {
              console.log(error);
              return of( new NewsActions.IndexedDbError(error));
            })
          );
      }),
  );


  @Effect()
  saveNewsToIndexedDb$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.AddInitialArticles>(NewsActionTypes.AddInitialArticles),
    concatMap(results => {
      const category = results.payload.category;
      const articles = results.payload.articles;
      const client$ = this.localDb.setData(category, articles);
        return client$.pipe(
          take(1),
          map(_ => {
              return new NewsActions.IndexedDbSaved(category);
            }),
            catchError(error => {
              console.log(error);
              return of( new NewsActions.IndexedDbError(error));
            })
          );
      }),
  );

  // init$: Observable<any> = defer(() => of(null)).pipe(
  //   tap(() => console.log('init$'))
  // );

  constructor(
    private actions$: Actions,
    private store: Store<fromFilter.State>,
    private localDb: LocalDbService,
    private newsService: NewsDataService,
    // used only for unit tests to be able to inject a debounce value
    @Optional()
    @Inject(DEBOUNCE)
    private debounce: number,

    // used only for unit tests to be able to inject a test scheduler for observables
    @Optional()
    @Inject(SCHEDULER)
    private scheduler: Scheduler) {}

}
