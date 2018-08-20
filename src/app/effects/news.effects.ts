import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Observable, of, Scheduler } from 'rxjs';
import { tap, concatMap, exhaustMap, take, map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store, select, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as NewsActions from '../actions/news.actions';
import { NewsActionTypes } from '../actions/news.actions';
import { IndexedDbService } from '../services/indexed-db.service';
import { NewsDataService } from '../services/news-data.service';
import * as fromFilter from './../reducers';
import { Service } from '../enums/service.enum';
import * as Message from '../messages/service.messages';

export const DEBOUNCE = new InjectionToken<number>('Test Debounce');
export const SCHEDULER = new InjectionToken<Scheduler>('Test Scheduler');


@Injectable()
export class NewsEffects {

  @Effect()
  loadNews$ = this.actions$.pipe(ofType(NewsActionTypes.LoadNews));

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
          return of( new NewsActions.NewsApiError({
            category: results.payload,
            service: Service.NewsAPI,
          }));
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
      const client$ = this.indexedDbService.getData(results.payload);
        return client$.pipe(
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


  // TODO - change take(1) to wait until indexed DB is done, then send action
  @Effect()
  saveNewsToIndexedDb$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.AddInitialArticles>(NewsActionTypes.AddInitialArticles),
    concatMap(results => {
      const category = results.payload.category;
      const articles = results.payload.articles;
      const client$ = this.indexedDbService.setData(category, articles);
        return client$.pipe(
          take(1),
          // tap(console.log),
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


  @Effect()
  getExpiredData$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.AddInitialArticles>(NewsActionTypes.AddInitialArticles),
    map(action => action.payload.category),
    concatMap(category => this.indexedDbService.getExpiredData(category).pipe(
      map(ids => new NewsActions.GetExpiredData(ids)),
      catchError(err => of(new NewsActions.GetExpiredDataFailed(new Message.GetExpiredArticlesMessage().errorMessage)))
    ))
  );


  @Effect({dispatch: false})
  deleteExpiredData$ = this.actions$.pipe(
    ofType<NewsActions.GetExpiredData>(NewsActionTypes.GetExpiredData),
    map(results => results.payload),
    map (keys => {
      keys.forEach(key => {
        this.indexedDbService.removeArticle(key).pipe(
          tap(_ => console.log('REMOVING')),
          map(() => new NewsActions.DeleteExpiredData(new Message.DeletedArticlesMessage().successMessage)),
          catchError(_ => of(new NewsActions.DeleteExpiredDataFailed(new Message.DeletedArticlesMessage().errorMessage)))
        ).subscribe();
      });
    })
  );


  // init$: Observable<any> = defer(() => of(null)).pipe(
  //   tap(() => console.log('init$'))
  // );

  constructor(
    private actions$: Actions,
    private store: Store<fromFilter.State>,
    private indexedDbService: IndexedDbService,
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
