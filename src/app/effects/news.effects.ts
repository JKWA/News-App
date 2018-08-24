import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Observable, of, Scheduler, defer, asyncScheduler } from 'rxjs';
import {concatMap, exhaustMap,
  take, map, catchError,
  throttleTime, withLatestFrom } from 'rxjs/operators';
import { Store, select, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as NewsActions from '../actions/news.actions';
import { NewsActionTypes } from '../actions/news.actions';
import { IndexedDbService } from '../services/indexed-db.service';
import { NewsDataService } from '../services/news-data.service';
import * as fromFilter from './../reducers';
import * as fromNews from './../reducers';
import { Service } from '../enums/service.enum';
import * as Message from '../messages/service.messages';
import { Filter } from '../models/filter';

export const DEBOUNCE = new InjectionToken<number>('Test Debounce');
export const SCHEDULER = new InjectionToken<Scheduler>('Test Scheduler');


@Injectable()
export class NewsEffects {

  @Effect()
  loadNews$ = this.actions$.pipe(ofType(NewsActionTypes.LoadNews));

  @Effect()
  getInitialApiNews$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.InitiateNews>(NewsActionTypes.InitiateNews),
    concatMap(results => {
      return this.store.pipe(
        select(fromFilter.getAllFilters),
        take(1),
        exhaustMap(allFilters => {
          const category = results.payload;
          return this.newsService.getNews(category, 1, allFilters);
        }),
        map( articlePayload => {
          return new NewsActions.AddInitialApiArticles(articlePayload);
        }),
        catchError(error => {
          return of( new NewsActions.AddInitialApiArticlesFailed(new Message.NewsApiMessage().errorMessage));
        })
      );
    })
  );


  @Effect()
  getInitialClientNews$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.InitiateNews>(NewsActionTypes.InitiateNews),
    concatMap(results => {
      const category = results.payload;
      const service = Service.IndexedDb;
      const client$ = this.indexedDbService.getData(results.payload);
        return client$.pipe(
          map(articles => {
              return new NewsActions.AddInitialClientArticles({
                category: category,
                articles: articles,
                service: service
              });
            }),
            catchError(_ => {
              return of( new NewsActions.AddInitialClientArticlesFailed(new Message.SavedIndexedDbMessage().errorMessage));
            })
          );
      }),
  );


  @Effect()
  saveApiNewsToIndexedDB$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.AddInitialApiArticles>(NewsActionTypes.AddInitialApiArticles, NewsActionTypes.InsertAdditionalNewsFromApi),
    concatMap(results => {
      const category = results.payload.category;
      const articles = results.payload.articles;
      const client$ = this.indexedDbService.setData(category, articles);
        return client$.pipe(
          map(_ => {
              return new NewsActions.SaveArticlesToClient(new Message.SavedIndexedDbMessage().successMessage);
          }),
          catchError(_ => {
            return of( new NewsActions.SaveArticlesToClientFailed(new Message.SavedIndexedDbMessage().errorMessage));
          })
        );
      }),
  );


  @Effect()
  getExpiredData$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.AddInitialApiArticles>(NewsActionTypes.AddInitialApiArticles),
    map(action => action.payload.category),
    concatMap(category => this.indexedDbService.getExpiredData(category).pipe(
      map(ids => new NewsActions.GetExpiredData(ids)),
      catchError(_ => of(new NewsActions.GetExpiredDataFailed(new Message.GetExpiredArticlesMessage().errorMessage)))
    ))
  );


  @Effect({dispatch: false})
  deleteExpiredData$ = this.actions$.pipe(
    ofType<NewsActions.GetExpiredData>(NewsActionTypes.GetExpiredData),
    map(results => results.payload),
    map (keys => {
      keys.forEach(key => {
        this.indexedDbService.removeArticle(key).pipe(
          // tap(_ => console.log('REMOVING')),
          map(() => new NewsActions.DeleteExpiredData(new Message.DeletedArticlesMessage().successMessage)),
          catchError(_ => of(new NewsActions.DeleteExpiredDataFailed(new Message.DeletedArticlesMessage().errorMessage)))
        ).subscribe();
      });
    })
  );

  get getAllFilters(): Observable<Set<Filter>> {
    return this.store.pipe(
      select(fromFilter.getAllFilters),
    );
  }

  get getNews() {
    return this.store.pipe(
      select(fromNews.getAllArticles),
    );
  }

  @Effect()
  search$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.GetAdditionalNewsFromApi>(NewsActionTypes.GetAdditionalNewsFromApi),
    throttleTime(this.debounce || 1000, this.scheduler || asyncScheduler),
    withLatestFrom(this.getNews, this.getAllFilters, (action, news, allFilters) => {
      const category = action.payload;
      const page = news[category].page;
      return this.newsService.getNews(category, page, allFilters);
    }),
    concatMap(observ => observ),
    map( articlePayload => {
      return new NewsActions.InsertAdditionalNewsFromApi(articlePayload);
    }),
    catchError(error => {
      return of( new NewsActions.InsertAdditionalNewsFromApiFailed(new Message.NewsApiMessage().errorMessage));
    })
  );


  init$: Observable<any> = defer(() => of(null)).pipe(
    // tap(() => console.log('init$'))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromFilter.State>,
    private indexedDbService: IndexedDbService,
    private newsService: NewsDataService,
    // for unit tests to inject debounce
    @Optional()
    @Inject(DEBOUNCE)
    private debounce: number,

    // for unit tests to inject a scheduler for observables
    @Optional()
    @Inject(SCHEDULER)
    private scheduler: Scheduler) {}

}
