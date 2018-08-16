import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, defer, of } from 'rxjs';
import { tap, concatMap, flatMap, exhaustMap, take, map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import * as NewsActions from '../actions/news.actions';
import { NewsActionTypes } from '../actions/news.actions';
import { Article } from '../models/article';
import { LocalDbService } from '../service/local-db.service';
import { NewsDataService } from '../service/news-data.service';
import { Store, select } from '@ngrx/store';
import * as fromFilter from './../reducers';
import * as fromNews from './../reducers';
import { Category } from '../utility/category.enum';
import { Service } from '../models/service.enum';

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
    private newsService: NewsDataService) {}

  // @Action(AddNews)
  // addNews(ctx: StateContext<NewsStateModel>, action: AddNews) {
  //   const state = ctx.getState();
  //   const pageNumber = state[action.category].page;
  //   const category = stringToCategory(action.category);

  //   // TOD0 is there a better way to thottle?
  //   if ( pageNumber > 5 ) { // limit to 5 calls per category
  //     return ;
  //   }

  //   if ( state[action.category].retrieving ) { // not if currently retrieving
  //     console.log(state);
  //     return ;
  //   }

  //   if ( !state[action.category].firstLoadComplete ) { // not until the inital load is complete
  //     console.log(state);
  //     return ;
  //   }

  //   this.setFlagForRetrevingStatus(ctx, action.category);

  //   this.filters.pipe(
  //     take(1),
  //     exhaustMap(allFilters => {
  //       return this.newsService.getNews(category, pageNumber, allFilters)
  //       .pipe(
  //         tap(results => this.updateState(ctx, action.category, results, 'NewsService')),
  //         catchError(this.handleError('getNews', [])),
  //       );
  //     }),
  //     tap(results => this.localDb.setData(category, results).pipe(
  //       catchError(this.handleError('setData', []))
  //     ).subscribe())
  //   ).subscribe();

  // }

/**
 * sets flag that data is currently being received for this category
 *
 * @private
 * @param {*} ctx
 * @param {*} category
 * @memberof NewsState
 */
// private setFlagForRetrevingStatus(ctx, category) {
//     const copyCurrentState = Object.assign({}, ctx.getState());

//     ctx.patchState({
//       [category]: {
//         ...copyCurrentState[category],
//         retrieving: true
//       }
//     });

//     // send action to the dev logs
//     // this.store.dispatch(new AddMessage('NewsService', `fetching ${category} news`));
//   }

/**
 * updates state
 *
 * @private
 * @param {*} ctx
 * @param {*} category
 * @param {*} result
 * @param {*} service
 * @returns
 * @memberof NewsState
 */
// private updateState(ctx, category, result, service) {
//       const state = ctx.getState();
//       const copyCurrentState = Object.assign({}, ctx.getState());
//       const copyArticles = copyCurrentState[category].articles.splice(0).concat(result);
//       const clientFlag = (copyCurrentState[category].clientDataLoaded)
//         ? true
//         :  service === 'LocalDB' ? true : false;

//       const pageUpdate = service === 'NewsService'
//         ? copyCurrentState[category].page + 1
//         : copyCurrentState[category].page;

//       ctx.patchState({
//         [category]: {
//         ...state[category],
//         articles: this.removeDuplicateTitles(copyArticles),
//         page: pageUpdate,
//         retrieving: false,
//         firstLoadComplete: true,
//         clientDataLoaded: clientFlag
//         }
//       });

      // send action to dev logs
      // this.store.dispatch(new AddMessage(service, `fetched ${category} news`));
      // this.store.dispatch(new UpdateState('NewsService', `fetched ${category} news`, copyCurrentState, ctx.getState()));

  //     return result;
  // }


   /**
   * Unduplicate articles by title, important to keep the article ids unique
   * @param articles - array of articles
   * @return articles - array of unduplicated articles
   */
  // private  removeDuplicateTitles(articles: Article[]): Article[] {
  //   const articleMap = new Map ();
  //   const deDupped = [];

  //   articles.map(article => articleMap.set(encodeURIComponent(article.title), article));
  //   articleMap.forEach(item => deDupped.push(item));

  //   return deDupped;
  // }


  /**
   * Handle Http operation that failed.
   * Dispatch error
   * Let the app continue.
   * @private
   * @template T
   * @param {string} [operation='operation'] - name of the operation that failed
   * @param {T} [result] - optional value to return as the observable result
   * @returns empty array for the articles value
   * @memberof NewsState
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      let userMessage: string;
      let service = 'unknown';
      console.log(error);
      switch (error.status) {
        case 200 :
          break;
        case 400 :
          userMessage = 'There was a problem with the news request';
          service = 'NewsService';
          break;

        case 401 :
          userMessage = 'This was an unauthorized request';
          service = 'NewsService';
          break;

        case 429 :
          userMessage = 'We are over the limit, please try again later';
          service = 'NewsService';
          break;

        case 500 :
          userMessage = 'There was a problem with the news server, please try again later';
          service = 'NewsService';
          break;

        case 0 :
          userMessage = 'offline';
          service = 'NewsService';
          break;

        case 1100 :
          userMessage = 'There is no local database';
          service = 'Indexed DB';
          break;

        case 1200 :
          userMessage = 'Indexed DB could not be opened and was reset';
          service = 'Indexed DB';
          break;

        case 1300 :
          userMessage = `No index named ${error.statusText}`;
          service = 'Indexed DB';
          break;

        case 1300 :
          userMessage = error.statusText;
          service = 'Indexed DB';
          break;

        default :
        userMessage = `${error.statusText}`;
      }
      if ( userMessage ) {
        // this.store.dispatch(new AddError(service, userMessage));
      }

      return of(result as T);
    };
  }
}
